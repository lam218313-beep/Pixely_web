// @vitest-environment node
import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const isMagenta = (r, g, b) => r > 175 && g < 120 && b > 40 && b < 180;

it('el SVG del logo coincide al menos un 98 % con el PNG original', async () => {
  const svg = readFileSync('public/brand/pixely-p.svg', 'utf8')
    .replace(/viewBox="[^"]*"/, 'viewBox="0 0 1245 1245" width="1245" height="1245"');
  const a = await sharp(Buffer.from(svg)).flatten({ background: '#ffffff' }).removeAlpha().raw().toBuffer();
  const b = await sharp('docs/brand-source/logo_pixely.png').flatten({ background: '#ffffff' }).removeAlpha().raw().toBuffer();
  expect(a.length).toBe(b.length);
  let inter = 0;
  let union = 0;
  for (let i = 0; i < a.length; i += 3) {
    const ma = isMagenta(a[i], a[i + 1], a[i + 2]);
    const mb = isMagenta(b[i], b[i + 1], b[i + 2]);
    if (ma && mb) inter += 1;
    if (ma || mb) union += 1;
  }
  expect(inter / union).toBeGreaterThanOrEqual(0.98);
});
