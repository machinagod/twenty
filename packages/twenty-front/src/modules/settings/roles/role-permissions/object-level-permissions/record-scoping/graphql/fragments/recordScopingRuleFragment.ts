import { gql } from '@apollo/client';

export const RECORD_SCOPING_RULE_FRAGMENT = gql`
  fragment RecordScopingRuleFragment on RecordScopingRule {
    id
    roleId
    objectMetadataId
    logicalOperator
    conditions {
      column
      operator
      staticValue
      currentWorkspaceMemberField
    }
  }
`;
