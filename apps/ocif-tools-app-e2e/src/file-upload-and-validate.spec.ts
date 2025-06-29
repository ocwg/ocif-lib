import { test, expect } from '@playwright/test';

test('file upload and validation', async ({ page }) => {
  await page.goto('/');

  expect(await page.locator('h1').innerText()).toContain('OCIF JSON Validator');
  await page
    .locator('input[type="file"]')
    .setInputFiles('test-files/hello-world.ocif.json');
  expect(await page.locator('h3').innerText()).toContain(
    'Validation Successful!'
  );
});
