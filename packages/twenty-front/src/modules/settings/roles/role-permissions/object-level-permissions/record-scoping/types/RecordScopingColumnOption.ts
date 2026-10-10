type RecordScopingColumnValueKind =
  | 'WORKSPACE_MEMBER'
  | 'UUID'
  | 'TEXT'
  | 'NUMBER'
  | 'BOOLEAN'
  | 'SELECT';

export type RecordScopingColumnOption = {
  // Unique among an object's options: the column, or `id:<matchColumn>` for the
  // options matching related records that point back at the object.
  key: string;
  column: string;
  label: string;
  icon?: string | null;
  valueKind: RecordScopingColumnValueKind;
  selectOptions?: Array<{ value: string; label: string }>;
  // Set on relation options: the object the related records belong to.
  targetObjectMetadataId?: string;
  // Set on one-to-many options: the related object's join column pointing back.
  matchColumn?: string;
};
