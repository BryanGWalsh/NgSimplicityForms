import { test, expect } from '@playwright/test';

// End-to-end checks for the fixes in 1.1.4 (form array removal, error display, accessibility, select values).
test.describe('NG-Simplicity Forms Bootstrap Demo regressions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByLabel('First Name')).toBeVisible();
  });

  test('Delete removes its own row after an earlier row was removed, and keeps focus in the list', async ({ page }) => {
    const add = page.getByRole('button', { name: /Add Additional Contact/ });
    await add.click();
    await add.click();
    const names = page.getByLabel('Contact Name');
    await expect(names).toHaveCount(3);
    await names.nth(0).fill('Ann');
    await names.nth(1).fill('Ben');
    await names.nth(2).fill('Cal');

    // Each row's button has its own accessible name.
    await expect(page.getByRole('button', { name: 'Delete item 3' })).toBeVisible();

    await page.getByRole('button', { name: 'Delete item 1' }).click();
    await expect(names).toHaveCount(2);
    await expect(names.nth(0)).toHaveValue('Ben');
    // Focus moves to the Delete button of the row that took the removed row's place.
    await expect(page.getByRole('button', { name: 'Delete item 1' })).toBeFocused();

    // The row now first (Ben) must remove itself, not the row after it.
    await page.getByRole('button', { name: 'Delete item 1' }).click();
    await expect(names).toHaveCount(1);
    await expect(names.nth(0)).toHaveValue('Cal');
    await expect(page.locator('pre')).toContainText('"contactName": "Cal"');
    await expect(page.locator('pre')).not.toContainText('"contactName": "Ben"');
  });

  test('shows a required error once the field is blurred, without typing', async ({ page }) => {
    await page.getByLabel('First Name').focus();
    await page.getByLabel('Last Name').focus();
    await expect(page.getByText('First name is highly recommended and required.')).toBeVisible();
  });

  test('exposes invalid and required state to assistive technology and announces errors', async ({ page }) => {
    await page.getByRole('button', { name: /Submit Form/ }).click();
    const firstName = page.getByLabel('First Name');
    const error = page.getByText('First name is highly recommended and required.');
    await expect(error).toBeVisible();
    await expect(firstName).toHaveAttribute('aria-invalid', 'true');
    await expect(firstName).toHaveAttribute('aria-required', 'true');
    await expect(error.locator('xpath=ancestor-or-self::*[@aria-live][1]')).toHaveCount(1);
  });

  test('radios in a group share one name', async ({ page }) => {
    const radios = page.getByRole('radio');
    await expect(radios).toHaveCount(3);
    const names = await radios.evaluateAll((els) => els.map((el) => (el as HTMLInputElement).name));
    expect(names[0]).toBeTruthy();
    expect(new Set(names).size).toBe(1);
  });

  test('sections are headings and named groups', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '1. Personal Profile', level: 3 })).toBeVisible();
    await expect(page.getByRole('group', { name: '4. Emergency Contacts' })).toBeVisible();
  });

  test('a select writes the chosen option id to the form value', async ({ page }) => {
    await page.getByLabel('Yes, sign me up for the weekly digest newsletter').check();
    await page.getByLabel('Delivery Frequency').selectOption({ label: 'Weekly (Every Friday)' });
    await expect(page.locator('pre')).toContainText('"frequency": "weekly"');
  });
});
