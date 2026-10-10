import { type RecordScopingColumnOption } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingColumnOption';
import { type RecordScopingConditionDraft } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingConditionDraft';
import {
  createRecordScopingConditionDraft,
  fromRecordScopingCondition,
  getCurrentMemberFieldForColumn,
  getRecordScopingOperators,
  toRecordScopingConditionInput,
} from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/utils/recordScopingConditionDraft';

const MEMBER_ID = '6a8d895c-c231-468c-9fed-01ca754a1a8d';

const column = (
  valueKind: RecordScopingColumnOption['valueKind'],
  overrides: Partial<RecordScopingColumnOption> = {},
): RecordScopingColumnOption => ({
  column: 'col',
  label: 'Col',
  valueKind,
  ...overrides,
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
      toRecordScopingConditionInput(draft({ staticValue }), columnOption),
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
      toRecordScopingConditionInput(conditionDraft, columnOption),
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
