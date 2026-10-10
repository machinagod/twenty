import { type RecordScopingColumnOption } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingColumnOption';
import { type RecordScopingConditionDraft } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingConditionDraft';
import {
  canMatchRelatedRecords,
  createRecordScopingConditionDraft,
  fromRecordScopingCondition,
  getCurrentMemberFieldForColumn,
  getDefaultRecordScopingColumn,
  getRecordScopingColumnKey,
  getRecordScopingOperators,
  toRecordScopingConditionInput,
  toRecordScopingConditionInputs,
  toRelatedRecordScopingConditionDraft,
} from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/utils/recordScopingConditionDraft';

const MEMBER_ID = '6a8d895c-c231-468c-9fed-01ca754a1a8d';

const noColumns = () => undefined;

const column = (
  valueKind: RecordScopingColumnOption['valueKind'],
  overrides: Partial<RecordScopingColumnOption> = {},
): RecordScopingColumnOption => ({
  column: 'col',
  label: 'Col',
  valueKind,
  ...overrides,
  key: overrides.key ?? overrides.column ?? 'col',
});

const stage = column('SELECT', {
  selectOptions: [
    { value: 'NEW', label: 'New' },
    { value: 'WON', label: 'Won' },
  ],
});

const draft = (
  overrides: Partial<RecordScopingConditionDraft>,
): RecordScopingConditionDraft => ({
  key: 'k',
  column: 'col',
  operator: 'eq',
  valueSource: 'STATIC',
  staticValue: '',
  ...overrides,
});

describe('getRecordScopingOperators', () => {
  it('offers "is any of" only for free-form values', () => {
    expect(getRecordScopingOperators(column('TEXT'))).toEqual([
      'eq',
      'neq',
      'in',
    ]);
    expect(getRecordScopingOperators(column('NUMBER'))).toEqual([
      'eq',
      'neq',
      'in',
    ]);
    expect(getRecordScopingOperators(column('UUID'))).toEqual([
      'eq',
      'neq',
      'in',
    ]);
    expect(getRecordScopingOperators(column('SELECT'))).toEqual(['eq', 'neq']);
    expect(getRecordScopingOperators(column('BOOLEAN'))).toEqual(['eq', 'neq']);
    expect(getRecordScopingOperators(column('WORKSPACE_MEMBER'))).toEqual([
      'eq',
      'neq',
    ]);
  });
});

describe('getCurrentMemberFieldForColumn', () => {
  it('matches member columns to the id and text columns to the email', () => {
    expect(getCurrentMemberFieldForColumn(column('WORKSPACE_MEMBER'))).toBe(
      'id',
    );
    expect(getCurrentMemberFieldForColumn(column('TEXT'))).toBe('userEmail');
    expect(getCurrentMemberFieldForColumn(column('NUMBER'))).toBeUndefined();
  });
});

describe('createRecordScopingConditionDraft', () => {
  it('defaults member columns to the current member', () => {
    expect(
      createRecordScopingConditionDraft(column('WORKSPACE_MEMBER')),
    ).toMatchObject({
      column: 'col',
      operator: 'eq',
      valueSource: 'CURRENT_MEMBER',
    });
  });

  it('defaults selects to their first option and booleans to true', () => {
    expect(createRecordScopingConditionDraft(stage).staticValue).toBe('NEW');
    expect(
      createRecordScopingConditionDraft(column('BOOLEAN')).staticValue,
    ).toBe('true');
    expect(createRecordScopingConditionDraft(column('TEXT')).staticValue).toBe(
      '',
    );
  });
});

