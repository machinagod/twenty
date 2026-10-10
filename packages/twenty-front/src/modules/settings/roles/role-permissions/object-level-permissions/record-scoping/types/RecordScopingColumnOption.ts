type RecordScopingColumnValueKind =
  | 'WORKSPACE_MEMBER'
  | 'UUID'
  | 'TEXT'
  | 'NUMBER'
  | 'BOOLEAN'
  | 'SELECT';

export type RecordScopingColumnOption = {
  column: string;
  label: string;
  icon?: string | null;
  valueKind: RecordScopingColumnValueKind;
  selectOptions?: Array<{ value: string; label: string }>;
  // Set on many-to-one relation columns: the object the column points at.
  targetObjectMetadataId?: string;
};
