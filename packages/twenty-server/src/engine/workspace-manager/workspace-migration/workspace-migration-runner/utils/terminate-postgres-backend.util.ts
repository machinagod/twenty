import { DataSource, type DataSourceOptions } from 'typeorm';

const TERMINATE_STATEMENT_TIMEOUT_MS = 10_000;

// Uses a dedicated connection: the shared pool may be starved by the very
// sessions queued behind the backend being terminated.
export const terminatePostgresBackend = async ({
  dataSourceOptions,
  backendPid,
}: {
  dataSourceOptions: DataSourceOptions;
  backendPid: number;
}): Promise<boolean> => {
  if (dataSourceOptions.type !== 'postgres') {
    return false;
  }

  const dataSource = new DataSource({
    ...dataSourceOptions,
    entities: [],
    migrations: [],
    subscribers: [],
    poolSize: 1,
    extra: {
      ...dataSourceOptions.extra,
      query_timeout: undefined,
      statement_timeout: TERMINATE_STATEMENT_TIMEOUT_MS,
    },
  });

  await dataSource.initialize();

  try {
    const [row] = await dataSource.query(
      'SELECT pg_terminate_backend($1) AS terminated',
      [backendPid],
    );

    return row?.terminated === true;
  } finally {
    await dataSource.destroy();
  }
};
