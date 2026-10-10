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

// Records of another object, selected by their own conditions. A condition with
// relatedRecords keeps the scoped record when its join column points at one of
// them, e.g. people whose company's account owner is the current member. With
// matchColumn the direction flips: the condition is on the scoped record's id and
// keeps it when one of the related records points back at it through matchColumn
// (a many-to-one join column on the related object), e.g. a route kept when any of
// its lines comes from an owned customer.
export type RecordScopingRelatedRecords = {
  objectMetadataId: string;
  matchColumn?: string;
  logicalOperator: RecordScopingLogicalOperator;
  conditions: RecordScopingCondition[];
};

// A single condition compares a column on the scoped object's table to a static
// value, a value read from the current workspace member (e.g. "owner = me"), or
// the ids of related records matching their own conditions. Exactly one value
// source must be provided.
export type RecordScopingCondition = {
  // Physical column on the object's workspace table, e.g. 'assigneeId' or the
  // flattened composite column 'createdByWorkspaceMemberId'.
  column: string;
  operator: RecordScopingOperator;
  staticValue?: RecordScopingScalar | RecordScopingScalar[];
  // Read the comparison value from a field on the current workspace member,
  // e.g. 'id' to scope to records the member owns.
  currentWorkspaceMemberField?: string;
  // Only with operator 'in', on a many-to-one join column, or on 'id' when the
  // related records carry a matchColumn.
  relatedRecords?: RecordScopingRelatedRecords;
};

export type RecordScopingLogicalOperator = 'AND' | 'OR';

// All conditions for one (role, object) pair, combined with a logical operator.
// Stored in core.recordScopingRule and edited from Settings > Roles.
export type RecordScopingRule = {
  objectMetadataId: string;
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

export type ResolvedRecordScopingValueCondition = {
  column: string;
  operator: RecordScopingOperator;
  value: RecordScopingScalar | RecordScopingScalar[];
};

export type ResolvedRecordScopingRelatedCondition = {
  column: string;
  related: {
    objectMetadataId: string;
    matchColumn?: string;
    logicalOperator: RecordScopingLogicalOperator;
    conditions: ResolvedRecordScopingCondition[];
  };
};

export type ResolvedRecordScopingCondition =
  | ResolvedRecordScopingValueCondition
  | ResolvedRecordScopingRelatedCondition;
