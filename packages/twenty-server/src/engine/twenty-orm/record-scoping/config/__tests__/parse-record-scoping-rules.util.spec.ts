import { parseRecordScopingRules } from 'src/engine/twenty-orm/record-scoping/config/parse-record-scoping-rules.util';
import { RecordScopingConfigException } from 'src/engine/twenty-orm/record-scoping/exceptions/record-scoping-config.exception';

const validRule = {
  roleLabel: 'Member',
  objectNameSingular: 'opportunity',
  logicalOperator: 'AND',
  conditions: [
    { column: 'assigneeId', operator: 'eq', currentWorkspaceMemberField: 'id' },
  ],
};

describe('parseRecordScopingRules', () => {
  it('should return [] for empty / whitespace / nullish config', () => {
    expect(parseRecordScopingRules(undefined)).toEqual([]);
    expect(parseRecordScopingRules(null)).toEqual([]);
    expect(parseRecordScopingRules('')).toEqual([]);
    expect(parseRecordScopingRules('   ')).toEqual([]);
  });

  it('should parse a valid rule array', () => {
    const rules = parseRecordScopingRules(JSON.stringify([validRule]));

    expect(rules).toEqual([validRule]);
  });

  it('should default logicalOperator to AND when omitted', () => {
    const rules = parseRecordScopingRules(
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
    const rules = parseRecordScopingRules(
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
    expect(() => parseRecordScopingRules('{not json')).toThrow(
      RecordScopingConfigException,
    );
  });

  it('should throw when the top-level value is not an array', () => {
    expect(() => parseRecordScopingRules(JSON.stringify(validRule))).toThrow(
      /must be a JSON array/,
    );
  });

  it('should throw on an invalid operator', () => {
    expect(() =>
      parseRecordScopingRules(
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
      parseRecordScopingRules(
        JSON.stringify([
          { ...validRule, conditions: [{ column: 'stage', operator: 'eq' }] },
        ]),
      ),
    ).toThrow(/exactly one of staticValue or currentWorkspaceMemberField/);
  });

  it('should throw when both value sources are set', () => {
    expect(() =>
      parseRecordScopingRules(
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
      parseRecordScopingRules(
        JSON.stringify([{ ...validRule, conditions: [] }]),
      ),
    ).toThrow(/conditions must be a non-empty array/);
  });

  it('should throw when roleLabel is missing', () => {
    expect(() =>
      parseRecordScopingRules(
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
});
