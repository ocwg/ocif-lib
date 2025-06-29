import { test, expect } from '@playwright/test';
import path = require('path');

test('file upload and validation fails', async ({ page }) => {
  await page.goto('/');

  expect(await page.locator('h1').innerText()).toContain('OCIF JSON Validator');
  const filePath = path.resolve(__dirname, '../test-files/bad.ocif.json');
  await page.locator('input[type="file"]').setInputFiles(filePath);
  expect(await page.locator('h3').innerText()).toContain('Validation Failed');
});
