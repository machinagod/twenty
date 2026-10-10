import { FieldMetadataType, RelationType } from 'twenty-shared/types';

import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { addFlatEntityToFlatEntityMapsOrThrow } from 'src/engine/metadata-modules/flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util';
import { getFlatFieldMetadataMock } from 'src/engine/metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { getFlatObjectMetadataMock } from 'src/engine/metadata-modules/flat-object-metadata/__mocks__/get-flat-object-metadata.mock';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';

export const OPPORTUNITY_ID = '20202020-0000-4000-8000-000000000001';
export const WORKSPACE_MEMBER_ID = '20202020-0000-4000-8000-000000000002';
export const COMPANY_ID = '20202020-0000-4000-8000-000000000003';

const field = (
  name: string,
  type: FieldMetadataType,
  overrides: Partial<FlatFieldMetadata> = {},
): FlatFieldMetadata =>
  getFlatFieldMetadataMock({
    universalIdentifier: `opportunity-${name}`,
    id: `field-${name}`,
    objectMetadataId: OPPORTUNITY_ID,
    type,
    name,
    isSystem: false,
    ...overrides,
  } as never);

export const OPPORTUNITY_FIELDS: FlatFieldMetadata[] = [
  field('owner', FieldMetadataType.RELATION, {
    settings: { relationType: RelationType.MANY_TO_ONE },
    relationTargetObjectMetadataId: WORKSPACE_MEMBER_ID,
  } as never),
  field('company', FieldMetadataType.RELATION, {
    settings: { relationType: RelationType.MANY_TO_ONE },
    relationTargetObjectMetadataId: COMPANY_ID,
  } as never),
  field('notes', FieldMetadataType.RELATION, {
    settings: { relationType: RelationType.ONE_TO_MANY },
    relationTargetObjectMetadataId: COMPANY_ID,
  } as never),
  field('createdBy', FieldMetadataType.ACTOR),
  field('name', FieldMetadataType.TEXT),
  field('externalId', FieldMetadataType.UUID),
  field('probability', FieldMetadataType.NUMBER),
  field('isWon', FieldMetadataType.BOOLEAN),
  field('stage', FieldMetadataType.SELECT, {
    options: [
      { id: 'o1', value: 'NEW', label: 'New', position: 0, color: 'blue' },
      { id: 'o2', value: 'WON', label: 'Won', position: 1, color: 'green' },
    ],
  } as never),
  field('tags', FieldMetadataType.MULTI_SELECT),
  field('closeDate', FieldMetadataType.DATE_TIME),
  field('position', FieldMetadataType.POSITION, { isSystem: true }),
  field('searchRank', FieldMetadataType.NUMBER, { isSystem: true }),
];

export const OPPORTUNITY_OBJECT: FlatObjectMetadata = getFlatObjectMetadataMock(
  {
    universalIdentifier: 'opportunity',
    id: OPPORTUNITY_ID,
    nameSingular: 'opportunity',
    fieldIds: OPPORTUNITY_FIELDS.map(({ id }) => id),
  },
);

export const WORKSPACE_MEMBER_OBJECT: FlatObjectMetadata =
  getFlatObjectMetadataMock({
    universalIdentifier: 'workspaceMember',
    id: WORKSPACE_MEMBER_ID,
    nameSingular: 'workspaceMember',
    fieldIds: [],
  });

export const buildFlatEntityMaps = <
  TEntity extends { universalIdentifier: string },
>(
  entities: TEntity[],
): FlatEntityMaps<never> =>
  entities.reduce(
    (flatEntityMaps, flatEntity) =>
      addFlatEntityToFlatEntityMapsOrThrow({
        flatEntity: flatEntity as never,
        flatEntityMaps,
      }),
    createEmptyFlatEntityMaps() as FlatEntityMaps<never>,
  );
