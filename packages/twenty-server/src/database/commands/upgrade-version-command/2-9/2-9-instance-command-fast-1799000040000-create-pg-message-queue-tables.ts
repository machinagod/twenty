import { type QueryRunner } from 'typeorm';

import {
  DEFAULT_TABLES,
  PgMessageQueueCore,
  type SqlExecutor,
} from 'src/engine/core-modules/message-queue/drivers/pg-driver-core';
import { RegisteredInstanceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-instance-command.decorator';
import { type FastInstanceCommand } from 'src/engine/core-modules/upgrade/interfaces/fast-instance-command.interface';

// Adapts the migration's QueryRunner to the dependency-free SqlExecutor contract.
// buildSchemaSql() is pure, so withTransaction is never exercised here.
const executorFromQueryRunner = (queryRunner: QueryRunner): SqlExecutor => ({
  query: (sql, params) => queryRunner.query(sql, params),
  withTransaction: (fn) => fn(executorFromQueryRunner(queryRunner)),
});

// Creates the Postgres message-queue tables (messageQueueJob +
// messageQueueJobSchedule) that back the Redis-free PG queue driver. The DDL is
// owned by PgMessageQueueCore.buildSchemaSql() — single source of truth shared
// with the deno-spike — so the schema can never drift from the driver.
@RegisteredInstanceCommand('2.9.0', 1799000040000)
export class CreatePgMessageQueueTablesFastInstanceCommand
  implements FastInstanceCommand
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const core = new PgMessageQueueCore(
      executorFromQueryRunner(queryRunner),
      DEFAULT_TABLES,
    );

    // One statement per query: queryRunner.query() uses the extended protocol, which
    // runs only the first statement of a multi-statement string (see buildSchemaStatements).
    for (const statement of core.buildSchemaStatements()) {
      await queryRunner.query(statement);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS "${DEFAULT_TABLES.schema}"."${DEFAULT_TABLES.scheduleTable}"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "${DEFAULT_TABLES.schema}"."${DEFAULT_TABLES.jobTable}"`,
    );
  }
}
