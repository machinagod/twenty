import { Test, type TestingModule } from '@nestjs/testing';

import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { WorkspaceDataSourceService } from 'src/engine/twenty-orm/datasource/workspace-data-source.service';
import { RecordScopingConfigService } from 'src/engine/twenty-orm/record-scoping/services/record-scoping-config.service';
import { type RecordScopingRule } from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';
import { getWorkspaceContext } from 'src/engine/twenty-orm/storage/orm-workspace-context.storage';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';

const memberOwnerRule: RecordScopingRule = {
  roleLabel: 'Member',
  objectNameSingular: 'opportunity',
  logicalOperator: 'AND',
  conditions: [
    { column: 'ownerId', operator: 'eq', currentWorkspaceMemberField: 'id' },
  ],
};

const buildModule = async (rules: RecordScopingRule[]) =>
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
            flatRoleMaps: {
              byUniversalIdentifier: {
                'member-uid': { id: 'member-role-id', label: 'Member' },
              },
            },
          }),
        },
      },
      {
        provide: RecordScopingConfigService,
        useValue: {
          getRules: () => rules,
          isEnabled: () => rules.length > 0,
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
      const module = await buildModule([]);
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
  it('should leave record scoping unset when no rules are configured', async () => {
    const module = await buildModule([]);
    const context = await loadContext(module, false);

    expect(context.recordScopingRulesByRoleId).toBeUndefined();
    await module.close();
  });

  it('should resolve configured rules to the workspace role ids', async () => {
    const module = await buildModule([memberOwnerRule]);
    const context = await loadContext(module, false);

    expect(context.recordScopingRulesByRoleId).toEqual({
      'member-role-id': [memberOwnerRule],
    });
    expect(
      module.get(WorkspaceCacheService).getOrRecompute,
    ).toHaveBeenCalledWith('workspace', ['flatRoleMaps']);
    await module.close();
  });

  it('should not load role maps for a lite context', async () => {
    const module = await buildModule([memberOwnerRule]);
    const context = await loadContext(module, true);

    expect(context.recordScopingRulesByRoleId).toBeUndefined();
    expect(
      module.get(WorkspaceCacheService).getOrRecompute,
    ).toHaveBeenCalledTimes(1);
    await module.close();
  });
});
