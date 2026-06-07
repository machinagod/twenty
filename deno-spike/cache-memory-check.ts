// Proves the cache slice: with CACHE_STORAGE_TYPE='memory' the REAL
// cacheStorageModuleFactory builds a working, Redis-free per-instance cache under
// Deno (no REDIS_URL, no connection). Default stays 'redis' so nothing breaks.
//
//   deno run -A --sloppy-imports --config deno-spike/cache-memory-check.json deno-spike/cache-memory-check.ts

import 'reflect-metadata';
import { CACHE_MANAGER, type Cache, CacheModule } from '@nestjs/cache-manager';
import { Global, Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { cacheStorageModuleFactory } from 'src/engine/core-modules/cache-storage/cache-storage.module-factory';

// Stub config: memory mode, and deliberately NO REDIS_URL — the Redis branch would
// throw, so reaching a working cache proves we took the memory branch.
@Injectable()
class StubConfig {
  get(key: string): unknown {
    if (key === 'CACHE_STORAGE_TYPE') return 'memory';
    if (key === 'CACHE_STORAGE_TTL') return 3600;
    return undefined;
  }
}

// Global, like the real TwentyConfigModule, so the CacheModule factory can inject it.
@Global()
@Module({ providers: [StubConfig], exports: [StubConfig] })
class StubConfigModule {}

@Module({
  imports: [
    StubConfigModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [StubConfigModule],
      useFactory: cacheStorageModuleFactory as unknown as (c: StubConfig) => unknown,
      inject: [StubConfig],
    }),
  ],
})
class CacheSpikeModule {}

let passed = 0;
let failed = 0;
const check = (label: string, ok: boolean) => {
  ok ? passed++ : failed++;
  console.log(`  ${ok ? '✅' : '❌'} ${label}`);
};

const app = await NestFactory.createApplicationContext(CacheSpikeModule, { logger: ['error'] });
const cache = app.get<Cache>(CACHE_MANAGER);

check('cache manager resolved (memory store, no REDIS_URL set)', !!cache);
await cache.set('k', { hello: 'world' });
const value = (await cache.get('k')) as { hello?: string } | undefined;
check('set/get round-trips through the in-memory store', value?.hello === 'world');
const storeName = (cache.store as { name?: string })?.name;
check(`store is NOT redis (got '${storeName ?? 'memory'}')`, storeName !== 'redis');

await app.close();
console.log(`\n==== ${passed} passed, ${failed} failed ====`);
if (failed > 0) Deno.exit(1);
