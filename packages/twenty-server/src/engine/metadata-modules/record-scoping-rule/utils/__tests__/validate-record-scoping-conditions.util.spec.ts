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
  OPPORTUNITY_ID,
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
  ({ [COMPANY_ID]: companyColumns, [OPPORTUNITY_ID]: columns })[
    objectMetadataId
  ];

const validate = (conditions: RecordScopingConditionInput[]) =>
  validateRecordScopingConditions({
    conditions,
    objectMetadataId: OPPORTUNITY_ID,
    columns,
    getColumnsForObject,
  });

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
        objectMetadataId: OPPORTUNITY_ID,
        columns,
        getColumnsForObject: () => undefined,
      }),
    ).toThrow('not found');
  });

  it('limits how deep related records nest', () => {
    expect(() =>
      validateRecordScopingConditions({
        conditions: [companyOwnedByMe()],
        objectMetadataId: OPPORTUNITY_ID,
        columns,
        getColumnsForObject,
        depth: MAX_RECORD_SCOPING_RELATED_DEPTH,
      }),
    ).toThrow('nested at most');
  });

  describe('related records pointing back', () => {
    const ownedOpportunities = (
      overrides: Partial<RecordScopingConditionInput> = {},
      relatedOverrides: Partial<
        NonNullable<RecordScopingConditionInput['relatedRecords']>
      > = {},
    ): RecordScopingConditionInput => ({
      column: 'id',
      operator: 'in',
      relatedRecords: {
        objectMetadataId: OPPORTUNITY_ID,
        matchColumn: 'companyId',
        logicalOperator: 'AND',
        conditions: [
          {
            column: 'ownerId',
            operator: 'eq',
            currentWorkspaceMemberField: 'id',
          },
        ],
        ...relatedOverrides,
      },
      ...overrides,
    });

    const validateForCompany = (conditions: RecordScopingConditionInput[]) =>
      validateRecordScopingConditions({
        conditions,
        objectMetadataId: COMPANY_ID,
        columns: companyColumns,
        getColumnsForObject,
      });

    it('accepts any related record whose join column points at the scoped one', () => {
      expect(validateForCompany([ownedOpportunities()])).toEqual([
        {
          column: 'id',
          operator: 'in',
          relatedRecords: {
            objectMetadataId: OPPORTUNITY_ID,
            matchColumn: 'companyId',
            logicalOperator: 'AND',
            conditions: [
              {
                column: 'ownerId',
                operator: 'eq',
                currentWorkspaceMemberField: 'id',
              },
            ],
          },
        },
      ]);
    });

    it.each([
      [
        'a matchColumn on another column',
        ownedOpportunities({ column: 'accountOwnerId' }),
        'matchColumn needs the condition on "id"',
      ],
      [
        'the id without a matchColumn',
        ownedOpportunities({}, { matchColumn: undefined }),
        'can only match related records that point back',
      ],
      [
        'the id without related records',
        { column: 'id', operator: 'eq', staticValue: MEMBER_UUID },
        'can only match related records that point back',
      ],
      [
        'a second value source',
        ownedOpportunities({ staticValue: MEMBER_UUID }),
        'set exactly one of',
      ],
      [
        'an operator other than in',
        ownedOpportunities({ operator: 'eq' }),
        'need the "in" operator',
      ],
      [
        'a bad logical operator',
        ownedOpportunities({}, { logicalOperator: 'XOR' }),
        'logicalOperator must be AND or OR',
      ],
      [
        'an unknown related object',
        ownedOpportunities({}, { objectMetadataId: MEMBER_UUID }),
        'not found',
      ],
      [
        'a matchColumn that is not a join column',
        ownedOpportunities({}, { matchColumn: 'name' }),
        'is not a relation on object',
      ],
      [
        'a matchColumn pointing at another object',
        ownedOpportunities({}, { matchColumn: 'ownerId' }),
        `does not point at object ${COMPANY_ID}`,
      ],
      [
        'invalid conditions on the related object',
        ownedOpportunities({}, { conditions: [] }),
        'at least one condition',
      ],
    ])('rejects %s', (_label, condition, message) => {
      expect(() =>
        validateForCompany([condition as RecordScopingConditionInput]),
      ).toThrow(message);
    });

    it('limits how deep they nest', () => {
      expect(() =>
        validateRecordScopingConditions({
          conditions: [ownedOpportunities()],
          objectMetadataId: COMPANY_ID,
          columns: companyColumns,
          getColumnsForObject,
          depth: MAX_RECORD_SCOPING_RELATED_DEPTH,
        }),
      ).toThrow('nested at most');
    });
  });
});
