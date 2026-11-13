import { expect, test } from '../lib/fixtures/screenshot';

// Read-only: builds a record-level condition on a role's object permissions and
// leaves without saving, so no rule is ever written.
test('Record-level rule editor on a role object', async ({ page }) => {
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('link', { name: 'Members' }).click();
  await page.getByRole('link', { name: 'Roles', exact: true }).click();
  await page.getByRole('link', { name: 'Member', exact: true }).click();
  await page.getByRole('link', { name: 'Permissions' }).click();
  await page.getByRole('button', { name: 'Add rule' }).click();
  await page.getByText('Opportunities', { exact: true }).click();

  await expect(
    page.getByRole('heading', { name: 'Record-level' }),
  ).toBeVisible();
  await expect(
    page.getByText(
      'No record-level rule: this role sees every record it can read.',
    ),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save rule' })).toBeDisabled();

  await page.getByRole('button', { name: 'Add condition' }).click();

  await expect(page.getByText('Owner', { exact: true }).last()).toBeVisible();
  await expect(page.getByText('Me', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save rule' })).toBeEnabled();

  await page.getByRole('button', { name: 'Remove condition' }).click();

  await expect(page.getByRole('button', { name: 'Save rule' })).toBeDisabled();
});
