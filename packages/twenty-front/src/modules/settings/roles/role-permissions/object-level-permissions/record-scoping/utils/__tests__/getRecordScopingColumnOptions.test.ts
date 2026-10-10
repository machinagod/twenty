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
});
