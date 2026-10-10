import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import {
  type RecordScopingRule,
  type RecordScopingRulesByRoleId,
} from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';
import { buildRecordScopingCondition } from 'src/engine/twenty-orm/record-scoping/utils/build-record-scoping-condition.util';
import { compileNamedParameters } from 'src/engine/twenty-orm/sql/utils/compile-named-parameters.util';

const userAuthContext = {
  type: 'user',
  userWorkspaceId: 'uw-1',
  workspaceMember: { id: 'wm-current' },
} as unknown as WorkspaceAuthContext;

const apiKeyAuthContext = {
  type: 'apiKey',
  apiKey: { id: 'api-key-1' },
} as unknown as WorkspaceAuthContext;

const userWorkspaceRoleMap = { 'uw-1': 'role-1' };

const ownerRule: RecordScopingRule = {
  objectMetadataId: 'opportunity-id',
  logicalOperator: 'AND',
  conditions: [
    { column: 'ownerId', operator: 'eq', currentWorkspaceMemberField: 'id' },
  ],
};

const rulesByRole: RecordScopingRulesByRoleId = { 'role-1': [ownerRule] };

const buildForOpportunity = (
  overrides: Partial<Parameters<typeof buildRecordScopingCondition>[0]> = {},
) =>
  buildRecordScopingCondition({
    alias: 'opportunity',
    objectMetadataId: 'opportunity-id',
    recordScopingRulesByRoleId: rulesByRole,
    userWorkspaceRoleMap,
    authContext: userAuthContext,
    getRelatedTableName: (objectMetadataId) =>
      ({ 'company-id': '"ws"."company"', 'document-id': '"ws"."_documento"' })[
        objectMetadataId
      ],
    ...overrides,
  });

