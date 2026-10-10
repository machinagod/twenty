import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStore, Provider } from 'jotai';

import { SettingsRolePermissionsObjectLevelRecordScopingConditionRow } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/components/SettingsRolePermissionsObjectLevelRecordScopingConditionRow';
import { type RecordScopingColumnOption } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingColumnOption';
import { type RecordScopingConditionDraft } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingConditionDraft';

const COMPANY_COLUMNS: RecordScopingColumnOption[] = [
  {
    column: 'accountOwnerId',
    label: 'Account owner',
    valueKind: 'WORKSPACE_MEMBER',
  },
];

const COLUMNS: RecordScopingColumnOption[] = [
  {
    column: 'companyId',
    label: 'Company',
    valueKind: 'UUID',
    targetObjectMetadataId: 'company-id',
  },
  { column: 'ownerId', label: 'Owner', valueKind: 'WORKSPACE_MEMBER' },
  { column: 'city', label: 'City', valueKind: 'TEXT' },
  { column: 'employees', label: 'Employees', valueKind: 'NUMBER' },
  { column: 'isClient', label: 'Client', valueKind: 'BOOLEAN' },
  {
    column: 'stage',
    label: 'Stage',
    valueKind: 'SELECT',
    selectOptions: [
      { value: 'NEW', label: 'New' },
      { value: 'WON', label: 'Won' },
    ],
  },
];

const draft = (
  overrides: Partial<RecordScopingConditionDraft>,
): RecordScopingConditionDraft => ({
  key: 'key-1',
  column: 'city',
  operator: 'eq',
  valueSource: 'STATIC',
  staticValue: '',
  ...overrides,
});

const renderRow = (conditionDraft: RecordScopingConditionDraft, depth = 0) => {
  const onChange = jest.fn();
  const onRemove = jest.fn();

  render(
    <Provider store={createStore()}>
      <I18nProvider i18n={i18n}>
        <SettingsRolePermissionsObjectLevelRecordScopingConditionRow
          draft={conditionDraft}
          columns={COLUMNS}
          getColumns={(objectMetadataId) =>
            objectMetadataId === 'company-id' ? COMPANY_COLUMNS : undefined
          }
          getObjectLabel={() => 'Companies'}
          depth={depth}
          instanceId="row"
          onChange={onChange}
          onRemove={onRemove}
        />
      </I18nProvider>
    </Provider>,
  );

  return { onChange, onRemove };
};

