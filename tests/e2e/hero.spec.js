import { test, expect } from '@playwright/test';
import { config } from '../../src/config.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

test('hero: titular, CTA, insignia y números', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('#inicio');
  await expect(hero.locator('h1')).toHaveText('Tu publicidad no sale de la ocurrencia de un diseñador. Sale de datos reales.');
  await expect(hero.locator('[data-cta="hero"]')).toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes.hero));
  await expect(hero.getByText('Pixely Partners · Nuevo')).toBeVisible();
  await expect(hero.locator('.hero__number')).toHaveText(['7', '12', '1', '100 %']);
  await expect(hero.locator('.hero__formats li')).toHaveText([/Investigar/, /Planificar/, /Producir/, /Aprobar/]);
  await expect(hero.locator('.hero__formats li')).toHaveCount(4);
  const clip = await hero.evaluate((el) => getComputedStyle(el).clipPath);
  expect(clip.startsWith('polygon(')).toBe(true);
  await expect(page.locator('.site-header')).toHaveAttribute('data-theme', 'dark');
});

test('hero: la laptop de la escena muestra Partners en movimiento', async ({ page }) => {
  await page.goto('/');
  const escena = page.locator('#inicio .escena--laptop');
  await expect(escena.locator('.escena__foto')).toHaveAttribute('src', /escena-laptop-still/);
  await expect(escena).toHaveClass(/is-live/);
  await expect(escena.locator('.vitrina__layer')).toHaveCount(1);
});

test.describe('con reducir movimiento', () => {
  test.use({ reducedMotion: 'reduce' });
  test('la escena queda quieta, con la captura real ya puesta', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    const escena = page.locator('#inicio .escena--laptop');
    await expect(escena).not.toHaveClass(/is-live/);
    await expect(escena.locator('.escena__foto')).toBeVisible();
  });
});
