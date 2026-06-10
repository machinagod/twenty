import { Brackets, type WhereExpressionBuilder } from 'typeorm';

import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import {
  type RecordScopingRule,
  type RecordScopingRulesByRoleId,
} from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';
import { applyRecordScoping } from 'src/engine/twenty-orm/record-scoping/utils/apply-record-scoping.util';
import { type WorkspaceSelectQueryBuilder } from 'src/engine/twenty-orm/repository/workspace-select-query-builder';

type Captured = { sql: string; parameters?: Record<string, unknown> };

const createQueryBuilderMock = ({
  queryType,
  alias,
}: {
  queryType: 'select' | 'update' | 'delete';
  alias?: string;
}) => {
  const andWhere = jest.fn();

  const queryBuilder = {
    expressionMap: {
      queryType,
      mainAlias: alias ? { name: alias } : undefined,
    },
    andWhere,
  } as unknown as WorkspaceSelectQueryBuilder<Record<string, unknown>>;

  return { queryBuilder, andWhere };
};

// Runs the Brackets captured by andWhere against a fake WhereExpressionBuilder so
// we can assert the SQL fragments and bound parameters it produces.
const evaluateBrackets = (brackets: Brackets): Captured[] => {
  const captured: Captured[] = [];
  const record =
    (kind: string) => (sql: string, parameters?: Record<string, unknown>) => {
      captured.push({ sql: `[${kind}] ${sql}`, parameters });

      return web;
    };
  const web = {
    where: jest.fn(record('where')),
    andWhere: jest.fn(record('andWhere')),
    orWhere: jest.fn(record('orWhere')),
  } as unknown as WhereExpressionBuilder;

  brackets.whereFactory(web);

  return captured;
};

const authContext = {
  type: 'user',
  userWorkspaceId: 'uw-1',
  workspaceMember: { id: 'wm-current' },
} as unknown as WorkspaceAuthContext;

const userWorkspaceRoleMap = { 'uw-1': 'role-1' };

const ownerRule: RecordScopingRule = {
  roleLabel: 'Member',
  objectNameSingular: 'opportunity',
  logicalOperator: 'AND',
  conditions: [
    { column: 'assigneeId', operator: 'eq', currentWorkspaceMemberField: 'id' },
  ],
};

const rulesByRole: RecordScopingRulesByRoleId = { 'role-1': [ownerRule] };

describe('applyRecordScoping', () => {
  it('should do nothing when no rules are configured', () => {
    const { queryBuilder, andWhere } = createQueryBuilderMock({
      queryType: 'select',
      alias: 'opportunity',
    });

    applyRecordScoping({
      queryBuilder,
      objectNameSingular: 'opportunity',
      recordScopingRulesByRoleId: undefined,
      userWorkspaceRoleMap,
      authContext,
    });

    expect(andWhere).not.toHaveBeenCalled();
  });

  it('should do nothing when no rule targets the queried object', () => {
    const { queryBuilder, andWhere } = createQueryBuilderMock({
      queryType: 'select',
      alias: 'person',
    });

    applyRecordScoping({
      queryBuilder,
      objectNameSingular: 'person',
      recordScopingRulesByRoleId: rulesByRole,
      userWorkspaceRoleMap,
      authContext,
    });

    expect(andWhere).not.toHaveBeenCalled();
  });

  it('should inject an alias-qualified WHERE for a SELECT', () => {
    const { queryBuilder, andWhere } = createQueryBuilderMock({
      queryType: 'select',
      alias: 'opportunity',
    });

    applyRecordScoping({
      queryBuilder,
      objectNameSingular: 'opportunity',
      recordScopingRulesByRoleId: rulesByRole,
      userWorkspaceRoleMap,
      authContext,
    });

    expect(andWhere).toHaveBeenCalledTimes(1);
    const brackets = andWhere.mock.calls[0][0] as Brackets;

    expect(brackets).toBeInstanceOf(Brackets);
    expect(evaluateBrackets(brackets)).toEqual([
      {
        sql: '[where] "opportunity"."assigneeId" = :record_scoping_0',
        parameters: { record_scoping_0: 'wm-current' },
      },
    ]);
  });

  it('should inject an unqualified WHERE for an UPDATE (no alias)', () => {
    const { queryBuilder, andWhere } = createQueryBuilderMock({
      queryType: 'update',
    });

    applyRecordScoping({
      queryBuilder,
      objectNameSingular: 'opportunity',
      recordScopingRulesByRoleId: rulesByRole,
      userWorkspaceRoleMap,
      authContext,
    });

    const brackets = andWhere.mock.calls[0][0] as Brackets;

    expect(evaluateBrackets(brackets)).toEqual([
      {
        sql: '[where] "assigneeId" = :record_scoping_0',
        parameters: { record_scoping_0: 'wm-current' },
      },
    ]);
  });

  it('should render an IN clause with an array parameter', () => {
    const { queryBuilder, andWhere } = createQueryBuilderMock({
      queryType: 'select',
      alias: 'opportunity',
    });

    applyRecordScoping({
      queryBuilder,
      objectNameSingular: 'opportunity',
      recordScopingRulesByRoleId: {
        'role-1': [
          {
            ...ownerRule,
            conditions: [
              { column: 'stage', operator: 'in', staticValue: ['NEW', 'WON'] },
            ],
          },
        ],
      },
      userWorkspaceRoleMap,
      authContext,
    });

    const brackets = andWhere.mock.calls[0][0] as Brackets;

    expect(evaluateBrackets(brackets)).toEqual([
      {
        sql: '[where] "opportunity"."stage" IN (:...record_scoping_0)',
        parameters: { record_scoping_0: ['NEW', 'WON'] },
      },
    ]);
  });

  it('should fail closed with 1 = 0 when a member-relative value is missing', () => {
    const { queryBuilder, andWhere } = createQueryBuilderMock({
      queryType: 'select',
      alias: 'opportunity',
    });

    applyRecordScoping({
      queryBuilder,
      objectNameSingular: 'opportunity',
      recordScopingRulesByRoleId: {
        'role-1': [
          {
            ...ownerRule,
            conditions: [
              {
                column: 'assigneeId',
                operator: 'eq',
                currentWorkspaceMemberField: 'missing',
              },
            ],
          },
        ],
      },
      userWorkspaceRoleMap,
      authContext,
    });

    expect(andWhere).toHaveBeenCalledWith('1 = 0');
  });
});
