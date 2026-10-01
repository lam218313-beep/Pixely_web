import { test, expect } from '@playwright/test';

test('cómo funciona: 4 pasos con imagen y tiempo de entrega', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#como-funciona');
  await expect(sec.locator('.paso h3')).toHaveText([
    '01 · Entrevista de marca', '02 · Lab de audiencia', '03 · Estrategia y calendario', '04 · Producción y entrega',
  ]);
  const imgs = sec.locator('img');
  await expect(imgs).toHaveCount(4);
  for (let i = 0; i < 4; i += 1) {
    await imgs.nth(i).scrollIntoViewIfNeeded();
    await expect.poll(() => imgs.nth(i).evaluate((im) => im.naturalWidth > 0)).toBe(true);
  }
  await expect(sec.getByText('7 y 14 días hábiles', { exact: false })).toBeVisible();
});

test('ecosistema: las pestañas cambian el panel', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#ecosistema');
  await expect(sec.getByRole('tab')).toHaveText(['Investigar', 'Planificar', 'Producir', 'Publicar y medir']);
  await expect(sec.locator('#panel-investigar')).toBeVisible();
  await expect(sec.locator('#panel-producir')).toBeHidden();
  await sec.getByRole('tab', { name: 'Producir' }).click();
  await expect(sec.locator('#panel-producir')).toBeVisible();
  await sec.getByRole('tab', { name: 'Producir' }).press('ArrowRight');
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
