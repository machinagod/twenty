import { gql } from '@apollo/client';

export const DELETE_RECORD_SCOPING_RULE = gql`
  mutation DeleteRecordScopingRule($input: DeleteRecordScopingRuleInput!) {
    deleteRecordScopingRule(input: $input) {
      id
    }
  }
`;
