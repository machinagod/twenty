// Clean-room record-level scoping (Path B). This module is intentionally
// independent of the `/* @license Enterprise */` row-level-permission-predicate
// code: it defines our own rule shape and reuses only AGPL/twenty-shared
// building blocks. A rule restricts which records of an object a given role may
// access by injecting an additional filter into every query for that object.

export type RecordScopingOperator = 'eq' | 'neq' | 'in';

// A single condition compares a field on the scoped object to either a static
// value or a value read from the current workspace member (e.g. "owner = me").
// Exactly one value source must be provided.
export type RecordScopingCondition = {
  // GraphQL field path on the scoped object. Dot-path composite/relation leaves,
  // e.g. 'stage', 'assigneeId', or 'createdBy.workspaceMemberId'.
  fieldPath: string;
  operator: RecordScopingOperator;
  staticValue?: string | number | boolean | (string | number)[];
  // Read the comparison value from a field on the current workspace member,
  // e.g. 'id' to scope to records the member owns.
  currentWorkspaceMemberField?: string;
};

export type RecordScopingRuleLogicalOperator = 'AND' | 'OR';

// All conditions for one (role, object) pair, combined with a logical operator.
export type RecordScopingRule = {
  roleId: string;
  objectNameSingular: string;
  logicalOperator: RecordScopingRuleLogicalOperator;
  conditions: RecordScopingCondition[];
};

// Minimal shape we read off the authenticated workspace member.
export type CurrentWorkspaceMemberLike = Record<string, unknown> & {
  id: string;
};
