import { test, expect } from '@playwright/test';

test('head: canonical, Open Graph y JSON-LD', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://pixely.pe/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://pixely.pe/brand/og.jpg?v=4');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(ld).toMatchObject({
    '@type': 'ProfessionalService',
    name: 'Pixely',
    legalName: 'SYNTESIA LABS E.I.R.L.',
    taxID: '20616010787',
    telephone: '+51949268607',
    email: 'hola@pixely.pe',
    sameAs: ['https://www.instagram.com/pixely_pe/'],
  });
});

for (const path of ['/brand/og.jpg', '/robots.txt', '/sitemap.xml']) {
  test(`sirve ${path}`, async ({ request }) => {
    expect((await request.get(path)).status()).toBe(200);
  });
}

for (const [path, title, other] of [['/privacidad', 'Política de privacidad', '/terminos'], ['/terminos', 'Términos y condiciones', '/privacidad']]) {
  test(`página legal ${path}`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText(title);
    await expect(page.getByText('SYNTESIA LABS E.I.R.L.', { exact: false }).first()).toBeVisible();
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
    await expect(page.locator(`a[href="${other}"]`)).toBeVisible();
  });
}
