import { randomUUID } from 'crypto';

import { createOneOperationFactory } from 'test/integration/graphql/utils/create-one-operation-factory.util';
import { destroyOneOperationFactory } from 'test/integration/graphql/utils/destroy-one-operation-factory.util';
import { findManyOperationFactory } from 'test/integration/graphql/utils/find-many-operation-factory.util';
import { makeGraphqlAPIRequest } from 'test/integration/graphql/utils/make-graphql-api-request.util';
import { updateOneOperationFactory } from 'test/integration/graphql/utils/update-one-operation-factory.util';
import { createOneRole } from 'test/integration/metadata/suites/role/utils/create-one-role.util';
import { deleteOneRole } from 'test/integration/metadata/suites/role/utils/delete-one-role.util';
import { findOneRoleByLabel } from 'test/integration/metadata/suites/role/utils/find-one-role-by-label.util';
import { updateWorkspaceMemberRole } from 'test/integration/metadata/suites/role/utils/update-workspace-member-role.util';
import { jestExpectToBeDefined } from 'test/utils/jest-expect-to-be-defined.util.test';

import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

// This suite is paired with the RECORD_SCOPING_RULES entry in .env.test, which
// scopes the `company` object for the role labelled "Record Scoping Test Role" to
// records with `employees = 42`. It proves the clean-room record-scoping feature
// is actually wired into the workspace ORM chokepoint end-to-end — not just that
// the pure utils generate the right SQL (covered by unit tests), but that:
//   1. SELECTs through the real query builder are filtered for a scoped role,
//   2. an unscoped role (admin) still sees everything (scoping is role-specific,
//      so a regression here can't be masked as "everything is hidden"),
//   3. UPDATEs are filtered too — out-of-scope writes fail closed, in-scope
//      writes go through.
//   4. member-relative scoping (ownerId = me) works on the `opportunity` object —
//      this mirrors the exact rule shape running in production, so the test
//      guards the real mechanism, not just a static-value stand-in.
// This is the regression net that survives upstream syncs: if a future upstream
// refactor of the query builders drops the applyRecordScoping() call, this fails.
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

  const findTestCompaniesAs = (token: string) =>
    makeGraphqlAPIRequest(
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
    makeGraphqlAPIRequest(
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

    await updateWorkspaceMemberRole({
      input: {
        roleId: customRoleId,
        workspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.JONY,
      },
      expectToFail: false,
    });

    // Seeded as admin (the default identity) so the rows exist regardless of
    // scoping; the scoped member should then only ever see the in-scope one.
    await makeGraphqlAPIRequest(
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

    await makeGraphqlAPIRequest(
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

    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'opportunity',
        gqlFields: OPPORTUNITY_GQL_FIELDS,
        data: {
          id: ownedByScopedMemberOpportunityId,
          name: 'RecordScoping Owned By Scoped Member',
          ownerId: WORKSPACE_MEMBER_DATA_SEED_IDS.JONY,
        },
      }),
    );

    await makeGraphqlAPIRequest(
      createOneOperationFactory({
        objectMetadataSingularName: 'opportunity',
        gqlFields: OPPORTUNITY_GQL_FIELDS,
        data: {
          id: ownedByOtherMemberOpportunityId,
          name: 'RecordScoping Owned By Other Member',
          ownerId: WORKSPACE_MEMBER_DATA_SEED_IDS.PHIL,
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
      await makeGraphqlAPIRequest(
        destroyOneOperationFactory({
          objectMetadataSingularName: 'company',
          gqlFields: 'id',
          recordId: id,
        }),
      );
    }

    for (const id of testOpportunityIds) {
      await makeGraphqlAPIRequest(
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
    await makeGraphqlAPIRequest(
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
    const response = await makeGraphqlAPIRequest(
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
});
