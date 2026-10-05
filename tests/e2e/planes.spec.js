import { test, expect } from '@playwright/test';
import { config } from '../../src/config.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

// What each plan includes and what it does not. No quantities: the volume is agreed per brand.
const BASE = ['Radar Pixely en tu nicho', 'Estrategia y plan del mes', 'Aprobación en Partners', 'Producción multiformato'];
const PLANS = {
  pro: { yes: [...BASE, 'Publicamos por ti', 'Resultados de cada pieza'], no: [], vol: 3 },
  basic: { yes: [...BASE, 'Calendario de publicación'], no: ['Resultados de cada pieza'], vol: 2 },
  lite: { yes: BASE, no: ['Calendario de publicación', 'Resultados de cada pieza'], vol: 1 },
};

test('planes: tres tarjetas comparables, Pro destacado, qué incluye cada uno y CTA por plan', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#planes');
  await expect(sec.locator('.plan__name')).toHaveText(['Plan Pro', 'Plan Basic', 'Plan Lite']);
  await expect(sec.locator('#plan-pro')).toHaveClass(/plan--featured/);
  for (const [plan, { yes, no, vol }] of Object.entries(PLANS)) {
    const card = sec.locator(`#plan-${plan}`);
    await expect(card.locator('.plan__item:not(.plan__item--no) > span')).toHaveText(yes);
    await expect(card.locator('.plan__item--no > span:not(.visually-hidden)')).toHaveText(no);
    await expect(card.locator('.plan__seg.is-on')).toHaveCount(vol);
    await expect(card.locator(`[data-cta="plan-${plan}"]`))
      .toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes[`plan-${plan}`]));
  }
  await expect(sec.locator('[data-cta="planes"]')).toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes.planes));
  expect(await sec.innerText()).not.toMatch(/S\/\.?\s*\d/);
  expect(await sec.innerText()).not.toMatch(/×\d|piezas al mes/);
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
