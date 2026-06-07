import { createHash } from 'node:crypto';

import { PubSubEngine } from 'graphql-subscriptions';
import pg from 'pg';

// Default-import + destructure rather than `import { Client } from 'pg'`: pg assigns
// `module.exports = {...}`, which Deno's CJS named-export lexer cannot split (Node is
// fine either way). This form works on both runtimes.
const { Client } = pg;
type PgClient = InstanceType<typeof Client>;

// Redis-free GraphQL-subscriptions transport backed by Postgres LISTEN/NOTIFY, for
// the Deno Deploy target. Drop-in for graphql-redis-subscriptions' RedisPubSub: it
// extends PubSubEngine, so asyncIterator()/asyncIterableIterator() come for free once
// publish/subscribe/unsubscribe are implemented.
//
// Constraints handled / deferred:
//  - Postgres channel identifiers are capped at 63 bytes; Twenty's logical channels
//    (e.g. `EVENT_STREAM_CHANNEL:<uuid>:<id>`) exceed that, so we hash each logical
//    trigger to a short `tw_<hash>` channel and carry the real trigger in the body
//    (and filter on it, so hash collisions can't cross-deliver).
//  - NOTIFY payloads are capped at ~8000 bytes. Larger payloads (big record events,
//    agent-chat chunks) are a documented follow-up (§7.5: store the payload in a
//    table and NOTIFY only its id). The first cut inlines JSON and throws on oversize.
//  - Reconnection under Deploy idle-shutdown/eviction is a follow-up (§7.2): on a
//    connection error we drop the client and re-LISTEN lazily on the next call.
type Subscription = {
  trigger: string;
  onMessage: (payload: unknown) => void;
};

const channelForTrigger = (trigger: string): string =>
  `tw_${createHash('sha1').update(trigger).digest('hex').slice(0, 40)}`;

export class PostgresPubSub extends PubSubEngine {
  private client: PgClient | null = null;
  private connecting: Promise<PgClient> | null = null;
  private nextSubscriptionId = 1;
  private readonly subscriptions = new Map<number, Subscription>();
  // hashed pg channel -> subscription ids currently LISTENing on it
  private readonly channelSubscriptionIds = new Map<string, Set<number>>();

  constructor(private readonly connectionString: string) {
    super();
  }

  private async getClient(): Promise<PgClient> {
    if (this.client) {
      return this.client;
    }

    if (!this.connecting) {
      this.connecting = (async () => {
        const client = new Client({ connectionString: this.connectionString });

        client.on('notification', (message) =>
          this.handleNotification(message.channel, message.payload),
        );
        client.on('error', () => {
          // Drop the client so the next call reconnects + re-LISTENs.
          this.client = null;
          this.connecting = null;
        });

        await client.connect();
        this.client = client;

        // Re-arm any channels that already have subscribers (reconnect path).
        for (const channel of this.channelSubscriptionIds.keys()) {
          await client.query(`LISTEN ${channel}`);
        }

        return client;
      })();
    }

    return this.connecting;
  }

  private handleNotification(channel: string, rawPayload?: string): void {
    const subscriptionIds = this.channelSubscriptionIds.get(channel);

    if (!subscriptionIds || !rawPayload) {
      return;
    }

    const { trigger, payload } = JSON.parse(rawPayload) as {
      trigger: string;
      payload: unknown;
    };

    for (const subscriptionId of subscriptionIds) {
      const subscription = this.subscriptions.get(subscriptionId);

      // Filter on the real trigger so hash collisions never cross-deliver.
      if (subscription && subscription.trigger === trigger) {
        subscription.onMessage(payload);
      }
    }
  }

  async publish(trigger: string, payload: unknown): Promise<void> {
    const client = await this.getClient();
    const body = JSON.stringify({ trigger, payload });

    // pg_notify enforces the ~8000-byte payload limit and will throw on oversize.
    await client.query('SELECT pg_notify($1, $2)', [
      channelForTrigger(trigger),
      body,
    ]);
  }

  async subscribe(
    trigger: string,
    onMessage: (payload: unknown) => void,
  ): Promise<number> {
    const client = await this.getClient();
    const subscriptionId = this.nextSubscriptionId++;
    const channel = channelForTrigger(trigger);

    this.subscriptions.set(subscriptionId, { trigger, onMessage });

    let subscriptionIds = this.channelSubscriptionIds.get(channel);

    if (!subscriptionIds) {
      subscriptionIds = new Set();
      this.channelSubscriptionIds.set(channel, subscriptionIds);
      // channel is a hashed `tw_<hex>` identifier — safe to interpolate.
      await client.query(`LISTEN ${channel}`);
    }

    subscriptionIds.add(subscriptionId);

    return subscriptionId;
  }

  async unsubscribe(subscriptionId: number): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId);

    if (!subscription) {
      return;
    }

    const channel = channelForTrigger(subscription.trigger);

    this.subscriptions.delete(subscriptionId);

    const subscriptionIds = this.channelSubscriptionIds.get(channel);

    if (subscriptionIds) {
      subscriptionIds.delete(subscriptionId);

      if (subscriptionIds.size === 0) {
        this.channelSubscriptionIds.delete(channel);

        if (this.client) {
          await this.client.query(`UNLISTEN ${channel}`);
        }
      }
    }
  }

  async close(): Promise<void> {
    if (this.client) {
      const client = this.client;

      this.client = null;
      this.connecting = null;
      await client.end();
    }
  }
}
