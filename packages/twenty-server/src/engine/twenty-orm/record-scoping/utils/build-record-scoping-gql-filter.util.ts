import { type RecordGqlOperationFilter } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import {
  type CurrentWorkspaceMemberLike,
  type RecordScopingCondition,
  type RecordScopingRule,
} from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';

// Sentinel filter that matches no rows. id is a generated uuid that is never the
// nil uuid, so this reliably excludes every record.
export const RECORD_SCOPING_MATCH_NOTHING: RecordGqlOperationFilter = {
  id: { eq: '00000000-0000-0000-0000-000000000000' },
};

// Builds a RecordGqlOperationFilter from a record-scoping rule. The result is the
// same shape the GraphQL API already produces for the user-supplied `filter`, so
// the caller can AND it into any query at the existing query chokepoint without a
// bespoke SQL builder.
//
// Fail-closed contract: if a condition references a current-workspace-member field
// that is missing/undefined we return MATCH_NOTHING rather than dropping the
// condition. This is a deliberate hardening over the enterprise predicate builder,
// which silently skips unresolved member values (fail-open for that condition).
export const buildRecordScopingGqlFilter = ({
  rule,
  currentWorkspaceMember,
}: {
  rule: RecordScopingRule;
  currentWorkspaceMember?: CurrentWorkspaceMemberLike;
}): RecordGqlOperationFilter | null => {
  if (rule.conditions.length === 0) {
    return null;
  }

  const leafFilters: RecordGqlOperationFilter[] = [];

  for (const condition of rule.conditions) {
    const value = resolveConditionValue({ condition, currentWorkspaceMember });

    if (!isDefined(value)) {
      return RECORD_SCOPING_MATCH_NOTHING;
    }

    leafFilters.push(buildLeafFilter(condition, value));
  }

  if (leafFilters.length === 1) {
    return leafFilters[0];
  }

  return rule.logicalOperator === 'OR'
    ? { or: leafFilters }
    : { and: leafFilters };
};

const resolveConditionValue = ({
  condition,
  currentWorkspaceMember,
}: {
  condition: RecordScopingCondition;
  currentWorkspaceMember?: CurrentWorkspaceMemberLike;
}): RecordScopingCondition['staticValue'] => {
  if (isDefined(condition.currentWorkspaceMemberField)) {
    const memberValue =
      currentWorkspaceMember?.[condition.currentWorkspaceMemberField];

    return isDefined(memberValue)
      ? (memberValue as RecordScopingCondition['staticValue'])
      : undefined;
  }

  return condition.staticValue;
};

// Builds a (possibly nested) leaf filter from a dot-path field, e.g.
// 'createdBy.workspaceMemberId' + eq -> { createdBy: { workspaceMemberId: { eq } } }
const buildLeafFilter = (
  condition: RecordScopingCondition,
  value: NonNullable<RecordScopingCondition['staticValue']>,
): RecordGqlOperationFilter => {
  const leaf: Record<string, unknown> = { [condition.operator]: value };

  return condition.fieldPath
    .split('.')
    .reduceRight<Record<string, unknown>>(
      (accumulator, key) => ({ [key]: accumulator }),
      leaf,
    ) as RecordGqlOperationFilter;
};
