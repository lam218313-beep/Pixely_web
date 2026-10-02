// @vitest-environment node
import { it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

it.skipIf(!existsSync('dist/assets'))('el JavaScript compilado pesa ≤ 90 KB comprimido', () => {
  const files = readdirSync('dist/assets').filter((f) => f.endsWith('.js'));
  const total = files.reduce((sum, f) => sum + gzipSync(readFileSync(`dist/assets/${f}`)).length, 0);
  expect(total).toBeLessThanOrEqual(90 * 1024);
});
