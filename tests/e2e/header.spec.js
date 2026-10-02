import { test, expect } from '@playwright/test';

test('la cabecera muestra el logo y el CTA de WhatsApp', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Pixely — inicio' })).toBeVisible();
  const cta = page.locator('.site-header [data-cta="header"]');
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', /^https:\/\/wa\.me\/51949268607\?text=/);
  await expect(cta).toHaveCSS('background-color', 'rgb(217, 11, 102)');
  await expect(page.locator('.site-header__access')).toBeHidden();
});

test('escritorio: anclas visibles y sin botón de menú', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await expect(page.locator('.site-header__nav')).toBeVisible();
  await expect(page.locator('.site-header__toggle')).toBeHidden();
});

test('móvil: el menú se abre y se cierra', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Abrir menú' });
  await toggle.click();
  await expect(page.locator('#menu-panel')).toBeVisible();
  await expect(page.locator('main')).toHaveAttribute('inert', '');
  await expect(page.locator('footer')).toHaveAttribute('inert', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu-panel')).toBeHidden();
  await expect(page.locator('main')).not.toHaveAttribute('inert');
});

test('el menú abierto se cierra al ensanchar a escritorio', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  await expect(page.locator('#menu-panel')).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator('#menu-panel')).toBeHidden();
  await expect(page.locator('main')).not.toHaveAttribute('inert');
});

test('escritorio: sobre fondo claro el hover del menú usa el magenta AA', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.getElementById('rubros').offsetTop + 10));
  await expect(page.locator('.site-header')).toHaveAttribute('data-theme', 'light');
  const link = page.locator('.site-header__nav a[href="#planes"]');
  await link.hover();
  await expect(link).toHaveCSS('color', 'rgb(217, 11, 102)');
});
