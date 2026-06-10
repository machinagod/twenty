import {
  buildRecordScopingGqlFilter,
  RECORD_SCOPING_MATCH_NOTHING,
} from 'src/engine/twenty-orm/record-scoping/utils/build-record-scoping-gql-filter.util';
import { type RecordScopingRule } from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';

const currentWorkspaceMember = {
  id: 'wm-current',
  name: { firstName: 'Ada', lastName: 'Lovelace' },
};

const makeRule = (
  conditions: RecordScopingRule['conditions'],
  logicalOperator: RecordScopingRule['logicalOperator'] = 'AND',
): RecordScopingRule => ({
  roleId: 'role-1',
  objectNameSingular: 'opportunity',
  logicalOperator,
  conditions,
});

describe('buildRecordScopingGqlFilter', () => {
  it('should scope to records owned by the current workspace member', () => {
    const filter = buildRecordScopingGqlFilter({
      rule: makeRule([
        {
          fieldPath: 'assigneeId',
          operator: 'eq',
          currentWorkspaceMemberField: 'id',
        },
      ]),
      currentWorkspaceMember,
    });

    expect(filter).toEqual({ assigneeId: { eq: 'wm-current' } });
  });

  it('should build a static-value filter', () => {
    const filter = buildRecordScopingGqlFilter({
      rule: makeRule([
        { fieldPath: 'stage', operator: 'eq', staticValue: 'WON' },
      ]),
      currentWorkspaceMember,
    });

    expect(filter).toEqual({ stage: { eq: 'WON' } });
  });

  it('should combine multiple conditions with AND', () => {
    const filter = buildRecordScopingGqlFilter({
      rule: makeRule([
        {
          fieldPath: 'assigneeId',
          operator: 'eq',
          currentWorkspaceMemberField: 'id',
        },
        { fieldPath: 'stage', operator: 'in', staticValue: ['NEW', 'WON'] },
      ]),
      currentWorkspaceMember,
    });

    expect(filter).toEqual({
      and: [
        { assigneeId: { eq: 'wm-current' } },
        { stage: { in: ['NEW', 'WON'] } },
      ],
    });
  });

  it('should combine multiple conditions with OR', () => {
    const filter = buildRecordScopingGqlFilter({
      rule: makeRule(
        [
          {
            fieldPath: 'assigneeId',
            operator: 'eq',
            currentWorkspaceMemberField: 'id',
          },
          { fieldPath: 'visibility', operator: 'eq', staticValue: 'PUBLIC' },
        ],
        'OR',
      ),
      currentWorkspaceMember,
    });

    expect(filter).toEqual({
      or: [
        { assigneeId: { eq: 'wm-current' } },
        { visibility: { eq: 'PUBLIC' } },
      ],
    });
  });

  it('should build a nested leaf filter for a composite/relation field path', () => {
    const filter = buildRecordScopingGqlFilter({
      rule: makeRule([
        {
          fieldPath: 'createdBy.workspaceMemberId',
          operator: 'eq',
          currentWorkspaceMemberField: 'id',
        },
      ]),
      currentWorkspaceMember,
    });

    expect(filter).toEqual({
      createdBy: { workspaceMemberId: { eq: 'wm-current' } },
    });
  });

  it('should fail closed (match nothing) when a member-relative field is missing', () => {
    const filter = buildRecordScopingGqlFilter({
      rule: makeRule([
        {
          fieldPath: 'assigneeId',
          operator: 'eq',
          currentWorkspaceMemberField: 'nonExistentField',
        },
      ]),
      currentWorkspaceMember,
    });

    expect(filter).toEqual(RECORD_SCOPING_MATCH_NOTHING);
  });

  it('should fail closed when there is no current workspace member at all', () => {
    const filter = buildRecordScopingGqlFilter({
      rule: makeRule([
        {
          fieldPath: 'assigneeId',
          operator: 'eq',
          currentWorkspaceMemberField: 'id',
        },
      ]),
      currentWorkspaceMember: undefined,
    });

    expect(filter).toEqual(RECORD_SCOPING_MATCH_NOTHING);
  });

  it('should return null when the rule has no conditions (no scoping applied)', () => {
    const filter = buildRecordScopingGqlFilter({
      rule: makeRule([]),
      currentWorkspaceMember,
    });

    expect(filter).toBeNull();
  });
});
