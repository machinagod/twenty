import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { type RecordScopingColumnOption } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingColumnOption';
import { getRecordScopingColumnKey } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/utils/recordScopingConditionDraft';
import { t } from '@lingui/core/macro';
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
// table, so only physical columns of comparable types are offered. One-to-many
// relations are offered too, as "any related record matching", when the inverse
// side is a plain many-to-one join column (looked up in `objectMetadataItems`).
export const getRecordScopingColumnOptions = (
  objectMetadataItem: Pick<EnrichedObjectMetadataItem, 'fields'>,
  objectMetadataItems: Array<
    Pick<EnrichedObjectMetadataItem, 'id' | 'fields'>
  > = [],
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
      const column = `${field.name}Id`;

      options.push({
        key: column,
        column,
        label: field.label,
        icon: field.icon,
        valueKind:
          field.relation.targetObjectMetadata.nameSingular === 'workspaceMember'
            ? 'WORKSPACE_MEMBER'
            : 'UUID',
        targetObjectMetadataId: field.relation.targetObjectMetadata.id,
      });
      continue;
    }

    if (
      field.type === FieldMetadataType.RELATION &&
      field.relation?.type === RelationType.ONE_TO_MANY
    ) {
      const relation = field.relation;
      const inverseField = objectMetadataItems
        .find((item) => item.id === relation.targetObjectMetadata.id)
        ?.fields.find(({ id }) => id === relation.targetFieldMetadata.id);

      if (
        field.isSystem === true ||
        inverseField?.type !== FieldMetadataType.RELATION
      ) {
        continue;
      }

      const matchColumn = `${inverseField.name}Id`;
      const fieldLabel = field.label;

      options.push({
        key: getRecordScopingColumnKey('id', matchColumn),
        column: 'id',
        label: t`Any of ${fieldLabel}`,
        icon: field.icon,
        valueKind: 'UUID',
        targetObjectMetadataId: relation.targetObjectMetadata.id,
        matchColumn,
      });
      continue;
    }

    // An email list matches when the signed-in member's email is any of them.
    if (field.type === FieldMetadataType.EMAILS && field.isSystem !== true) {
      options.push({
        key: field.name,
        column: field.name,
        label: field.label,
        icon: field.icon,
        valueKind: 'EMAILS',
      });
      continue;
    }

    if (field.type === FieldMetadataType.ACTOR) {
      const column = `${field.name}WorkspaceMemberId`;

      options.push({
        key: column,
        column,
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
      key: field.name,
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
