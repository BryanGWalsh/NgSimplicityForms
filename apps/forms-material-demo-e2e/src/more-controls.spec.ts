import { test, expect, Page } from '@playwright/test';

// The toggle, button group, range and typeahead controls added in the Material package.
async function formValue(page: Page) {
  const text = await page.locator('pre').first().textContent();
  return JSON.parse(text ?? '{}').materialDemoForm;
}

test.describe('NG-Simplicity Forms Material Demo more controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByLabel('First Name')).toBeVisible();
    await page.getByRole('heading', { name: '5. More Controls' }).scrollIntoViewIfNeeded();
  });

  test('toggle switch sets a boolean', async ({ page }) => {
    const toggle = page.getByRole('switch', { name: 'Send me product updates' });
    await expect(toggle).not.toBeChecked();
    await toggle.click();
    await expect(toggle).toBeChecked();
    await expect.poll(async () => (await formValue(page)).productUpdates).toBe(true);
  });

  test('single choice button group is required and stores the option id', async ({ page }) => {
    await page.getByRole('button', { name: /Submit/ }).click();
    await expect(page.getByText('Choose a plan.')).toBeVisible();
    await page.getByRole('radio', { name: 'Pro' }).click();
    await expect(page.getByText('Choose a plan.')).toBeHidden();
    await expect.poll(async () => (await formValue(page)).plan).toBe('pro');
    await page.getByRole('radio', { name: 'Enterprise' }).click();
    await expect.poll(async () => (await formValue(page)).plan).toBe('enterprise');
  });

  test('multiple choice button group stores the chosen ids', async ({ page }) => {
    await page.getByRole('button', { name: 'Design', exact: true }).click();
    await page.getByRole('button', { name: 'Frontend', exact: true }).click();
    await expect.poll(async () => (await formValue(page)).interests).toEqual(['frontend', 'design']);
    await page.getByRole('button', { name: 'Design', exact: true }).click();
    await expect.poll(async () => (await formValue(page)).interests).toEqual(['frontend']);
  });

  test('range slider stores a number and shows it', async ({ page }) => {
    await expect.poll(async () => (await formValue(page)).experience).toBe(0);
    await page.getByLabel('Years of Experience').fill('12');
    await expect.poll(async () => (await formValue(page)).experience).toBe(12);
    await expect(page.locator('output').filter({ hasText: '12 yrs' })).toBeVisible();
  });

  test('typeahead filters suggestions and writes the chosen one', async ({ page }) => {
    await page.getByLabel('City').fill('bos');
    await expect(page.getByRole('option')).toHaveText(['Boston']);
    await page.getByRole('option', { name: 'Boston' }).click();
    await expect.poll(async () => (await formValue(page)).city).toBe('Boston');
  });

  test('datepicker parses typed dates, opens a calendar and reports min errors', async ({ page }) => {
    const date = page.getByLabel('Available From');
    await date.fill('1/1/2019');
    await date.blur();
    await expect(page.getByText('Choose a date from 2020 onwards.')).toBeVisible();
    await date.fill('3/15/2026');
    await date.blur();
    await expect(page.getByText('Choose a date from 2020 onwards.')).toBeHidden();
    await expect.poll(async () => new Date((await formValue(page)).startDate).getFullYear()).toBe(2026);
    await page.getByRole('button', { name: 'Open calendar' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('chips input adds chips on Enter and removes them', async ({ page }) => {
    const input = page.getByPlaceholder('Type a skill and press Enter');
    await input.fill('Angular');
    await input.press('Enter');
    await input.fill('RxJS');
    await input.press('Enter');
    await expect.poll(async () => (await formValue(page)).skills).toEqual(['Angular', 'RxJS']);
    await page.getByRole('button', { name: 'Remove Angular' }).click();
    await expect.poll(async () => (await formValue(page)).skills).toEqual(['RxJS']);
  });
});
