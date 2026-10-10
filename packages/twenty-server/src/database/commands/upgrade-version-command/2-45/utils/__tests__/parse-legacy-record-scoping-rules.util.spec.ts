import {
  LegacyRecordScopingRulesException,
  parseLegacyRecordScopingRules,
} from 'src/database/commands/upgrade-version-command/2-45/utils/parse-legacy-record-scoping-rules.util';

const validRule = {
  roleLabel: 'Member',
  objectNameSingular: 'opportunity',
  logicalOperator: 'AND',
  conditions: [
    { column: 'assigneeId', operator: 'eq', currentWorkspaceMemberField: 'id' },
  ],
};

describe('parseLegacyRecordScopingRules', () => {
  it('should return [] for empty / whitespace / nullish config', () => {
    expect(parseLegacyRecordScopingRules(undefined)).toEqual([]);
    expect(parseLegacyRecordScopingRules(null)).toEqual([]);
    expect(parseLegacyRecordScopingRules('')).toEqual([]);
    expect(parseLegacyRecordScopingRules('   ')).toEqual([]);
  });

  it('should parse a valid rule array', () => {
    const rules = parseLegacyRecordScopingRules(JSON.stringify([validRule]));

    expect(rules).toEqual([validRule]);
  });

  it('should default logicalOperator to AND when omitted', () => {
    const rules = parseLegacyRecordScopingRules(
      JSON.stringify([
        {
          roleLabel: validRule.roleLabel,
          objectNameSingular: validRule.objectNameSingular,
          conditions: validRule.conditions,
        },
      ]),
    );

    expect(rules[0].logicalOperator).toBe('AND');
  });

  it('should keep only the provided value source on each condition', () => {
    const rules = parseLegacyRecordScopingRules(
      JSON.stringify([
        {
          ...validRule,
          conditions: [{ column: 'stage', operator: 'eq', staticValue: 'WON' }],
        },
      ]),
    );

    expect(rules[0].conditions[0]).toEqual({
      column: 'stage',
      operator: 'eq',
      staticValue: 'WON',
    });
  });

  it('should throw on invalid JSON', () => {
    expect(() => parseLegacyRecordScopingRules('{not json')).toThrow(
      LegacyRecordScopingRulesException,
    );
  });

  it('should throw when the top-level value is not an array', () => {
    expect(() => parseLegacyRecordScopingRules(JSON.stringify(validRule))).toThrow(
      /must be a JSON array/,
    );
  });

  it('should throw on an invalid operator', () => {
    expect(() =>
      parseLegacyRecordScopingRules(
        JSON.stringify([
          {
            ...validRule,
            conditions: [
              { column: 'stage', operator: 'like', staticValue: 'x' },
            ],
          },
        ]),
      ),
    ).toThrow(/operator must be one of/);
  });

  it('should throw when neither value source is set', () => {
    expect(() =>
      parseLegacyRecordScopingRules(
        JSON.stringify([
          { ...validRule, conditions: [{ column: 'stage', operator: 'eq' }] },
        ]),
      ),
    ).toThrow(/exactly one of staticValue or currentWorkspaceMemberField/);
  });

  it('should throw when both value sources are set', () => {
    expect(() =>
      parseLegacyRecordScopingRules(
        JSON.stringify([
          {
            ...validRule,
            conditions: [
              {
                column: 'stage',
                operator: 'eq',
                staticValue: 'WON',
                currentWorkspaceMemberField: 'id',
              },
            ],
          },
        ]),
      ),
    ).toThrow(/exactly one of staticValue or currentWorkspaceMemberField/);
  });

  it('should throw when conditions is empty', () => {
    expect(() =>
      parseLegacyRecordScopingRules(
        JSON.stringify([{ ...validRule, conditions: [] }]),
      ),
    ).toThrow(/conditions must be a non-empty array/);
  });

  it('should throw when roleLabel is missing', () => {
    expect(() =>
      parseLegacyRecordScopingRules(
        JSON.stringify([
          {
            objectNameSingular: validRule.objectNameSingular,
            logicalOperator: validRule.logicalOperator,
            conditions: validRule.conditions,
          },
        ]),
      ),
    ).toThrow(/roleLabel must be a non-empty string/);
  });
  it.each([
    ['a rule that is not an object', ['nope'], 'must be an object'],
    [
      'a missing objectNameSingular',
      [{ ...validRule, objectNameSingular: ' ' }],
      'objectNameSingular must be a non-empty string',
    ],
    [
      'an unknown logicalOperator',
      [{ ...validRule, logicalOperator: 'XOR' }],
      "logicalOperator must be 'AND' or 'OR'",
    ],
    [
      'a condition that is not an object',
      [{ ...validRule, conditions: [42] }],
      'conditions[0] must be an object',
    ],
    [
      'a blank column',
      [
        {
          ...validRule,
          conditions: [{ column: '', operator: 'eq', staticValue: 1 }],
        },
      ],
      'column must be a non-empty string',
    ],
    [
      'a blank member field',
      [
        {
          ...validRule,
          conditions: [
            {
              column: 'ownerId',
              operator: 'eq',
              currentWorkspaceMemberField: ' ',
            },
          ],
        },
      ],
      'currentWorkspaceMemberField must be a non-empty string',
    ],
  ])('should throw on %s', (_label, rules, message) => {
    expect(() => parseLegacyRecordScopingRules(JSON.stringify(rules))).toThrow(
      LegacyRecordScopingRulesException,
    );
    expect(() => parseLegacyRecordScopingRules(JSON.stringify(rules))).toThrow(
      message,
    );
  });
});
