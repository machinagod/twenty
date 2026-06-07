// Proves the pub/sub slice: the PostgresPubSub LISTEN/NOTIFY transport delivers
// GraphQL-subscription messages under Deno against real Postgres — exercising the
// >63-char channel hashing and cross-channel filtering. Default stays Redis.
//
//   DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/deno_spike \
//   deno run -A --sloppy-imports --config deno-spike/pubsub-pg-check.json deno-spike/pubsub-pg-check.ts

import { PostgresPubSub } from 'src/engine/subscriptions/drivers/postgres-pub-sub.driver';

const url = Deno.env.get('DATABASE_URL') ??
  'postgres://postgres:postgres@127.0.0.1:5432/deno_spike';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let passed = 0;
let failed = 0;
const check = (label: string, ok: boolean) => {
  ok ? passed++ : failed++;
  console.log(`  ${ok ? '✅' : '❌'} ${label}`);
};

const pubsub = new PostgresPubSub(url);

// Both > 63 bytes — exercises channel hashing.
const channelA = 'EVENT_STREAM_CHANNEL:11111111-1111-1111-1111-111111111111:long-stream-channel-id';
const channelB = 'AGENT_CHAT_CHANNEL:22222222-2222-2222-2222-222222222222:thread-abc';

const receivedA: Array<{ n?: number }> = [];
const receivedB: unknown[] = [];
await pubsub.subscribe(channelA, (p) => receivedA.push(p as { n?: number }));
await pubsub.subscribe(channelB, (p) => receivedB.push(p));

await pubsub.publish(channelA, { hello: 'world', n: 1 });
await sleep(250);

check('subscriber on channel A received the published payload', receivedA.length === 1 && receivedA[0].n === 1);
check('subscriber on channel B was NOT cross-delivered (filtering works)', receivedB.length === 0);

// asyncIterator path (what SubscriptionService actually uses). graphql-subscriptions
// subscribes lazily on the first next(), so call it BEFORE publishing.
const iterator = pubsub.asyncIterator<{ via?: string }>(channelA);
const nextPromise = iterator.next();
await sleep(200); // let the iterator's subscription register
await pubsub.publish(channelA, { via: 'iterator' });
const next = await Promise.race([
  nextPromise,
  sleep(2000).then(() => ({ value: undefined, done: true })),
]);
check('asyncIterator delivered the message', (next.value as { via?: string } | undefined)?.via === 'iterator');

await pubsub.close();
console.log(`\n==== ${passed} passed, ${failed} failed ====`);
if (failed > 0) Deno.exit(1);
