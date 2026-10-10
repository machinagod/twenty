import { RecordScopingRuleException } from 'src/engine/metadata-modules/record-scoping-rule/record-scoping-rule.exception';
import { getRecordScopingColumns } from 'src/engine/metadata-modules/record-scoping-rule/utils/get-record-scoping-columns.util';
import {
  MAX_RECORD_SCOPING_CONDITIONS,
  MAX_RECORD_SCOPING_RELATED_DEPTH,
  type RecordScopingConditionInput,
  validateRecordScopingConditions,
} from 'src/engine/metadata-modules/record-scoping-rule/utils/validate-record-scoping-conditions.util';

import {
  buildFlatEntityMaps,
  COMPANY_FIELDS,
  COMPANY_ID,
  COMPANY_OBJECT,
  OPPORTUNITY_FIELDS,
  OPPORTUNITY_OBJECT,
  WORKSPACE_MEMBER_ID,
} from 'src/engine/metadata-modules/record-scoping-rule/utils/__tests__/record-scoping-rule-fixtures';

const columns = getRecordScopingColumns({
  flatObjectMetadata: OPPORTUNITY_OBJECT,
  flatFieldMetadataMaps: buildFlatEntityMaps(OPPORTUNITY_FIELDS),
  workspaceMemberObjectMetadataId: WORKSPACE_MEMBER_ID,
});

const companyColumns = getRecordScopingColumns({
  flatObjectMetadata: COMPANY_OBJECT,
  flatFieldMetadataMaps: buildFlatEntityMaps(COMPANY_FIELDS),
  workspaceMemberObjectMetadataId: WORKSPACE_MEMBER_ID,
});

const getColumnsForObject = (objectMetadataId: string) =>
  objectMetadataId === COMPANY_ID ? companyColumns : undefined;

const validate = (conditions: RecordScopingConditionInput[]) =>
  validateRecordScopingConditions({ conditions, columns, getColumnsForObject });

const companyOwnedByMe = (
  overrides: Partial<
    NonNullable<RecordScopingConditionInput['relatedRecords']>
  > = {},
): RecordScopingConditionInput => ({
  column: 'companyId',
  operator: 'in',
  relatedRecords: {
    objectMetadataId: COMPANY_ID,
    logicalOperator: 'AND',
    conditions: [
      {
        column: 'accountOwnerId',
        operator: 'eq',
        currentWorkspaceMemberField: 'id',
      },
    ],
    ...overrides,
  },
});

const MEMBER_UUID = '6a8d895c-c231-468c-9fed-01ca754a1a8d';

