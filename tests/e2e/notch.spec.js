import { test, expect } from '@playwright/test';

// Bloques negros que siguen a uno blanco: punta reflejada y esquinas redondeadas arriba.
// [selector, también lleva la pestaña inferior]
const TOP_NOTCHED = [['#planes', true], ['#ecosistema', false], ['#garantias', true], ['.site-footer', false]];

for (const [selector, alsoBottom] of TOP_NOTCHED) {
  test(`${selector}: recorte superior${alsoBottom ? ' e inferior' : ''}`, async ({ page }, info) => {
    const [radius, depth] = info.project.name === 'desktop' ? [40, 74] : [24, 48];
    await page.goto('/');
    const el = page.locator(selector);
    const { clip, paddingTop } = await el.evaluate((node) => {
      const cs = getComputedStyle(node);
      return { clip: cs.clipPath, paddingTop: parseFloat(cs.paddingTop) };
    });
    expect(clip.startsWith(`polygon(0px ${radius}px, `)).toBe(true);
    // La punta superior llega a la profundidad de la pestaña.
    expect(clip).toMatch(new RegExp(`calc\\(50% [-+] [\\d.]+px\\) ${depth}(\\.\\d+)?px`));
    expect(new RegExp(`calc\\(100% - ${depth}(\\.\\d+)?px\\)`).test(clip)).toBe(alsoBottom);
    // El contenido empieza por debajo de la punta.
    expect(paddingTop).toBeGreaterThanOrEqual(depth);
  });
}

test('el hero solo lleva la pestaña inferior', async ({ page }) => {
  await page.goto('/');
  const clip = await page.locator('#inicio').evaluate((node) => getComputedStyle(node).clipPath);
  expect(clip.startsWith('polygon(0px 0px, 100% 0px, ')).toBe(true);
});
