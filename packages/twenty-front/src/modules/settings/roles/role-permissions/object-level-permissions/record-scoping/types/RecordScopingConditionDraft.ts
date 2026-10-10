export type RecordScopingOperator = 'eq' | 'neq' | 'in';

export type RecordScopingValueSource = 'STATIC' | 'CURRENT_MEMBER';

// One condition as the form edits it: values stay text until saved.
export type RecordScopingConditionDraft = {
  key: string;
  column: string;
  operator: RecordScopingOperator;
  valueSource: RecordScopingValueSource;
  staticValue: string;
};
