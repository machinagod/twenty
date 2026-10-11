import { type DataSourceOptions } from 'typeorm';

import { terminatePostgresBackend } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/terminate-postgres-backend.util';

const mockInitialize = jest.fn();
const mockQuery = jest.fn();
const mockDestroy = jest.fn();
const mockDataSourceConstructor = jest.fn();

jest.mock('typeorm', () => ({
  ...jest.requireActual('typeorm'),
  DataSource: jest.fn().mockImplementation((options: unknown) => {
    mockDataSourceConstructor(options);

    return {
      initialize: mockInitialize,
      query: mockQuery,
      destroy: mockDestroy,
    };
  }),
}));

const POSTGRES_OPTIONS = {
  type: 'postgres',
  url: 'postgres://twenty@localhost/default',
  poolSize: 20,
  entities: ['dist/**/*.entity.js'],
  extra: { query_timeout: 10_000, idleTimeoutMillis: 600_000 },
} as DataSourceOptions;

describe('terminatePostgresBackend', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockInitialize.mockResolvedValue(undefined);
    mockDestroy.mockResolvedValue(undefined);
    mockQuery.mockResolvedValue([{ terminated: true }]);
  });

  it('should end the backend over a dedicated connection with no client timeout', async () => {
    const terminated = await terminatePostgresBackend({
      dataSourceOptions: POSTGRES_OPTIONS,
      backendPid: 10601,
    });

    expect(terminated).toBe(true);
    expect(mockDataSourceConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'postgres',
        url: 'postgres://twenty@localhost/default',
        poolSize: 1,
        entities: [],
        migrations: [],
        subscribers: [],
        extra: {
          query_timeout: undefined,
          statement_timeout: 10_000,
          idleTimeoutMillis: 600_000,
        },
      }),
    );
    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT pg_terminate_backend($1) AS terminated',
      [10601],
    );
    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });

  it('should report a backend that was already gone', async () => {
    mockQuery.mockResolvedValue([{ terminated: false }]);

    await expect(
      terminatePostgresBackend({
        dataSourceOptions: POSTGRES_OPTIONS,
        backendPid: 1,
      }),
    ).resolves.toBe(false);

    mockQuery.mockResolvedValue([]);

    await expect(
      terminatePostgresBackend({
        dataSourceOptions: POSTGRES_OPTIONS,
        backendPid: 1,
      }),
    ).resolves.toBe(false);
  });

  it('should close the dedicated connection even when the query fails', async () => {
    mockQuery.mockRejectedValue(new Error('permission denied'));

    await expect(
      terminatePostgresBackend({
        dataSourceOptions: POSTGRES_OPTIONS,
        backendPid: 1,
      }),
    ).rejects.toThrow('permission denied');
    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });

  it('should do nothing on a non-postgres datasource', async () => {
    await expect(
      terminatePostgresBackend({
        dataSourceOptions: { type: 'sqlite', database: ':memory:' },
        backendPid: 1,
      }),
    ).resolves.toBe(false);
    expect(mockDataSourceConstructor).not.toHaveBeenCalled();
  });
});
