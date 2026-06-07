// Boots CommandModule on Deno and runs the run-instance-commands command.
// Equivalent to: nx database:migrate -- --include-slow --force on Node.
//
//   APP_SECRET=… PG_DATABASE_URL=… \
//   MESSAGE_QUEUE_DRIVER_TYPE=pg CACHE_STORAGE_TYPE=memory \
//   SESSION_STORAGE_TYPE=memory PUB_SUB_DRIVER_TYPE=postgres \
//   deno run -A --sloppy-imports boot-migrate.ts

import 'reflect-metadata';
import { CommandFactory } from 'nest-commander';
import { CommandModule } from 'src/command/command.module';

// Inject the command-line args nest-commander expects.
process.argv = [
  ...process.argv.slice(0, 2),
  'run-instance-commands',
  '--force',
  '--include-slow',
];

const app = await CommandFactory.createWithoutRunning(CommandModule, {
  logger: ['error', 'warn', 'log'],
});
console.log('[migrate] CommandModule ready, running run-instance-commands');
await CommandFactory.runApplication(app);
await app.close();
console.log('[migrate] done');
