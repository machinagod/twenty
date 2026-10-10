import { randomUUID } from 'crypto';

import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { destroyOneOperationFactory } from 'test/integration/graphql/utils/destroy-one-operation-factory.util';
import { findManyOperationFactory } from 'test/integration/graphql/utils/find-many-operation-factory.util';
import { makeGraphqlApiRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { updateOneOperationFactory } from 'test/integration/graphql/utils/update-one-operation-factory.util';
import { findManyObjectMetadata } from 'test/integration/metadata/suites/object-metadata/utils/find-many-object-metadata.util';
import {
  deleteRecordScopingRule,
  findRecordScopingRules,
  upsertRecordScopingRule,
} from 'test/integration/metadata/suites/record-scoping-rule/utils/record-scoping-rule-requests.util';
import { createOneRole } from 'test/integration/metadata/suites/role/utils/create-one-role.util';
import { deleteOneRole } from 'test/integration/metadata/suites/role/utils/delete-one-role.util';
import { findOneRoleByLabel } from 'test/integration/metadata/suites/role/utils/find-one-role-by-label.util';
import { updateWorkspaceMemberRole } from 'test/integration/metadata/suites/role/utils/update-workspace-member-role.util';
import { jestExpectToBeDefined } from 'test/utils/jest-expect-to-be-defined.util.test';

import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

// Proves the clean-room record scoping is wired end-to-end: rules created through
// the metadata API (as Settings > Roles does) reach the workspace ORM chokepoint.
// The company rule scopes the test role to `employees = 42`; the opportunity
// rule is the production shape (ownerId = me). It checks that:
//   1. SELECTs through the real query builder are filtered for a scoped role,
//   2. an unscoped role (admin) still sees everything (scoping is role-specific,
//      so a regression here can't be masked as "everything is hidden"),
//   3. UPDATEs are filtered too: out-of-scope writes fail closed, in-scope
//      writes go through,
//   4. member-relative scoping works on `opportunity`,
//   5. editing rules needs the Roles permission, invalid rules are rejected,
//      and removing a rule lifts the scope without a restart,
//   6. a rule can keep records that related records point back at (companies
//      with an opportunity owned by the member),
//   7. an email list matches when the member's email is the primary or any
//      additional one, also from inside related records.
// This is the regression net that survives upstream syncs: if a future upstream
// refactor of the query builders drops the record scoping call, this fails.
const ROLE_LABEL = 'Record Scoping Test Role';
const COMPANY_GQL_FIELDS = `
  id
  name
  employees
`;
const OPPORTUNITY_GQL_FIELDS = `
  id
  name
  ownerId
`;

describe('record scoping is enforced at the workspace ORM chokepoint', () => {
  const inScopeCompanyId = randomUUID();
  const outOfScopeCompanyId = randomUUID();
  const testCompanyIds = [inScopeCompanyId, outOfScopeCompanyId];

  // The scoped member (JONY) owns one opportunity; another member (PHIL) owns the
  // other. The member-relative rule (ownerId = me) must hide PHIL's from JONY.
  const ownedByScopedMemberOpportunityId = randomUUID();
  const ownedByOtherMemberOpportunityId = randomUUID();
  const testOpportunityIds = [
    ownedByScopedMemberOpportunityId,
    ownedByOtherMemberOpportunityId,
  ];

  let customRoleId: string;
  let originalMemberRoleId: string;
  let companyObjectMetadataId: string;
  let opportunityObjectMetadataId: string;

  // People are scoped through their company (related records), not a column
  // of their own.
  const inScopePersonId = randomUUID();
  const outOfScopePersonId = randomUUID();
  const testPersonIds = [inScopePersonId, outOfScopePersonId];
  const emailPersonIds: string[] = [];

  const findTestCompaniesAs = (token: string) =>
    makeGraphqlApiRequest(
      findManyOperationFactory({
        objectMetadataSingularName: 'company',
        objectMetadataPluralName: 'companies',
        gqlFields: COMPANY_GQL_FIELDS,
        filter: { id: { in: testCompanyIds } },
        first: 10,
      }),
      token,
    );

  const findTestOpportunitiesAs = (token: string) =>
    makeGraphqlApiRequest(
      findManyOperationFactory({
        objectMetadataSingularName: 'opportunity',
        objectMetadataPluralName: 'opportunities',
        gqlFields: OPPORTUNITY_GQL_FIELDS,
        filter: { id: { in: testOpportunityIds } },
        first: 10,
      }),
      token,
    );

  const namesFromCompaniesResponse = (response: {
    body: { data: { companies: { edges: { node: { name: string } }[] } } };
  }) =>
    response.body.data.companies.edges
      .map((edge) => edge.node.name)
      .sort((a, b) => a.localeCompare(b));

  const namesFromOpportunitiesResponse = (response: {
    body: { data: { opportunities: { edges: { node: { name: string } }[] } } };
  }) =>
    response.body.data.opportunities.edges
      .map((edge) => edge.node.name)
      .sort((a, b) => a.localeCompare(b));

  beforeAll(async () => {
    const memberRole = await findOneRoleByLabel({ label: 'Member' });

    originalMemberRoleId = memberRole.id;

    const { data: roleData } = await createOneRole({
      expectToFail: false,
      input: {
        label: ROLE_LABEL,
        description: 'Role assigned to a member to verify record scoping',
        icon: 'IconLock',
        canUpdateAllSettings: false,
        canAccessAllTools: true,
        canReadAllObjectRecords: true,
        canUpdateAllObjectRecords: true,
        canSoftDeleteAllObjectRecords: false,
        canDestroyAllObjectRecords: false,
        canBeAssignedToUsers: true,
        canBeAssignedToAgents: false,
        canBeAssignedToApiKeys: false,
      },
    });

    customRoleId = roleData?.createOneRole?.id;
    jestExpectToBeDefined(customRoleId);

    const { objects } = await findManyObjectMetadata({
      input: { filter: {}, paging: { first: 1000 } },
      gqlFields: 'id nameSingular',
      expectToFail: false,
    });
    const objectId = (nameSingular: string) => {
      const object = objects.find((item) => item.nameSingular === nameSingular);

      jestExpectToBeDefined(object);

      return object.id;
    };

    companyObjectMetadataId = objectId('company');
    opportunityObjectMetadataId = objectId('opportunity');

    for (const rule of [
      {
        objectMetadataId: companyObjectMetadataId,
        conditions: [{ column: 'employees', operator: 'eq', staticValue: 42 }],
      },
      {
        objectMetadataId: objectId('person'),
        conditions: [
          {
            column: 'companyId',
            operator: 'in',
            relatedRecords: {
              objectMetadataId: companyObjectMetadataId,
              logicalOperator: 'AND',
              conditions: [
                { column: 'employees', operator: 'eq', staticValue: 42 },
              ],
            },
          },
        ],
      },
      {
        objectMetadataId: opportunityObjectMetadataId,
        conditions: [
          {
            column: 'ownerId',
            operator: 'eq',
            currentWorkspaceMemberField: 'id',
          },
        ],
      },
    ]) {
      const response = await upsertRecordScopingRule({
        roleId: customRoleId,
        logicalOperator: 'AND',
        ...rule,
      });

      expect(response.body.errors).toBeUndefined();
    }

    await updateWorkspaceMemberRole({
      input: {
        roleId: customRoleId,
        workspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.JONY,
      },
      expectToFail: false,
    });

    // Seeded as admin (the default identity) so the rows exist regardless of
    // scoping; the scoped member should then only ever see the in-scope one.
    await makeGraphqlApiRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'company',
        gqlFields: COMPANY_GQL_FIELDS,
        data: {
          id: inScopeCompanyId,
          name: 'RecordScoping In Scope Co',
          employees: 42,
        },
      }),
    );

    await makeGraphqlApiRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'company',
        gqlFields: COMPANY_GQL_FIELDS,
        data: {
          id: outOfScopeCompanyId,
          name: 'RecordScoping Out Of Scope Co',
          employees: 7,
        },
      }),
    );

    for (const [id, companyId, firstName] of [
      [inScopePersonId, inScopeCompanyId, 'RecordScopingInScope'],
      [outOfScopePersonId, outOfScopeCompanyId, 'RecordScopingOutOfScope'],
    ]) {
      await makeGraphqlApiRequest(
        createOneOperationFactory({
          objectMetadataSingularName: 'person',
          gqlFields: 'id',
          data: { id, companyId, name: { firstName, lastName: 'Person' } },
        }),
      );
    }

    await makeGraphqlApiRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'opportunity',
        gqlFields: OPPORTUNITY_GQL_FIELDS,
        data: {
          id: ownedByScopedMemberOpportunityId,
          name: 'RecordScoping Owned By Scoped Member',
          ownerId: WORKSPACE_MEMBER_DATA_SEED_IDS.JONY,
          companyId: inScopeCompanyId,
        },
      }),
    );

    await makeGraphqlApiRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'opportunity',
        gqlFields: OPPORTUNITY_GQL_FIELDS,
        data: {
          id: ownedByOtherMemberOpportunityId,
          name: 'RecordScoping Owned By Other Member',
          ownerId: WORKSPACE_MEMBER_DATA_SEED_IDS.PHIL,
          companyId: outOfScopeCompanyId,
        },
      }),
    );
  });

  afterAll(async () => {
    await updateWorkspaceMemberRole({
      input: {
        workspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.JONY,
        roleId: originalMemberRoleId,
      },
      expectToFail: false,
    });

    for (const id of testCompanyIds) {
      await makeGraphqlApiRequest(
        destroyOneOperationFactory({
          objectMetadataSingularName: 'company',
          gqlFields: 'id',
          recordId: id,
        }),
      );
    }

    for (const id of [...testPersonIds, ...emailPersonIds]) {
      await makeGraphqlApiRequest(
        destroyOneOperationFactory({
          objectMetadataSingularName: 'person',
          gqlFields: 'id',
          recordId: id,
        }),
      );
    }

    for (const id of testOpportunityIds) {
      await makeGraphqlApiRequest(
        destroyOneOperationFactory({
          objectMetadataSingularName: 'opportunity',
          gqlFields: 'id',
          recordId: id,
        }),
      );
    }

    if (customRoleId) {
      await deleteOneRole({
        expectToFail: false,
        input: { idToDelete: customRoleId },
      });
    }
  });

  it('filters SELECTs for the scoped role to only in-scope records', async () => {
    const response = await findTestCompaniesAs(APPLE_JONY_MEMBER_ACCESS_TOKEN);

    expect(response.body.errors).toBeUndefined();
    expect(namesFromCompaniesResponse(response)).toEqual([
      'RecordScoping In Scope Co',
    ]);
  });

  it('leaves an unscoped role (admin) able to read every record', async () => {
    const response = await findTestCompaniesAs(APPLE_JANE_ADMIN_ACCESS_TOKEN);

    expect(response.body.errors).toBeUndefined();
    expect(namesFromCompaniesResponse(response)).toEqual([
      'RecordScoping In Scope Co',
      'RecordScoping Out Of Scope Co',
    ]);
  });

  it('fails closed on UPDATEs of out-of-scope records for the scoped role', async () => {
    await makeGraphqlApiRequest(
      updateOneOperationFactory({
        objectMetadataSingularName: 'company',
        gqlFields: COMPANY_GQL_FIELDS,
        recordId: outOfScopeCompanyId,
        data: { name: 'Mutated By Scoped Role' },
      }),
      APPLE_JONY_MEMBER_ACCESS_TOKEN,
    );

    // Re-read as admin: the out-of-scope row must be untouched.
    const response = await findTestCompaniesAs(APPLE_JANE_ADMIN_ACCESS_TOKEN);
    const outOfScope = response.body.data.companies.edges.find(
      (edge: { node: { id: string } }) => edge.node.id === outOfScopeCompanyId,
    );

    jestExpectToBeDefined(outOfScope);
    expect(outOfScope.node.name).toBe('RecordScoping Out Of Scope Co');
  });

  it('allows UPDATEs of in-scope records for the scoped role', async () => {
    const response = await makeGraphqlApiRequest(
      updateOneOperationFactory({
        objectMetadataSingularName: 'company',
        gqlFields: COMPANY_GQL_FIELDS,
        recordId: inScopeCompanyId,
        data: { name: 'RecordScoping In Scope Co (edited)' },
      }),
      APPLE_JONY_MEMBER_ACCESS_TOKEN,
    );

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.updateCompany.name).toBe(
      'RecordScoping In Scope Co (edited)',
    );
  });

  it('applies member-relative scoping (ownerId = me) for the scoped role', async () => {
    const response = await findTestOpportunitiesAs(
      APPLE_JONY_MEMBER_ACCESS_TOKEN,
    );

    expect(response.body.errors).toBeUndefined();
    expect(namesFromOpportunitiesResponse(response)).toEqual([
      'RecordScoping Owned By Scoped Member',
    ]);
  });

  it('leaves an unscoped role (admin) able to read opportunities of any owner', async () => {
    const response = await findTestOpportunitiesAs(
      APPLE_JANE_ADMIN_ACCESS_TOKEN,
    );

    expect(response.body.errors).toBeUndefined();
    expect(namesFromOpportunitiesResponse(response)).toEqual([
      'RecordScoping Owned By Other Member',
      'RecordScoping Owned By Scoped Member',
    ]);
  });
  it('scopes people through their company (related records)', async () => {
    const findPeopleAs = (token: string) =>
      makeGraphqlApiRequest(
        findManyOperationFactory({
          objectMetadataSingularName: 'person',
          objectMetadataPluralName: 'people',
          gqlFields: 'id name { firstName }',
          filter: { id: { in: testPersonIds } },
          first: 10,
        }),
        token,
      );
    const firstNames = (response: {
      body: {
        data: {
          people: { edges: { node: { name: { firstName: string } } }[] };
        };
      };
    }) =>
      response.body.data.people.edges
        .map((edge) => edge.node.name.firstName)
        .sort((a, b) => a.localeCompare(b));

    const scoped = await findPeopleAs(APPLE_JONY_MEMBER_ACCESS_TOKEN);

    expect(scoped.body.errors).toBeUndefined();
    expect(firstNames(scoped)).toEqual(['RecordScopingInScope']);
    expect(
      firstNames(await findPeopleAs(APPLE_JANE_ADMIN_ACCESS_TOKEN)),
    ).toEqual(['RecordScopingInScope', 'RecordScopingOutOfScope']);
  });

  it('lists the role rules through the metadata API', async () => {
    const response = await findRecordScopingRules(customRoleId);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.recordScopingRules).toHaveLength(3);
    expect(response.body.data.recordScopingRules[0]).toMatchObject({
      roleId: customRoleId,
      objectMetadataId: companyObjectMetadataId,
      logicalOperator: 'AND',
      conditions: [
        {
          column: 'employees',
          operator: 'eq',
          staticValue: 42,
          currentWorkspaceMemberField: null,
        },
      ],
    });
  });

  it('refuses rule edits from a member without the Roles permission', async () => {
    const response = await upsertRecordScopingRule(
      {
        roleId: customRoleId,
        objectMetadataId: companyObjectMetadataId,
        logicalOperator: 'AND',
        conditions: [{ column: 'employees', operator: 'eq', staticValue: 7 }],
      },
      APPLE_JONY_MEMBER_ACCESS_TOKEN,
    );

    expect(response.body.errors?.[0]?.extensions?.code).toBe('FORBIDDEN');
  });

  it('rejects a rule on a column it cannot enforce', async () => {
    const response = await upsertRecordScopingRule({
      roleId: customRoleId,
      objectMetadataId: companyObjectMetadataId,
      logicalOperator: 'AND',
      conditions: [{ column: 'address', operator: 'eq', staticValue: 'x' }],
    });

    expect(response.body.errors?.[0]?.extensions?.code).toBe('BAD_USER_INPUT');
  });

  it('lifts the scope as soon as the rule is deleted', async () => {
    const deleteResponse = await deleteRecordScopingRule({
      roleId: customRoleId,
      objectMetadataId: companyObjectMetadataId,
    });

    expect(deleteResponse.body.errors).toBeUndefined();

    const response = await findTestCompaniesAs(APPLE_JONY_MEMBER_ACCESS_TOKEN);

    expect(namesFromCompaniesResponse(response)).toEqual([
      'RecordScoping In Scope Co (edited)',
      'RecordScoping Out Of Scope Co',
    ]);
  });

  it('keeps records that matching related records point back at', async () => {
    const upsertResponse = await upsertRecordScopingRule({
      roleId: customRoleId,
      objectMetadataId: companyObjectMetadataId,
      logicalOperator: 'AND',
      conditions: [
        {
          column: 'id',
          operator: 'in',
          relatedRecords: {
            objectMetadataId: opportunityObjectMetadataId,
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
      ],
    });

    expect(upsertResponse.body.errors).toBeUndefined();

    const scoped = await findTestCompaniesAs(APPLE_JONY_MEMBER_ACCESS_TOKEN);

    expect(scoped.body.errors).toBeUndefined();
    expect(namesFromCompaniesResponse(scoped)).toEqual([
      'RecordScoping In Scope Co (edited)',
    ]);
    expect(
      namesFromCompaniesResponse(
        await findTestCompaniesAs(APPLE_JANE_ADMIN_ACCESS_TOKEN),
      ),
    ).toEqual([
      'RecordScoping In Scope Co (edited)',
      'RecordScoping Out Of Scope Co',
    ]);
  });

  it('rejects related records pointing back through a column that does not point here', async () => {
    const response = await upsertRecordScopingRule({
      roleId: customRoleId,
      objectMetadataId: companyObjectMetadataId,
      logicalOperator: 'AND',
      conditions: [
        {
          column: 'id',
          operator: 'in',
          relatedRecords: {
            objectMetadataId: opportunityObjectMetadataId,
            matchColumn: 'ownerId',
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
      ],
    });

    expect(response.body.errors?.[0]?.extensions?.code).toBe('BAD_USER_INPUT');
  });

  describe('email lists', () => {
    const primaryMatchId = randomUUID();
    const additionalMatchId = randomUUID();
    const noMatchId = randomUUID();
    let personObjectMetadataId: string;

    const meByEmail = {
      column: 'emails',
      operator: 'eq',
      currentWorkspaceMemberField: 'userEmail',
    };

    const findPeopleAs = (token: string) =>
      makeGraphqlApiRequest(
        findManyOperationFactory({
          objectMetadataSingularName: 'person',
          objectMetadataPluralName: 'people',
          gqlFields: 'id name { firstName }',
          filter: {
            id: { in: [primaryMatchId, additionalMatchId, noMatchId] },
          },
          first: 10,
        }),
        token,
      );

    const firstNames = (response: {
      body: {
        data: {
          people: { edges: { node: { name: { firstName: string } } }[] };
        };
      };
    }) =>
      response.body.data.people.edges
        .map((edge) => edge.node.name.firstName)
        .sort((a, b) => a.localeCompare(b));

    beforeAll(async () => {
      const { objects } = await findManyObjectMetadata({
        input: { filter: {}, paging: { first: 1000 } },
        gqlFields: 'id nameSingular',
        expectToFail: false,
      });
      const personObject = objects.find(
        (item) => item.nameSingular === 'person',
      );

      jestExpectToBeDefined(personObject);
      personObjectMetadataId = personObject.id;

      const people = [
        {
          id: primaryMatchId,
          firstName: 'RecordScopingEmailPrimary',
          emails: {
            primaryEmail: 'Jony.Ive@Apple.dev',
            additionalEmails: [],
          },
        },
        {
          id: additionalMatchId,
          firstName: 'RecordScopingEmailAdditional',
          emails: {
            primaryEmail: 'someone.else@apple.dev',
            additionalEmails: ['other@apple.dev', 'JONY.IVE@apple.dev'],
          },
        },
        {
          id: noMatchId,
          firstName: 'RecordScopingEmailNone',
          emails: {
            primaryEmail: 'phil.schiler@apple.dev',
            additionalEmails: ['jony.ive@apple.dev.example'],
          },
        },
      ];

      for (const { id, firstName, emails } of people) {
        emailPersonIds.push(id);

        const response = await makeGraphqlApiRequest(
          createOneOperationFactory({
            objectMetadataSingularName: 'person',
            gqlFields: 'id',
            data: { id, emails, name: { firstName, lastName: 'Person' } },
          }),
        );

        expect(response.body.errors).toBeUndefined();
      }
    });

    it('keeps records listing the member email as primary or additional', async () => {
      const upsertResponse = await upsertRecordScopingRule({
        roleId: customRoleId,
        objectMetadataId: personObjectMetadataId,
        logicalOperator: 'AND',
        conditions: [meByEmail],
      });

      expect(upsertResponse.body.errors).toBeUndefined();

      const scoped = await findPeopleAs(APPLE_JONY_MEMBER_ACCESS_TOKEN);

      expect(scoped.body.errors).toBeUndefined();
      expect(firstNames(scoped)).toEqual([
        'RecordScopingEmailAdditional',
        'RecordScopingEmailPrimary',
      ]);
      expect(
        firstNames(await findPeopleAs(APPLE_JANE_ADMIN_ACCESS_TOKEN)),
      ).toEqual([
        'RecordScopingEmailAdditional',
        'RecordScopingEmailNone',
        'RecordScopingEmailPrimary',
      ]);
    });

    it('matches the member email from inside related records', async () => {
      for (const [opportunityId, pointOfContactId] of [
        [ownedByOtherMemberOpportunityId, primaryMatchId],
        [ownedByScopedMemberOpportunityId, noMatchId],
      ]) {
        const response = await makeGraphqlApiRequest(
          updateOneOperationFactory({
            objectMetadataSingularName: 'opportunity',
            gqlFields: 'id',
            recordId: opportunityId,
            data: { pointOfContactId },
          }),
        );

        expect(response.body.errors).toBeUndefined();
      }

      const upsertResponse = await upsertRecordScopingRule({
        roleId: customRoleId,
        objectMetadataId: opportunityObjectMetadataId,
        logicalOperator: 'AND',
        conditions: [
          {
            column: 'pointOfContactId',
            operator: 'in',
            relatedRecords: {
              objectMetadataId: personObjectMetadataId,
              logicalOperator: 'AND',
              conditions: [meByEmail],
            },
          },
        ],
      });

      expect(upsertResponse.body.errors).toBeUndefined();

      const scoped = await findTestOpportunitiesAs(
        APPLE_JONY_MEMBER_ACCESS_TOKEN,
      );

      expect(scoped.body.errors).toBeUndefined();
      expect(namesFromOpportunitiesResponse(scoped)).toEqual([
        'RecordScoping Owned By Other Member',
      ]);
    });

    it.each([
      [
        'a static value',
        { column: 'emails', operator: 'eq', staticValue: 'jony.ive@apple.dev' },
      ],
      ['"is not"', { ...meByEmail, operator: 'neq' }],
    ])('rejects an email list compared with %s', async (_label, condition) => {
      const response = await upsertRecordScopingRule({
        roleId: customRoleId,
        objectMetadataId: personObjectMetadataId,
        logicalOperator: 'AND',
        conditions: [condition],
      });

      expect(response.body.errors?.[0]?.extensions?.code).toBe(
        'BAD_USER_INPUT',
      );
    });
  });
});