describe('SettingsRolePermissionsObjectLevelRecordScopingConditionRow', () => {
  it('lets a text column compare to a typed value', async () => {
    const { onChange } = renderRow(draft({}));

    expect(screen.getByText('Value')).toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText('Enter value'), 'L');

    expect(onChange).toHaveBeenLastCalledWith(draft({ staticValue: 'L' }));
  });

  it('switches a text column to the signed-in member email', async () => {
    const { onChange } = renderRow(draft({}));

    await userEvent.click(screen.getByText('Value'));
    await userEvent.click(await screen.findByText('My email'));

    expect(onChange).toHaveBeenLastCalledWith(
      draft({ valueSource: 'CURRENT_MEMBER' }),
    );
  });

  it('hides the text input while comparing to the member email', () => {
    renderRow(draft({ valueSource: 'CURRENT_MEMBER' }));

    expect(screen.getByText('My email')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter value')).toBeNull();
  });

  it('asks for a list with "is any of"', () => {
    renderRow(draft({ column: 'employees', operator: 'in' }));

    expect(screen.getByText('Is any of')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Comma-separated values'),
    ).toBeInTheDocument();
  });

  it('picks a select option', async () => {
    const { onChange } = renderRow(
      draft({ column: 'stage', staticValue: 'NEW' }),
    );

    await userEvent.click(screen.getByText('New'));
    await userEvent.click(await screen.findByText('Won'));

    expect(onChange).toHaveBeenLastCalledWith(
      draft({ column: 'stage', staticValue: 'WON' }),
    );
  });

  it('shows booleans as true or false', () => {
    renderRow(draft({ column: 'isClient', staticValue: 'false' }));

    expect(screen.getByText('False')).toBeInTheDocument();
  });

  it('always compares member columns to the signed-in member', () => {
    renderRow(draft({ column: 'ownerId', valueSource: 'CURRENT_MEMBER' }));

    expect(screen.getByText('Me')).toBeInTheDocument();
  });

  it('resets the value when the column changes', async () => {
    const { onChange } = renderRow(draft({ staticValue: 'Lisboa' }));

    await userEvent.click(screen.getByText('City'));
    await userEvent.click(await screen.findByText('Stage'));

    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        key: 'key-1',
        column: 'stage',
        operator: 'eq',
        valueSource: 'STATIC',
        staticValue: 'NEW',
      }),
    );
  });

  it('drops the member value when switching to "is any of"', async () => {
    const { onChange } = renderRow(draft({ valueSource: 'CURRENT_MEMBER' }));

    await userEvent.click(screen.getByText('Is'));
    await userEvent.click(await screen.findByText('Is any of'));

    expect(onChange).toHaveBeenLastCalledWith(
      draft({ operator: 'in', valueSource: 'STATIC' }),
    );
  });

  it('keeps the value source for other operators', async () => {
    const { onChange } = renderRow(draft({ valueSource: 'CURRENT_MEMBER' }));

    await userEvent.click(screen.getByText('Is'));
    await userEvent.click(await screen.findByText('Is not'));

    expect(onChange).toHaveBeenLastCalledWith(
      draft({ operator: 'neq', valueSource: 'CURRENT_MEMBER' }),
    );
  });

  it('renders no value input for a column that no longer exists', () => {
    renderRow(draft({ column: 'deleted' }));

    expect(screen.queryByPlaceholderText('Enter value')).toBeNull();
  });

  it('removes the condition', async () => {
    const { onRemove } = renderRow(draft({}));

    await userEvent.click(
      screen.getByRole('button', { name: 'Remove condition' }),
    );

    expect(onRemove).toHaveBeenCalled();
  });
  it('switches a relation to matching related records', async () => {
    const { onChange } = renderRow(draft({ column: 'companyId' }));

    await userEvent.click(screen.getByText('Value'));
    await userEvent.click(await screen.findByText('Matching records'));

    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        valueSource: 'RELATED',
        operator: 'in',
        related: expect.objectContaining({
          objectMetadataId: 'company-id',
          conditions: [expect.objectContaining({ column: 'accountOwnerId' })],
        }),
      }),
    );
  });

  const relatedDraft = draft({
    column: 'companyId',
    operator: 'in',
    valueSource: 'RELATED',
    related: {
      objectMetadataId: 'company-id',
      logicalOperator: 'AND',
      conditions: [
        draft({
          key: 'nested',
          column: 'accountOwnerId',
          valueSource: 'CURRENT_MEMBER',
        }),
      ],
    },
  });

  it('shows the related records conditions under the row', () => {
    renderRow(relatedDraft);

    expect(screen.getByText('Companies matching')).toBeInTheDocument();
    expect(screen.getByText('Account owner')).toBeInTheDocument();
    expect(screen.getByText('Me')).toBeInTheDocument();
  });

  it('edits and leaves related records', async () => {
    const { onChange } = renderRow(relatedDraft);

    await userEvent.click(
      screen.getAllByRole('button', { name: 'Remove condition' })[1],
    );
    expect(onChange).toHaveBeenLastCalledWith({
      ...relatedDraft,
      related: { ...relatedDraft.related, conditions: [] },
    });

    await userEvent.click(
      screen.getAllByRole('button', { name: 'Add condition' })[0],
    );
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        related: expect.objectContaining({
          conditions: [
            expect.objectContaining({ key: 'nested' }),
            expect.objectContaining({ column: 'accountOwnerId' }),
          ],
        }),
      }),
    );

    await userEvent.click(screen.getByText('Matching records'));
    await userEvent.click(await screen.findByText('Value'));
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        valueSource: 'STATIC',
        operator: 'eq',
        related: undefined,
      }),
    );
  });

  it('switches the related records to match any condition', async () => {
    const twoConditions = {
      ...relatedDraft,
      related: {
        ...relatedDraft.related!,
        conditions: [
          ...relatedDraft.related!.conditions,
          draft({
            key: 'second',
            column: 'accountOwnerId',
            valueSource: 'CURRENT_MEMBER',
          }),
        ],
      },
    };
    const { onChange } = renderRow(twoConditions);

    await userEvent.click(screen.getByText('Match all conditions'));
    await userEvent.click(await screen.findByText('Match any condition'));

    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        related: expect.objectContaining({ logicalOperator: 'OR' }),
      }),
    );
  });

  it('stops offering related records at the maximum depth', () => {
    renderRow(draft({ column: 'companyId' }), 3);

    expect(screen.queryByText('Value')).toBeNull();
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });
});
