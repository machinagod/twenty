// Clean-room record-level locking (Path B). This module is intentionally
// independent of Twenty's `/* @license Enterprise */` row-level-permission code:
// it defines our own rule shape and is enforced by our own AGPL applier at the
// workspace ORM query-builder chokepoint.
//
// A rule restricts which records of an object a given role may read/write by
// ANDing an additional WHERE condition onto every query for that object. To keep
// the applier valid for SELECT, UPDATE and DELETE alike, conditions target direct
// table columns (no relation traversal / joins).

export type RecordScopingOperator = 'eq' | 'neq' | 'in';

export type RecordScopingScalar = string | number | boolean;

// A single condition compares a column on the scoped object's table to either a
// static value or a value read from the current workspace member (e.g.
// "owner = me"). Exactly one value source must be provided.
export type RecordScopingCondition = {
  // Physical column on the object's workspace table, e.g. 'assigneeId' or the
  // flattened composite column 'createdByWorkspaceMemberId'.
  column: string;
  operator: RecordScopingOperator;
  staticValue?: RecordScopingScalar | RecordScopingScalar[];
  // Read the comparison value from a field on the current workspace member,
  // e.g. 'id' to scope to records the member owns.
  currentWorkspaceMemberField?: string;
};

export type RecordScopingLogicalOperator = 'AND' | 'OR';

// All conditions for one (role, object) pair, combined with a logical operator.
// Rules are authored by role *label* (stable, human-readable) and resolved to a
// roleId when the workspace context is loaded.
export type RecordScopingRule = {
  roleLabel: string;
  objectNameSingular: string;
  logicalOperator: RecordScopingLogicalOperator;
  conditions: RecordScopingCondition[];
};

// Rules indexed by resolved roleId, ready for O(1) lookup at query time. Lives on
// the workspace internal context next to the other permission maps.
export type RecordScopingRulesByRoleId = Record<string, RecordScopingRule[]>;

// Minimal shape we read off the authenticated workspace member.
export type CurrentWorkspaceMemberLike = Record<string, unknown> & {
  id: string;
};

// Output of the pure rule resolver, consumed by the query-builder applier.
export type ResolvedRecordScoping =
  // No rule applies to this (role, object) — leave the query untouched.
  | { kind: 'none' }
  // A member-relative value could not be resolved — fail closed (match no rows).
  | { kind: 'match-nothing' }
  // Concrete conditions to AND/OR onto the query.
  | {
      kind: 'conditions';
      logicalOperator: RecordScopingLogicalOperator;
      conditions: ResolvedRecordScopingCondition[];
    };

export type ResolvedRecordScopingCondition = {
  column: string;
  operator: RecordScopingOperator;
  value: RecordScopingScalar | RecordScopingScalar[];
};
