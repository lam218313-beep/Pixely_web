import { test, expect } from '@playwright/test';

test('carga con título, idioma y clase js', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Pixely — Publicidad que vende | Publicidad con IA para negocios');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-PE');
  await expect(page.locator('html')).toHaveClass(/(^|\s)js(\s|$)/);
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('conserva la clase no-js y no activa el movimiento', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/(^|\s)no-js(\s|$)/);
    await expect(page.locator('html')).not.toHaveClass(/js-motion/);
  });
});

test.describe('con reducir movimiento', () => {
  test.use({ reducedMotion: 'reduce' });

  test('no añade js-motion', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/js-motion/);
  });
});
