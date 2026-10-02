import { test, expect } from '@playwright/test';
import { config } from '../../src/config.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

test('garantías: 3 garantías, 4 límites y disclaimer', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#garantias');
  await expect(sec.locator('.garantia--si')).toHaveCount(3);
  await expect(sec.locator('.garantia--no')).toHaveCount(4);
  await expect(sec.getByText('Los resultados pueden variar según el negocio', { exact: false })).toBeVisible();
  const clip = await sec.evaluate((el) => getComputedStyle(el).clipPath);
  expect(clip.startsWith('polygon(')).toBe(true);
});

test('preguntas: 9 preguntas, Canva solo en la primera y acordeón exclusivo', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#preguntas');
  await expect(sec.locator('summary')).toHaveCount(9);
  await expect(sec.locator('summary').first()).toHaveText('¿Por qué Pixely si mi sobrino usa Canva?');
  await expect(sec.locator('details').first()).toHaveAttribute('id', 'faq-canva');
  await sec.locator('summary').nth(0).click();
  await expect(sec.locator('details').nth(0)).toHaveAttribute('open', '');
  await sec.locator('summary').nth(1).click();
  await expect(sec.locator('details').nth(0)).not.toHaveAttribute('open', '');
  await expect(sec.locator('[data-cta="faq"]')).toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes.faq));
});

test('pie: CTA gigante, contacto y datos legales', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('.site-footer');
  await expect(footer.locator('.footer-cta')).toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes.footer));
  await expect(footer.locator('.footer-cta__text')).toHaveText('Hablemos');
  await expect(footer.locator('a[href="mailto:hola@pixely.pe"]')).toBeVisible();
  await expect(footer.locator('a[href="https://www.instagram.com/pixely_pe/"]')).toBeVisible();
  await expect(footer.getByText('© 2026 Pixely · SYNTESIA LABS E.I.R.L. · RUC 20616010787')).toBeVisible();
  await expect(footer.locator('a[href="/terminos"]')).toBeVisible();
  await expect(footer.locator('a[href="/privacidad"]')).toBeVisible();
});

test('pie: el CTA gigante cabe completo a 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  const cta = page.locator('.footer-cta');
  await cta.scrollIntoViewIfNeeded();
  const arrow = await page.locator('.footer-cta__arrow').boundingBox();
  const text = await page.locator('.footer-cta__text').boundingBox();
  expect(arrow.x + arrow.width).toBeLessThanOrEqual(320);
  expect(text.x + text.width).toBeLessThanOrEqual(arrow.x);
});
