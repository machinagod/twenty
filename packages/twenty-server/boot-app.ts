// Boot the real AppModule under Deno (deno mode env vars set externally).
// Run from packages/twenty-server/:
//   APP_SECRET=… PG_DATABASE_URL=postgres://… \
//   MESSAGE_QUEUE_DRIVER_TYPE=pg CACHE_STORAGE_TYPE=memory \
//   SESSION_STORAGE_TYPE=memory PUB_SUB_DRIVER_TYPE=postgres \
//   NODE_ENV=development \
//   deno run -A --sloppy-imports boot-app.ts

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

console.log('[boot] AppModule imported:', typeof AppModule);
const app = await NestFactory.createApplicationContext(AppModule, {
  logger: ['error', 'warn'],
});
console.log('[boot] DI container created');
await app.close();
console.log('[boot] closed cleanly');