describe('toRecordScopingConditionInput', () => {
  it('builds a current member condition', () => {
    expect(
      toRecordScopingConditionInput(
        draft({ valueSource: 'CURRENT_MEMBER' }),
        column('WORKSPACE_MEMBER'),
        noColumns,
      ),
    ).toEqual({
      column: 'col',
      operator: 'eq',
      currentWorkspaceMemberField: 'id',
    });
  });

  it.each([
    [column('NUMBER'), ' 42 ', 42],
    [column('BOOLEAN'), 'false', false],
    [column('BOOLEAN'), 'true', true],
    [stage, 'WON', 'WON'],
    [column('UUID'), MEMBER_ID, MEMBER_ID],
    [column('TEXT'), ' Lisboa ', 'Lisboa'],
  ])('parses a static value', (columnOption, staticValue, expected) => {
    expect(
      toRecordScopingConditionInput(
        draft({ staticValue }),
        columnOption,
        noColumns,
      ),
    ).toEqual({
      column: 'col',
      operator: 'eq',
      staticValue: expected,
    });
  });

  it('splits a list for "is any of"', () => {
    expect(
      toRecordScopingConditionInput(
        draft({ operator: 'in', staticValue: '1, 2,,3' }),
        column('NUMBER'),
        noColumns,
      ),
    ).toEqual({ column: 'col', operator: 'in', staticValue: [1, 2, 3] });
  });

  it.each([
    ['an unknown column', draft({}), undefined],
    [
      'a member value on a number column',
      draft({ valueSource: 'CURRENT_MEMBER' }),
      column('NUMBER'),
    ],
    [
      'a member value with "is any of"',
      draft({ valueSource: 'CURRENT_MEMBER', operator: 'in' }),
      column('WORKSPACE_MEMBER'),
    ],
    ['an empty text', draft({ staticValue: '  ' }), column('TEXT')],
    ['a non-number', draft({ staticValue: 'abc' }), column('NUMBER')],
    ['an empty number', draft({ staticValue: '' }), column('NUMBER')],
    ['a non-boolean', draft({ staticValue: 'yes' }), column('BOOLEAN')],
    ['an unknown option', draft({ staticValue: 'LOST' }), stage],
    [
      'a select without options',
      draft({ staticValue: 'NEW' }),
      column('SELECT'),
    ],
    ['a malformed id', draft({ staticValue: 'me' }), column('UUID')],
    [
      'a member column static id',
      draft({ staticValue: 'x' }),
      column('WORKSPACE_MEMBER'),
    ],
    [
      'an empty list',
      draft({ operator: 'in', staticValue: ' , ' }),
      column('TEXT'),
    ],
    [
      'a list with a bad item',
      draft({ operator: 'in', staticValue: '1, x' }),
      column('NUMBER'),
    ],
  ])('is undefined for %s', (_label, conditionDraft, columnOption) => {
    expect(
      toRecordScopingConditionInput(conditionDraft, columnOption, noColumns),
    ).toBeUndefined();
  });
});

describe('fromRecordScopingCondition', () => {
  it('turns stored conditions back into drafts', () => {
    expect(
      fromRecordScopingCondition({
        column: 'ownerId',
        operator: 'eq',
        currentWorkspaceMemberField: 'id',
      }),
    ).toMatchObject({
      column: 'ownerId',
      operator: 'eq',
      valueSource: 'CURRENT_MEMBER',
      staticValue: '',
    });
    expect(
      fromRecordScopingCondition({
        column: 'amount',
        operator: 'in',
        staticValue: [1, 2],
      }),
    ).toMatchObject({
      valueSource: 'STATIC',
      staticValue: '1, 2',
    });
    expect(
      fromRecordScopingCondition({
        column: 'isWon',
        operator: 'neq',
        staticValue: false,
      }),
    ).toMatchObject({
      operator: 'neq',
      staticValue: 'false',
    });
  });
});

