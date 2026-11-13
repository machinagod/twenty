import { gql } from '@apollo/client';

import { RECORD_SCOPING_RULE_FRAGMENT } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/graphql/fragments/recordScopingRuleFragment';

export const FIND_RECORD_SCOPING_RULES = gql`
  ${RECORD_SCOPING_RULE_FRAGMENT}
  query FindRecordScopingRules($roleId: UUID!) {
    recordScopingRules(roleId: $roleId) {
      ...RecordScopingRuleFragment
    }
  }
`;
