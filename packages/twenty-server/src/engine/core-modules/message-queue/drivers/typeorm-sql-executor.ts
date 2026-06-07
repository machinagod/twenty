import { type DataSource, type EntityManager } from 'typeorm';

import { type SqlExecutor } from 'src/engine/core-modules/message-queue/drivers/pg-driver-core';

// TypeORM's query() returns a flat rows array for SELECT, but a [rows, affectedCount]
// tuple for INSERT/UPDATE/DELETE ... RETURNING (node-postgres returns plain rows in
// both cases). The SqlExecutor contract is always "rows", and the driver core relies
// on UPDATE ... RETURNING (claimBatch), so unwrap that write-result tuple. A SELECT
// result is an array of row OBJECTS, never [array, number], so this never misfires.
const toRows = (result: unknown): Record<string, unknown>[] => {
  if (
    Array.isArray(result) &&
    result.length === 2 &&
    Array.isArray(result[0]) &&
    typeof result[1] === 'number'
  ) {
    return result[0] as Record<string, unknown>[];
  }

  return (result ?? []) as Record<string, unknown>[];
};

// Adapts a TypeORM EntityManager to the dependency-free SqlExecutor contract the
// PG driver core speaks. Used for the body of a transaction so the FOR UPDATE
// locks taken by claimBatch/runDueSchedules stay on one connection.
//
// Nested withTransaction() reuses the SAME EntityManager instead of opening a new
// transaction: the SKIP LOCKED claim and its follow-up writes must share the one
// connection that holds the row locks.
const executorFromManager = (manager: EntityManager): SqlExecutor => ({
  query: async (sql, params) => toRows(await manager.query(sql, params)),
  withTransaction: (fn) => fn(executorFromManager(manager)),
});

// Build a SqlExecutor from the core DataSource. `query` runs on the pool;
// `withTransaction` opens one transaction and hands its EntityManager to the core.
export const createTypeormSqlExecutor = (dataSource: DataSource): SqlExecutor => ({
  query: async (sql, params) => toRows(await dataSource.query(sql, params)),
  withTransaction: (fn) =>
    dataSource.transaction((manager) => fn(executorFromManager(manager))),
});