describe('related records', () => {
  const companyColumn = column('UUID', {
    column: 'companyId',
    label: 'Company',
    targetObjectMetadataId: 'company-id',
  });
  const companyColumns = [
    column('TEXT', { column: 'name', label: 'Name' }),
    column('WORKSPACE_MEMBER', {
      column: 'accountOwnerId',
      label: 'Account owner',
      targetObjectMetadataId: 'wm-id',
    }),
  ];
  const getColumns = (objectMetadataId: string) =>
    objectMetadataId === 'company-id' ? companyColumns : undefined;

  it('only lets relations to other objects match related records', () => {
    expect(canMatchRelatedRecords(companyColumn)).toBe(true);
    expect(canMatchRelatedRecords(column('UUID'))).toBe(false);
    expect(
      canMatchRelatedRecords(
        column('WORKSPACE_MEMBER', { targetObjectMetadataId: 'wm-id' }),
      ),
    ).toBe(false);
  });

  it('seeds the related records with the default related condition', () => {
    const related = toRelatedRecordScopingConditionDraft(
      draft({ column: 'companyId', staticValue: 'x' }),
      companyColumn,
      getColumns,
    );

    expect(related).toMatchObject({
      operator: 'in',
      valueSource: 'RELATED',
      staticValue: '',
      related: {
        objectMetadataId: 'company-id',
        logicalOperator: 'AND',
        conditions: [
          { column: 'accountOwnerId', valueSource: 'CURRENT_MEMBER' },
        ],
      },
    });
    expect(
      toRelatedRecordScopingConditionDraft(
        draft({}),
        companyColumn,
        () => undefined,
      ).related?.conditions,
    ).toEqual([]);
  });

  it('round-trips a related condition through the API shape', () => {
    const input = {
      column: 'companyId',
      operator: 'in',
      relatedRecords: {
        objectMetadataId: 'company-id',
        logicalOperator: 'OR',
        conditions: [
          {
            column: 'accountOwnerId',
            operator: 'eq',
            currentWorkspaceMemberField: 'id',
          },
        ],
      },
    };
    const relatedDraft = fromRecordScopingCondition(input);

    expect(relatedDraft).toMatchObject({
      valueSource: 'RELATED',
      related: { logicalOperator: 'OR' },
    });
    expect(
      toRecordScopingConditionInput(relatedDraft, companyColumn, getColumns),
    ).toEqual(input);
    expect(
      fromRecordScopingCondition({
        ...input,
        relatedRecords: { ...input.relatedRecords, logicalOperator: 'AND' },
      }).related?.logicalOperator,
    ).toBe('AND');
  });

  it.each([
    ['no related records', draft({ valueSource: 'RELATED' }), companyColumn],
    [
      'an unknown related object',
      draft({
        valueSource: 'RELATED',
        related: {
          objectMetadataId: 'ghost',
          logicalOperator: 'AND',
          conditions: [],
        },
      }),
      companyColumn,
    ],
    [
      'a column that cannot match related records',
      draft({
        valueSource: 'RELATED',
        related: {
          objectMetadataId: 'company-id',
          logicalOperator: 'AND',
          conditions: [],
        },
      }),
      column('UUID'),
    ],
    [
      'an incomplete related condition',
      draft({
        valueSource: 'RELATED',
        related: {
          objectMetadataId: 'company-id',
          logicalOperator: 'AND',
          conditions: [draft({ column: 'name', staticValue: ' ' })],
        },
      }),
      companyColumn,
    ],
  ])('is undefined for %s', (_label, conditionDraft, columnOption) => {
    expect(
      toRecordScopingConditionInput(conditionDraft, columnOption, getColumns),
    ).toBeUndefined();
  });

  describe('pointing back at the scoped record', () => {
    const linesColumn = column('UUID', {
      key: 'id:companyId',
      column: 'id',
      label: 'Any of people',
      targetObjectMetadataId: 'company-id',
      matchColumn: 'companyId',
    });
    const input = {
      column: 'id',
      operator: 'in',
      relatedRecords: {
        objectMetadataId: 'company-id',
        matchColumn: 'companyId',
        logicalOperator: 'AND',
        conditions: [
          {
            column: 'accountOwnerId',
            operator: 'eq',
            currentWorkspaceMemberField: 'id',
          },
        ],
      },
    };

    it('keys the option by its match column', () => {
      expect(getRecordScopingColumnKey('id', 'companyId')).toBe('id:companyId');
      expect(getRecordScopingColumnKey('name')).toBe('name');
      expect(getRecordScopingColumnKey('name', null)).toBe('name');
    });

    it('starts as matching records when the related columns are known', () => {
      expect(
        createRecordScopingConditionDraft(linesColumn, getColumns),
      ).toMatchObject({
        column: 'id:companyId',
        valueSource: 'RELATED',
        related: { objectMetadataId: 'company-id' },
      });
      expect(createRecordScopingConditionDraft(linesColumn)).toMatchObject({
        column: 'id:companyId',
        valueSource: 'STATIC',
      });
    });

    it('round-trips through the API shape with its match column', () => {
      const relatedDraft = fromRecordScopingCondition(input);

      expect(relatedDraft.column).toBe('id:companyId');
      expect(
        toRecordScopingConditionInputs(
          [relatedDraft],
          [...companyColumns, linesColumn],
          getColumns,
        ),
      ).toEqual([input]);
    });

    it('is undefined unless it matches related records', () => {
      expect(
        toRecordScopingConditionInput(
          draft({ column: 'id:companyId', valueSource: 'CURRENT_MEMBER' }),
          linesColumn,
          getColumns,
        ),
      ).toBeUndefined();
    });

    it('is the default column only when nothing else is offered', () => {
      const text = column('TEXT', { column: 'name' });

      expect(getDefaultRecordScopingColumn([linesColumn, text])).toBe(text);
      expect(getDefaultRecordScopingColumn([linesColumn])).toBe(linesColumn);
    });
  });

  it('converts a list only when every draft is complete', () => {
    expect(
      toRecordScopingConditionInputs([], companyColumns, getColumns),
    ).toBeUndefined();
    expect(
      toRecordScopingConditionInputs(
        [draft({ column: 'name', staticValue: 'Acme' })],
        companyColumns,
        getColumns,
      ),
    ).toEqual([{ column: 'name', operator: 'eq', staticValue: 'Acme' }]);
  });
});

describe('getDefaultRecordScopingColumn', () => {
  it('prefers an owner relation, then an actor, then the first column', () => {
    const text = column('TEXT', { column: 'name' });
    const actor = column('WORKSPACE_MEMBER', {
      column: 'createdByWorkspaceMemberId',
    });
    const owner = column('WORKSPACE_MEMBER', { column: 'ownerId' });

    expect(getDefaultRecordScopingColumn([text, actor, owner])).toBe(owner);
    expect(getDefaultRecordScopingColumn([text, actor])).toBe(actor);
    expect(getDefaultRecordScopingColumn([text])).toBe(text);
    expect(getDefaultRecordScopingColumn([])).toBeUndefined();
  });
});
