import { type RecordScopingColumnOption } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingColumnOption';
import {
  type RecordScopingConditionDraft,
  type RecordScopingOperator,
} from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingConditionDraft';
import { isDefined, isValidUuid } from 'twenty-shared/utils';
import { v4 } from 'uuid';

type RecordScopingScalar = string | number | boolean;

export type RecordScopingConditionValue = {
  column: string;
  operator: string;
  staticValue?: unknown;
  currentWorkspaceMemberField?: string | null;
  relatedRecords?: {
    objectMetadataId: string;
    matchColumn?: string | null;
    logicalOperator: string;
    conditions: RecordScopingConditionValue[];
  } | null;
};

// The scopable columns of an object, or undefined for an unknown object.
export type GetRecordScopingColumns = (
  objectMetadataId: string,
) => RecordScopingColumnOption[] | undefined;

// The option key of a condition: options matching related records that point
// back at the object all sit on its id, so they are told apart by matchColumn.
export const getRecordScopingColumnKey = (
  column: string,
  matchColumn?: string | null,
) => (isDefined(matchColumn) ? `${column}:${matchColumn}` : column);

// Matches the server limit: a rule may hop through at most three related objects.
export const MAX_RECORD_SCOPING_RELATED_DEPTH = 3;

const LIST_VALUE_KINDS: RecordScopingColumnOption['valueKind'][] = [
  'TEXT',
  'NUMBER',
  'UUID',
];

export const getRecordScopingOperators = (
  column: RecordScopingColumnOption,
): RecordScopingOperator[] =>
  LIST_VALUE_KINDS.includes(column.valueKind)
    ? ['eq', 'neq', 'in']
    : ['eq', 'neq'];

// Which field of the signed-in member a column can be compared to, if any.
export const getCurrentMemberFieldForColumn = (
  column: RecordScopingColumnOption,
): 'id' | 'userEmail' | undefined => {
  switch (column.valueKind) {
    case 'WORKSPACE_MEMBER':
      return 'id';
    case 'TEXT':
      return 'userEmail';
    default:
      return undefined;
  }
};

export const canMatchRelatedRecords = (column: RecordScopingColumnOption) =>
  column.valueKind === 'UUID' && isDefined(column.targetObjectMetadataId);

// An owner-style relation is the most common rule; actor columns (created by /
// updated by) come next, and related records pointing back come last.
export const getDefaultRecordScopingColumn = (
  columns: RecordScopingColumnOption[],
): RecordScopingColumnOption | undefined =>
  columns.find(
    (column) =>
      column.valueKind === 'WORKSPACE_MEMBER' &&
      !column.column.endsWith('WorkspaceMemberId'),
  ) ??
  columns.find((column) => column.valueKind === 'WORKSPACE_MEMBER') ??
  columns.find((column) => !isDefined(column.matchColumn)) ??
  columns[0];

// A condition on related records pointing back can only match those records,
// so it starts as "matching records" when `getColumns` is given.
export const createRecordScopingConditionDraft = (
  column: RecordScopingColumnOption,
  getColumns?: GetRecordScopingColumns,
): RecordScopingConditionDraft => {
  const draft: RecordScopingConditionDraft = {
    key: v4(),
    column: column.key,
    operator: 'eq',
    valueSource:
      column.valueKind === 'WORKSPACE_MEMBER' ? 'CURRENT_MEMBER' : 'STATIC',
    staticValue:
      column.valueKind === 'BOOLEAN'
        ? 'true'
        : (column.selectOptions?.[0]?.value ?? ''),
  };

  return isDefined(column.matchColumn) && isDefined(getColumns)
    ? toRelatedRecordScopingConditionDraft(draft, column, getColumns)
    : draft;
};

// Switches a relation condition to "matching records", seeded with the
// related object's default condition.
export const toRelatedRecordScopingConditionDraft = (
  draft: RecordScopingConditionDraft,
  column: RecordScopingColumnOption,
  getColumns: GetRecordScopingColumns,
): RecordScopingConditionDraft => {
  const targetObjectMetadataId = column.targetObjectMetadataId ?? '';
  const defaultColumn = getDefaultRecordScopingColumn(
    getColumns(targetObjectMetadataId) ?? [],
  );

  return {
    ...draft,
    operator: 'in',
    valueSource: 'RELATED',
    staticValue: '',
    related: {
      objectMetadataId: targetObjectMetadataId,
      logicalOperator: 'AND',
      conditions: isDefined(defaultColumn)
        ? [createRecordScopingConditionDraft(defaultColumn)]
        : [],
    },
  };
};

