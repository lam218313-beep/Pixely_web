import { test, expect } from '@playwright/test';

const rotation = (el) => el.evaluate((node) => {
  const t = getComputedStyle(node).transform;
  if (t === 'none') return 0;
  const [a, b] = t.match(/matrix\(([^)]+)\)/)[1].split(',').map(Number);
  return Math.round((Math.atan2(b, a) * 180) / Math.PI);
});

test('escritorio: el showreel empieza a −15° y se endereza', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  const media = page.locator('[data-tilt]');
  await expect.poll(() => rotation(media)).toBe(-15);
  await page.evaluate(() => {
    const wrap = document.querySelector('[data-tilt-wrap]');
    window.scrollTo(0, wrap.getBoundingClientRect().bottom + window.scrollY);
  });
  await expect.poll(() => rotation(media), { timeout: 5000 }).toBe(0);
});

test('móvil: el showreel no se inclina', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  await page.waitForFunction(() => window.__motionReady === true);
  expect(await rotation(page.locator('[data-tilt]'))).toBe(0);
});

test('escritorio: el cursor magenta aparece sobre "Hablemos"', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await page.waitForFunction(() => window.__motionReady === true);
  await page.locator('.footer-cta').hover();
  await expect(page.locator('.cursor-dot')).toHaveClass(/is-visible/);
});
