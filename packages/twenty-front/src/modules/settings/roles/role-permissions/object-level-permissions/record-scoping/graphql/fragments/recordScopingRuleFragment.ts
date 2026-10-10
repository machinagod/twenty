import { gql } from '@apollo/client';

// The server accepts related records three levels deep, so the selection
// spells out each level.
export const RECORD_SCOPING_RULE_FRAGMENT = gql`
  fragment RecordScopingRuleFragment on RecordScopingRule {
    id
    roleId
    objectMetadataId
    logicalOperator
    conditions {
      ...RecordScopingConditionFields
      relatedRecords {
        objectMetadataId
        logicalOperator
        conditions {
          ...RecordScopingConditionFields
          relatedRecords {
            objectMetadataId
            logicalOperator
            conditions {
              ...RecordScopingConditionFields
              relatedRecords {
                objectMetadataId
                logicalOperator
                conditions {
                  ...RecordScopingConditionFields
                }
              }
            }
          }
        }
      }
    }
  }

  fragment RecordScopingConditionFields on RecordScopingCondition {
    column
    operator
    staticValue
    currentWorkspaceMemberField
  }
`;
