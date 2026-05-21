import { test, expect } from '@playwright/test';

test('home page loads and shows greeting', async ({ page }) => {
  await page.goto('/home');
  await expect(page.getByText(/Welcome|أهلاً بك/)).toBeVisible();
});

test('contact page loads', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByText(/contact_title|معلومات التواصل|Contact/)).toBeVisible();
});
