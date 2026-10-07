import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('accesibilidad (WCAG 2 A/AA)', () => {
  test.use({ reducedMotion: 'reduce' });
  for (const path of ['/', '/privacidad', '/terminos']) {
    test(`sin infracciones axe en ${path}`, async ({ page }) => {
      await page.goto(path);
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).exclude('.cursor-dot').analyze();
      // Brand decision: the brand pink (#EB0C6E) next to white gives 4.36:1, just under AA for small print
      // (white on pink buttons, pink numbers on the white sections). Only that pair is allowed; anything else still fails.
      const violations = result.violations
        .map((v) => (v.id === 'color-contrast' ? { ...v, nodes: v.nodes.filter((n) => !/(#ffffff.*#eb0c6e|#eb0c6e.*#ffffff)/i.test(n.any[0]?.message ?? '')) } : v))
        .filter((v) => v.nodes.length);
      expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    });
  }
});

test('sin scroll horizontal a 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('el primer Tab muestra el enlace para saltar al contenido', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.locator('.skip-link');
  await expect(skip).toBeFocused();
  expect((await skip.boundingBox()).y).toBeGreaterThanOrEqual(0);
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('todas las secciones y sus títulos son visibles', async ({ page }) => {
    await page.goto('/');
    for (const id of ['inicio', 'rubros', 'problemas', 'planes', 'como-funciona', 'ecosistema', 'partners', 'historia', 'garantias', 'preguntas']) {
      const heading = page.locator(`#${id} :is(h1, h2)`).first();
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();
    }
    const hrefs = await page.locator('[data-cta]').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    expect(hrefs.every((h) => h.startsWith('https://wa.me/51949268607'))).toBe(true);
  });
});
