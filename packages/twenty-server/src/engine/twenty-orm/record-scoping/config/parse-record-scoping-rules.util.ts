import { isDefined } from 'twenty-shared/utils';

import { RecordScopingConfigException } from 'src/engine/twenty-orm/record-scoping/exceptions/record-scoping-config.exception';
import {
  type RecordScopingCondition,
  type RecordScopingOperator,
  type RecordScopingRule,
} from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';

const VALID_OPERATORS: RecordScopingOperator[] = ['eq', 'neq', 'in'];

// Parses and validates the RECORD_SCOPING_RULES config (a JSON array of rules).
// Throws RecordScopingConfigException on any structural problem so misconfiguration
// surfaces loudly instead of silently disabling the lock.
export const parseRecordScopingRules = (
  rawConfig: string | undefined | null,
): RecordScopingRule[] => {
  if (!isDefined(rawConfig) || rawConfig.trim() === '') {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawConfig);
  } catch (error) {
    throw new RecordScopingConfigException(
      `RECORD_SCOPING_RULES is not valid JSON: ${
        error instanceof Error ? error.message : 'unknown error'
      }`,
    );
  }

  if (!Array.isArray(parsed)) {
    throw new RecordScopingConfigException(
      'RECORD_SCOPING_RULES must be a JSON array of rules',
    );
  }

  return parsed.map((rule, index) => parseRule(rule, index));
};

const parseRule = (rule: unknown, index: number): RecordScopingRule => {
  if (!isRecord(rule)) {
    throw new RecordScopingConfigException(
      `RECORD_SCOPING_RULES[${index}] must be an object`,
    );
  }

  const roleLabel = rule.roleLabel;
  const objectNameSingular = rule.objectNameSingular;
  const logicalOperator = rule.logicalOperator ?? 'AND';

  if (typeof roleLabel !== 'string' || roleLabel.trim() === '') {
    throw new RecordScopingConfigException(
      `RECORD_SCOPING_RULES[${index}].roleLabel must be a non-empty string`,
    );
  }

  if (
    typeof objectNameSingular !== 'string' ||
    objectNameSingular.trim() === ''
  ) {
    throw new RecordScopingConfigException(
      `RECORD_SCOPING_RULES[${index}].objectNameSingular must be a non-empty string`,
    );
  }

  if (logicalOperator !== 'AND' && logicalOperator !== 'OR') {
    throw new RecordScopingConfigException(
      `RECORD_SCOPING_RULES[${index}].logicalOperator must be 'AND' or 'OR'`,
    );
  }

  if (!Array.isArray(rule.conditions) || rule.conditions.length === 0) {
    throw new RecordScopingConfigException(
      `RECORD_SCOPING_RULES[${index}].conditions must be a non-empty array`,
    );
  }

  return {
    roleLabel,
    objectNameSingular,
    logicalOperator,
    conditions: rule.conditions.map((condition, conditionIndex) =>
      parseCondition(condition, index, conditionIndex),
    ),
  };
};

const parseCondition = (
  condition: unknown,
  ruleIndex: number,
  conditionIndex: number,
): RecordScopingCondition => {
  const location = `RECORD_SCOPING_RULES[${ruleIndex}].conditions[${conditionIndex}]`;

  if (!isRecord(condition)) {
    throw new RecordScopingConfigException(`${location} must be an object`);
  }

  if (typeof condition.column !== 'string' || condition.column.trim() === '') {
    throw new RecordScopingConfigException(
      `${location}.column must be a non-empty string`,
    );
  }

  if (!VALID_OPERATORS.includes(condition.operator as RecordScopingOperator)) {
    throw new RecordScopingConfigException(
      `${location}.operator must be one of ${VALID_OPERATORS.join(', ')}`,
    );
  }

  const hasStaticValue = isDefined(condition.staticValue);
  const hasMemberField = isDefined(condition.currentWorkspaceMemberField);

  if (hasStaticValue === hasMemberField) {
    throw new RecordScopingConfigException(
      `${location} must set exactly one of staticValue or currentWorkspaceMemberField`,
    );
  }

  if (
    hasMemberField &&
    (typeof condition.currentWorkspaceMemberField !== 'string' ||
      condition.currentWorkspaceMemberField.trim() === '')
  ) {
    throw new RecordScopingConfigException(
      `${location}.currentWorkspaceMemberField must be a non-empty string`,
    );
  }

  return {
    column: condition.column,
    operator: condition.operator as RecordScopingOperator,
    ...(hasStaticValue
      ? { staticValue: condition.staticValue as RecordScopingCondition['staticValue'] }
      : {
          currentWorkspaceMemberField:
            condition.currentWorkspaceMemberField as string,
        }),
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
