// @vitest-environment node
import { it, expect } from 'vitest';
import sharp from 'sharp';

it('la imagen OG mide 1200×630', async () => {
  const meta = await sharp('public/brand/og.jpg').metadata();
  expect([meta.width, meta.height]).toEqual([1200, 630]);
});
