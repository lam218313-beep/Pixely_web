import { test, expect } from '@playwright/test';
import { config } from '../../src/config.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

const QTY = {
  pro: ['×4', '×4', '×16', '×20', '×4'],
  basic: ['×2', '×2', '×8', '×10', '×2'],
  lite: ['×1', '×1', '×4', '×5', '×1'],
};

test('planes: orden Top-Down, cantidades y CTA por plan', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#planes');
  await expect(sec.locator('.plan h3')).toHaveText(['Plan Pro', 'Plan Basic', 'Plan Lite']);
  for (const [plan, qty] of Object.entries(QTY)) {
    await expect(sec.locator(`#plan-${plan} .plan__qty`)).toHaveText(qty);
    await expect(sec.locator(`#plan-${plan} [data-cta="plan-${plan}"]`))
      .toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes[`plan-${plan}`]));
  }
  expect(await sec.innerText()).not.toMatch(/S\/\.?\s*\d/);
  const clip = await sec.evaluate((el) => getComputedStyle(el).clipPath);
  expect(clip.startsWith('polygon(')).toBe(true);
});

test('escritorio: el menú lateral sigue el plan visible', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await page.evaluate(() => {
    const el = document.getElementById('plan-basic');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3);
  });
  await expect(page.locator('.planes__nav a[href="#plan-basic"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-plan-cta]'))
    .toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes['plan-basic']));
});

test('planes: el ancla de un plan lo deja justo debajo de la cabecera y del menú de planes', async ({ page }, info) => {
  await page.goto('/');
  if (info.project.name === 'desktop') await expect.poll(() => page.evaluate(() => window.__motionReady === true), { timeout: 10000 }).toBe(true);
  await page.locator('#planes').scrollIntoViewIfNeeded();
  await page.locator('.planes__nav a[href="#plan-basic"]').click();
  const gap = () => page.evaluate(() => {
    const top = document.getElementById('plan-basic').getBoundingClientRect().top;
    const header = document.querySelector('.site-header').getBoundingClientRect().bottom;
    const aside = document.querySelector('.planes__aside').getBoundingClientRect();
    // En escritorio el menú va en la columna izquierda; en móvil, fijo encima del plan.
    const above = aside.right <= document.getElementById('plan-basic').getBoundingClientRect().left ? header : aside.bottom;
    return Math.round(top - above);
  });
  await expect.poll(gap, { timeout: 5000 }).toBeGreaterThanOrEqual(0);
  await expect.poll(gap, { timeout: 5000 }).toBeLessThanOrEqual(48);
});
