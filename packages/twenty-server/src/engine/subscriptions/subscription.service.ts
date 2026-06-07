import { Injectable, type OnModuleDestroy } from '@nestjs/common';

import { type PubSubEngine } from 'graphql-subscriptions';

import { RedisClientService } from 'src/engine/core-modules/redis-client/redis-client.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { PostgresPubSub } from 'src/engine/subscriptions/drivers/postgres-pub-sub.driver';
import { PubSubDriverType } from 'src/engine/subscriptions/enums/pub-sub-driver-type.enum';
import { SubscriptionChannel } from 'src/engine/subscriptions/enums/subscription-channel.enum';

@Injectable()
export class SubscriptionService implements OnModuleDestroy {
  private postgresPubSub: PostgresPubSub | null = null;

  constructor(
    private readonly redisClient: RedisClientService,
    private readonly twentyConfigService: TwentyConfigService,
  ) {}

  // Returns the configured pub/sub transport (lazy, like the Redis client). Both
  // RedisPubSub and PostgresPubSub implement PubSubEngine (asyncIterator/publish).
  private getPubSubEngine(): PubSubEngine {
    if (
      this.twentyConfigService.get('PUB_SUB_DRIVER_TYPE') ===
      PubSubDriverType.Postgres
    ) {
      if (!this.postgresPubSub) {
        this.postgresPubSub = new PostgresPubSub(
          this.twentyConfigService.get('PG_DATABASE_URL'),
        );
      }

      return this.postgresPubSub;
    }

    return this.redisClient.getPubSubClient();
  }

  async onModuleDestroy() {
    if (this.postgresPubSub) {
      await this.postgresPubSub.close();
      this.postgresPubSub = null;
    }
  }

  private getSubscriptionChannel({
    channel,
    workspaceId,
  }: {
    channel: SubscriptionChannel;
    workspaceId: string;
  }) {
    return `${channel}:${workspaceId}`;
  }

  private getEventStreamChannel({
    workspaceId,
    eventStreamChannelId,
  }: {
    workspaceId: string;
    eventStreamChannelId: string;
  }) {
    return `${SubscriptionChannel.EVENT_STREAM_CHANNEL}:${workspaceId}:${eventStreamChannelId}`;
  }

  async subscribe({
    channel,
    workspaceId,
  }: {
    channel: SubscriptionChannel;
    workspaceId: string;
  }) {
    const client = this.getPubSubEngine();

    return client.asyncIterator(
      this.getSubscriptionChannel({ channel, workspaceId }),
    );
  }

  async subscribeToEventStream({
    workspaceId,
    eventStreamChannelId,
  }: {
    workspaceId: string;
    eventStreamChannelId: string;
  }) {
    const client = this.getPubSubEngine();

    return client.asyncIterator(
      this.getEventStreamChannel({ workspaceId, eventStreamChannelId }),
    );
  }

  async publish<T>({
    channel,
    payload,
    workspaceId,
  }: {
    channel: SubscriptionChannel;
    payload: T;
    workspaceId: string;
  }): Promise<void> {
    const client = this.getPubSubEngine();

    await client.publish(
      this.getSubscriptionChannel({ channel, workspaceId }),
      payload,
    );
  }

  async publishToEventStream<T>({
    workspaceId,
    eventStreamChannelId,
    payload,
  }: {
    workspaceId: string;
    eventStreamChannelId: string;
    payload: T;
  }): Promise<void> {
    const client = this.getPubSubEngine();

    await client.publish(
      this.getEventStreamChannel({ workspaceId, eventStreamChannelId }),
      payload,
    );
  }

  private getAgentChatChannel({
    workspaceId,
    threadId,
  }: {
    workspaceId: string;
    threadId: string;
  }) {
    return `${SubscriptionChannel.AGENT_CHAT_CHANNEL}:${workspaceId}:${threadId}`;
  }

  async subscribeToAgentChat({
    workspaceId,
    threadId,
  }: {
    workspaceId: string;
    threadId: string;
  }) {
    const client = this.getPubSubEngine();

    return client.asyncIterator(
      this.getAgentChatChannel({ workspaceId, threadId }),
    );
  }

  async publishToAgentChat<T>({
    workspaceId,
    threadId,
    payload,
  }: {
    workspaceId: string;
    threadId: string;
    payload: T;
  }): Promise<void> {
    const client = this.getPubSubEngine();

    await client.publish(
      this.getAgentChatChannel({ workspaceId, threadId }),
      payload,
    );
  }
}
