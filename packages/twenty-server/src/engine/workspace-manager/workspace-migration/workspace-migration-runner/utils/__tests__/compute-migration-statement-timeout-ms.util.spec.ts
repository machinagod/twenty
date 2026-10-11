import { computeMigrationStatementTimeoutMs } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/utils/compute-migration-statement-timeout-ms.util';

describe('computeMigrationStatementTimeoutMs', () => {
  it('should stop the statement on the server a second before the client gives up', () => {
    expect(computeMigrationStatementTimeoutMs(10_000)).toBe(9_000);
    expect(computeMigrationStatementTimeoutMs('30000')).toBe(29_000);
  });

  it('should keep at least half the client timeout when it is short', () => {
    expect(computeMigrationStatementTimeoutMs(1_500)).toBe(750);
    expect(computeMigrationStatementTimeoutMs(1)).toBe(1);
  });

  it.each([undefined, null, 0, -5, Number.NaN, 'never'])(
    'should not set a timeout when the client has none (%p)',
    (clientQueryTimeoutMs) => {
      expect(
        computeMigrationStatementTimeoutMs(clientQueryTimeoutMs),
      ).toBeUndefined();
    },
  );
});
