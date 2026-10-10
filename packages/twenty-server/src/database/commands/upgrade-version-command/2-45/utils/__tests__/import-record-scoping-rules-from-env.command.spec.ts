import { ImportRecordScopingRulesFromEnvCommand } from 'src/database/commands/upgrade-version-command/2-45/2-45-workspace-command-1791590005647-import-record-scoping-rules-from-env.command';
import { getRegisteredWorkspaceCommandMetadata } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';

describe('ImportRecordScopingRulesFromEnvCommand', () => {
  const command = new ImportRecordScopingRulesFromEnvCommand({} as never);
  const args = { workspaceId: 'workspace-id', options: {} } as never;

  it('keeps its 2.45.0 slot so ledgers that recorded it resolve', () => {
    expect(
      getRegisteredWorkspaceCommandMetadata(ImportRecordScopingRulesFromEnvCommand),
    ).toEqual({ version: '2.45.0', timestamp: 1791590005647 });
  });

  it('does nothing on up, down or a workspace run', async () => {
    await expect(command.up(args)).resolves.toBeUndefined();
    await expect(command.down(args)).resolves.toBeUndefined();
    await expect(command.runOnWorkspace(args)).resolves.toBeUndefined();
  });
});
