import { test, expect } from '@playwright/test';

test('con movimiento: arranca GSAP, divide el titular y revela los bloques', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/js-motion/);
  await expect.poll(() => page.evaluate(() => window.__motionReady === true)).toBe(true);
  const h1 = page.locator('#hero-title');
  await expect(h1.locator('.split-word').first()).toBeAttached();
  await expect(h1).toHaveCSS('visibility', 'visible');
  const blocks = page.locator('[data-reveal]');
  const count = await blocks.count();
  for (let i = 0; i < count; i += 1) {
    const el = blocks.nth(i);
    if (!(await el.isVisible())) continue;
    // Al centro: un bloque ya visible en el último 8 % de la pantalla no pasa el
    // inicio del revelado ('top 92%') y scrollIntoViewIfNeeded no lo movería.
    await el.evaluate((node) => node.scrollIntoView({ block: 'center' }));
    await expect(el).toHaveCSS('opacity', '1', { timeout: 4000 });
  }
});

test('el scramble termina mostrando el texto original', async ({ page }) => {
  await page.goto('/');
  const el = page.locator('#inicio [data-scramble]').first();
  await el.scrollIntoViewIfNeeded();
  await expect(el).toHaveText('El proceso', { timeout: 4000 });
  await expect(el).toHaveCSS('opacity', '1');
});

test.describe('con reducir movimiento', () => {
  test.use({ reducedMotion: 'reduce' });
  test('no carga GSAP y todo es visible de inmediato', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(() => window.__motionReady)).toBeUndefined();
    await expect(page.locator('#hero-title .split-word')).toHaveCount(0);
    const opacities = await page.locator('[data-reveal]').evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
    expect(opacities.every((o) => o === '1')).toBe(true);
  });
});
