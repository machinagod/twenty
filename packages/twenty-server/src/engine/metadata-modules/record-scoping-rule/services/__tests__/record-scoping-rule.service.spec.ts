import { RecordScopingRuleException } from 'src/engine/metadata-modules/record-scoping-rule/record-scoping-rule.exception';
import { RecordScopingRuleService } from 'src/engine/metadata-modules/record-scoping-rule/services/record-scoping-rule.service';
import {
  buildFlatEntityMaps,
  OPPORTUNITY_FIELDS,
  OPPORTUNITY_ID,
  OPPORTUNITY_OBJECT,
  WORKSPACE_MEMBER_OBJECT,
} from 'src/engine/metadata-modules/record-scoping-rule/utils/__tests__/record-scoping-rule-fixtures';

const WORKSPACE_ID = 'workspace-id';
const ROLE_ID = '20202020-0000-4000-8000-0000000000aa';

const ownerIsMe = {
  column: 'ownerId',
  operator: 'eq',
  currentWorkspaceMemberField: 'id',
};

const storedRule = {
  id: 'rule-id',
  workspaceId: WORKSPACE_ID,
  roleId: ROLE_ID,
  objectMetadataId: OPPORTUNITY_ID,
  logicalOperator: 'AND',
  conditions: [ownerIsMe],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const ruleDto = {
  id: 'rule-id',
  roleId: ROLE_ID,
  objectMetadataId: OPPORTUNITY_ID,
  logicalOperator: 'AND',
  conditions: [ownerIsMe],
};

describe('RecordScopingRuleService', () => {
  let repository: Record<string, jest.Mock>;
  let workspaceCacheService: Record<string, jest.Mock>;
  let service: RecordScopingRuleService;

  beforeEach(() => {
    repository = {
      find: jest.fn().mockResolvedValue([storedRule]),
      findOne: jest.fn().mockResolvedValue(storedRule),
      upsertAndReturnOne: jest.fn().mockResolvedValue(storedRule),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    workspaceCacheService = {
      getOrRecompute: jest.fn().mockResolvedValue({
        flatRoleMaps: buildFlatEntityMaps([
          { id: ROLE_ID, universalIdentifier: 'member-role' },
        ]),
        flatObjectMetadataMaps: buildFlatEntityMaps([
          OPPORTUNITY_OBJECT,
          WORKSPACE_MEMBER_OBJECT,
        ]),
        flatFieldMetadataMaps: buildFlatEntityMaps(OPPORTUNITY_FIELDS),
      }),
      invalidateAndRecompute: jest.fn().mockResolvedValue(undefined),
    };
    service = new RecordScopingRuleService(
      repository as never,
      workspaceCacheService as never,
    );
  });

  it('lists a role rules oldest first', async () => {
    await expect(
      service.findByRole({ workspaceId: WORKSPACE_ID, roleId: ROLE_ID }),
    ).resolves.toEqual([ruleDto]);
    expect(repository.find).toHaveBeenCalledWith(WORKSPACE_ID, {
      where: { roleId: ROLE_ID },
      order: { createdAt: 'ASC' },
    });
  });

  it('upserts a validated rule and refreshes the cache', async () => {
    await expect(
      service.upsert({
        workspaceId: WORKSPACE_ID,
        input: {
          roleId: ROLE_ID,
          objectMetadataId: OPPORTUNITY_ID,
          logicalOperator: 'AND',
          conditions: [{ ...ownerIsMe, staticValue: null }],
        },
      }),
    ).resolves.toEqual(ruleDto);
    expect(repository.upsertAndReturnOne).toHaveBeenCalledWith(
      WORKSPACE_ID,
      {
        roleId: ROLE_ID,
        objectMetadataId: OPPORTUNITY_ID,
        logicalOperator: 'AND',
        conditions: [ownerIsMe],
      },
      ['workspaceId', 'roleId', 'objectMetadataId'],
    );
    expect(workspaceCacheService.invalidateAndRecompute).toHaveBeenCalledWith(
      WORKSPACE_ID,
      ['recordScopingRulesByRoleId'],
    );
  });

  it.each([
    [
      'an unknown role',
      { roleId: '20202020-0000-4000-8000-0000000000ff' },
      'Role',
    ],
    [
      'an unknown object',
      { objectMetadataId: '20202020-0000-4000-8000-0000000000ee' },
      'Object',
    ],
    [
      'an invalid condition',
      { conditions: [{ column: 'nope', operator: 'eq', staticValue: 'x' }] },
      'not a column',
    ],
  ])('rejects %s without writing', async (_label, override, message) => {
    await expect(
      service.upsert({
        workspaceId: WORKSPACE_ID,
        input: {
          roleId: ROLE_ID,
          objectMetadataId: OPPORTUNITY_ID,
          logicalOperator: 'AND',
          conditions: [ownerIsMe],
          ...override,
        },
      }),
    ).rejects.toThrow(message);
    expect(repository.upsertAndReturnOne).not.toHaveBeenCalled();
    expect(workspaceCacheService.invalidateAndRecompute).not.toHaveBeenCalled();
  });

  it('deletes a rule and refreshes the cache', async () => {
    await expect(
      service.delete({
        workspaceId: WORKSPACE_ID,
        input: { roleId: ROLE_ID, objectMetadataId: OPPORTUNITY_ID },
      }),
    ).resolves.toEqual(ruleDto);
    expect(repository.delete).toHaveBeenCalledWith(WORKSPACE_ID, {
      id: 'rule-id',
    });
    expect(workspaceCacheService.invalidateAndRecompute).toHaveBeenCalled();
  });

  it('fails to delete a rule that does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(
      service.delete({
        workspaceId: WORKSPACE_ID,
        input: { roleId: ROLE_ID, objectMetadataId: OPPORTUNITY_ID },
      }),
    ).rejects.toBeInstanceOf(RecordScopingRuleException);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
