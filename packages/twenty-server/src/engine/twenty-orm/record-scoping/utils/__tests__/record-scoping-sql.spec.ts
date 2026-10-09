import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import {
  buildQueryBuilder,
  SCHEMA_NAME,
} from 'src/engine/twenty-orm/query-builder/__tests__/workspace-select-query-builder-test-shapes.util';
import { type WorkspaceSelectQueryBuilder } from 'src/engine/twenty-orm/query-builder/workspace-select-query-builder';
import { type RecordScopingRulesByRoleId } from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';
import { buildRecordScopingCondition } from 'src/engine/twenty-orm/record-scoping/utils/build-record-scoping-condition.util';

const authContext = {
  type: 'user',
  userWorkspaceId: 'uw-1',
  workspaceMember: { id: 'wm-current' },
} as unknown as WorkspaceAuthContext;

const recordScopingRulesByRoleId: RecordScopingRulesByRoleId = {
  'role-1': ['person', 'company'].map((objectNameSingular) => ({
    roleLabel: 'Member',
    objectNameSingular,
    logicalOperator: 'AND',
    conditions: [
      {
        column: 'ownerId',
        operator: 'eq',
        currentWorkspaceMemberField: 'id',
      },
    ],
  })),
};

// Mirrors how WorkspaceRepository attaches record scoping: on the main alias as a
// row access condition, on joined aliases as an extra ON condition.
const applyRecordScoping = (queryBuilder: WorkspaceSelectQueryBuilder) => {
  const aliases = [
    { alias: queryBuilder.alias, objectNameSingular: 'person' },
    ...queryBuilder
      .getJoinAliases()
      .map(({ name }) => ({ alias: name, objectNameSingular: 'company' })),
  ];

  for (const { alias, objectNameSingular } of aliases) {
    if (!queryBuilder.markRowLevelPermissionApplied(alias)) {
      continue;
    }

    const condition = buildRecordScopingCondition({
      alias,
      objectNameSingular,
      recordScopingRulesByRoleId,
      userWorkspaceRoleMap: { 'uw-1': 'role-1' },
      authContext,
    });

    if (!condition) {
      continue;
    }

    if (alias === queryBuilder.alias) {
      queryBuilder.addRowAccessCondition(condition.sql, condition.parameters);
    } else {
      queryBuilder.addJoinCondition(alias, condition.sql);
      queryBuilder.setParameters(condition.parameters);
    }
  }
};

const buildScopedQueryBuilder = () => {
  const built = buildQueryBuilder({ onBeforeExecute: applyRecordScoping });

  built.queryBuilder.setFindOptions({ select: { id: true } });

  return built;
};

describe('record scoping on workspace query builders', () => {
  it('should scope a SELECT and keep an orWhere inside the guarded expression', async () => {
    const { queryBuilder, executedStatements } = buildScopedQueryBuilder();

    await queryBuilder
      .where('"person"."id" = :a', { a: 1 })
      .orWhere('"person"."id" = :b', { b: 2 })
      .getMany();

    expect(executedStatements[0].text).toContain(
      '(("person"."id" = $1) OR ("person"."id" = $2)) AND (("person"."ownerId" = $3))',
    );
    expect(executedStatements[0].values).toEqual([1, 2, 'wm-current']);
  });

  it('should scope a count', async () => {
    const { queryBuilder, executedStatements } = buildScopedQueryBuilder();

    await queryBuilder.getCount();

    expect(executedStatements[0].text).toContain('("person"."ownerId" = $1)');
    expect(executedStatements[0].values).toEqual(['wm-current']);
  });

  it('should scope a DELETE built from the select builder', () => {
    const { queryBuilder } = buildScopedQueryBuilder();

    const mutationQueryBuilder = queryBuilder
      .where('"person"."id" = :a', { a: 1 })
      .applyRowLevelPermissions()
      .delete();

    expect(mutationQueryBuilder.getQuery()).toBe(
      `DELETE FROM "${SCHEMA_NAME}"."person" AS "person" WHERE (("person"."id" = :a)) AND (("person"."ownerId" = :recordScoping_person_0))`,
    );
  });

  it('should scope a joined relation on its ON clause', async () => {
    const { queryBuilder, executedStatements } = buildScopedQueryBuilder();

    queryBuilder.leftJoin('person.company', 'company');
    await queryBuilder.getMany();

    expect(executedStatements[0].text).toContain(
      'ON ("person"."companyId" = "company"."id") AND (("company"."ownerId" = $1))',
    );
    expect(executedStatements[0].text).toContain(
      'WHERE ((("person"."ownerId" = $2)))',
    );
    expect(executedStatements[0].values).toEqual(['wm-current', 'wm-current']);
  });
});
