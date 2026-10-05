// Tab and home-screen icons: the "p." of the Pixely Partners app (frontend/app/public in the Partners repo).
// Run: npm run icons   (PARTNERS=/ruta/al/repo/frontend si no está al lado)
import sharp from 'sharp';

const SRC = `${process.env.PARTNERS ?? '../pixely/frontend'}/app/public`;
await sharp(`${SRC}/favicon-64.png`).toFile('public/brand/favicon-64.png');
await sharp(`${SRC}/favicon-64.png`).resize(32, 32).png().toFile('public/brand/favicon-32.png');
await sharp(`${SRC}/apple-touch-icon.png`).toFile('public/brand/apple-touch-icon.png');
await sharp(`${SRC}/icon-512.png`).toFile('public/brand/icon-512.png');
console.log('Iconos (p.) copiados en public/brand/');
