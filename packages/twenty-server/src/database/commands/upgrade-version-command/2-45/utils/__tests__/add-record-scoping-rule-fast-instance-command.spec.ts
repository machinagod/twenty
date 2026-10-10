import { AddRecordScopingRuleFastInstanceCommand } from 'src/database/commands/upgrade-version-command/2-45/2-45-instance-command-fast-1791589855992-add-record-scoping-rule';

describe('AddRecordScopingRuleFastInstanceCommand', () => {
  const queryRunner = { query: jest.fn() };
  const command = new AddRecordScopingRuleFastInstanceCommand();

  beforeEach(() => queryRunner.query.mockClear());

  it('creates the table with its unique key and cascading foreign keys', async () => {
    await command.up(queryRunner as never);

    const statements = queryRunner.query.mock.calls.map(([sql]) => sql).join('\n');

    expect(statements).toContain('CREATE TABLE "core"."recordScopingRule"');
    expect(statements).toContain('UNIQUE ("workspaceId", "roleId", "objectMetadataId")');
    expect(statements).toContain('REFERENCES "core"."role"("id") ON DELETE CASCADE');
    expect(statements).toContain('REFERENCES "core"."objectMetadata"("id") ON DELETE CASCADE');
  });

  it('drops the table on down', async () => {
    await command.down(queryRunner as never);

    expect(queryRunner.query).toHaveBeenLastCalledWith(
      'DROP TABLE "core"."recordScopingRule"',
    );
  });
});
