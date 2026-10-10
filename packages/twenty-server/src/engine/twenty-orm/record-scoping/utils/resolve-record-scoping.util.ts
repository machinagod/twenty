import { isDefined } from 'twenty-shared/utils';

import {
  type CurrentWorkspaceMemberLike,
  type RecordScopingCondition,
  type RecordScopingRule,
  type RecordScopingScalar,
  type ResolvedRecordScoping,
  type ResolvedRecordScopingCondition,
} from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';

// Resolves the record-scoping rule(s) for a single (role, object) pair against the
// current workspace member into concrete conditions the applier can render to SQL.
//
// Multiple rules for the same object are flattened and combined with AND (each rule
// keeps its own AND/OR between its conditions).
//
// Fail-closed contract: if any member-relative condition cannot resolve (no member,
// or missing/empty field) we return `match-nothing` rather than dropping the
// condition. This is stricter than Twenty's enterprise predicate builder, which
// silently skips unresolved member values (fail-open for that condition).
export const resolveRecordScoping = ({
  rules,
  currentWorkspaceMember,
}: {
  rules: RecordScopingRule[];
  currentWorkspaceMember?: CurrentWorkspaceMemberLike;
}): ResolvedRecordScoping => {
  const rulesWithConditions = rules.filter(
    (rule) => rule.conditions.length > 0,
  );

  if (rulesWithConditions.length === 0) {
    return { kind: 'none' };
  }

  const resolvedConditions: ResolvedRecordScopingCondition[] = [];

  for (const rule of rulesWithConditions) {
    for (const condition of rule.conditions) {
      const resolvedCondition = resolveCondition({
        condition,
        currentWorkspaceMember,
      });

      if (!isDefined(resolvedCondition)) {
        return { kind: 'match-nothing' };
      }

      resolvedConditions.push(resolvedCondition);
    }
  }

  // A single rule preserves its own logical operator; multiple rules are ANDed.
  const logicalOperator =
    rulesWithConditions.length === 1
      ? rulesWithConditions[0].logicalOperator
      : 'AND';

  return {
    kind: 'conditions',
    logicalOperator,
    conditions: resolvedConditions,
  };
};

// Undefined when any value, at any depth, cannot be resolved: the caller then
// fails closed for the whole rule.
const resolveCondition = ({
  condition,
  currentWorkspaceMember,
}: {
  condition: RecordScopingCondition;
  currentWorkspaceMember?: CurrentWorkspaceMemberLike;
}): ResolvedRecordScopingCondition | undefined => {
  if (isDefined(condition.relatedRecords)) {
    const { objectMetadataId, matchColumn, logicalOperator, conditions } =
      condition.relatedRecords;
    const resolvedConditions = conditions.map((relatedCondition) =>
      resolveCondition({ condition: relatedCondition, currentWorkspaceMember }),
    );

    if (
      resolvedConditions.length === 0 ||
      !resolvedConditions.every(isDefined)
    ) {
      return undefined;
    }

    return {
      column: condition.column,
      related: {
        objectMetadataId,
        ...(isDefined(matchColumn) ? { matchColumn } : {}),
        logicalOperator,
        conditions: resolvedConditions,
      },
    };
  }

  const value = resolveConditionValue({ condition, currentWorkspaceMember });

  if (!isDefined(value)) {
    return undefined;
  }

  return {
    column: condition.column,
    operator: condition.operator,
    value,
    ...(isDefined(condition.columnKind)
      ? { columnKind: condition.columnKind }
      : {}),
  };
};

const resolveConditionValue = ({
  condition,
  currentWorkspaceMember,
}: {
  condition: RecordScopingCondition;
  currentWorkspaceMember?: CurrentWorkspaceMemberLike;
}): RecordScopingScalar | RecordScopingScalar[] | undefined => {
  if (isDefined(condition.currentWorkspaceMemberField)) {
    const memberValue =
      currentWorkspaceMember?.[condition.currentWorkspaceMemberField];

    if (!isScopingScalar(memberValue)) {
      return undefined;
    }

    return memberValue;
  }

  if (!isDefined(condition.staticValue)) {
    return undefined;
  }

  return condition.staticValue;
};

const isScopingScalar = (
  value: unknown,
): value is RecordScopingScalar | RecordScopingScalar[] => {
  if (Array.isArray(value)) {
    return value.length > 0 && value.every(isScopingScalarPrimitive);
  }

  return isScopingScalarPrimitive(value);
};

const isScopingScalarPrimitive = (
  value: unknown,
): value is RecordScopingScalar =>
  typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'boolean';