describe('validateRecordScopingConditions', () => {
  it('accepts "owner is me" and drops the unused value source', () => {
    expect(
      validate([
        {
          column: 'ownerId',
          operator: 'eq',
          currentWorkspaceMemberField: 'id',
          staticValue: null,
        },
      ]),
    ).toEqual([
      { column: 'ownerId', operator: 'eq', currentWorkspaceMemberField: 'id' },
    ]);
  });

  it('accepts the member email against a text column', () => {
    expect(
      validate([
        {
          column: 'name',
          operator: 'neq',
          currentWorkspaceMemberField: 'userEmail',
        },
      ]),
    ).toEqual([
      {
        column: 'name',
        operator: 'neq',
        currentWorkspaceMemberField: 'userEmail',
      },
    ]);
  });

  it.each([
    ['stage', 'eq', 'WON'],
    ['stage', 'in', ['NEW', 'WON']],
    ['probability', 'neq', 50],
    ['isWon', 'eq', true],
    ['name', 'eq', 'Acme'],
    ['companyId', 'eq', MEMBER_UUID],
    ['ownerId', 'in', [MEMBER_UUID]],
  ])('accepts a static %s %s value', (column, operator, staticValue) => {
    expect(validate([{ column, operator, staticValue }])).toEqual([
      { column, operator, staticValue },
    ]);
  });

  it.each([
    [[], 'at least one condition'],
    [
      Array.from({ length: MAX_RECORD_SCOPING_CONDITIONS + 1 }, () => ({
        column: 'name',
        operator: 'eq',
        staticValue: 'x',
      })),
      `at most ${MAX_RECORD_SCOPING_CONDITIONS} conditions`,
    ],
    [[{ ...companyOwnedByMe(), staticValue: 'x' }], 'exactly one of'],
    [[{ ...companyOwnedByMe(), column: 'name' }], 'is not a relation'],
    [
      [{ ...companyOwnedByMe(), column: 'ownerId' }],
      'does not point at object',
    ],
    [[{ ...companyOwnedByMe(), operator: 'eq' }], 'need the "in" operator'],
    [[companyOwnedByMe({ logicalOperator: 'XOR' })], 'logicalOperator must be'],
    [[companyOwnedByMe({ conditions: [] })], 'at least one condition'],
    [
      [
        companyOwnedByMe({
          conditions: [{ column: 'nope', operator: 'eq', staticValue: 'x' }],
        }),
      ],
      'conditions[0].relatedRecords.conditions[0]: "nope" is not a column',
    ],
    [
      [{ column: 'closeDate', operator: 'eq', staticValue: 'x' }],
      'not a column this rule can filter on',
    ],
    [
      [{ column: 'name', operator: 'like', staticValue: 'x' }],
      'operator must be one of',
    ],
    [[{ column: 'name', operator: 'eq' }], 'exactly one of'],
    [
      [
        {
          column: 'ownerId',
          operator: 'eq',
          staticValue: MEMBER_UUID,
          currentWorkspaceMemberField: 'id',
        },
      ],
      'exactly one of',
    ],
    [
      [
        {
          column: 'ownerId',
          operator: 'eq',
          currentWorkspaceMemberField: 'name',
        },
      ],
      'currentWorkspaceMemberField must be one of',
    ],
    [
      [{ column: 'name', operator: 'eq', currentWorkspaceMemberField: 'id' }],
      "the current member's id cannot be compared",
    ],
    [
      [
        {
          column: 'ownerId',
          operator: 'in',
          currentWorkspaceMemberField: 'id',
        },
      ],
      'not the current member',
    ],
    [[{ column: 'stage', operator: 'in', staticValue: [] }], 'non-empty list'],
    [
      [{ column: 'stage', operator: 'in', staticValue: 'WON' }],
      'non-empty list',
    ],
    [
      [{ column: 'stage', operator: 'in', staticValue: ['WON', 'LOST'] }],
      '"LOST" is not a valid value',
    ],
    [
      [{ column: 'stage', operator: 'eq', staticValue: 'LOST' }],
      'not a valid value',
    ],
    [
      [{ column: 'probability', operator: 'eq', staticValue: '50' }],
      'not a valid value',
    ],
    [
      [{ column: 'probability', operator: 'eq', staticValue: Number.NaN }],
      'not a valid value',
    ],
    [
      [{ column: 'isWon', operator: 'eq', staticValue: 'true' }],
      'not a valid value',
    ],
    [
      [{ column: 'ownerId', operator: 'eq', staticValue: 'me' }],
      'not a valid value',
    ],
    [[{ column: 'name', operator: 'eq', staticValue: 3 }], 'not a valid value'],
  ])('rejects %j', (conditions, message) => {
    expect(() => validate(conditions as RecordScopingConditionInput[])).toThrow(
      RecordScopingRuleException,
    );
    expect(() => validate(conditions as RecordScopingConditionInput[])).toThrow(
      message,
    );
  });
  it('accepts related records and keeps them normalized', () => {
    expect(validate([companyOwnedByMe()])).toEqual([
      {
        column: 'companyId',
        operator: 'in',
        relatedRecords: {
          objectMetadataId: COMPANY_ID,
          logicalOperator: 'AND',
          conditions: [
            {
              column: 'accountOwnerId',
              operator: 'eq',
              currentWorkspaceMemberField: 'id',
            },
          ],
        },
      },
    ]);
  });

  it('rejects related records on an object it cannot find', () => {
    expect(() =>
      validateRecordScopingConditions({
        conditions: [companyOwnedByMe()],
        columns,
        getColumnsForObject: () => undefined,
      }),
    ).toThrow('not found');
  });

  it('limits how deep related records nest', () => {
    expect(() =>
      validateRecordScopingConditions({
        conditions: [companyOwnedByMe()],
        columns,
        getColumnsForObject,
        depth: MAX_RECORD_SCOPING_RELATED_DEPTH,
      }),
    ).toThrow('nested at most');
  });
});
