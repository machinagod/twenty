import { type MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStore, Provider } from 'jotai';
import { FieldMetadataType, RelationType } from 'twenty-shared/types';

import { SettingsRolePermissionsObjectLevelRecordScopingSection } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/components/SettingsRolePermissionsObjectLevelRecordScopingSection';
import { settingsPersistedRoleFamilyState } from '@/settings/roles/states/settingsPersistedRoleFamilyState';
import {
  DeleteRecordScopingRuleDocument,
  FindRecordScopingRulesDocument,
  UpsertRecordScopingRuleDocument,
} from '~/generated-metadata/graphql';

const enqueueToast = jest.fn();

jest.mock('twenty-ui/components', () => ({
  ...jest.requireActual('twenty-ui/components'),
  useToast: () => ({ enqueueToast }),
}));

const ROLE_ID = 'role-id';
const OBJECT_ID = 'opportunity-id';

const objectMetadataItem = {
  id: OBJECT_ID,
  fields: [
    {
      id: 'owner',
      name: 'owner',
      label: 'Owner',
      type: FieldMetadataType.RELATION,
      isActive: true,
      isSystem: false,
      relation: {
        type: RelationType.MANY_TO_ONE,
        targetObjectMetadata: {
          id: 'wm',
          nameSingular: 'workspaceMember',
          namePlural: 'workspaceMembers',
        },
      },
    },
    {
      id: 'name',
      name: 'name',
      label: 'Name',
      type: FieldMetadataType.TEXT,
      isActive: true,
      isSystem: false,
    },
  ],
} as never;

const ownerIsMe = {
  __typename: 'RecordScopingCondition' as const,
  column: 'ownerId',
  operator: 'eq',
  staticValue: null,
  currentWorkspaceMemberField: 'id',
};

const savedRule = {
  __typename: 'RecordScopingRule' as const,
  id: 'rule-id',
  roleId: ROLE_ID,
  objectMetadataId: OBJECT_ID,
  logicalOperator: 'AND',
  conditions: [ownerIsMe],
};

const rulesQuery = (rules: (typeof savedRule)[]): MockedResponse => ({
  request: {
    query: FindRecordScopingRulesDocument,
    variables: { roleId: ROLE_ID },
  },
  result: { data: { recordScopingRules: rules } },
});

const renderSection = ({
  isRoleSaved = true,
  mocks = [],
}: {
  isRoleSaved?: boolean;
  mocks?: MockedResponse[];
}) => {
  const store = createStore();

  if (isRoleSaved) {
    store.set(settingsPersistedRoleFamilyState.atomFamily(ROLE_ID), {
      id: ROLE_ID,
      label: 'Comercial',
    } as never);
  }

  return render(
    <Provider store={store}>
      <MockedProvider mocks={mocks}>
        <I18nProvider i18n={i18n}>
          <SettingsRolePermissionsObjectLevelRecordScopingSection
            objectMetadataItem={objectMetadataItem}
            roleId={ROLE_ID}
          />
        </I18nProvider>
      </MockedProvider>
    </Provider>,
  );
};

beforeEach(() => jest.clearAllMocks());

it('asks to save a new role before adding rules', () => {
  renderSection({ isRoleSaved: false });

  expect(
    screen.getByText('Save the role before adding record-level rules.'),
  ).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Add condition' })).toBeNull();
});

