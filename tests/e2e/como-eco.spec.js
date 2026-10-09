import { test, expect } from '@playwright/test';

test('cómo funciona: 4 pasos, cada uno con su recorrido real de Partners', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#como-funciona');
  await expect(sec.locator('.paso h3')).toHaveText([
    '01 · Entendemos tu negocio', '02 · Leemos tu mercado', '03 · Estrategia y plan del mes', '04 · Validas cada pieza',
  ]);
  await expect(sec.locator('.paso .vitrina')).toHaveCount(4);
  for (const scene of ['negocio', 'mercado', 'plan', 'validar']) {
    const screen = sec.locator(`[data-vitrina="${scene}"] .vitrina__screen`);
    await screen.scrollIntoViewIfNeeded();
    await expect.poll(() => screen.locator('img').first().evaluate((im) => im.complete && im.naturalWidth > 0)).toBe(true);
  }
  await expect(sec.getByText('máximo 7 días hábiles', { exact: false })).toBeVisible();
});

test('ecosistema: las pestañas cambian el panel', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#ecosistema');
  await expect(sec.getByRole('tab')).toHaveText(['Leer', 'Medir', 'Decidir', 'Aprender']);
  await expect(sec.locator('#panel-investigar')).toBeVisible();
  await expect(sec.locator('#panel-producir')).toBeHidden();
  await sec.getByRole('tab', { name: 'Decidir' }).click();
  await expect(sec.locator('#panel-producir')).toBeVisible();
  await sec.getByRole('tab', { name: 'Decidir' }).press('ArrowRight');
  await expect(sec.locator('#panel-publicar')).toBeVisible();
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('los cuatro paneles se ven', async ({ page }) => {
    await page.goto('/');
    for (const id of ['investigar', 'planificar', 'producir', 'publicar']) {
      await expect(page.locator(`#panel-${id}`)).toBeVisible();
    }
  });
});

test('los recorridos se mueven solos: el celular de Validar cambia de pantalla', async ({ page }) => {
  await page.goto('/');
  const fig = page.locator('#como-funciona [data-vitrina="validar"]');
  await fig.scrollIntoViewIfNeeded();
  const shown = () => fig.locator('.vitrina__layer').last().getAttribute('data-shot');
  await expect.poll(shown, { timeout: 8000 }).toBe('m-validar');
  await expect.poll(shown, { timeout: 12000 }).toBe('m-validar-siguiente');
  await expect(page.locator('#como-funciona .vitrina__label').nth(3)).toHaveText('Aprobada. Va la siguiente');
});

test.describe('con reducir movimiento', () => {
  test.use({ reducedMotion: 'reduce' });
  test('los recorridos no muestran el dedo', async ({ page }) => {
    await page.goto('/');
    const fig = page.locator('#como-funciona [data-vitrina="plan"]');
    await fig.scrollIntoViewIfNeeded();
    await expect(fig.locator('.vitrina__finger')).toBeHidden();
  });
});
