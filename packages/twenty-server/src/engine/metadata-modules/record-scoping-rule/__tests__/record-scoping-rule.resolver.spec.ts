import { RecordScopingRuleResolver } from 'src/engine/metadata-modules/record-scoping-rule/record-scoping-rule.resolver';

describe('RecordScopingRuleResolver', () => {
  const workspace = { id: 'workspace-id' } as never;
  const input = {
    roleId: 'role-id',
    objectMetadataId: 'object-id',
    logicalOperator: 'AND',
    conditions: [],
  };
  const service = {
    findByRole: jest.fn().mockResolvedValue(['rule']),
    upsert: jest.fn().mockResolvedValue('upserted'),
    delete: jest.fn().mockResolvedValue('deleted'),
  };
  const resolver = new RecordScopingRuleResolver(service as never);

  it('lists the rules of a role in the workspace', async () => {
    await expect(
      resolver.recordScopingRules(workspace, 'role-id'),
    ).resolves.toEqual(['rule']);
    expect(service.findByRole).toHaveBeenCalledWith({
      workspaceId: 'workspace-id',
      roleId: 'role-id',
    });
  });

  it('upserts and deletes in the workspace', async () => {
    await expect(
      resolver.upsertRecordScopingRule(workspace, input),
    ).resolves.toBe('upserted');
    expect(service.upsert).toHaveBeenCalledWith({
      workspaceId: 'workspace-id',
      input,
    });

    const deleteInput = { roleId: 'role-id', objectMetadataId: 'object-id' };

    await expect(
      resolver.deleteRecordScopingRule(workspace, deleteInput),
    ).resolves.toBe('deleted');
    expect(service.delete).toHaveBeenCalledWith({
      workspaceId: 'workspace-id',
      input: deleteInput,
    });
  });
});
