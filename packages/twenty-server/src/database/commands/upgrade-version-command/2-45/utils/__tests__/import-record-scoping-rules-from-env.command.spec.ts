import { ImportRecordScopingRulesFromEnvCommand } from 'src/database/commands/upgrade-version-command/2-45/2-45-workspace-command-1791590005647-import-record-scoping-rules-from-env.command';

const RULES = JSON.stringify([
  {
    roleLabel: 'Member',
    objectNameSingular: 'opportunity',
    logicalOperator: 'AND',
    conditions: [{ column: 'ownerId', operator: 'eq', currentWorkspaceMemberField: 'id' }],
  },
  {
    roleLabel: 'Ghost',
    objectNameSingular: 'opportunity',
    conditions: [{ column: 'ownerId', operator: 'eq', currentWorkspaceMemberField: 'id' }],
  },
]);

describe('ImportRecordScopingRulesFromEnvCommand', () => {
  const originalRules = process.env.RECORD_SCOPING_RULES;
  let dataSource: { query: jest.Mock };
  let workspaceCacheService: { invalidateAndRecompute: jest.Mock };
  let command: ImportRecordScopingRulesFromEnvCommand;

  const args = (dryRun = false) =>
    ({ workspaceId: 'workspace-id', options: { dryRun } }) as never;

  beforeEach(() => {
    process.env.RECORD_SCOPING_RULES = RULES;
    dataSource = {
      query: jest.fn(async (sql: string) => {
        if (sql.includes('FROM "core"."role"')) return [{ id: 'member-id', label: 'Member' }];
        if (sql.includes('FROM "core"."objectMetadata"')) return [{ id: 'opportunity-id', nameSingular: 'opportunity' }];
        return [];
      }),
    };
    workspaceCacheService = { invalidateAndRecompute: jest.fn() };
    command = new ImportRecordScopingRulesFromEnvCommand(
      {} as never,
      workspaceCacheService as never,
      dataSource as never,
    );
  });

  afterEach(() => {
    process.env.RECORD_SCOPING_RULES = originalRules;
  });

  const writes = () =>
    dataSource.query.mock.calls.filter(([sql]) => /INSERT|DELETE/.test(sql));

  it('inserts the env rules without overwriting UI edits', async () => {
    await command.runOnWorkspace(args());

    expect(writes()).toEqual([
      [
        expect.stringContaining('ON CONFLICT ("workspaceId", "roleId", "objectMetadataId") DO NOTHING'),
        [
          'workspace-id',
          'member-id',
          'opportunity-id',
          'AND',
          JSON.stringify([{ column: 'ownerId', operator: 'eq', currentWorkspaceMemberField: 'id' }]),
        ],
      ],
    ]);
    expect(workspaceCacheService.invalidateAndRecompute).toHaveBeenCalledWith('workspace-id', [
      'recordScopingRulesByRoleId',
    ]);
  });

  it('writes nothing on a dry run', async () => {
    await command.up(args(true));

    expect(writes()).toEqual([]);
    expect(workspaceCacheService.invalidateAndRecompute).not.toHaveBeenCalled();
  });

  it('does nothing when the env var is unset', async () => {
    delete process.env.RECORD_SCOPING_RULES;
    await command.up(args());

    expect(dataSource.query).not.toHaveBeenCalled();
  });

  it('removes the imported rules on down', async () => {
    await command.down(args());

    expect(writes()).toEqual([
      [expect.stringContaining('DELETE FROM "core"."recordScopingRule"'), ['workspace-id', 'member-id', 'opportunity-id']],
    ]);
    expect(workspaceCacheService.invalidateAndRecompute).toHaveBeenCalled();
  });

  it('skips down when nothing was configured or on a dry run', async () => {
    await command.down(args(true));
    delete process.env.RECORD_SCOPING_RULES;
    await command.down(args());

    expect(writes()).toEqual([]);
  });
});