it('adds an "owner is me" condition and saves it', async () => {
  const upsert = jest.fn(() => ({
    data: { upsertRecordScopingRule: savedRule },
  }));

  renderSection({
    mocks: [
      rulesQuery([]),
      {
        request: {
          query: UpsertRecordScopingRuleDocument,
          variables: {
            input: {
              roleId: ROLE_ID,
              objectMetadataId: OBJECT_ID,
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
        },
        result: upsert,
      },
      rulesQuery([savedRule]),
    ],
  });

  expect(
    await screen.findByText(
      'No record-level rule: this role sees every record it can read.',
    ),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save rule' })).toBeDisabled();

  await userEvent.click(screen.getByRole('button', { name: 'Add condition' }));

  expect(screen.getByText('Owner')).toBeInTheDocument();
  expect(screen.getByText('Me')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Save rule' }));

  await waitFor(() => expect(upsert).toHaveBeenCalled());
  expect(enqueueToast).toHaveBeenCalledWith({
    variant: 'success',
    children: 'Record-level rule saved',
  });
});

it('removes a condition back to the empty state', async () => {
  renderSection({ mocks: [rulesQuery([])] });

  await userEvent.click(
    await screen.findByRole('button', { name: 'Add condition' }),
  );
  await userEvent.click(
    screen.getByRole('button', { name: 'Remove condition' }),
  );

  expect(
    screen.getByText(
      'No record-level rule: this role sees every record it can read.',
    ),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save rule' })).toBeDisabled();
});

it('shows the saved rule and removes it', async () => {
  const remove = jest.fn(() => ({
    data: {
      deleteRecordScopingRule: {
        __typename: 'RecordScopingRule',
        id: 'rule-id',
      },
    },
  }));

  renderSection({
    mocks: [
      rulesQuery([savedRule]),
      {
        request: {
          query: DeleteRecordScopingRuleDocument,
          variables: {
            input: { roleId: ROLE_ID, objectMetadataId: OBJECT_ID },
          },
        },
        result: remove,
      },
      rulesQuery([]),
    ],
  });

  expect(await screen.findByText('Owner')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save rule' })).toBeDisabled();

  await userEvent.click(screen.getByRole('button', { name: 'Remove rule' }));

  await waitFor(() => expect(remove).toHaveBeenCalled());
  expect(enqueueToast).toHaveBeenCalledWith({
    variant: 'success',
    children: 'Record-level rule removed',
  });
});

it('reports a failed save', async () => {
  renderSection({
    mocks: [
      rulesQuery([]),
      {
        request: {
          query: UpsertRecordScopingRuleDocument,
          variables: {
            input: {
              roleId: ROLE_ID,
              objectMetadataId: OBJECT_ID,
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
        },
        error: new Error('boom'),
      },
    ],
  });

  await userEvent.click(
    await screen.findByRole('button', { name: 'Add condition' }),
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save rule' }));

  await waitFor(() =>
    expect(enqueueToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'error' }),
    ),
  );
});

it('saves two conditions matched with OR', async () => {
  const upsert = jest.fn(() => ({
    data: { upsertRecordScopingRule: savedRule },
  }));

  renderSection({
    mocks: [
      rulesQuery([savedRule]),
      {
        request: {
          query: UpsertRecordScopingRuleDocument,
          variables: {
            input: {
              roleId: ROLE_ID,
              objectMetadataId: OBJECT_ID,
              logicalOperator: 'OR',
              conditions: [
                {
                  column: 'ownerId',
                  operator: 'eq',
                  currentWorkspaceMemberField: 'id',
                },
                {
                  column: 'ownerId',
                  operator: 'neq',
                  currentWorkspaceMemberField: 'id',
                },
              ],
            },
          },
        },
        result: upsert,
      },
      rulesQuery([savedRule]),
    ],
  });

  await userEvent.click(
    await screen.findByRole('button', { name: 'Add condition' }),
  );
  const operatorSelects = screen.getAllByText('Is');
  await userEvent.click(operatorSelects[1]);
  await userEvent.click(await screen.findByText('Is not'));
  await userEvent.click(screen.getByText('Match all conditions'));
  await userEvent.click(await screen.findByText('Match any condition'));
  await userEvent.click(screen.getByRole('button', { name: 'Save rule' }));

  await waitFor(() => expect(upsert).toHaveBeenCalled());
});

it('reports a failed removal', async () => {
  renderSection({
    mocks: [
      rulesQuery([savedRule]),
      {
        request: {
          query: DeleteRecordScopingRuleDocument,
          variables: {
            input: { roleId: ROLE_ID, objectMetadataId: OBJECT_ID },
          },
        },
        error: new Error('boom'),
      },
    ],
  });

  await userEvent.click(
    await screen.findByRole('button', { name: 'Remove rule' }),
  );

  await waitFor(() =>
    expect(enqueueToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'error' }),
    ),
  );
});
