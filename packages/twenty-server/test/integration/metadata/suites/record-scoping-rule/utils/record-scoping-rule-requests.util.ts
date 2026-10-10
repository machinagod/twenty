import gql from 'graphql-tag';
import { makeMetadataApiRequest } from 'test/integration/metadata/suites/utils/make-metadata-api-request.util';

const RULE_FIELDS = `
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
`;

export type RecordScopingRuleRequestInput = {
  roleId: string;
  objectMetadataId: string;
  logicalOperator: 'AND' | 'OR';
  conditions: Array<{
    column: string;
    operator: string;
    staticValue?: unknown;
    currentWorkspaceMemberField?: string;
  }>;
};

export const upsertRecordScopingRule = (
  input: RecordScopingRuleRequestInput,
  token?: string,
) =>
  makeMetadataApiRequest(
    {
      query: gql`
        mutation UpsertRecordScopingRule($input: UpsertRecordScopingRuleInput!) {
          upsertRecordScopingRule(input: $input) {
            ${RULE_FIELDS}
          }
        }
      `,
      variables: { input },
    },
    token,
  );

export const deleteRecordScopingRule = (
  input: { roleId: string; objectMetadataId: string },
  token?: string,
) =>
  makeMetadataApiRequest(
    {
      query: gql`
        mutation DeleteRecordScopingRule(
          $input: DeleteRecordScopingRuleInput!
        ) {
          deleteRecordScopingRule(input: $input) {
            id
          }
        }
      `,
      variables: { input },
    },
    token,
  );

export const findRecordScopingRules = (roleId: string, token?: string) =>
  makeMetadataApiRequest(
    {
      query: gql`
        query RecordScopingRules($roleId: UUID!) {
          recordScopingRules(roleId: $roleId) {
            ${RULE_FIELDS}
          }
        }
      `,
      variables: { roleId },
    },
    token,
  );
