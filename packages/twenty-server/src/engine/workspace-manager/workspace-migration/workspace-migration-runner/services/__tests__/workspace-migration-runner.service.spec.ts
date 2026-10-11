import { type DataSource } from 'typeorm';

import { type FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { type LoggerService } from 'src/engine/core-modules/logger/logger.service';
import { type MetricsService } from 'src/engine/core-modules/metrics/metrics.service';
import { type TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { type WorkspaceManyOrAllFlatEntityMapsCacheService } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service';
import { type WorkspaceMetadataVersionService } from 'src/engine/metadata-modules/workspace-metadata-version/services/workspace-metadata-version.service';
import { type WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { type WorkspaceMigration } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/types/workspace-migration.type';
import { WorkspaceMigrationRunnerException } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/exceptions/workspace-migration-runner.exception';
import { type WorkspaceMigrationRunnerActionHandlerRegistryService } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/registry/workspace-migration-runner-action-handler-registry.service';
import { type DeferredWorkspaceMigrationActionRunnerService } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/services/deferred-workspace-migration-action-runner.service';
import { type InFlightDeferredWorkspaceMigrationActionsService } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/services/in-flight-deferred-workspace-migration-actions.service';
import { WorkspaceMigrationRunnerService } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/services/workspace-migration-runner.service';
import { terminatePostgresBackend } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/terminate-postgres-backend.util';

jest.mock(
  'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/terminate-postgres-backend.util',
  () => ({ terminatePostgresBackend: jest.fn() }),
);

const mockTerminatePostgresBackend = jest.mocked(terminatePostgresBackend);

const WORKSPACE_ID = '20202020-0000-4000-8000-000000000001';
const APPLICATION_UNIVERSAL_IDENTIFIER = 'application-universal-identifier';
const BACKEND_PID = 10601;

type MockQueryRunner = {
  connect: jest.Mock;
  startTransaction: jest.Mock;
  commitTransaction: jest.Mock;
  rollbackTransaction: jest.Mock;
  release: jest.Mock;
  query: jest.Mock;
  isTransactionActive: boolean;
  isReleased: boolean;
};

const buildQueryRunner = (): MockQueryRunner => {
  const queryRunner: MockQueryRunner = {
    connect: jest.fn().mockResolvedValue(undefined),
    startTransaction: jest.fn().mockResolvedValue(undefined),
    commitTransaction: jest.fn().mockResolvedValue(undefined),
    rollbackTransaction: jest.fn().mockResolvedValue(undefined),
    release: jest.fn(),
    query: jest.fn(async (sql: string) =>
      sql.includes('pg_backend_pid') ? [{ pid: BACKEND_PID }] : [],
    ),
    isTransactionActive: true,
    isReleased: false,
  };

  queryRunner.release.mockImplementation(async () => {
    queryRunner.isReleased = true;
  });

  return queryRunner;
};

const buildLogger = (): LoggerService =>
  new Proxy({} as Record<string, jest.Mock>, {
    get: (target, property: string) => {
      target[property] ??= jest.fn();

      return target[property];
    },
  }) as unknown as LoggerService;

const MIGRATION = {
  applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  actions: [
    {
      type: 'create',
      metadataName: 'fieldMetadata',
      flatEntity: { id: 'field-id', universalIdentifier: 'field-universal-id' },
    },
  ],
} as unknown as WorkspaceMigration;

describe('WorkspaceMigrationRunnerService', () => {
  let queryRunner: MockQueryRunner;
  let logger: LoggerService;
  let actionHandlerRegistry: {
    executeActionHandler: jest.Mock;
    executeActionRollbackHandler: jest.Mock;
  };
  let coreDataSourceOptions: Record<string, unknown>;

  const buildService = () =>
    new WorkspaceMigrationRunnerService(
      {
        getOrRecomputeManyOrAllFlatEntityMaps: jest.fn().mockResolvedValue({}),
      } as unknown as WorkspaceManyOrAllFlatEntityMapsCacheService,
      {
        createQueryRunner: () => queryRunner,
        options: coreDataSourceOptions,
        query: jest.fn().mockResolvedValue([]),
      } as unknown as DataSource,
      actionHandlerRegistry as unknown as WorkspaceMigrationRunnerActionHandlerRegistryService,
      {
        incrementMetadataVersion: jest.fn().mockResolvedValue(undefined),
      } as unknown as WorkspaceMetadataVersionService,
      {
        getOrRecompute: jest.fn().mockResolvedValue({
          flatApplicationMaps: {
            idByUniversalIdentifier: {
              [APPLICATION_UNIVERSAL_IDENTIFIER]: 'application-id',
            },
            byId: { 'application-id': { id: 'application-id' } },
          },
        }),
        invalidateAndRecompute: jest.fn().mockResolvedValue(undefined),
      } as unknown as WorkspaceCacheService,
      { recordHistogram: jest.fn() } as unknown as MetricsService,
      logger,
      {
        get: jest.fn().mockReturnValue(false),
      } as unknown as TwentyConfigService,
      {
        getWorkspaceFeatureFlagsMap: jest.fn().mockResolvedValue({}),
      } as unknown as FeatureFlagService,
      {} as DeferredWorkspaceMigrationActionRunnerService,
      {} as InFlightDeferredWorkspaceMigrationActionsService,
    );

  const runFailingMigration = () =>
    buildService().run({
      workspaceMigration: MIGRATION,
      workspaceId: WORKSPACE_ID,
    });

  const executedSql = () =>
    queryRunner.query.mock.calls.map(([sql]: [string]) => sql);

  beforeEach(() => {
    jest.clearAllMocks();
    queryRunner = buildQueryRunner();
    logger = buildLogger();
    coreDataSourceOptions = {
      type: 'postgres',
      extra: { query_timeout: 10_000 },
    };
    actionHandlerRegistry = {
      executeActionHandler: jest
        .fn()
        .mockRejectedValue(new Error('Query read timeout')),
      executeActionRollbackHandler: jest.fn().mockResolvedValue(undefined),
    };
    mockTerminatePostgresBackend.mockImplementation(async () => {
      // TypeORM drops the connection from the pool on the connection error.
      queryRunner.isReleased = true;

      return true;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should make Postgres give up on a statement before the client stops waiting', async () => {
    await expect(runFailingMigration()).rejects.toBeInstanceOf(
      WorkspaceMigrationRunnerException,
    );

    expect(executedSql()).toEqual([
      'SELECT pg_backend_pid() AS pid',
      "SET LOCAL lock_timeout = '8s'",
      'SET LOCAL statement_timeout = 9000',
    ]);
  });

  it('should leave the statement timeout alone when the client has none', async () => {
    coreDataSourceOptions = { type: 'postgres', extra: {} };

    await expect(runFailingMigration()).rejects.toThrow('Query read timeout');

    expect(executedSql()).toEqual([
      'SELECT pg_backend_pid() AS pid',
      "SET LOCAL lock_timeout = '8s'",
    ]);
  });

  it('should not end the backend when the rollback succeeds', async () => {
    await expect(runFailingMigration()).rejects.toThrow('Query read timeout');

    expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
    expect(mockTerminatePostgresBackend).not.toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });

  it('should end the backend of a transaction whose rollback failed instead of pooling it', async () => {
    queryRunner.rollbackTransaction.mockRejectedValue(
      new Error('Query read timeout'),
    );

    await expect(runFailingMigration()).rejects.toThrow('Query read timeout');

    expect(mockTerminatePostgresBackend).toHaveBeenCalledWith({
      dataSourceOptions: coreDataSourceOptions,
      backendPid: BACKEND_PID,
    });
    expect(
      mockTerminatePostgresBackend.mock.invocationCallOrder[0],
    ).toBeLessThan(queryRunner.release.mock.invocationCallOrder[0]);
    expect(logger.error).toHaveBeenCalledWith(
      `[install-perf] ended backend ${BACKEND_PID} of the failed transaction (terminated=true)`,
      'Runner',
    );
  });

  it('should still release the connection when the backend cannot be ended', async () => {
    queryRunner.rollbackTransaction.mockRejectedValue(
      new Error('Query read timeout'),
    );
    mockTerminatePostgresBackend.mockRejectedValue(
      new Error('too many connections'),
    );

    await expect(runFailingMigration()).rejects.toThrow('Query read timeout');

    expect(logger.error).toHaveBeenCalledWith(
      `[install-perf] could not end backend ${BACKEND_PID}: too many connections`,
      'Runner',
    );
    expect(queryRunner.release).toHaveBeenCalled();
  });

  it('should report a failed transaction whose backend pid is unknown', async () => {
    queryRunner.query.mockImplementation(async (sql: string) =>
      sql.includes('pg_backend_pid') ? [{}] : [],
    );
    queryRunner.rollbackTransaction.mockRejectedValue(
      new Error('Query read timeout'),
    );

    await expect(runFailingMigration()).rejects.toThrow('Query read timeout');

    expect(mockTerminatePostgresBackend).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      '[install-perf] cannot end the failed transaction: backend pid unknown',
      'Runner',
    );
  });

  it('should release the connection itself when the pool never drops it', async () => {
    jest.useFakeTimers();
    queryRunner.rollbackTransaction.mockRejectedValue(
      new Error('Query read timeout'),
    );
    mockTerminatePostgresBackend.mockResolvedValue(false);

    const run = runFailingMigration();
    const settled = expect(run).rejects.toThrow('Query read timeout');

    await jest.advanceTimersByTimeAsync(5_000);
    await settled;

    expect(queryRunner.release).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      `[install-perf] ended backend ${BACKEND_PID} of the failed transaction (terminated=false)`,
      'Runner',
    );
  });
});
