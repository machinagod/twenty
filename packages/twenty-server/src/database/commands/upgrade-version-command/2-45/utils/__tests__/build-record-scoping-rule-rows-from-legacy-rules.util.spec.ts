import { buildRecordScopingRuleRowsFromLegacyRules } from 'src/database/commands/upgrade-version-command/2-45/utils/build-record-scoping-rule-rows-from-legacy-rules.util';
import {
  type LegacyRecordScopingRule,
  LegacyRecordScopingRulesException,
} from 'src/database/commands/upgrade-version-command/2-45/utils/parse-legacy-record-scoping-rules.util';

const ownerIsMe = {
  column: 'ownerId',
  operator: 'eq' as const,
  currentWorkspaceMemberField: 'id',
};
const stageIsWon = { column: 'stage', operator: 'eq' as const, staticValue: 'WON' };

const rule = (
  overrides: Partial<LegacyRecordScopingRule> = {},
): LegacyRecordScopingRule => ({
  roleLabel: 'Member',
  objectNameSingular: 'opportunity',
  logicalOperator: 'AND',
  conditions: [ownerIsMe],
  ...overrides,
});

const build = (rules: LegacyRecordScopingRule[]) =>
  buildRecordScopingRuleRowsFromLegacyRules({
    rules,
    roleIdByLabel: new Map([['Member', 'member-id']]),
    objectMetadataIdByNameSingular: new Map([
      ['opportunity', 'opportunity-id'],
      ['company', 'company-id'],
    ]),
  });

describe('buildRecordScopingRuleRowsFromLegacyRules', () => {
  it('maps labels and names to ids', () => {
    expect(build([rule(), rule({ objectNameSingular: 'company', logicalOperator: 'OR' })])).toEqual({
      rows: [
        { roleId: 'member-id', objectMetadataId: 'opportunity-id', logicalOperator: 'AND', conditions: [ownerIsMe] },
        { roleId: 'member-id', objectMetadataId: 'company-id', logicalOperator: 'OR', conditions: [ownerIsMe] },
      ],
      skippedRules: [],
    });
  });

  it('skips rules for an unknown role or object, as the runtime did', () => {
    const unknownRole = rule({ roleLabel: 'Ghost' });
    const unknownObject = rule({ objectNameSingular: 'ghost' });

    expect(build([unknownRole, unknownObject])).toEqual({
      rows: [],
      skippedRules: [unknownRole, unknownObject],
    });
  });

  it('merges several rules for one role and object into one AND rule', () => {
    expect(
      build([rule(), rule({ logicalOperator: 'OR', conditions: [stageIsWon] })]).rows,
    ).toEqual([
      {
        roleId: 'member-id',
        objectMetadataId: 'opportunity-id',
        logicalOperator: 'AND',
        conditions: [ownerIsMe, stageIsWon],
      },
    ]);
  });

  it('refuses to merge an OR rule with several conditions', () => {
    expect(() =>
      build([rule(), rule({ logicalOperator: 'OR', conditions: [ownerIsMe, stageIsWon] })]),
    ).toThrow(LegacyRecordScopingRulesException);
  });
});
