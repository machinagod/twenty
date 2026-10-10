import { FieldMetadataType, RelationType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { getFlatFieldsFromFlatObjectMetadata } from 'src/engine/api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util';
import { computeMorphOrRelationFieldJoinColumnName } from 'src/engine/metadata-modules/field-metadata/utils/compute-morph-or-relation-field-join-column-name.util';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { isFlatFieldMetadataOfType } from 'src/engine/metadata-modules/flat-field-metadata/utils/is-flat-field-metadata-of-type.util';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';

// What a column holds, which decides the values a condition may compare it to.
export type RecordScopingColumnValueKind =
  | 'WORKSPACE_MEMBER'
  | 'UUID'
  | 'TEXT'
  | 'NUMBER'
  | 'BOOLEAN'
  | 'SELECT';

export type RecordScopingColumn = {
  column: string;
  valueKind: RecordScopingColumnValueKind;
  selectOptionValues?: string[];
};

const SCALAR_VALUE_KIND_BY_FIELD_TYPE: Partial<
  Record<FieldMetadataType, RecordScopingColumnValueKind>
> = {
  [FieldMetadataType.TEXT]: 'TEXT',
  [FieldMetadataType.UUID]: 'UUID',
  [FieldMetadataType.NUMBER]: 'NUMBER',
  [FieldMetadataType.NUMERIC]: 'NUMBER',
  [FieldMetadataType.BOOLEAN]: 'BOOLEAN',
  [FieldMetadataType.SELECT]: 'SELECT',
};

// The direct table columns a rule may target: scoping ANDs a WHERE on the
// object's own table, so only physical columns of comparable types qualify
// (many-to-one join columns, the actor's workspace member, simple scalars).
export const getRecordScopingColumns = ({
  flatObjectMetadata,
  flatFieldMetadataMaps,
  workspaceMemberObjectMetadataId,
}: {
  flatObjectMetadata: FlatObjectMetadata;
  flatFieldMetadataMaps: FlatEntityMaps<FlatFieldMetadata>;
  workspaceMemberObjectMetadataId: string | undefined;
}): Map<string, RecordScopingColumn> => {
  const columns = new Map<string, RecordScopingColumn>();

  for (const field of getFlatFieldsFromFlatObjectMetadata(
    flatObjectMetadata,
    flatFieldMetadataMaps,
  )) {
    if (
      isFlatFieldMetadataOfType(field, FieldMetadataType.RELATION) &&
      field.settings.relationType === RelationType.MANY_TO_ONE
    ) {
      const column = computeMorphOrRelationFieldJoinColumnName({
        name: field.name,
      });

      columns.set(column, {
        column,
        valueKind:
          isDefined(workspaceMemberObjectMetadataId) &&
          field.relationTargetObjectMetadataId ===
            workspaceMemberObjectMetadataId
            ? 'WORKSPACE_MEMBER'
            : 'UUID',
      });
      continue;
    }

    if (field.type === FieldMetadataType.ACTOR) {
      const column = `${field.name}WorkspaceMemberId`;

      columns.set(column, { column, valueKind: 'WORKSPACE_MEMBER' });
      continue;
    }

    const valueKind = SCALAR_VALUE_KIND_BY_FIELD_TYPE[field.type];

    if (!isDefined(valueKind) || field.isSystem) {
      continue;
    }

    columns.set(field.name, {
      column: field.name,
      valueKind,
      ...(valueKind === 'SELECT'
        ? {
            selectOptionValues: (
              (field.options ?? []) as Array<{ value: string }>
            ).map((option) => option.value),
          }
        : {}),
    });
  }

  return columns;
};
