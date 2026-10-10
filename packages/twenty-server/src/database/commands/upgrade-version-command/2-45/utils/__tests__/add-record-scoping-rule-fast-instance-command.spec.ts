import { AddRecordScopingRuleFastInstanceCommand } from 'src/database/commands/upgrade-version-command/2-45/2-45-instance-command-fast-1791624473376-add-record-scoping-rule';

describe('AddRecordScopingRuleFastInstanceCommand', () => {
  const queryRunner = { query: jest.fn() };
  const command = new AddRecordScopingRuleFastInstanceCommand();

  beforeEach(() => queryRunner.query.mockClear());

  const statements = () =>
    queryRunner.query.mock.calls.map(([sql]) => sql as string);

  it('creates the table with its unique key and cascading foreign keys', async () => {
    await command.up(queryRunner as never);

    const sql = statements().join('\n');

    expect(sql).toContain('CREATE TABLE IF NOT EXISTS "core"."recordScopingRule"');
    expect(sql).toContain('UNIQUE ("workspaceId", "roleId", "objectMetadataId")');
    expect(sql).toContain('REFERENCES "core"."workspace"("id") ON DELETE CASCADE');
    expect(sql).toContain('REFERENCES "core"."role"("id") ON DELETE CASCADE');
    expect(sql).toContain('REFERENCES "core"."objectMetadata"("id") ON DELETE CASCADE');
  });

  it('only issues statements that tolerate a table created under 2.45.0', async () => {
    await command.up(queryRunner as never);

    for (const sql of statements()) {
      expect(sql).toMatch(/^CREATE (TABLE|INDEX) IF NOT EXISTS /);
    }
  });

  it('drops the table on down', async () => {
    await command.down(queryRunner as never);

    expect(queryRunner.query).toHaveBeenLastCalledWith(
      'DROP TABLE IF EXISTS "core"."recordScopingRule"',
    );
  });
});
