import { WorkspaceRecordScopingRulesCacheService } from 'src/engine/metadata-modules/record-scoping-rule/services/workspace-record-scoping-rules-cache.service';

describe('WorkspaceRecordScopingRulesCacheService', () => {
  it('groups the rules by role', () => {
    const ownerCondition = {
      column: 'ownerId',
      operator: 'eq',
      currentWorkspaceMemberField: 'id',
    };
    const stageCondition = {
      column: 'stage',
      operator: 'eq',
      staticValue: 'WON',
    };

    expect(
      new WorkspaceRecordScopingRulesCacheService().computeForCache({
        workspaceId: 'workspace',
        rows: {
          recordScopingRule: [
            {
              roleId: 'member',
              objectMetadataId: 'opportunity',
              logicalOperator: 'AND',
              conditions: [ownerCondition],
            },
            {
              roleId: 'member',
              objectMetadataId: 'company',
              logicalOperator: 'OR',
              conditions: [stageCondition],
            },
            {
              roleId: 'sales',
              objectMetadataId: 'opportunity',
              logicalOperator: 'AND',
              conditions: [ownerCondition],
            },
          ],
        },
      } as never),
    ).toEqual({
      member: [
        {
          objectMetadataId: 'opportunity',
          logicalOperator: 'AND',
          conditions: [ownerCondition],
        },
        {
          objectMetadataId: 'company',
          logicalOperator: 'OR',
          conditions: [stageCondition],
        },
      ],
      sales: [
        {
          objectMetadataId: 'opportunity',
          logicalOperator: 'AND',
          conditions: [ownerCondition],
        },
      ],
    });
  });

  it('is empty without rules', () => {
    expect(
      new WorkspaceRecordScopingRulesCacheService().computeForCache({
        workspaceId: 'workspace',
        rows: { recordScopingRule: [] },
      } as never),
    ).toEqual({});
  });
});
