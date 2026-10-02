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

test('problemas: el CTA de una fila tapada queda visible y encima al recibir el foco', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'las filas solo se apilan en escritorio');
  await page.goto('/');
  // Al final de la lista las tres filas están apiladas en el mismo tope fijo.
  await page.evaluate(() => {
    const list = document.querySelector('.problemas__list');
    window.scrollTo(0, list.getBoundingClientRect().bottom + window.scrollY - window.innerHeight);
  });
  const cta = page.locator('[data-cta="problema-fotos"]');
  await expect.poll(() => cta.evaluate((el) => getComputedStyle(el.closest('.problema__a')).opacity)).toBe('0');
  await cta.evaluate((el) => el.focus({ preventScroll: true }));
  await expect.poll(() => cta.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return Boolean(hit && el.contains(hit)) && getComputedStyle(el.closest('.problema__a')).opacity === '1';
  })).toBe(true);
});

test('problemas: tras pulsar con el ratón el CTA de la fila 1, la fila 2 la sigue cubriendo', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'las filas solo se apilan en escritorio');
  context.on('page', (popup) => popup.close().catch(() => {}));
  await page.goto('/');
  // Pulsar con el ratón deja el foco en el CTA (abre WhatsApp en otra pestaña).
  await page.locator('#problemas').scrollIntoViewIfNeeded();
  const cta = page.locator('[data-cta="problema-fotos"]');
  await cta.click();
  await page.bringToFront();
  expect(await cta.evaluate((el) => document.activeElement === el && document.hasFocus())).toBe(true);
  // La fila 2 sube hasta el tope fijo, encima de la fila 1 (la 3 es la última y nunca llega a cubrirla).
  await page.evaluate(() => {
    const row = document.querySelectorAll('.problema')[1];
    window.scrollTo(0, row.getBoundingClientRect().top + window.scrollY);
  });
  const q2 = page.locator('.problema').nth(1).locator('.problema__q');
  await expect.poll(() => q2.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return Boolean(hit && el.closest('.problema').contains(hit));
  })).toBe(true);
});
