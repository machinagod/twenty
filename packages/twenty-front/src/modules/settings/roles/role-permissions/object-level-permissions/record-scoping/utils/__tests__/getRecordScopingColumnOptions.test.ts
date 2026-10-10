import { getRecordScopingColumnOptions } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/utils/getRecordScopingColumnOptions';
import { FieldMetadataType, RelationType } from 'twenty-shared/types';

const field = (overrides: Record<string, unknown>) =>
  ({
    id: String(overrides.name),
    label: String(overrides.name),
    icon: 'IconCircle',
    isActive: true,
    isSystem: false,
    ...overrides,
  }) as never;

const relationTo = (nameSingular: string, type = RelationType.MANY_TO_ONE) => ({
  type,
  targetObjectMetadata: {
    id: nameSingular,
    nameSingular,
    namePlural: `${nameSingular}s`,
  },
});

describe('getRecordScopingColumnOptions', () => {
  const options = getRecordScopingColumnOptions({
    fields: [
      field({
        name: 'owner',
        type: FieldMetadataType.RELATION,
        relation: relationTo('workspaceMember'),
      }),
      field({
        name: 'company',
        type: FieldMetadataType.RELATION,
        relation: relationTo('company'),
      }),
      field({
        name: 'tasks',
        type: FieldMetadataType.RELATION,
        relation: relationTo('task', RelationType.ONE_TO_MANY),
      }),
      field({ name: 'createdBy', type: FieldMetadataType.ACTOR }),
      field({ name: 'name', type: FieldMetadataType.TEXT }),
      field({ name: 'amount', type: FieldMetadataType.NUMERIC }),
      field({ name: 'isWon', type: FieldMetadataType.BOOLEAN }),
      field({
        name: 'stage',
        type: FieldMetadataType.SELECT,
        options: [
          { id: '1', value: 'NEW', label: 'New', position: 0, color: 'blue' },
        ],
      }),
      field({ name: 'label', type: FieldMetadataType.SELECT, options: null }),
      field({ name: 'closeDate', type: FieldMetadataType.DATE_TIME }),
      field({
        name: 'position',
        type: FieldMetadataType.NUMBER,
        isSystem: true,
      }),
      field({
        name: 'archived',
        type: FieldMetadataType.TEXT,
        isActive: false,
      }),
    ],
  });

  it('offers the scopable columns sorted by label', () => {
    expect(options.map((option) => [option.column, option.valueKind])).toEqual([
      ['amount', 'NUMBER'],
      ['companyId', 'UUID'],
      ['createdByWorkspaceMemberId', 'WORKSPACE_MEMBER'],
      ['isWon', 'BOOLEAN'],
      ['label', 'SELECT'],
      ['name', 'TEXT'],
      ['ownerId', 'WORKSPACE_MEMBER'],
      ['stage', 'SELECT'],
    ]);
  });

  it('carries select options', () => {
    expect(
      options.find((option) => option.column === 'stage')?.selectOptions,
    ).toEqual([{ value: 'NEW', label: 'New' }]);
    expect(
      options.find((option) => option.column === 'label')?.selectOptions,
    ).toEqual([]);
  });

  describe('one-to-many relations', () => {
    const oneToMany = (
      name: string,
      targetFieldId: string,
      overrides: Record<string, unknown> = {},
    ) =>
      field({
        name,
        type: FieldMetadataType.RELATION,
        relation: {
          ...relationTo('line', RelationType.ONE_TO_MANY),
          targetFieldMetadata: { id: targetFieldId, name: 'unused' },
        },
        ...overrides,
      });

    const lineObject = {
      id: 'line',
      fields: [
        field({
          name: 'route',
          id: 'line-route',
          type: FieldMetadataType.RELATION,
        }),
        field({
          name: 'target',
          id: 'line-target',
          type: FieldMetadataType.MORPH_RELATION,
        }),
      ],
    } as never;

    it('offers any related record pointing back through a plain join column', () => {
      expect(
        getRecordScopingColumnOptions(
          {
            fields: [
              oneToMany('lines', 'line-route'),
              oneToMany('targets', 'line-target'),
              oneToMany('hiddenLines', 'line-route', { isSystem: true }),
              oneToMany('unknown', 'missing-field'),
            ],
          },
          [lineObject],
        ),
      ).toEqual([
        {
          key: 'id:routeId',
          column: 'id',
          label: 'Any of lines',
          icon: 'IconCircle',
          valueKind: 'UUID',
          targetObjectMetadataId: 'line',
          matchColumn: 'routeId',
        },
      ]);
    });

    it('skips them when the related object is unknown', () => {
      expect(
        getRecordScopingColumnOptions({
          fields: [oneToMany('lines', 'line-route')],
        }),
      ).toEqual([]);
    });
  });
});
