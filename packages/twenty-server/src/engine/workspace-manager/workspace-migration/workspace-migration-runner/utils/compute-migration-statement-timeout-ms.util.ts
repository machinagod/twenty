// The pg client stops waiting at query_timeout, but Postgres keeps running the
// statement and holding its locks, so the server must give up first.
const CLIENT_TIMEOUT_MARGIN_MS = 1_000;

export const computeMigrationStatementTimeoutMs = (
  clientQueryTimeoutMs: unknown,
): number | undefined => {
  const timeoutMs = Number(clientQueryTimeoutMs);

  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return undefined;
  }

  return Math.max(
    timeoutMs - CLIENT_TIMEOUT_MARGIN_MS,
    Math.ceil(timeoutMs / 2),
  );
};
