import { type RecordScopingRule } from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';
import { resolveRecordScoping } from 'src/engine/twenty-orm/record-scoping/utils/resolve-record-scoping.util';

const currentWorkspaceMember = { id: 'wm-current', region: 'EMEA' };

const ownerRule: RecordScopingRule = {
  roleLabel: 'Member',
  objectNameSingular: 'opportunity',
  logicalOperator: 'AND',
  conditions: [
    { column: 'assigneeId', operator: 'eq', currentWorkspaceMemberField: 'id' },
  ],
};

describe('resolveRecordScoping', () => {
  it('should resolve an owner=me rule to a concrete condition', () => {
    const result = resolveRecordScoping({
      rules: [ownerRule],
      currentWorkspaceMember,
    });

    expect(result).toEqual({
      kind: 'conditions',
      logicalOperator: 'AND',
      conditions: [
        { column: 'assigneeId', operator: 'eq', value: 'wm-current' },
      ],
    });
  });

  it('should resolve a static-value rule', () => {
    const result = resolveRecordScoping({
      rules: [
        {
          ...ownerRule,
          conditions: [
            { column: 'stage', operator: 'in', staticValue: ['NEW', 'WON'] },
          ],
        },
      ],
      currentWorkspaceMember,
    });

    expect(result).toEqual({
      kind: 'conditions',
      logicalOperator: 'AND',
      conditions: [{ column: 'stage', operator: 'in', value: ['NEW', 'WON'] }],
    });
  });

  it('should preserve the OR operator within a single rule', () => {
    const result = resolveRecordScoping({
      rules: [
        {
          ...ownerRule,
          logicalOperator: 'OR',
          conditions: [
            {
              column: 'assigneeId',
              operator: 'eq',
              currentWorkspaceMemberField: 'id',
            },
            { column: 'visibility', operator: 'eq', staticValue: 'PUBLIC' },
          ],
        },
      ],
      currentWorkspaceMember,
    });

    expect(result).toEqual({
      kind: 'conditions',
      logicalOperator: 'OR',
      conditions: [
        { column: 'assigneeId', operator: 'eq', value: 'wm-current' },
        { column: 'visibility', operator: 'eq', value: 'PUBLIC' },
      ],
    });
  });

  it('should AND conditions across multiple rules for the same object', () => {
    const result = resolveRecordScoping({
      rules: [
        ownerRule,
        {
          ...ownerRule,
          logicalOperator: 'OR',
          conditions: [
            {
              column: 'region',
              operator: 'eq',
              currentWorkspaceMemberField: 'region',
            },
          ],
        },
      ],
      currentWorkspaceMember,
    });

    expect(result).toEqual({
      kind: 'conditions',
      logicalOperator: 'AND',
      conditions: [
        { column: 'assigneeId', operator: 'eq', value: 'wm-current' },
        { column: 'region', operator: 'eq', value: 'EMEA' },
      ],
    });
  });

  it('should fail closed when a member-relative field is missing', () => {
    const result = resolveRecordScoping({
      rules: [
        {
          ...ownerRule,
          conditions: [
            {
              column: 'assigneeId',
              operator: 'eq',
              currentWorkspaceMemberField: 'doesNotExist',
            },
          ],
        },
      ],
      currentWorkspaceMember,
    });

    expect(result).toEqual({ kind: 'match-nothing' });
  });

  it('should fail closed when there is no current workspace member', () => {
    const result = resolveRecordScoping({
      rules: [ownerRule],
      currentWorkspaceMember: undefined,
    });

    expect(result).toEqual({ kind: 'match-nothing' });
  });

  it('should return none when no rule has conditions', () => {
    const result = resolveRecordScoping({
      rules: [{ ...ownerRule, conditions: [] }],
      currentWorkspaceMember,
    });

    expect(result).toEqual({ kind: 'none' });
  });
});
