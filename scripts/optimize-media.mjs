import { mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { IMAGES } from './media-manifest.mjs';

const SRC = 'media-src/images';
const OUT = 'public/media';
mkdirSync(OUT, { recursive: true });
const sources = readdirSync(SRC);

const encoders = {
  avif: (p) => p.avif({ quality: 50 }),
  webp: (p) => p.webp({ quality: 72 }),
  jpg: (p) => p.jpeg({ quality: 78, mozjpeg: true }),
};

for (const img of IMAGES) {
  const file = sources.find((f) => f.startsWith(`${img.id}.`));
  if (!file) throw new Error(`Falta el original de ${img.id} en ${SRC}`);
  for (const w of img.widths) {
    const base = sharp(join(SRC, file)).resize({ width: w, withoutEnlargement: true });
    for (const ext of img.formats) {
      await encoders[ext](base.clone()).toFile(join(OUT, `${img.id}-${w}.${ext}`));
    }
  }
  console.log(`✓ ${img.id}`);
}
