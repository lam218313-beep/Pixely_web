// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { IMAGES, VIDEO_FILES, VIDEO_MAX_BYTES } from '../../scripts/media-manifest.mjs';

describe('medios optimizados', () => {
  it('hay 23 imágenes en el manifiesto', () => {
    expect(IMAGES).toHaveLength(23);
  });

  for (const img of IMAGES) {
    for (const w of img.widths) {
      for (const ext of img.formats) {
        const file = `public/media/${img.id}-${w}.${ext}`;
        it(`existe ${file}`, () => expect(existsSync(file)).toBe(true));
      }
    }
  }

  for (const name of VIDEO_FILES) {
    it(`existe public/media/${name} y pesa ≤ 4 MB`, () => {
      const file = `public/media/${name}`;
      expect(existsSync(file)).toBe(true);
      expect(statSync(file).size).toBeLessThanOrEqual(VIDEO_MAX_BYTES);
    });
  }
});
