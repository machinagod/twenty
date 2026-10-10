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
};

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

// The API input for a draft, or undefined while the draft is incomplete.
export const toRecordScopingConditionInput = (
  draft: RecordScopingConditionDraft,
  column: RecordScopingColumnOption | undefined,
): RecordScopingConditionValue | undefined => {
  if (!isDefined(column)) {
    return undefined;
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
): RecordScopingConditionDraft => ({
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
});
