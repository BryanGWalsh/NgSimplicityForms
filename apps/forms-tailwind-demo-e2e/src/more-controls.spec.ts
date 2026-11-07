import { test, expect, Page } from '@playwright/test';

// The toggle, button group, range and typeahead controls added in the Tailwind package.
async function formValue(page: Page) {
  const text = await page.locator('pre').first().textContent();
  return JSON.parse(text ?? '{}').demoForm;
}

test.describe('NG-Simplicity Forms Tailwind Demo more controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByLabel('First Name')).toBeVisible();
    await page.getByRole('heading', { name: '5. More Controls' }).scrollIntoViewIfNeeded();
  });

  test('toggle switch sets a boolean', async ({ page }) => {
    const toggle = page.getByRole('switch', { name: 'Send me product updates' });
    await expect(toggle).not.toBeChecked();
    await page.getByText('Send me product updates').click();
    await expect(toggle).toBeChecked();
    await expect.poll(async () => (await formValue(page)).productUpdates).toBe(true);
  });

  test('single choice button group is required and stores the option id', async ({ page }) => {
    await page.getByRole('button', { name: /Submit/ }).click();
    await expect(page.getByText('Choose a plan.')).toBeVisible();
    await page.getByText('Pro', { exact: true }).click();
    await expect(page.getByText('Choose a plan.')).toBeHidden();
    await expect.poll(async () => (await formValue(page)).plan).toBe('pro');
    await page.getByText('Enterprise', { exact: true }).click();
    await expect.poll(async () => (await formValue(page)).plan).toBe('enterprise');
  });

  test('multiple choice button group stores the chosen ids', async ({ page }) => {
    await page.getByText('Design', { exact: true }).click();
    await page.getByText('Frontend', { exact: true }).click();
    await expect.poll(async () => (await formValue(page)).interests).toEqual(['frontend', 'design']);
    await page.getByText('Design', { exact: true }).click();
    await expect.poll(async () => (await formValue(page)).interests).toEqual(['frontend']);
  });

  test('range slider stores a number and shows it', async ({ page }) => {
    await expect.poll(async () => (await formValue(page)).experience).toBe(0);
    await page.getByLabel('Years of Experience').fill('12');
    await expect.poll(async () => (await formValue(page)).experience).toBe(12);
    await expect(page.locator('output').filter({ hasText: '12 yrs' })).toBeVisible();
  });

  test('typeahead offers the suggestions and keeps the typed text', async ({ page }) => {
    const city = page.getByLabel('City');
    const list = page.locator(`datalist[id="${await city.getAttribute('list')}"]`);
    await expect(list.locator('option')).toHaveCount(8);
    await city.fill('Lisbon');
    await expect.poll(async () => (await formValue(page)).city).toBe('Lisbon');
  });
});
