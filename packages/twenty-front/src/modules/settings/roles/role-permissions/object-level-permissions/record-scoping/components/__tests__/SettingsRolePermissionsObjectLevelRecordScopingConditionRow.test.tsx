import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStore, Provider } from 'jotai';

import { SettingsRolePermissionsObjectLevelRecordScopingConditionRow } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/components/SettingsRolePermissionsObjectLevelRecordScopingConditionRow';
import { type RecordScopingColumnOption } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingColumnOption';
import { type RecordScopingConditionDraft } from '@/settings/roles/role-permissions/object-level-permissions/record-scoping/types/RecordScopingConditionDraft';

const COLUMNS: RecordScopingColumnOption[] = [
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

const renderRow = (conditionDraft: RecordScopingConditionDraft) => {
  const onChange = jest.fn();
  const onRemove = jest.fn();

  render(
    <Provider store={createStore()}>
      <I18nProvider i18n={i18n}>
        <SettingsRolePermissionsObjectLevelRecordScopingConditionRow
          draft={conditionDraft}
          columns={COLUMNS}
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
});
