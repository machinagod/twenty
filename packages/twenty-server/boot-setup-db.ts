// Run the real setup-db logic on Deno. The script in src/database/scripts/setup-db.ts
// kicks off on import (top-level await on rawDataSource.initialize()), so we just
// import it and let it run.
import 'reflect-metadata';
await import('src/database/scripts/setup-db');
// Give the script time to settle (its work is in a promise chain).
await new Promise((r) => setTimeout(r, 1500));
console.log('[setup-db] done');
