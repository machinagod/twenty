import { isUserAuthContext } from 'src/engine/core-modules/auth/guards/is-user-auth-context.guard';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { type UserWorkspaceRoleMap } from 'src/engine/metadata-modules/role-target/types/user-workspace-role-map.type';
import {
  type CurrentWorkspaceMemberLike,
  type RecordScopingRulesByRoleId,
  type ResolvedRecordScopingCondition,
} from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';
import { resolveRecordScoping } from 'src/engine/twenty-orm/record-scoping/utils/resolve-record-scoping.util';
import { type SqlCondition } from 'src/engine/twenty-orm/types/row-access-policy.type';
import { escapeIdentifier } from 'src/engine/workspace-manager/workspace-migration/utils/remove-sql-injection.util';

const MATCH_NOTHING_CONDITION = '1 = 0';

// Builds the record-level scoping condition for the current role on one table alias,
// or undefined when no rule applies. The condition is alias-qualified because every
// workspace statement (SELECT, UPDATE, DELETE, soft-delete) aliases its tables, and
// joined aliases get the condition on their ON clause.
export const buildRecordScopingCondition = ({
  alias,
  objectNameSingular,
  recordScopingRulesByRoleId,
  userWorkspaceRoleMap,
  authContext,
}: {
  alias: string;
  objectNameSingular: string;
  recordScopingRulesByRoleId: RecordScopingRulesByRoleId | undefined;
  userWorkspaceRoleMap: UserWorkspaceRoleMap;
  authContext: WorkspaceAuthContext;
}): SqlCondition | undefined => {
  if (!recordScopingRulesByRoleId) {
    return undefined;
  }

  // Scoping is role-based; contexts without a user role (e.g. API keys) are not
  // scoped here and rely on object/field permissions instead.
  if (!isUserAuthContext(authContext)) {
    return undefined;
  }

  const roleId = userWorkspaceRoleMap[authContext.userWorkspaceId];

  if (!roleId) {
    return undefined;
  }

  const rulesForObject = (recordScopingRulesByRoleId[roleId] ?? []).filter(
    (rule) => rule.objectNameSingular === objectNameSingular,
  );

  if (rulesForObject.length === 0) {
    return undefined;
  }

  const resolved = resolveRecordScoping({
    rules: rulesForObject,
    currentWorkspaceMember:
      authContext.workspaceMember as unknown as CurrentWorkspaceMemberLike,
  });

  if (resolved.kind === 'none') {
    return undefined;
  }

  if (resolved.kind === 'match-nothing') {
    return { sql: MATCH_NOTHING_CONDITION, parameters: {} };
  }

  const parameterPrefix = `recordScoping_${alias.replace(/[^A-Za-z0-9_]/g, '_')}`;
  const renderedConditions = resolved.conditions.map((condition, index) =>
    renderCondition({
      condition,
      column: `${escapeIdentifier(alias)}.${escapeIdentifier(condition.column)}`,
      parameterKey: `${parameterPrefix}_${index}`,
    }),
  );

  const separator = resolved.logicalOperator === 'OR' ? ' OR ' : ' AND ';

  return {
    sql: `(${renderedConditions.map(({ sql }) => sql).join(separator)})`,
    parameters: Object.assign(
      {},
      ...renderedConditions.map(({ parameters }) => parameters),
    ),
  };
};

const renderCondition = ({
  condition,
  column,
  parameterKey,
}: {
  condition: ResolvedRecordScopingCondition;
  column: string;
  parameterKey: string;
}): SqlCondition => {
  switch (condition.operator) {
    case 'eq':
      return {
        sql: `${column} = :${parameterKey}`,
        parameters: { [parameterKey]: condition.value },
      };
    case 'neq':
      return {
        sql: `${column} != :${parameterKey}`,
        parameters: { [parameterKey]: condition.value },
      };
    case 'in':
      return {
        sql: `${column} IN (:...${parameterKey})`,
        parameters: {
          [parameterKey]: Array.isArray(condition.value)
            ? condition.value
            : [condition.value],
        },
      };
  }
};
