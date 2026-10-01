import { test, expect } from '@playwright/test';

for (const path of ['/brand/pixely-p.svg', '/brand/favicon-32.png', '/brand/apple-touch-icon.png', '/brand/icon-512.png']) {
  test(`sirve ${path}`, async ({ request }) => {
    const res = await request.get(path);
    expect(res.status()).toBe(200);
  });
}

test('el head enlaza los iconos', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/brand/pixely-p.svg');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/brand/apple-touch-icon.png');
});
