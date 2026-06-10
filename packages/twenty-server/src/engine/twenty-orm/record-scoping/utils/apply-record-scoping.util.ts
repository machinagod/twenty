import { Brackets, type ObjectLiteral } from 'typeorm';

import { isUserAuthContext } from 'src/engine/core-modules/auth/guards/is-user-auth-context.guard';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import {
  type CurrentWorkspaceMemberLike,
  type RecordScopingRulesByRoleId,
  type ResolvedRecordScopingCondition,
} from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';
import { resolveRecordScoping } from 'src/engine/twenty-orm/record-scoping/utils/resolve-record-scoping.util';
import { type WorkspaceSelectQueryBuilder } from 'src/engine/twenty-orm/repository/workspace-select-query-builder';

// Applies record-level scoping for the current role to a workspace query by ANDing
// an extra WHERE onto it. Works for SELECT, UPDATE, DELETE and SOFT-DELETE builders
// (the builders share the same expressionMap surface); columns are qualified with
// the main alias only for SELECT, since UPDATE/DELETE statements have no alias.
export const applyRecordScoping = <T extends ObjectLiteral>({
  queryBuilder,
  objectNameSingular,
  recordScopingRulesByRoleId,
  userWorkspaceRoleMap,
  authContext,
}: {
  queryBuilder: WorkspaceSelectQueryBuilder<T>;
  objectNameSingular: string;
  recordScopingRulesByRoleId: RecordScopingRulesByRoleId | undefined;
  userWorkspaceRoleMap: Record<string, string>;
  authContext: WorkspaceAuthContext;
}): void => {
  if (!recordScopingRulesByRoleId) {
    return;
  }

  const userWorkspaceId = isUserAuthContext(authContext)
    ? authContext.userWorkspaceId
    : undefined;

  // Scoping is role-based; contexts without a user role (e.g. API keys) are not
  // scoped here and rely on object/field permissions instead.
  if (!userWorkspaceId) {
    return;
  }

  const roleId = userWorkspaceRoleMap[userWorkspaceId];

  if (!roleId) {
    return;
  }

  const rulesForObject = (recordScopingRulesByRoleId[roleId] ?? []).filter(
    (rule) => rule.objectNameSingular === objectNameSingular,
  );

  if (rulesForObject.length === 0) {
    return;
  }

  const currentWorkspaceMember: CurrentWorkspaceMemberLike | undefined =
    isUserAuthContext(authContext)
      ? (authContext.workspaceMember as unknown as CurrentWorkspaceMemberLike)
      : undefined;

  const resolved = resolveRecordScoping({
    rules: rulesForObject,
    currentWorkspaceMember,
  });

  if (resolved.kind === 'none') {
    return;
  }

  if (resolved.kind === 'match-nothing') {
    queryBuilder.andWhere('1 = 0');

    return;
  }

  const useAlias = queryBuilder.expressionMap.queryType === 'select';
  const alias = queryBuilder.expressionMap.mainAlias?.name;

  const { logicalOperator, conditions } = resolved;

  queryBuilder.andWhere(
    new Brackets((qb) => {
      conditions.forEach((condition, index) => {
        const { sql, parameters } = renderCondition({
          condition,
          index,
          column: qualifyColumn(condition.column, useAlias ? alias : undefined),
        });

        if (index === 0) {
          qb.where(sql, parameters);
        } else if (logicalOperator === 'OR') {
          qb.orWhere(sql, parameters);
        } else {
          qb.andWhere(sql, parameters);
        }
      });
    }),
  );
};

const qualifyColumn = (column: string, alias: string | undefined): string =>
  alias ? `"${alias}"."${column}"` : `"${column}"`;

const renderCondition = ({
  condition,
  index,
  column,
}: {
  condition: ResolvedRecordScopingCondition;
  index: number;
  column: string;
}): { sql: string; parameters: Record<string, unknown> } => {
  const parameterKey = `record_scoping_${index}`;

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
