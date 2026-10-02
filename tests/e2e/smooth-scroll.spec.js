import { test, expect } from '@playwright/test';

test.describe('scroll suave (escritorio)', () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop'));

  test('las anclas dejan la sección justo debajo de la cabecera', async ({ page }) => {
    await page.goto('/');
    await expect.poll(() => page.evaluate(() => window.__motionReady === true)).toBe(true);
    await page.locator('.site-header__nav a[href="#planes"]').click();
    const header = await page.locator('.site-header').boundingBox();
    await expect
      .poll(async () => Math.round((await page.locator('#planes').boundingBox()).y - header.height), { timeout: 5000 })
      .toBeLessThanOrEqual(2);
    expect(Math.round((await page.locator('#planes').boundingBox()).y - header.height)).toBeGreaterThanOrEqual(-2);
  });

  test('con el menú abierto la rueda no desplaza la página', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto('/');
    await expect.poll(() => page.evaluate(() => window.__motionReady === true)).toBe(true);
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await expect(page.locator('#menu-panel')).toBeVisible();
    await page.mouse.move(450, 400);
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await page.keyboard.press('Escape');
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  });
});
