import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const bg = readFileSync('public/media/og-fondo-1600.jpg').toString('base64');
const logo = readFileSync('public/brand/pixely-p.svg').toString('base64');

const html = `<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500&family=Bricolage+Grotesque:opsz,wght@12..96,500&display=swap" rel="stylesheet">
<style>
  body { margin: 0; width: 1200px; height: 630px; background: #0A0A0C url(data:image/jpeg;base64,${bg}) center/cover; color: #fff; font-family: 'Albert Sans', sans-serif; }
  .wrap { padding: 72px 80px; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; }
  img { width: 56px; }
  h1 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 500; font-size: 84px; line-height: 1.02; margin: 0; letter-spacing: -1px; }
  p { font-size: 30px; margin: 16px 0 0; color: rgba(255,255,255,.75); }
  span { color: #EB0C6E; }
</style></head><body><div class="wrap">
  <img src="data:image/svg+xml;base64,${logo}" alt="">
  <div><h1>Publicidad<br>que vende<span>.</span></h1><p>Tu publicidad sale de datos reales.</p></div>
</div></body></html>`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/brand/og.jpg', type: 'jpeg', quality: 85 });
await browser.close();
console.log('public/brand/og.jpg generado');
