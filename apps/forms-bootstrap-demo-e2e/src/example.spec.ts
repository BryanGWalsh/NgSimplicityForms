import { test, expect } from '@playwright/test';

test.describe('NG-Simplicity Forms Bootstrap Demo E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER EXCEPTION:', err.message));
    // Navigate to the bootstrap demo page
    await page.goto('/');
  });

  test('should render form structure, section titles, and initial components', async ({ page }) => {
    // Verify Page Title / Hero header is present
    await expect(page.locator('h1')).toContainText('NG-Simplicity Forms Bootstrap');

    // Verify Section Titles are rendered
    await expect(page.getByText('1. Personal Profile')).toBeVisible();
    await expect(page.getByText('2. Preferences & Contact Details')).toBeVisible();
    await expect(page.getByText('3. Newsletter Subscriptions')).toBeVisible();
    await expect(page.getByText('4. Emergency Contacts')).toBeVisible();

    // Verify standard controls (without visible$ conditions) are rendered initially
    await expect(page.getByLabel('First Name')).toBeVisible();
    await expect(page.getByLabel('Last Name')).toBeVisible();
    await expect(page.getByLabel('Biography / About Me')).toBeVisible();
    await expect(page.getByLabel('Preferred Contact Method')).toBeVisible();
    await expect(page.getByLabel('Yes, sign me up for the weekly digest newsletter')).toBeVisible();
  });

  test('should dynamically toggle visibility of contact preference fields', async ({ page }) => {
    // Initially, neither dynamic email nor dynamic phone input should be visible
    await expect(page.getByLabel('Preferred Email Address')).not.toBeVisible();
    await expect(page.getByLabel('Preferred Phone Number')).not.toBeVisible();

    // Select "Email Address" contact method
    await page.getByLabel('Email Address').check();

    // The preferred email field should now be visible, but phone should remain hidden
    await expect(page.getByLabel('Preferred Email Address')).toBeVisible();
    await expect(page.getByLabel('Preferred Phone Number')).not.toBeVisible();

    // Select "Phone Number" contact method
    await page.getByLabel('Phone Number').check();

    // The preferred phone field should now be visible, but email should become hidden
    await expect(page.getByLabel('Preferred Phone Number')).toBeVisible();
    await expect(page.getByLabel('Preferred Email Address')).not.toBeVisible();

    // Select "None / No contact"
    await page.getByLabel('None / No contact').check();

    // Both should be hidden again
    await expect(page.getByLabel('Preferred Email Address')).not.toBeVisible();
    await expect(page.getByLabel('Preferred Phone Number')).not.toBeVisible();
  });

  test('should dynamically toggle visibility of nested newsletter form group', async ({ page }) => {
    // Initially, newsletter group fields (Frequency, Terms Checkbox) should not be visible
    await expect(page.getByLabel('Delivery Frequency')).not.toBeVisible();
    await expect(page.getByLabel('I agree to the promotional email terms and conditions')).not.toBeVisible();

    // Check "sign me up" checkbox
    await page.getByLabel('Yes, sign me up for the weekly digest newsletter').check();

    // Frequency and Terms should now be visible
    await expect(page.getByLabel('Delivery Frequency')).toBeVisible();
    await expect(page.getByLabel('I agree to the promotional email terms and conditions')).toBeVisible();

    // Uncheck "sign me up"
    await page.getByLabel('Yes, sign me up for the weekly digest newsletter').uncheck();

    // Both should be hidden again
    await expect(page.getByLabel('Delivery Frequency')).not.toBeVisible();
    await expect(page.getByLabel('I agree to the promotional email terms and conditions')).not.toBeVisible();
  });

  test('should dynamically add and remove emergency contacts in FormArray', async ({ page }) => {
    // By default, 1 contact row is rendered (initialItemCount: 1)
    await expect(page.getByLabel('Contact Name')).toBeVisible();
    await expect(page.getByLabel('Contact Phone')).toBeVisible();

    // Click "Add Additional Contact"
    await page.getByText('Add Additional Contact').click();

    // Now we should have 2 of each input field
    const nameFields = page.getByLabel('Contact Name');
    await expect(nameFields).toHaveCount(2);

    // Type in the second name field
    await nameFields.nth(1).fill('Jane Doe');
    await expect(nameFields.nth(1)).toHaveValue('Jane Doe');

    // Click the first "Delete" button
    await page.getByText('Delete').first().click();

    // We should be back to 1 contact field (Jane Doe should remain)
    await expect(nameFields).toHaveCount(1);
    await expect(nameFields.first()).toHaveValue('Jane Doe');
  });

  test('should update status cards and live values dynamically', async ({ page }) => {
    // Verify form status starts as INVALID and PRISTINE
    await expect(page.getByText('INVALID', { exact: true })).toBeVisible();
    await expect(page.getByText('PRISTINE', { exact: true })).toBeVisible();

    // Type into First Name
    await page.getByLabel('First Name').fill('Bryan');

    // Status should update to DIRTY (Form Engine Status card updates)
    await expect(page.getByText('DIRTY', { exact: true })).toBeVisible();

    // Verify live form value signal updates dynamically
    const liveValuePre = page.locator('pre');
    await expect(liveValuePre).toContainText('"firstName": "Bryan"');
  });

  test('should toggle submitted state on submit click', async ({ page }) => {
    await expect(page.getByText('Submitted State').locator('..').locator('.badge')).toHaveText('NO');

    // Fill out required fields
    await page.getByLabel('First Name').fill('Bryan');
    await page.getByLabel('Last Name').fill('Walsh');

    // Click Submit
    await page.getByText('Submit Form').click();

    // Submitted state badge should update to YES
    await expect(page.getByText('Submitted State').locator('..').locator('.badge')).toHaveText('YES');
  });

  test('should display validation error messages and highlights on invalid submit or bad input', async ({ page }) => {
    // 1. Initially, no error messages should be visible on the page
    await expect(page.getByText('First name is highly recommended and required.')).not.toBeVisible();
    await expect(page.getByText('Last name is required to complete your registration.')).not.toBeVisible();

    // 2. Click "Submit Form" to trigger submission validation
    await page.getByText('Submit Form').click();

    // 3. The custom required error messages should now be displayed
    const firstNameError = page.getByText('First name is highly recommended and required.');
    const lastNameError = page.getByText('Last name is required to complete your registration.');
    await expect(firstNameError).toBeVisible();
    await expect(lastNameError).toBeVisible();

    // 4. Verify border-danger class is applied to the input fields
    const firstNameInput = page.getByLabel('First Name');
    const lastNameInput = page.getByLabel('Last Name');
    await expect(firstNameInput).toHaveClass(/border-danger/);
    await expect(lastNameInput).toHaveClass(/border-danger/);

    // 5. Provide invalid input (too short name) and verify message switches
    await firstNameInput.fill('B');
    await firstNameInput.press('Tab');
    
    // The required error message should disappear, and the minlength error should appear
    await expect(page.getByText('First name is highly recommended and required.')).not.toBeVisible();
    await expect(page.getByText('First name must contain at least 2 letters.')).toBeVisible();

    // 6. Provide valid input, and verify the highlight and error messages disappear
    await firstNameInput.fill('Bryan');
    await firstNameInput.press('Tab');
    await expect(page.getByText('First name must contain at least 2 letters.')).not.toBeVisible();
    await expect(firstNameInput).not.toHaveClass(/border-danger/);
  });
});
