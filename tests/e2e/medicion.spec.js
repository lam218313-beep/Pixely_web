import { test, expect } from '@playwright/test';

test('sin parámetros, los botones de WhatsApp no cambian', async ({ page }) => {
  await page.goto('/');
  const href = await page.locator('[data-cta="hero"]').getAttribute('href');
  expect(decodeURIComponent(href)).not.toContain('Ref:');
});

test('con origen, el mensaje de WhatsApp lo lleva y el clic queda registrado', async ({ page, context }) => {
  await page.goto('/?utm_source=instagram&utm_medium=bio');
  const boton = page.locator('[data-cta="hero"]');
  expect(decodeURIComponent(await boton.getAttribute('href'))).toContain('(Ref: instagram)');

  await context.route('https://wa.me/**', (route) => route.fulfill({ status: 200, body: '' }));
  const popup = context.waitForEvent('page');
  await boton.click();
  (await popup).close().catch(() => {});

  const evento = await page.evaluate(() => window.dataLayer.find((e) => e.event === 'click_whatsapp'));
  expect(evento).toMatchObject({ cta: 'hero', origen: 'instagram', medio: 'bio' });
});

test('el sitio no carga scripts de terceros mientras no haya ID de GTM', async ({ page }) => {
  const externos = [];
  page.on('request', (r) => { if (/googletagmanager|facebook|tiktok|google-analytics/.test(new URL(r.url()).hostname)) externos.push(r.url()); });
  await page.goto('/?utm_source=tiktok');
  await page.waitForTimeout(500);
  expect(externos).toEqual([]);
});
