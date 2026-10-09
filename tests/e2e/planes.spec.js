import { test, expect } from '@playwright/test';
import { config } from '../../src/config.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

// What each plan includes and what it does not, with the approved campaigns (9 oct). No prices on the web.
const PLANS = {
  pro: { yes: ['4 campañas de hasta 12 piezas', 'Hasta 4 reels al mes', 'Textos para hasta 5 redes', 'Calendario con día y orden', 'Publicamos en Instagram y Facebook', 'Resultados de cada pieza en Instagram', 'Estudio de mercado cada mes'], no: [], vol: 3, max: 48 },
  basic: { yes: ['2 campañas de hasta 12 piezas', 'Hasta 2 reels al mes', 'Textos para Instagram, Facebook y 1 red más', 'Calendario con día y orden'], no: ['Publicamos por ti', 'Resultados de cada pieza'], vol: 2, max: 24 },
  lite: { yes: ['1 campaña de hasta 12 piezas', 'Hasta 1 reel al mes', 'Textos para Instagram y Facebook', 'Fecha sugerida para cada pieza'], no: ['Calendario con día y orden', 'Publicamos por ti', 'Resultados de cada pieza'], vol: 1, max: 12 },
};

test('planes: tres tarjetas comparables, Pro destacado, qué incluye cada uno y CTA por plan', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#planes');
  await expect(sec.locator('.plan__name')).toHaveText(['Plan Pro', 'Plan Basic', 'Plan Lite']);
  await expect(sec.locator('#plan-pro')).toHaveClass(/plan--featured/);
  for (const [plan, { yes, no, vol, max }] of Object.entries(PLANS)) {
    const card = sec.locator(`#plan-${plan}`);
    await expect(card.locator('.plan__item:not(.plan__item--no) > span')).toHaveText(yes);
    await expect(card.locator('.plan__item--no > span:not(.visually-hidden)')).toHaveText(no);
    await expect(card.locator('.plan__seg.is-on')).toHaveCount(vol);
    await expect(card.locator('.plan__vol-name')).toHaveText(`Hasta ${max}`);
    await expect(card.locator(`[data-cta="plan-${plan}"]`))
      .toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes[`plan-${plan}`]));
  }
  await expect(sec.locator('[data-cta="planes"]')).toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes.planes));
  expect(await sec.innerText()).not.toMatch(/S\/\.?\s*\d/);
  const clip = await sec.evaluate((el) => getComputedStyle(el).clipPath);
  expect(clip.startsWith('polygon(')).toBe(true);
});

test('planes: las tarjetas entran al llegar a la sección y las marcas se dibujan', async ({ page }) => {
  await page.goto('/');
  const grid = page.locator('[data-planes]');
  await expect(grid).not.toHaveClass(/is-in/);
  await grid.scrollIntoViewIfNeeded();
  await expect(grid).toHaveClass(/is-in/);
  await expect.poll(() => page.locator('#plan-lite').evaluate((el) => getComputedStyle(el).opacity), { timeout: 4000 }).toBe('1');
});

test.describe('con reducir movimiento', () => {
  test.use({ reducedMotion: 'reduce' });
  test('los planes se ven completos sin esperar animaciones', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-planes]')).toHaveClass(/is-in/);
  });
});

test('móvil: los planes se deslizan de lado, sin mover la página', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  const grid = page.locator('[data-planes]');
  await grid.scrollIntoViewIfNeeded();
  expect(await grid.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
});
