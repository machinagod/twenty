import { type DataSource, type EntityManager } from 'typeorm';

import { type SqlExecutor } from 'src/engine/core-modules/message-queue/drivers/pg-driver-core';

// Adapts a TypeORM EntityManager to the dependency-free SqlExecutor contract the
// PG driver core speaks. Used for the body of a transaction so the FOR UPDATE
// locks taken by claimBatch/runDueSchedules stay on one connection.
//
// Nested withTransaction() reuses the SAME EntityManager instead of opening a new
// transaction: the SKIP LOCKED claim and its follow-up writes must share the one
// connection that holds the row locks.
const executorFromManager = (manager: EntityManager): SqlExecutor => ({
  query: (sql, params) => manager.query(sql, params),
  withTransaction: (fn) => fn(executorFromManager(manager)),
});

// Build a SqlExecutor from the core DataSource. `query` runs on the pool;
// `withTransaction` opens one transaction and hands its EntityManager to the core.
export const createTypeormSqlExecutor = (dataSource: DataSource): SqlExecutor => ({
  query: (sql, params) => dataSource.query(sql, params),
  withTransaction: (fn) =>
    dataSource.transaction((manager) => fn(executorFromManager(manager))),
});
