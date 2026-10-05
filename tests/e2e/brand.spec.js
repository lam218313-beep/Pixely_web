import { test, expect } from '@playwright/test';

for (const path of ['/brand/favicon-64.png', '/brand/favicon-32.png', '/brand/apple-touch-icon.png', '/brand/icon-512.png']) {
  test(`sirve ${path}`, async ({ request }) => {
    const res = await request.get(path);
    expect(res.status()).toBe(200);
  });
}

test('el head enlaza los iconos', async ({ page }) => {
  await page.goto('/');
  // Tab icon: the "p." of the Partners app.
  await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute('href', /^\/brand\/favicon-64\.png/);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', /^\/brand\/apple-touch-icon\.png/);
});