describe('buildRecordScopingCondition', () => {
  it('should return undefined when no rules are configured', () => {
    expect(
      buildForOpportunity({ recordScopingRulesByRoleId: undefined }),
    ).toBeUndefined();
  });

  it('should return undefined when no rule targets the queried object', () => {
    expect(
      buildForOpportunity({ alias: 'person', objectMetadataId: 'person-id' }),
    ).toBeUndefined();
  });

  it('should return undefined for a non-user auth context', () => {
    expect(
      buildForOpportunity({ authContext: apiKeyAuthContext }),
    ).toBeUndefined();
  });

  it('should return undefined when the user has no role in the workspace', () => {
    expect(buildForOpportunity({ userWorkspaceRoleMap: {} })).toBeUndefined();
  });

  it('should return undefined when the role has no rules', () => {
    expect(
      buildForOpportunity({ userWorkspaceRoleMap: { 'uw-1': 'role-other' } }),
    ).toBeUndefined();
  });

  it('should build an alias-qualified condition bound to the current member', () => {
    expect(buildForOpportunity()).toEqual({
      sql: '("opportunity"."ownerId" = :recordScoping_opportunity_0)',
      parameters: { recordScoping_opportunity_0: 'wm-current' },
    });
  });

  it('should compile to positional SQL through the workspace parameter compiler', () => {
    const condition = buildForOpportunity({
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
    });

    expect(condition).toBeDefined();
    expect(
      compileNamedParameters(
        `SELECT 1 WHERE ${condition?.sql}`,
        condition?.parameters ?? {},
      ),
    ).toEqual({
      text: 'SELECT 1 WHERE ("opportunity"."stage" IN ($1, $2))',
      values: ['NEW', 'WON'],
    });
  });

  it('should render neq and join a single rule with its own OR operator', () => {
    expect(
      buildForOpportunity({
        recordScopingRulesByRoleId: {
          'role-1': [
            {
              ...ownerRule,
              logicalOperator: 'OR',
              conditions: [
                {
                  column: 'ownerId',
                  operator: 'eq',
                  currentWorkspaceMemberField: 'id',
                },
                { column: 'stage', operator: 'neq', staticValue: 'LOST' },
              ],
            },
          ],
        },
      }),
    ).toEqual({
      sql: '("opportunity"."ownerId" = :recordScoping_opportunity_0 OR "opportunity"."stage" != :recordScoping_opportunity_1)',
      parameters: {
        recordScoping_opportunity_0: 'wm-current',
        recordScoping_opportunity_1: 'LOST',
      },
    });
  });

  it('should AND conditions across multiple rules for the same object', () => {
    const condition = buildForOpportunity({
      recordScopingRulesByRoleId: {
        'role-1': [
          { ...ownerRule, logicalOperator: 'OR' },
          {
            ...ownerRule,
            conditions: [
              { column: 'stage', operator: 'eq', staticValue: 'NEW' },
            ],
          },
        ],
      },
    });

    expect(condition?.sql).toBe(
      '("opportunity"."ownerId" = :recordScoping_opportunity_0 AND "opportunity"."stage" = :recordScoping_opportunity_1)',
    );
  });

  it('should wrap a scalar value in an array for IN', () => {
    expect(
      buildForOpportunity({
        recordScopingRulesByRoleId: {
          'role-1': [
            {
              ...ownerRule,
              conditions: [
                {
                  column: 'ownerId',
                  operator: 'in',
                  currentWorkspaceMemberField: 'id',
                },
              ],
            },
          ],
        },
      })?.parameters,
    ).toEqual({ recordScoping_opportunity_0: ['wm-current'] });
  });

  it('should namespace parameters per alias so joined aliases cannot collide', () => {
    const condition = buildForOpportunity({ alias: 'company.opportunities' });

    expect(condition).toEqual({
      sql: '("company.opportunities"."ownerId" = :recordScoping_company_opportunities_0)',
      parameters: { recordScoping_company_opportunities_0: 'wm-current' },
    });
  });

  it('should fail closed when a member-relative value is missing', () => {
    expect(
      buildForOpportunity({
        recordScopingRulesByRoleId: {
          'role-1': [
            {
              ...ownerRule,
              conditions: [
                {
                  column: 'ownerId',
                  operator: 'eq',
                  currentWorkspaceMemberField: 'missing',
                },
              ],
            },
          ],
        },
      }),
    ).toEqual({ sql: '1 = 0', parameters: {} });
  });
  describe('related records', () => {
    const relatedRule = (
      conditions: RecordScopingRule['conditions'],
    ): RecordScopingRulesByRoleId => ({
      'role-1': [
        {
          objectMetadataId: 'opportunity-id',
          logicalOperator: 'AND',
          conditions,
        },
      ],
    });
    const companyOwnedByMe = {
      column: 'companyId',
      operator: 'in' as const,
      relatedRecords: {
        objectMetadataId: 'company-id',
        logicalOperator: 'AND' as const,
        conditions: [
          {
            column: 'accountOwnerId',
            operator: 'eq' as const,
            currentWorkspaceMemberField: 'id',
          },
        ],
      },
    };

    it('should keep records whose relation points at a matching record', () => {
      expect(
        buildForOpportunity({
          recordScopingRulesByRoleId: relatedRule([companyOwnedByMe]),
        }),
      ).toEqual({
        sql: '("opportunity"."companyId" IN (SELECT "recordScoping_opportunity_0"."id" FROM "ws"."company" "recordScoping_opportunity_0" WHERE ("recordScoping_opportunity_0"."accountOwnerId" = :recordScoping_opportunity_0_0)))',
        parameters: { recordScoping_opportunity_0_0: 'wm-current' },
      });
    });

    it('should keep records that matching related records point back at', () => {
      expect(
        buildForOpportunity({
          recordScopingRulesByRoleId: relatedRule([
            {
              column: 'id',
              operator: 'in',
              relatedRecords: {
                objectMetadataId: 'document-id',
                matchColumn: 'opportunityId',
                logicalOperator: 'AND',
                conditions: [companyOwnedByMe],
              },
            },
          ]),
        }),
      ).toEqual({
        sql: '("opportunity"."id" IN (SELECT "recordScoping_opportunity_0"."opportunityId" FROM "ws"."_documento" "recordScoping_opportunity_0" WHERE ("recordScoping_opportunity_0"."companyId" IN (SELECT "recordScoping_opportunity_0_0"."id" FROM "ws"."company" "recordScoping_opportunity_0_0" WHERE ("recordScoping_opportunity_0_0"."accountOwnerId" = :recordScoping_opportunity_0_0_0)))))',
        parameters: { recordScoping_opportunity_0_0_0: 'wm-current' },
      });
    });

    it('should nest related records and mix them with plain conditions', () => {
      const condition = buildForOpportunity({
        recordScopingRulesByRoleId: relatedRule([
          {
            column: 'documentoId',
            operator: 'in',
            relatedRecords: {
              objectMetadataId: 'document-id',
              logicalOperator: 'OR',
              conditions: [
                companyOwnedByMe,
                { column: 'status', operator: 'eq', staticValue: 1 },
              ],
            },
          },
          { column: 'stage', operator: 'neq', staticValue: 'LOST' },
        ]),
      });

      expect(condition?.sql).toBe(
        '("opportunity"."documentoId" IN (SELECT "recordScoping_opportunity_0"."id" FROM "ws"."_documento" "recordScoping_opportunity_0" WHERE ("recordScoping_opportunity_0"."companyId" IN (SELECT "recordScoping_opportunity_0_0"."id" FROM "ws"."company" "recordScoping_opportunity_0_0" WHERE ("recordScoping_opportunity_0_0"."accountOwnerId" = :recordScoping_opportunity_0_0_0)) OR "recordScoping_opportunity_0"."status" = :recordScoping_opportunity_0_1)) AND "opportunity"."stage" != :recordScoping_opportunity_1)',
      );
      expect(condition?.parameters).toEqual({
        recordScoping_opportunity_0_0_0: 'wm-current',
        recordScoping_opportunity_0_1: 1,
        recordScoping_opportunity_1: 'LOST',
      });
    });

    it('should fail closed when the related object has no table', () => {
      expect(
        buildForOpportunity({
          recordScopingRulesByRoleId: relatedRule([
            {
              ...companyOwnedByMe,
              relatedRecords: {
                ...companyOwnedByMe.relatedRecords,
                objectMetadataId: 'deleted-id',
              },
            },
          ]),
        }),
      ).toEqual({ sql: '1 = 0', parameters: {} });
    });

    it('should fail closed when a nested member value is missing', () => {
      expect(
        buildForOpportunity({
          recordScopingRulesByRoleId: relatedRule([companyOwnedByMe]),
          authContext: {
            ...userAuthContext,
            workspaceMember: undefined,
          } as unknown as WorkspaceAuthContext,
        }),
      ).toEqual({ sql: '1 = 0', parameters: {} });
    });

    it('should fail closed on related records without conditions', () => {
      expect(
        buildForOpportunity({
          recordScopingRulesByRoleId: relatedRule([
            {
              ...companyOwnedByMe,
              relatedRecords: {
                ...companyOwnedByMe.relatedRecords,
                conditions: [],
              },
            },
          ]),
        }),
      ).toEqual({ sql: '1 = 0', parameters: {} });
    });

    it('should compile to positional parameters', () => {
      const condition = buildForOpportunity({
        recordScopingRulesByRoleId: relatedRule([companyOwnedByMe]),
      });

      expect(
        compileNamedParameters(condition!.sql, condition!.parameters).values,
      ).toEqual(['wm-current']);
    });
  });
});
