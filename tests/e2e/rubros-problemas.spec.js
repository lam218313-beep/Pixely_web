import { test, expect } from '@playwright/test';
import { config } from '../../src/config.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

async function expectLoaded(img) {
  await img.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate((i) => i.complete && i.naturalWidth > 0)).toBe(true);
}

test('rubros: 8 celdas, 6 imágenes cargadas y CTA para otros rubros', async ({ page }) => {
  await page.goto('/');
  const rubros = page.locator('#rubros');
  await expect(rubros.locator('.rubro')).toHaveCount(8);
  const imgs = rubros.locator('img');
  await expect(imgs).toHaveCount(6);
  for (let i = 0; i < 6; i += 1) {
    await expect(imgs.nth(i)).not.toHaveAttribute('alt', '');
    await expectLoaded(imgs.nth(i));
  }
  await expect(rubros.locator('[data-cta="rubro-otro"]'))
    .toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes['rubro-otro']));
});

test('la cabecera se vuelve clara sobre Rubros', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.getElementById('rubros').offsetTop + 10));
  await expect(page.locator('.site-header')).toHaveAttribute('data-theme', 'light');
});

test('problemas: 3 filas con CTA, fuentes y disclaimer', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#problemas');
  await expect(sec.locator('.problema__q')).toHaveText([
    '¿Tus fotos las tomas con el celular sobre una sábana blanca?',
    '¿Te hace los diseños un familiar?',
    '¿No tienes tiempo para publicar?',
  ]);
  for (const key of ['problema-fotos', 'problema-diseno', 'problema-tiempo']) {
    await expect(sec.locator(`[data-cta="${key}"]`)).toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes[key]));
  }
  await expect(sec.locator('.source-note a')).toHaveCount(2);
  await expect(sec.getByText('Los resultados pueden variar según el negocio, el sector y la constancia en la publicación.')).toBeVisible();
  const imgs = sec.locator('img');
  await expect(imgs).toHaveCount(3);
  for (let i = 0; i < 3; i += 1) await expectLoaded(imgs.nth(i));
});

test('rubros: el nombre de la celda de texto sigue visible al pasar el cursor', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'el hover solo aplica en escritorio');
  await page.goto('/');
  await page.addStyleTag({ content: '.rubro__name { transition: none !important; }' });
  const cell = page.locator('#rubros .rubro--text');
  await cell.scrollIntoViewIfNeeded();
  await cell.hover();
  await expect(cell.locator('.rubro__name')).not.toHaveCSS('color', 'rgb(255, 255, 255)');
});
