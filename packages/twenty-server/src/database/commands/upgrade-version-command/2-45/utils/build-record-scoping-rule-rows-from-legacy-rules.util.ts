import { isDefined } from 'twenty-shared/utils';

import {
  type LegacyRecordScopingCondition,
  type LegacyRecordScopingRule,
  LegacyRecordScopingRulesException,
} from 'src/database/commands/upgrade-version-command/2-45/utils/parse-legacy-record-scoping-rules.util';

export type RecordScopingRuleRow = {
  roleId: string;
  objectMetadataId: string;
  logicalOperator: 'AND' | 'OR';
  conditions: LegacyRecordScopingCondition[];
};

// The env format allowed several rules per (role, object), ANDed together; the
// table holds one. AND rules merge losslessly, anything else cannot be expressed
// as one rule and must fail rather than silently widen access.
export const buildRecordScopingRuleRowsFromLegacyRules = ({
  rules,
  roleIdByLabel,
  objectMetadataIdByNameSingular,
}: {
  rules: LegacyRecordScopingRule[];
  roleIdByLabel: Map<string, string>;
  objectMetadataIdByNameSingular: Map<string, string>;
}): { rows: RecordScopingRuleRow[]; skippedRules: LegacyRecordScopingRule[] } => {
  const rulesByPair = new Map<string, { roleId: string; objectMetadataId: string; rules: LegacyRecordScopingRule[] }>();
  const skippedRules: LegacyRecordScopingRule[] = [];

  for (const rule of rules) {
    const roleId = roleIdByLabel.get(rule.roleLabel);
    const objectMetadataId = objectMetadataIdByNameSingular.get(
      rule.objectNameSingular,
    );

    // Matches the old runtime: a rule naming an unknown role or object never applied.
    if (!isDefined(roleId) || !isDefined(objectMetadataId)) {
      skippedRules.push(rule);
      continue;
    }

    const key = `${roleId}:${objectMetadataId}`;
    const pair = rulesByPair.get(key) ?? { roleId, objectMetadataId, rules: [] };

    pair.rules.push(rule);
    rulesByPair.set(key, pair);
  }

  const rows = [...rulesByPair.values()].map(
    ({ roleId, objectMetadataId, rules: pairRules }): RecordScopingRuleRow => {
      if (pairRules.length === 1) {
        return {
          roleId,
          objectMetadataId,
          logicalOperator: pairRules[0].logicalOperator,
          conditions: pairRules[0].conditions,
        };
      }

      const isMergeable = pairRules.every(
        (rule) => rule.logicalOperator === 'AND' || rule.conditions.length === 1,
      );

      if (!isMergeable) {
        throw new LegacyRecordScopingRulesException(
          `RECORD_SCOPING_RULES has several rules for role "${pairRules[0].roleLabel}" on "${pairRules[0].objectNameSingular}" including an OR rule; merge them into one rule before upgrading`,
        );
      }

      return {
        roleId,
        objectMetadataId,
        logicalOperator: 'AND',
        conditions: pairRules.flatMap((rule) => rule.conditions),
      };
    },
  );

  return { rows, skippedRules };
};
