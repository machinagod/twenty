import { isDefined } from 'twenty-shared/utils';

import { isUserAuthContext } from 'src/engine/core-modules/auth/guards/is-user-auth-context.guard';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { type UserWorkspaceRoleMap } from 'src/engine/metadata-modules/role-target/types/user-workspace-role-map.type';
import {
  type CurrentWorkspaceMemberLike,
  type RecordScopingLogicalOperator,
  type RecordScopingRulesByRoleId,
  type ResolvedRecordScopingCondition,
  type ResolvedRecordScopingValueCondition,
} from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';
import { resolveRecordScoping } from 'src/engine/twenty-orm/record-scoping/utils/resolve-record-scoping.util';
import { type SqlCondition } from 'src/engine/twenty-orm/types/row-access-policy.type';
import { escapeIdentifier } from 'src/engine/workspace-manager/workspace-migration/utils/remove-sql-injection.util';

const MATCH_NOTHING: SqlCondition = { sql: '1 = 0', parameters: {} };

// Builds the record-level scoping condition for the current role on one table alias,
// or undefined when no rule applies. The condition is alias-qualified because every
// workspace statement (SELECT, UPDATE, DELETE, soft-delete) aliases its tables, and
// joined aliases get the condition on their ON clause.
export const buildRecordScopingCondition = ({
  alias,
  objectMetadataId,
  recordScopingRulesByRoleId,
  userWorkspaceRoleMap,
  authContext,
  getRelatedTableName,
}: {
  alias: string;
  objectMetadataId: string;
  recordScopingRulesByRoleId: RecordScopingRulesByRoleId | undefined;
  userWorkspaceRoleMap: UserWorkspaceRoleMap;
  authContext: WorkspaceAuthContext;
  // Escaped, schema-qualified table of an object, for related-record conditions.
  getRelatedTableName: (objectMetadataId: string) => string | undefined;
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
    (rule) => rule.objectMetadataId === objectMetadataId,
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
    return MATCH_NOTHING;
  }

  const parameterPrefix = `recordScoping_${alias.replace(/[^A-Za-z0-9_]/g, '_')}`;

  return (
    renderConditionGroup({
      alias,
      parameterPrefix,
      logicalOperator: resolved.logicalOperator,
      conditions: resolved.conditions,
      getRelatedTableName,
    }) ?? MATCH_NOTHING
  );
};

// Undefined when a related object has no table any more: the caller fails closed.
const renderConditionGroup = ({
  alias,
  parameterPrefix,
  logicalOperator,
  conditions,
  getRelatedTableName,
}: {
  alias: string;
  parameterPrefix: string;
  logicalOperator: RecordScopingLogicalOperator;
  conditions: ResolvedRecordScopingCondition[];
  getRelatedTableName: (objectMetadataId: string) => string | undefined;
}): SqlCondition | undefined => {
  const renderedConditions: SqlCondition[] = [];

  for (const [index, condition] of conditions.entries()) {
    const parameterKey = `${parameterPrefix}_${index}`;
    const column = `${escapeIdentifier(alias)}.${escapeIdentifier(condition.column)}`;

    if (!('related' in condition)) {
      renderedConditions.push(
        renderValueCondition({ condition, column, parameterKey }),
      );
      continue;
    }

    const relatedTableName = getRelatedTableName(
      condition.related.objectMetadataId,
    );

    if (!isDefined(relatedTableName)) {
      return undefined;
    }

    // The parameter key is unique per position, so it doubles as a unique
    // subquery alias at any nesting depth.
    const relatedAlias = parameterKey;
    const relatedCondition = renderConditionGroup({
      alias: relatedAlias,
      parameterPrefix: parameterKey,
      logicalOperator: condition.related.logicalOperator,
      conditions: condition.related.conditions,
      getRelatedTableName,
    });

    if (!isDefined(relatedCondition)) {
      return undefined;
    }

    renderedConditions.push({
      sql: `${column} IN (SELECT ${escapeIdentifier(relatedAlias)}."id" FROM ${relatedTableName} ${escapeIdentifier(relatedAlias)} WHERE ${relatedCondition.sql})`,
      parameters: relatedCondition.parameters,
    });
  }

  const separator = logicalOperator === 'OR' ? ' OR ' : ' AND ';

  return {
    sql: `(${renderedConditions.map(({ sql }) => sql).join(separator)})`,
    parameters: Object.assign(
      {},
      ...renderedConditions.map(({ parameters }) => parameters),
    ),
  };
};

const renderValueCondition = ({
  condition,
  column,
  parameterKey,
}: {
  condition: ResolvedRecordScopingValueCondition;
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
