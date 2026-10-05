import { test, expect } from '@playwright/test';

const rotation = (el) => el.evaluate((node) => {
  const t = getComputedStyle(node).transform;
  if (t === 'none') return 0;
  const [a, b] = t.match(/matrix\(([^)]+)\)/)[1].split(',').map(Number);
  return Math.round((Math.atan2(b, a) * 180) / Math.PI);
});

test('escritorio: la escena del hero empieza a −15° y se endereza', async ({ page }, info) => {
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

test('móvil: la escena del hero no se inclina', async ({ page }, info) => {
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

test('escritorio: cada fila de problemas se desvanece cuando la siguiente la cubre', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await page.waitForFunction(() => window.__motionReady === true);
  const firstQ = page.locator('.problema').first().locator('.problema__q');
  const scrollRowTo = (index, viewportY) => page.evaluate(([index, viewportY]) => {
    const row = document.querySelectorAll('.problema')[index];
    window.scrollTo(0, row.getBoundingClientRect().top + window.scrollY - viewportY);
  }, [index, viewportY]);
  await scrollRowTo(1, 2000);
  await expect.poll(() => firstQ.evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.95);
  await scrollRowTo(1, 0);
  await expect.poll(() => firstQ.evaluate((el) => Number(getComputedStyle(el).opacity)), { timeout: 5000 }).toBeLessThan(0.05);
});
