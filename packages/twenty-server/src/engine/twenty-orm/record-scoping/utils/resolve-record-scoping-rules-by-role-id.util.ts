import { isDefined } from 'twenty-shared/utils';

import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { type FlatRole } from 'src/engine/metadata-modules/flat-role/types/flat-role.type';
import {
  type RecordScopingRule,
  type RecordScopingRulesByRoleId,
} from 'src/engine/twenty-orm/record-scoping/types/record-scoping-rule.type';

// Resolves config rules (authored by role label) into a roleId-indexed map for the
// current workspace, using the workspace's flat role maps. Rules referencing an
// unknown role label are collected in `unmatchedRoleLabels` so the caller can warn;
// they are simply not enforced (there is no role to attach them to).
export const resolveRecordScopingRulesByRoleId = ({
  rules,
  flatRoleMaps,
}: {
  rules: RecordScopingRule[];
  flatRoleMaps: FlatEntityMaps<FlatRole>;
}): {
  recordScopingRulesByRoleId: RecordScopingRulesByRoleId;
  unmatchedRoleLabels: string[];
} => {
  const roleIdByLabel = new Map<string, string>();

  for (const role of Object.values(flatRoleMaps.byUniversalIdentifier)) {
    if (isDefined(role)) {
      roleIdByLabel.set(role.label, role.id);
    }
  }

  const recordScopingRulesByRoleId: RecordScopingRulesByRoleId = {};
  const unmatchedRoleLabels: string[] = [];

  for (const rule of rules) {
    const roleId = roleIdByLabel.get(rule.roleLabel);

    if (!isDefined(roleId)) {
      unmatchedRoleLabels.push(rule.roleLabel);
      continue;
    }

    if (!isDefined(recordScopingRulesByRoleId[roleId])) {
      recordScopingRulesByRoleId[roleId] = [];
    }

    recordScopingRulesByRoleId[roleId].push(rule);
  }

  return { recordScopingRulesByRoleId, unmatchedRoleLabels };
};
