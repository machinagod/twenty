import { Test, type TestingModule } from '@nestjs/testing';

import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { WorkspaceDataSourceService } from 'src/engine/twenty-orm/datasource/workspace-data-source.service';
import { type RecordScopingRulesByRoleId } from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';
import { getWorkspaceContext } from 'src/engine/twenty-orm/storage/orm-workspace-context.storage';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';

const memberOwnerRules: RecordScopingRulesByRoleId = {
  'member-role-id': [
    {
      objectMetadataId: 'opportunity-id',
      logicalOperator: 'AND',
      conditions: [
        {
          column: 'ownerId',
          operator: 'eq',
          currentWorkspaceMemberField: 'id',
        },
      ],
    },
  ],
};

const buildModule = async (
  recordScopingRulesByRoleId: RecordScopingRulesByRoleId = {},
) =>
  Test.createTestingModule({
    providers: [
      WorkspaceOrmManager,
      { provide: WorkspaceDataSourceService, useValue: {} },
      {
        provide: WorkspaceCacheService,
        useValue: {
          getOrRecompute: jest.fn().mockResolvedValue({
            flatObjectMetadataMaps: createEmptyFlatEntityMaps(),
            featureFlagsMap: {},
            recordScopingRulesByRoleId,
          }),
        },
      },
    ],
  }).compile();

const loadContext = (module: TestingModule, lite: boolean) =>
  module
    .get(WorkspaceOrmManager)
    .executeInWorkspaceContext(
      () => getWorkspaceContext(),
      buildSystemAuthContext('workspace'),
      { lite },
    );

describe('workspace context sharing enforcement', () => {
  it.each([true, false])(
    'loads the authenticated workspace without a sharing rollout lookup (lite=%s)',
    async (lite) => {
      const module = await buildModule();
      const authContext = buildSystemAuthContext('workspace');
      const context = await module
        .get(WorkspaceOrmManager)
        .executeInWorkspaceContext(() => getWorkspaceContext(), authContext, {
          lite,
        });
      expect(context.authContext).toBe(authContext);
      expect(
        module.get(WorkspaceCacheService).getOrRecompute,
      ).toHaveBeenCalledTimes(1);
      await module.close();
    },
  );
});

describe('workspace context record scoping', () => {
  it('should expose the cached rules on a full context', async () => {
    const module = await buildModule(memberOwnerRules);
    const context = await loadContext(module, false);

    expect(context.recordScopingRulesByRoleId).toEqual(memberOwnerRules);
    expect(
      module.get(WorkspaceCacheService).getOrRecompute,
    ).toHaveBeenCalledWith(
      'workspace',
      expect.arrayContaining(['recordScopingRulesByRoleId']),
    );
    await module.close();
  });

  it('should not load rules for a lite context', async () => {
    const module = await buildModule(memberOwnerRules);
    const context = await loadContext(module, true);

    expect(context.recordScopingRulesByRoleId).toBeUndefined();
    expect(
      module.get(WorkspaceCacheService).getOrRecompute,
    ).toHaveBeenCalledTimes(1);
    await module.close();
  });
});
