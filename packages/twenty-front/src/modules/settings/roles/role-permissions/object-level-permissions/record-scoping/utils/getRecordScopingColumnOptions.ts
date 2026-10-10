import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { type RecordScopingColumnOption } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingColumnOption';
import { FieldMetadataType, RelationType } from 'twenty-shared/types';

const SCALAR_VALUE_KINDS: Partial<
  Record<FieldMetadataType, RecordScopingColumnOption['valueKind']>
> = {
  [FieldMetadataType.TEXT]: 'TEXT',
  [FieldMetadataType.UUID]: 'UUID',
  [FieldMetadataType.NUMBER]: 'NUMBER',
  [FieldMetadataType.NUMERIC]: 'NUMBER',
  [FieldMetadataType.BOOLEAN]: 'BOOLEAN',
  [FieldMetadataType.SELECT]: 'SELECT',
};

// Mirrors the server's getRecordScopingColumns: a rule filters the object's own
// table, so only physical columns of comparable types are offered.
export const getRecordScopingColumnOptions = (
  objectMetadataItem: Pick<EnrichedObjectMetadataItem, 'fields'>,
): RecordScopingColumnOption[] => {
  const options: RecordScopingColumnOption[] = [];

  for (const field of objectMetadataItem.fields) {
    if (field.isActive === false) {
      continue;
    }

    if (
      field.type === FieldMetadataType.RELATION &&
      field.relation?.type === RelationType.MANY_TO_ONE
    ) {
      options.push({
        column: `${field.name}Id`,
        label: field.label,
        icon: field.icon,
        valueKind:
          field.relation.targetObjectMetadata.nameSingular === 'workspaceMember'
            ? 'WORKSPACE_MEMBER'
            : 'UUID',
      });
      continue;
    }

    if (field.type === FieldMetadataType.ACTOR) {
      options.push({
        column: `${field.name}WorkspaceMemberId`,
        label: field.label,
        icon: field.icon,
        valueKind: 'WORKSPACE_MEMBER',
      });
      continue;
    }

    const valueKind = SCALAR_VALUE_KINDS[field.type];

    if (valueKind === undefined || field.isSystem === true) {
      continue;
    }

    options.push({
      column: field.name,
      label: field.label,
      icon: field.icon,
      valueKind,
      ...(valueKind === 'SELECT'
        ? {
            selectOptions: (field.options ?? []).map((option) => ({
              value: option.value,
              label: option.label,
            })),
          }
        : {}),
    });
  }

  return options.sort((a, b) => a.label.localeCompare(b.label));
};
