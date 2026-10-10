import { isDefined } from 'twenty-shared/utils';

// The RECORD_SCOPING_RULES env format the fork used before rules moved to
// core.recordScopingRule. Frozen here for the one-time import command.
export type LegacyRecordScopingOperator = 'eq' | 'neq' | 'in';

export type LegacyRecordScopingScalar = string | number | boolean;

export type LegacyRecordScopingCondition = {
  column: string;
  operator: LegacyRecordScopingOperator;
  staticValue?: LegacyRecordScopingScalar | LegacyRecordScopingScalar[];
  currentWorkspaceMemberField?: string;
};

export type LegacyRecordScopingRule = {
  roleLabel: string;
  objectNameSingular: string;
  logicalOperator: 'AND' | 'OR';
  conditions: LegacyRecordScopingCondition[];
};

export class LegacyRecordScopingRulesException extends Error {}

const VALID_OPERATORS: LegacyRecordScopingOperator[] = ['eq', 'neq', 'in'];

export const parseLegacyRecordScopingRules = (
  rawConfig: string | undefined | null,
): LegacyRecordScopingRule[] => {
  if (!isDefined(rawConfig) || rawConfig.trim() === '') {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawConfig);
  } catch (error) {
    throw new LegacyRecordScopingRulesException(
      `RECORD_SCOPING_RULES is not valid JSON: ${
        error instanceof Error ? error.message : 'unknown error'
      }`,
    );
  }

  if (!Array.isArray(parsed)) {
    throw new LegacyRecordScopingRulesException(
      'RECORD_SCOPING_RULES must be a JSON array of rules',
    );
  }

  return parsed.map((rule, index) => parseRule(rule, index));
};

const parseRule = (rule: unknown, index: number): LegacyRecordScopingRule => {
  if (!isRecord(rule)) {
    throw new LegacyRecordScopingRulesException(
      `RECORD_SCOPING_RULES[${index}] must be an object`,
    );
  }

  const roleLabel = rule.roleLabel;
  const objectNameSingular = rule.objectNameSingular;
  const logicalOperator = rule.logicalOperator ?? 'AND';

  if (typeof roleLabel !== 'string' || roleLabel.trim() === '') {
    throw new LegacyRecordScopingRulesException(
      `RECORD_SCOPING_RULES[${index}].roleLabel must be a non-empty string`,
    );
  }

  if (
    typeof objectNameSingular !== 'string' ||
    objectNameSingular.trim() === ''
  ) {
    throw new LegacyRecordScopingRulesException(
      `RECORD_SCOPING_RULES[${index}].objectNameSingular must be a non-empty string`,
    );
  }

  if (logicalOperator !== 'AND' && logicalOperator !== 'OR') {
    throw new LegacyRecordScopingRulesException(
      `RECORD_SCOPING_RULES[${index}].logicalOperator must be 'AND' or 'OR'`,
    );
  }

  if (!Array.isArray(rule.conditions) || rule.conditions.length === 0) {
    throw new LegacyRecordScopingRulesException(
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
): LegacyRecordScopingCondition => {
  const location = `RECORD_SCOPING_RULES[${ruleIndex}].conditions[${conditionIndex}]`;

  if (!isRecord(condition)) {
    throw new LegacyRecordScopingRulesException(`${location} must be an object`);
  }

  if (typeof condition.column !== 'string' || condition.column.trim() === '') {
    throw new LegacyRecordScopingRulesException(
      `${location}.column must be a non-empty string`,
    );
  }

  if (!VALID_OPERATORS.includes(condition.operator as LegacyRecordScopingOperator)) {
    throw new LegacyRecordScopingRulesException(
      `${location}.operator must be one of ${VALID_OPERATORS.join(', ')}`,
    );
  }

  const hasStaticValue = isDefined(condition.staticValue);
  const hasMemberField = isDefined(condition.currentWorkspaceMemberField);

  if (hasStaticValue === hasMemberField) {
    throw new LegacyRecordScopingRulesException(
      `${location} must set exactly one of staticValue or currentWorkspaceMemberField`,
    );
  }

  if (
    hasMemberField &&
    (typeof condition.currentWorkspaceMemberField !== 'string' ||
      condition.currentWorkspaceMemberField.trim() === '')
  ) {
    throw new LegacyRecordScopingRulesException(
      `${location}.currentWorkspaceMemberField must be a non-empty string`,
    );
  }

  return {
    column: condition.column,
    operator: condition.operator as LegacyRecordScopingOperator,
    ...(hasStaticValue
      ? {
          staticValue:
            condition.staticValue as LegacyRecordScopingCondition['staticValue'],
        }
      : {
          currentWorkspaceMemberField:
            condition.currentWorkspaceMemberField as string,
        }),
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
