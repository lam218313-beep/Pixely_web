import { test, expect } from '@playwright/test';
import { config } from '../../src/config.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

test('hero: titular, CTA, insignia y números', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('#inicio');
  await expect(hero.locator('h1')).toHaveText('Tu publicidad no sale de la ocurrencia de un diseñador. Sale de datos reales.');
  await expect(hero.locator('[data-cta="hero"]')).toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes.hero));
  await expect(hero.getByText('Pixely Partners · Próximamente')).toBeVisible();
  await expect(hero.locator('.hero__number')).toHaveText(['48', '7–14', '10', '100 %']);
  await expect(hero.locator('.hero__formats li')).toHaveCount(4);
  const clip = await hero.evaluate((el) => getComputedStyle(el).clipPath);
  expect(clip.startsWith('polygon(')).toBe(true);
  await expect(page.locator('.site-header')).toHaveAttribute('data-theme', 'dark');
});

test('hero: el showreel tiene portada y se reproduce', async ({ page }) => {
  await page.goto('/');
  const video = page.locator('.hero__video');
  await expect(video).toHaveAttribute('poster', '/media/showreel-poster.jpg');
  await expect(video.locator('source')).toHaveCount(2);
  await expect.poll(() => video.evaluate((v) => v.paused)).toBe(false);
});

test.describe('con reducir movimiento', () => {
  test.use({ reducedMotion: 'reduce' });
  test('el showreel no se reproduce solo', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    expect(await page.locator('.hero__video').evaluate((v) => v.paused)).toBe(true);
  });
});

test('hero: el botón pausa y reanuda el showreel', async ({ page }) => {
  await page.goto('/');
  const video = page.locator('.hero__video');
  const toggle = page.getByRole('button', { name: 'Pausar showreel' });
  await expect.poll(() => video.evaluate((v) => v.paused)).toBe(false);
  await toggle.click();
  await expect.poll(() => video.evaluate((v) => v.paused)).toBe(true);
  await expect(page.getByRole('button', { name: 'Reproducir showreel' })).toBeVisible();
});

test.describe('con reducir movimiento (botón)', () => {
  test.use({ reducedMotion: 'reduce' });
  test('el botón inicia el showreel', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Reproducir showreel' }).click();
    await expect.poll(() => page.locator('.hero__video').evaluate((v) => v.paused)).toBe(false);
  });
});
