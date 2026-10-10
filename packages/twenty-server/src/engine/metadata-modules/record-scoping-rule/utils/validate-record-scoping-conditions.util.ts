import { isDefined, isValidUuid } from 'twenty-shared/utils';

import {
  RecordScopingRuleException,
  RecordScopingRuleExceptionCode,
} from 'src/engine/metadata-modules/record-scoping-rule/record-scoping-rule.exception';
import {
  type RecordScopingColumn,
  type RecordScopingColumnValueKind,
} from 'src/engine/metadata-modules/record-scoping-rule/utils/get-record-scoping-columns.util';
import {
  type RecordScopingCondition,
  type RecordScopingOperator,
  type RecordScopingScalar,
} from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';

export const MAX_RECORD_SCOPING_CONDITIONS = 20;

const OPERATORS: RecordScopingOperator[] = ['eq', 'neq', 'in'];

// The member fields a condition may read, and the columns each can match.
const VALUE_KINDS_BY_MEMBER_FIELD: Record<
  string,
  RecordScopingColumnValueKind[]
> = {
  id: ['WORKSPACE_MEMBER', 'UUID'],
  userEmail: ['TEXT'],
};

export type RecordScopingConditionInput = {
  column: string;
  operator: string;
  staticValue?: unknown;
  currentWorkspaceMemberField?: string | null;
};

const invalid = (message: string): never => {
  throw new RecordScopingRuleException(
    message,
    RecordScopingRuleExceptionCode.INVALID_RECORD_SCOPING_RULE_INPUT,
  );
};

const isScalarOfKind = (
  value: unknown,
  column: RecordScopingColumn,
): value is RecordScopingScalar => {
  switch (column.valueKind) {
    case 'NUMBER':
      return typeof value === 'number' && Number.isFinite(value);
    case 'BOOLEAN':
      return typeof value === 'boolean';
    case 'SELECT':
      return (
        typeof value === 'string' &&
        (column.selectOptionValues ?? []).includes(value)
      );
    case 'UUID':
    case 'WORKSPACE_MEMBER':
      return typeof value === 'string' && isValidUuid(value);
    case 'TEXT':
      return typeof value === 'string';
  }
};

const validateStaticValue = (
  value: unknown,
  operator: RecordScopingOperator,
  column: RecordScopingColumn,
  location: string,
): RecordScopingScalar | RecordScopingScalar[] => {
  if (operator === 'in') {
    if (!Array.isArray(value) || value.length === 0) {
      return invalid(`${location}: "in" needs a non-empty list of values`);
    }

    for (const item of value) {
      if (!isScalarOfKind(item, column)) {
        return invalid(
          `${location}: ${JSON.stringify(item)} is not a valid value for column "${column.column}"`,
        );
      }
    }

    return value as RecordScopingScalar[];
  }

  if (!isScalarOfKind(value, column)) {
    return invalid(
      `${location}: ${JSON.stringify(value)} is not a valid value for column "${column.column}"`,
    );
  }

  return value;
};

// Checks a rule's conditions against the object's scopable columns and returns
// them normalized for storage. Anything the query-time applier could not render
// to a valid WHERE is rejected here, so a stored rule never fails open.
export const validateRecordScopingConditions = ({
  conditions,
  columns,
}: {
  conditions: RecordScopingConditionInput[];
  columns: Map<string, RecordScopingColumn>;
}): RecordScopingCondition[] => {
  if (conditions.length === 0) {
    return invalid('A rule needs at least one condition');
  }

  if (conditions.length > MAX_RECORD_SCOPING_CONDITIONS) {
    return invalid(
      `A rule can have at most ${MAX_RECORD_SCOPING_CONDITIONS} conditions`,
    );
  }

  return conditions.map((condition, index) => {
    const location = `conditions[${index}]`;
    const column = columns.get(condition.column);

    if (!isDefined(column)) {
      return invalid(
        `${location}: "${condition.column}" is not a column this rule can filter on`,
      );
    }

    if (!OPERATORS.includes(condition.operator as RecordScopingOperator)) {
      return invalid(
        `${location}: operator must be one of ${OPERATORS.join(', ')}`,
      );
    }

    const operator = condition.operator as RecordScopingOperator;
    const memberField = condition.currentWorkspaceMemberField;
    const hasMemberField = isDefined(memberField);
    const hasStaticValue = isDefined(condition.staticValue);

    if (hasMemberField === hasStaticValue) {
      return invalid(
        `${location}: set exactly one of staticValue or currentWorkspaceMemberField`,
      );
    }

    if (!hasMemberField) {
      return {
        column: column.column,
        operator,
        staticValue: validateStaticValue(
          condition.staticValue,
          operator,
          column,
          location,
        ),
      };
    }

    const compatibleKinds = VALUE_KINDS_BY_MEMBER_FIELD[memberField];

    if (!isDefined(compatibleKinds)) {
      return invalid(
        `${location}: currentWorkspaceMemberField must be one of ${Object.keys(VALUE_KINDS_BY_MEMBER_FIELD).join(', ')}`,
      );
    }

    if (!compatibleKinds.includes(column.valueKind)) {
      return invalid(
        `${location}: the current member's ${memberField} cannot be compared to column "${column.column}"`,
      );
    }

    if (operator === 'in') {
      return invalid(
        `${location}: "in" needs a list of values, not the current member`,
      );
    }

    return {
      column: column.column,
      operator,
      currentWorkspaceMemberField: memberField,
    };
  });
};
