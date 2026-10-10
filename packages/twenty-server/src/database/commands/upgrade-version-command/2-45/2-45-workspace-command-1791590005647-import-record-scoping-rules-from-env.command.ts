import { Command } from 'nest-commander';

import { ProvisionedWorkspaceCommandRunner } from 'src/database/commands/command-runners/provisioned-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';

// Superseded by the 2.45.1 CopyRecordScopingRulesFromEnvCommand: on instances
// already past 2.45.0 it ran before core.recordScopingRule existed and failed.
// Kept as a no-op so upgrade ledgers that recorded it still resolve their cursor.
@RegisteredWorkspaceCommand('2.45.0', 1791590005647)
@Command({
  name: 'upgrade:2-45:import-record-scoping-rules-from-env',
  description: 'No-op, superseded by upgrade:2-45-1:copy-record-scoping-rules-from-env',
})
export class ImportRecordScopingRulesFromEnvCommand extends ProvisionedWorkspaceCommandRunner {
  constructor(protected readonly workspaceIteratorService: WorkspaceIteratorService) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace(args: RunOnWorkspaceArgs): Promise<void> {
    await this.up(args);
  }

  async up(_args: RunOnWorkspaceArgs): Promise<void> {}

  async down(_args: RunOnWorkspaceArgs): Promise<void> {}
}
