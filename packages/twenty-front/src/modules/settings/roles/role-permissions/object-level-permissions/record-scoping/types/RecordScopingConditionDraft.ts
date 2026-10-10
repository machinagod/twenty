export type RecordScopingOperator = 'eq' | 'neq' | 'in';

export type RecordScopingLogicalOperator = 'AND' | 'OR';

export type RecordScopingValueSource = 'STATIC' | 'CURRENT_MEMBER' | 'RELATED';

// One condition as the form edits it: values stay text until saved. A RELATED
// condition keeps records whose relation points at records matching `related`.
export type RecordScopingConditionDraft = {
  key: string;
  column: string;
  operator: RecordScopingOperator;
  valueSource: RecordScopingValueSource;
  staticValue: string;
  related?: {
    objectMetadataId: string;
    logicalOperator: RecordScopingLogicalOperator;
    conditions: RecordScopingConditionDraft[];
  };
};
