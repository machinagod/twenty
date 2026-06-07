// Proves the sessions slice: with SESSION_STORAGE_TYPE='memory' the real
// getSessionStorageOptions returns a valid Redis-free session config (no store, no
// REDIS_URL required, no throw) under Deno. Default stays 'redis' so nothing breaks.
//
//   deno run -A --sloppy-imports --config deno-spike/session-memory-check.json deno-spike/session-memory-check.ts

import { getSessionStorageOptions } from 'src/engine/core-modules/session-storage/session-storage.module-factory';
import { type TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

// memory mode + deliberately NO REDIS_URL — the Redis branch throws without it, so a
// clean return proves we took the memory branch.
const stubConfig = {
  get(key: string): unknown {
    if (key === 'SESSION_STORAGE_TYPE') return 'memory';
    if (key === 'SERVER_URL') return 'http://localhost:3000';
    return undefined;
  },
} as unknown as TwentyConfigService;

let passed = 0;
let failed = 0;
const check = (label: string, ok: boolean) => {
  ok ? passed++ : failed++;
  console.log(`  ${ok ? '✅' : '❌'} ${label}`);
};

const options = getSessionStorageOptions(stubConfig);

check('memory branch returned without throwing (no REDIS_URL)', !!options);
check('no Redis store attached (per-instance MemoryStore)', options.store === undefined);
check('session cookie options preserved', options.cookie?.maxAge === 1000 * 60 * 30);

console.log(`\n==== ${passed} passed, ${failed} failed ====`);
if (failed > 0) Deno.exit(1);
