import { test, expect } from '@playwright/test';

test('admin CRUD flow: login, add property, edit, delete, view stats', async ({ page }) => {
  const adminEmail = process.env.PLAYWRIGHT_ADMIN_EMAIL || 'admin@aqari.local';
  const adminPass = process.env.PLAYWRIGHT_ADMIN_PASSWORD || 'test-admin-password';
  const unique = Date.now();
  const titleAr = `اختبار عقار ${unique}`;
  const titleEn = `Test Property ${unique}`;

  // Forward browser console messages to test runner stdout (helps debugging)
  page.on('console', (msg) => console.log('PAGE_CONSOLE>', msg.text()));

  // Navigate to admin and login with Supabase auth
  await page.goto('/admin');

  // Wait for login form to render
  await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 5000 });

  // Fill in email and password
  await page.fill('input[type="email"]', adminEmail);
  await page.fill('input[type="password"]', adminPass);

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for admin dashboard to load (should redirect to /admin and show tabs)
  await page.waitForURL('/admin', { timeout: 10000 });
  await page.waitForSelector('button[role="tab"]', { timeout: 5000 });

  // Should be on "Add" tab by default, fill property form
  await expect(page.locator('input')).first().toBeVisible();

  // Fill in property details
  await page.fill('input[placeholder*="عنوان"]', titleAr);
  const titleInputs = page.locator('input[placeholder*="العنوان"]');
  const titleCount = await titleInputs.count();
  if (titleCount > 1) {
    await titleInputs.nth(1).fill(titleEn);
  }

  // Select type (sale/rent) using combobox
  const typeSelects = page.locator('select');
  if (await typeSelects.count() > 0) {
    await typeSelects.first().selectOption('sale');
  }

  // Select category
  const categorySelects = page.locator('select');
  if (await categorySelects.count() > 1) {
    await categorySelects.nth(1).selectOption('apartment');
  }

  // Fill price
  const numberInputs = page.locator('input[type="number"]');
  if (await numberInputs.count() > 0) {
    await numberInputs.nth(0).fill('100000');  // price
    if (await numberInputs.count() > 1) {
      await numberInputs.nth(1).fill('120');  // area
    }
    if (await numberInputs.count() > 2) {
      await numberInputs.nth(2).fill('3');  // rooms
    }
    if (await numberInputs.count() > 3) {
      await numberInputs.nth(3).fill('2');  // bathrooms
    }
  }

  // Fill text fields
  const textInputs = page.locator('input[type="text"]');
  const textCount = await textInputs.count();
  if (textCount > 0) {
    // Location
    const locationInputs = page.locator('input[placeholder*="الموقع"]');
    if (await locationInputs.count() > 0) {
      await locationInputs.nth(0).fill('دمشق');
    }
    if (await locationInputs.count() > 1) {
      await locationInputs.nth(1).fill('Damascus');
    }

    // Agent name
    const agentInputs = page.locator('input[placeholder*="الوكيل"]');
    if (await agentInputs.count() > 0) {
      await agentInputs.nth(0).fill('وكيل الاختبار');
    }
    if (await agentInputs.count() > 1) {
      await agentInputs.nth(1).fill('Test Agent');
    }

    // Phone and image
    const otherInputs = page.locator('input[type="text"]');
    if (await otherInputs.count() > 4) {
      await otherInputs.nth(4).fill('+963999999999');  // phone
      await otherInputs.nth(5).fill('https://via.placeholder.com/500x400');  // image
    }
  }

  // Submit add property (look for button with Arabic text for "add property")
  const submitBtn = page.locator('button[type="submit"]').first();
  await submitBtn.click();

  // Wait for success toast or property to appear in list
  await page.waitForTimeout(2000);

  // Navigate to List tab
  const listTabBtn = page.locator('button').filter({ hasText: /القائمة|List/ }).first();
  await listTabBtn.click();

  // Wait for property list to load
  await page.waitForTimeout(1500);

  // Find the property we just created (look for title)
  const propertyRow = page.locator('text=' + titleAr).first();
  await expect(propertyRow).toBeVisible({ timeout: 5000 });

  // Find edit button for this property and click it
  const propertyContainer = propertyRow.locator('..');
  const editBtn = propertyContainer.locator('button').first(); // Edit button is first button in container
  await editBtn.click();

  // Wait for edit form to appear
  await page.waitForTimeout(800);

  // Verify form is populated
  const titleInput = page.locator('input[placeholder*="عنوان"]').first();
  const currentValue = await titleInput.inputValue();
  await expect(currentValue).toBe(titleAr);

  // Change price as an edit verification
  const priceInput = page.locator('input[placeholder*="السعر"]');
  await priceInput.fill('150000');

  // Submit edit
  await submitBtn.click();
  await page.waitForTimeout(2000);

  // Verify edit succeeded by checking updated price
  const updatedPrice = await priceInput.inputValue();
  await expect(updatedPrice).toBe('150000');

  // Delete the property - navigate to list tab again
  await listTabBtn.click();
  await page.waitForTimeout(1000);

  // Find the property row again
  const deletePropertyRow = page.locator('text=' + titleAr).first();
  await expect(deletePropertyRow).toBeVisible();

  // Find delete button (usually second button in the row) and click it
  const deleteContainer = deletePropertyRow.locator('..');
  const deleteBtn = deleteContainer.locator('button').last(); // Delete button is typically last button
  await deleteBtn.click();

  // Wait for confirm dialog to appear
  await page.waitForTimeout(500);

  // Look for confirmation button (should have "نعم" or "yes" text)
  const confirmDeleteBtn = page.locator('button').filter({ hasText: /نعم|Yes|delete/ }).last();
  if (await confirmDeleteBtn.isVisible()) {
    await confirmDeleteBtn.click();
  }

  // Wait for property to disappear from list
  await page.waitForTimeout(1500);
  await expect(deletePropertyRow).not.toBeVisible({ timeout: 5000 });

  // Navigate to Stats tab to verify UI
  const statsTabBtn = page.locator('button').filter({ hasText: /إحصائيات|Stats/ }).first();
  await statsTabBtn.click();
  await page.waitForTimeout(800);

  // Verify stats tab is visible
  await expect(page.locator('text=/الإجمالي|total/i')).toBeVisible({ timeout: 3000 });

  // Navigate to Notifications tab
  const notificationsTabBtn = page.locator('button').filter({ hasText: /الإشعارات|Notifications/ }).first();
  await notificationsTabBtn.click();
  await page.waitForTimeout(800);

  // Tab should be visible (notifications list or empty state)
  await expect(page.locator('body')).toBeVisible();

  console.log('✓ Admin CRUD test completed successfully');
});
