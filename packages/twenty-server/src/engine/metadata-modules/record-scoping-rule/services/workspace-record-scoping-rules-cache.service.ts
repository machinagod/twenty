import { Injectable } from '@nestjs/common';

import { WorkspaceCacheProvider } from 'src/engine/workspace-cache/interfaces/workspace-cache-provider.service';

import { type RecordScopingRulesByRoleId } from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';
import { WorkspaceCache } from 'src/engine/workspace-cache/decorators/workspace-cache.decorator';
import { type WorkspaceCacheProviderContext } from 'src/engine/workspace-cache/types/workspace-cache-provider-context.type';
import { type WorkspaceCacheRowsRequirement } from 'src/engine/workspace-cache/types/workspace-cache-rows-requirement.type';

const RECORD_SCOPING_RULES_ROWS_REQUIREMENT = {
  recordScopingRule: [
    'roleId',
    'objectMetadataId',
    'logicalOperator',
    'conditions',
  ],
} as const satisfies WorkspaceCacheRowsRequirement;

@Injectable()
@WorkspaceCache('recordScopingRulesByRoleId', { packingPonderation: 1 })
export class WorkspaceRecordScopingRulesCacheService extends WorkspaceCacheProvider<RecordScopingRulesByRoleId> {
  override readonly rowsRequirement = RECORD_SCOPING_RULES_ROWS_REQUIREMENT;

  computeForCache({
    rows,
  }: WorkspaceCacheProviderContext<
    typeof RECORD_SCOPING_RULES_ROWS_REQUIREMENT
  >): RecordScopingRulesByRoleId {
    const recordScopingRulesByRoleId: RecordScopingRulesByRoleId = {};

    for (const rule of rows.recordScopingRule) {
      (recordScopingRulesByRoleId[rule.roleId] ??= []).push({
        objectMetadataId: rule.objectMetadataId,
        logicalOperator: rule.logicalOperator,
        conditions: rule.conditions,
      });
    }

    return recordScopingRulesByRoleId;
  }
}
