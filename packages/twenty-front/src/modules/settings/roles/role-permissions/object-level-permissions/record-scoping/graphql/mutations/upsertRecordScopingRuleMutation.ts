import { gql } from '@apollo/client';

import { RECORD_SCOPING_RULE_FRAGMENT } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/graphql/fragments/recordScopingRuleFragment';

export const UPSERT_RECORD_SCOPING_RULE = gql`
  ${RECORD_SCOPING_RULE_FRAGMENT}
  mutation UpsertRecordScopingRule($input: UpsertRecordScopingRuleInput!) {
    upsertRecordScopingRule(input: $input) {
      ...RecordScopingRuleFragment
    }
  }
`;
