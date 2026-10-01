import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const svg = readFileSync('public/brand/pixely-p.svg');

async function onInk(size, logoHeight, out) {
  const logo = await sharp(svg).resize({ height: logoHeight }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#0A0A0C' } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(out);
}

await sharp(svg, { density: 300 })
  .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png().toFile('public/brand/favicon-32.png');
await onInk(180, 128, 'public/brand/apple-touch-icon.png');
await onInk(512, 360, 'public/brand/icon-512.png');
console.log('Iconos generados en public/brand/');
