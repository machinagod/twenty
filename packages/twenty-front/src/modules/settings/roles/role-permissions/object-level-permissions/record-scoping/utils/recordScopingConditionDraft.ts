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
    logicalOperator: string;
    conditions: RecordScopingConditionValue[];
  } | null;
};

// The scopable columns of an object, or undefined for an unknown object.
export type GetRecordScopingColumns = (
  objectMetadataId: string,
) => RecordScopingColumnOption[] | undefined;

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
// updated by) come next.
export const getDefaultRecordScopingColumn = (
  columns: RecordScopingColumnOption[],
): RecordScopingColumnOption | undefined =>
  columns.find(
    (column) =>
      column.valueKind === 'WORKSPACE_MEMBER' &&
      !column.column.endsWith('WorkspaceMemberId'),
  ) ??
  columns.find((column) => column.valueKind === 'WORKSPACE_MEMBER') ??
  columns[0];

export const createRecordScopingConditionDraft = (
  column: RecordScopingColumnOption,
): RecordScopingConditionDraft => ({
  key: v4(),
  column: column.column,
  operator: 'eq',
  valueSource:
    column.valueKind === 'WORKSPACE_MEMBER' ? 'CURRENT_MEMBER' : 'STATIC',
  staticValue:
    column.valueKind === 'BOOLEAN'
      ? 'true'
      : (column.selectOptions?.[0]?.value ?? ''),
});

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
      columns.find((column) => column.column === draft.column),
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
          column: draft.column,
          operator: 'in',
          relatedRecords: {
            objectMetadataId: draft.related.objectMetadataId,
            logicalOperator: draft.related.logicalOperator,
            conditions: relatedInputs,
          },
        }
      : undefined;
  }

  if (draft.valueSource === 'CURRENT_MEMBER') {
    const memberField = getCurrentMemberFieldForColumn(column);

    return isDefined(memberField) && draft.operator !== 'in'
      ? {
          column: draft.column,
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
      ? { column: draft.column, operator: 'in', staticValue: values }
      : undefined;
  }

  const value = parseScalar(draft.staticValue, column);

  return isDefined(value)
    ? { column: draft.column, operator: draft.operator, staticValue: value }
    : undefined;
};

export const fromRecordScopingCondition = (
  condition: RecordScopingConditionValue,
): RecordScopingConditionDraft => {
  if (isDefined(condition.relatedRecords)) {
    return {
      key: v4(),
      column: condition.column,
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
