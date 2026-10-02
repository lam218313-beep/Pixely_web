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

});
