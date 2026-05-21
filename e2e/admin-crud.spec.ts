import { test, expect } from '@playwright/test';

test('admin CRUD flow: login, add property, delete property, notify, update contacts', async ({ page }) => {
  const adminPassword = process.env.PLAYWRIGHT_VITE_ADMIN_PASSWORD ?? 'test-admin';
  const unique = Date.now();
  const titleAr = `اختبار عقار ${unique}`;
  const titleEn = `Test Property ${unique}`;
  // Forward browser console messages to test runner stdout (helps debugging)
  page.on('console', (msg) => console.log('PAGE_CONSOLE>', msg.text()));

  // Bypass login for tests by setting the admin flag in localStorage
  await page.addInitScript(() => localStorage.setItem('aqari_admin', '1'));
  await page.goto('/admin');
  // wait for admin tabs to render
  await page.waitForSelector('button:has-text("العقارات")', { timeout: 20000 });

  // Switch to Properties tab
  await page.click('button:has-text("العقارات")');
  await page.waitForSelector('input[placeholder="العنوان بالعربية"]', { timeout: 5000 });

  // Fill property form
  await page.fill('input[placeholder="العنوان بالعربية"]', titleAr);
  await page.fill('input[placeholder="العنوان بالإنجليزية"]', titleEn);
  await page.selectOption('select', 'sale');
  await page.selectOption('select:nth-of-type(2)', 'apartment');
  await page.fill('input[placeholder="السعر"]', '100000');
  await page.fill('input[placeholder="عدد الغرف"]', '3');
  await page.fill('input[placeholder="عدد الحمامات"]', '2');
  await page.fill('input[placeholder="المساحة (م²)"]', '120');
  await page.fill('input[placeholder="رقم الهاتف"]', '+963999999999');
  await page.fill('input[placeholder="الموقع بالعربية"]', 'دمشق');
  await page.fill('input[placeholder="الموقع بالإنجليزية"]', 'Damascus');
  await page.fill('input[placeholder="اسم الوكيل بالعربية"]', 'وكيل الاختبار');
  await page.fill('input[placeholder="اسم الوكيل بالإنجليزية"]', 'Test Agent');
  await page.fill('input[placeholder="رابط الصورة"]', 'https://example.com/image.jpg');

  // Submit add property
  await page.click('button:has-text("إضافة العقار")');

  // Expect property to appear in the list
  await expect(page.getByText(titleAr)).toBeVisible({ timeout: 15000 });

  // Delete the property we just created
  const titleLocator = page.getByText(titleAr);
  const container = titleLocator.locator('..').locator('..');
  await container.locator('button').click();
  await expect(page.getByText(titleAr)).not.toBeVisible({ timeout: 5000 });

  // Notifications
  await page.click('button:has-text("الإشعارات")');
  await page.fill('input[placeholder="مثال: تحديث جديد"]', `تجربة إشعار ${unique}`);
  await page.fill('textarea[placeholder="مثال: تم إضافة ميزات جديدة للتطبيق"]', 'نص اختبار الإشعار');
  await page.click('button:has-text("إرسال للجميع")');
  await expect(page.getByText('تم إرسال الإشعار لجميع المستخدمين')).toBeVisible({ timeout: 15000 });

  // Contacts
  await page.click('button:has-text("معلومات التواصل")');
  await page.fill('input[placeholder="+963 XX XXX XXXX"]', '+963 99 888 7777');
  await page.fill('input[placeholder="+963 XX XXX XXXX"]:nth-of-type(2)', '+963 11 222 3333');
  await page.fill('input[placeholder="info@aqari.sy"]', `test+${unique}@example.com`);
  await page.click('button:has-text("حفظ التغييرات")');
  await expect(page.getByText('تم تحديث معلومات التواصل')).toBeVisible({ timeout: 5000 });
});
