import { test, expect } from '@playwright/test';

test('la cabecera muestra el logo y el CTA de WhatsApp', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Pixely — inicio' })).toBeVisible();
  await expect(page.locator('.site-header__logo')).toHaveText('pixely.');
  const cta = page.locator('.site-header [data-cta="header"]');
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', /^https:\/\/wa\.me\/51949268607\?text=/);
  await expect(cta).toHaveCSS('background-color', 'rgb(235, 12, 110)');
});

test('el acceso a Pixely Partners es un enlace siempre disponible', async ({ page }, info) => {
  await page.goto('/');
  const access = page.locator('.site-header__access');
  await expect(access).toHaveAttribute('href', 'https://partners.pixely.pe');
  if (info.project.name === 'desktop') await expect(access).toBeVisible();
  else await expect(page.locator('.menu-panel a[href="https://partners.pixely.pe"]')).toHaveCount(1);
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

test('escritorio: sobre fondo magenta el hover del menú va en negro', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.getElementById('rubros').offsetTop + 10));
  await expect(page.locator('.site-header')).toHaveAttribute('data-theme', 'light');
  const link = page.locator('.site-header__nav a[href="#planes"]');
  await link.hover();
  await expect(link).toHaveCSS('color', 'rgb(10, 10, 12)');
});