const parseScalar = (
  text: string,
  column: RecordScopingColumnOption,
): RecordScopingScalar | undefined => {
  const trimmed = text.trim();

  switch (column.valueKind) {
    case 'NUMBER': {
      const value = Number(trimmed);

      return trimmed !== '' && Number.isFinite(value) ? value : undefined;
    }
    case 'BOOLEAN':
      return trimmed === 'true'
        ? true
        : trimmed === 'false'
          ? false
          : undefined;
    case 'SELECT':
      return column.selectOptions?.some((option) => option.value === trimmed)
        ? trimmed
        : undefined;
    case 'UUID':
    case 'WORKSPACE_MEMBER':
      return isValidUuid(trimmed) ? trimmed : undefined;
    case 'TEXT':
      return trimmed === '' ? undefined : trimmed;
  }
};

// The API inputs for a list of drafts, or undefined while any is incomplete.
export const toRecordScopingConditionInputs = (
  drafts: RecordScopingConditionDraft[],
  columns: RecordScopingColumnOption[],
  getColumns: GetRecordScopingColumns,
): RecordScopingConditionValue[] | undefined => {
  const inputs = drafts.map((draft) =>
    toRecordScopingConditionInput(
      draft,
      columns.find((column) => column.key === draft.column),
      getColumns,
    ),
  );

  return inputs.length > 0 && inputs.every(isDefined) ? inputs : undefined;
};

// The API input for a draft, or undefined while the draft is incomplete.
export const toRecordScopingConditionInput = (
  draft: RecordScopingConditionDraft,
  column: RecordScopingColumnOption | undefined,
  getColumns: GetRecordScopingColumns,
): RecordScopingConditionValue | undefined => {
  if (!isDefined(column)) {
    return undefined;
  }

  if (draft.valueSource === 'RELATED') {
    const relatedColumns = isDefined(draft.related)
      ? getColumns(draft.related.objectMetadataId)
      : undefined;

    if (
      !isDefined(draft.related) ||
      !isDefined(relatedColumns) ||
      !canMatchRelatedRecords(column)
    ) {
      return undefined;
    }

    const relatedInputs = toRecordScopingConditionInputs(
      draft.related.conditions,
      relatedColumns,
      getColumns,
    );

    return isDefined(relatedInputs)
      ? {
          column: column.column,
          operator: 'in',
          relatedRecords: {
            objectMetadataId: draft.related.objectMetadataId,
            ...(isDefined(column.matchColumn)
              ? { matchColumn: column.matchColumn }
              : {}),
            logicalOperator: draft.related.logicalOperator,
            conditions: relatedInputs,
          },
        }
      : undefined;
  }

  if (isDefined(column.matchColumn)) {
    return undefined;
  }

  if (draft.valueSource === 'CURRENT_MEMBER') {
    const memberField = getCurrentMemberFieldForColumn(column);

    return isDefined(memberField) && draft.operator !== 'in'
      ? {
          column: column.column,
          operator: draft.operator,
          currentWorkspaceMemberField: memberField,
        }
      : undefined;
  }

  if (draft.operator === 'in') {
    const values = draft.staticValue
      .split(',')
      .filter((item) => item.trim() !== '')
      .map((item) => parseScalar(item, column));

    return values.length > 0 && values.every(isDefined)
      ? { column: column.column, operator: 'in', staticValue: values }
      : undefined;
  }

  const value = parseScalar(draft.staticValue, column);

  return isDefined(value)
    ? { column: column.column, operator: draft.operator, staticValue: value }
    : undefined;
};

export const fromRecordScopingCondition = (
  condition: RecordScopingConditionValue,
): RecordScopingConditionDraft => {
  if (isDefined(condition.relatedRecords)) {
    return {
      key: v4(),
      column: getRecordScopingColumnKey(
        condition.column,
        condition.relatedRecords.matchColumn,
      ),
      operator: 'in',
      valueSource: 'RELATED',
      staticValue: '',
      related: {
        objectMetadataId: condition.relatedRecords.objectMetadataId,
        logicalOperator:
          condition.relatedRecords.logicalOperator === 'OR' ? 'OR' : 'AND',
        conditions: condition.relatedRecords.conditions.map(
          fromRecordScopingCondition,
        ),
      },
    };
  }

  return {
    key: v4(),
    column: condition.column,
    operator: condition.operator as RecordScopingOperator,
    valueSource: isDefined(condition.currentWorkspaceMemberField)
      ? 'CURRENT_MEMBER'
      : 'STATIC',
    staticValue: Array.isArray(condition.staticValue)
      ? condition.staticValue.join(', ')
      : isDefined(condition.staticValue)
        ? String(condition.staticValue)
        : '',
  };
};
