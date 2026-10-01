import { test, expect } from '@playwright/test';
import { config } from '../../src/config.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

test('partners: próximamente, 4 funciones y CTA de aviso', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#partners');
  await expect(sec.locator('.badge')).toHaveText(/Próximamente/);
  await expect(sec.locator('.partners__features h3')).toHaveText([
    'Diagnóstico de marca', 'Lab de audiencia', 'Estrategia de contenido', 'Calendario de publicación',
  ]);
  await expect(sec.locator('[data-cta="partners"]')).toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes.partners));
  await expect(sec.locator('a[href="https://partners.pixely.pe"]')).toBeHidden();
  await expect(sec.locator('.partners__devices')).toHaveAttribute('aria-hidden', 'true');
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
