import { InjectDataSource } from '@nestjs/typeorm';

import { Command } from 'nest-commander';
import { DataSource } from 'typeorm';

import { ProvisionedWorkspaceCommandRunner } from 'src/database/commands/command-runners/provisioned-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { buildRecordScopingRuleRowsFromLegacyRules } from 'src/database/commands/upgrade-version-command/2-45/utils/build-record-scoping-rule-rows-from-legacy-rules.util';
import { parseLegacyRecordScopingRules } from 'src/database/commands/upgrade-version-command/2-45/utils/parse-legacy-record-scoping-rules.util';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';

// Record scoping rules moved from the RECORD_SCOPING_RULES env var to
// core.recordScopingRule (edited from Settings > Roles). Copies the env rules in
// so scoping keeps applying across the deploy; the env var is read straight from
// process.env because it is no longer a config variable. Runs after the 2.45.1
// instance command that creates the table.
@RegisteredWorkspaceCommand('2.45.1', 1791624474376)
@Command({
  name: 'upgrade:2-45-1:copy-record-scoping-rules-from-env',
  description:
    'Import the RECORD_SCOPING_RULES env rules into core.recordScopingRule',
})
export class CopyRecordScopingRulesFromEnvCommand extends ProvisionedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly workspaceCacheService: WorkspaceCacheService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace(args: RunOnWorkspaceArgs): Promise<void> {
    await this.up(args);
  }

  async up({ workspaceId, options }: RunOnWorkspaceArgs): Promise<void> {
    const rows = await this.buildRows(workspaceId);

    if (rows.length === 0) {
      return;
    }

    this.logger.log(
      `${options.dryRun ? '[DRY RUN] ' : ''}Workspace ${workspaceId}: importing ${rows.length} record scoping rule(s) from RECORD_SCOPING_RULES`,
    );

    if (options.dryRun) {
      return;
    }

    for (const row of rows) {
      // Rules already edited in the UI win over the env copy.
      await this.dataSource.query(
        `INSERT INTO "core"."recordScopingRule" ("workspaceId", "roleId", "objectMetadataId", "logicalOperator", "conditions")
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT ("workspaceId", "roleId", "objectMetadataId") DO NOTHING`,
        [
          workspaceId,
          row.roleId,
          row.objectMetadataId,
          row.logicalOperator,
          JSON.stringify(row.conditions),
        ],
      );
    }

    await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
      'recordScopingRulesByRoleId',
    ]);
  }

  async down({ workspaceId, options }: RunOnWorkspaceArgs): Promise<void> {
    const rows = await this.buildRows(workspaceId);

    if (rows.length === 0 || options.dryRun) {
      return;
    }

    for (const row of rows) {
      await this.dataSource.query(
        `DELETE FROM "core"."recordScopingRule"
         WHERE "workspaceId" = $1 AND "roleId" = $2 AND "objectMetadataId" = $3`,
        [workspaceId, row.roleId, row.objectMetadataId],
      );
    }

    await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
      'recordScopingRulesByRoleId',
    ]);
  }

  private async buildRows(workspaceId: string) {
    const rules = parseLegacyRecordScopingRules(
      process.env.RECORD_SCOPING_RULES,
    );

    if (rules.length === 0) {
      return [];
    }

    const [roles, objects]: [
      Array<{ id: string; label: string }>,
      Array<{ id: string; nameSingular: string }>,
    ] = await Promise.all([
      this.dataSource.query(
        `SELECT "id", "label" FROM "core"."role" WHERE "workspaceId" = $1`,
        [workspaceId],
      ),
      this.dataSource.query(
        `SELECT "id", "nameSingular" FROM "core"."objectMetadata" WHERE "workspaceId" = $1`,
        [workspaceId],
      ),
    ]);

    const { rows, skippedRules } = buildRecordScopingRuleRowsFromLegacyRules({
      rules,
      roleIdByLabel: new Map(roles.map((role) => [role.label, role.id])),
      objectMetadataIdByNameSingular: new Map(
        objects.map((object) => [object.nameSingular, object.id]),
      ),
    });

    for (const rule of skippedRules) {
      this.logger.warn(
        `Workspace ${workspaceId}: skipping RECORD_SCOPING_RULES rule for role "${rule.roleLabel}" on "${rule.objectNameSingular}" (no such role or object)`,
      );
    }

    return rows;
  }
}
