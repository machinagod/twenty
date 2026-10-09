import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { type FlatRole } from 'src/engine/metadata-modules/flat-role/types/flat-role.type';
import { type RecordScopingRule } from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';
import { resolveRecordScopingRulesByRoleId } from 'src/engine/twenty-orm/record-scoping/utils/resolve-record-scoping-rules-by-role-id.util';

const flatRoleMaps = {
  byUniversalIdentifier: {
    'uid-1': { id: 'role-member', label: 'Member' },
    'uid-2': { id: 'role-admin', label: 'Admin' },
  },
} as unknown as FlatEntityMaps<FlatRole>;

const makeRule = (roleLabel: string): RecordScopingRule => ({
  roleLabel,
  objectNameSingular: 'opportunity',
  logicalOperator: 'AND',
  conditions: [
    { column: 'assigneeId', operator: 'eq', currentWorkspaceMemberField: 'id' },
  ],
});

describe('resolveRecordScopingRulesByRoleId', () => {
  it('should index rules by resolved roleId', () => {
    const { recordScopingRulesByRoleId, unmatchedRoleLabels } =
      resolveRecordScopingRulesByRoleId({
        rules: [makeRule('Member')],
        flatRoleMaps,
      });

    expect(recordScopingRulesByRoleId).toEqual({
      'role-member': [makeRule('Member')],
    });
    expect(unmatchedRoleLabels).toEqual([]);
  });

  it('should group multiple rules under the same role', () => {
    const { recordScopingRulesByRoleId } = resolveRecordScopingRulesByRoleId({
      rules: [makeRule('Member'), makeRule('Member')],
      flatRoleMaps,
    });

    expect(recordScopingRulesByRoleId['role-member']).toHaveLength(2);
  });

  it('should collect unmatched role labels and not enforce them', () => {
    const { recordScopingRulesByRoleId, unmatchedRoleLabels } =
      resolveRecordScopingRulesByRoleId({
        rules: [makeRule('Member'), makeRule('Ghost')],
        flatRoleMaps,
      });

    expect(Object.keys(recordScopingRulesByRoleId)).toEqual(['role-member']);
    expect(unmatchedRoleLabels).toEqual(['Ghost']);
  });

  it('should return an empty map when there are no rules', () => {
    const { recordScopingRulesByRoleId, unmatchedRoleLabels } =
      resolveRecordScopingRulesByRoleId({ rules: [], flatRoleMaps });

    expect(recordScopingRulesByRoleId).toEqual({});
    expect(unmatchedRoleLabels).toEqual([]);
  });
});
