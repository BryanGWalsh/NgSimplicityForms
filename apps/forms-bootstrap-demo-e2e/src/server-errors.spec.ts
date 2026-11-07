import { test, expect } from '@playwright/test';

test.describe('NG-Simplicity Forms Bootstrap Demo server errors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByLabel('First Name')).toBeVisible();
    await page.getByRole('button', { name: /Load Sample Data/ }).click();
    await expect(page.getByLabel('Contact Name')).toHaveValue('John Doe');
  });

  test('shows mapped and plain-text server errors and clears each when its field changes', async ({ page }) => {
    await page.getByRole('button', { name: /Simulate Server Errors/ }).click();

    const firstNameError = page.getByText('That first name is already registered.');
    const phoneError = page.getByText('The server could not reach this number.');
    await expect(firstNameError).toBeVisible();
    await expect(phoneError).toBeVisible();
    await expect(page.getByLabel('First Name')).toHaveAttribute('aria-invalid', 'true');

    await page.getByLabel('First Name').fill('Janet');
    await expect(firstNameError).toBeHidden();
    await expect(phoneError).toBeVisible();

    await page.getByLabel('Contact Phone').fill('555-000-0000');
    await expect(phoneError).toBeHidden();
    await expect(page.getByLabel('First Name')).not.toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByLabel('Contact Phone')).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('adding a contact row clears the server errors', async ({ page }) => {
    await page.getByRole('button', { name: /Simulate Server Errors/ }).click();
    await expect(page.getByText('The server could not reach this number.')).toBeVisible();
    await page.getByRole('button', { name: /Add Additional Contact/ }).click();
    await expect(page.getByText('The server could not reach this number.')).toBeHidden();
    await expect(page.getByText('That first name is already registered.')).toBeHidden();
  });
});
