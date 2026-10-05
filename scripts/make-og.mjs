// Share image (WhatsApp, redes): 1200×630 with the brand wordmark "pixely." and the brand fonts.
// Run: npm run og   (CHROME=/ruta/a/chrome si no hay Chrome instalado)
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const b64 = (p) => readFileSync(p).toString('base64');
const bg = b64('public/media/og-fondo-1600.jpg');
const unbounded = b64('node_modules/@fontsource-variable/unbounded/files/unbounded-latin-wght-normal.woff2');
const manrope = b64('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2');

const html = `<!doctype html><html><head><style>
  @font-face { font-family: 'Unbounded'; src: url(data:font/woff2;base64,${unbounded}) format('woff2'); font-weight: 200 900; }
  @font-face { font-family: 'Manrope'; src: url(data:font/woff2;base64,${manrope}) format('woff2'); font-weight: 200 800; }
  body { margin: 0; width: 1200px; height: 630px; background: #0A0A0C url(data:image/jpeg;base64,${bg}) center/cover; color: #fff; font-family: 'Manrope', sans-serif; }
  .wrap { padding: 72px 80px; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; }
  .mark { font-family: 'Unbounded'; font-weight: 800; font-size: 44px; letter-spacing: -0.01em; }
  h1 { font-family: 'Unbounded'; font-weight: 700; font-size: 70px; line-height: 1.04; margin: 0; letter-spacing: -0.02em; max-width: 13ch; }
  p { font-size: 28px; margin: 22px 0 0; color: rgba(255,255,255,.8); }
  b { color: #EB0C6E; }
</style></head><body><div class="wrap">
  <div class="mark">pixely<b>.</b></div>
  <div><h1>Publicidad que vende<b>.</b></h1><p>Tu publicidad sale de datos reales.</p></div>
</div></body></html>`;

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : { channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/brand/og.jpg', type: 'jpeg', quality: 85 });
await browser.close();
console.log('public/brand/og.jpg generado');
