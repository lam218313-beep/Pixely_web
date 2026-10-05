import { test, expect } from '@playwright/test';
import { config } from '../../src/config.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

test('partners: ya disponible, 4 funciones, entrada directa y recorrido real', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#partners');
  await expect(sec.locator('.badge')).toHaveText(/Ya disponible/);
  await expect(sec.locator('.partners__features h3')).toHaveText([
    'Aprueba el plan', 'Previsualiza cada pieza', 'Tu mercado, en vivo', 'Resultados claros',
  ]);
  await expect(sec.locator('a[href="https://partners.pixely.pe"]')).toBeVisible();
  await expect(sec.locator('[data-cta="partners"]')).toBeHidden();
  await expect(sec.locator('.partners__devices [data-vitrina]')).toHaveCount(2);
  const clip = await sec.evaluate((el) => getComputedStyle(el).clipPath);
  expect(clip.startsWith('polygon(')).toBe(true);
});

test('historia: relato, imagen y 5 valores', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#historia');
  await expect(sec.locator('h2')).toHaveText('Nacimos de una frustración.');
  await expect(sec.locator('.valor h3')).toHaveText([
    'Resultados medibles', 'Accesibilidad real', 'Coherencia de marca', 'Velocidad de ejecución', 'Transparencia operativa',
  ]);
  const img = sec.locator('img');
  await img.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate((i) => i.naturalWidth > 0)).toBe(true);
});

test('casos y testimonios siguen ocultos', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#casos')).toBeHidden();
  await expect(page.locator('#testimonios')).toBeHidden();
});
