import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const url = process.argv[2] ?? 'http://localhost:4173/';
const MIN = { performance: 90, accessibility: 95, 'best-practices': 95, seo: 95 };

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });
const result = await lighthouse(url, {
  port: chrome.port,
  logLevel: 'error',
  onlyCategories: Object.keys(MIN),
});
await chrome.kill();

let failed = false;
for (const [key, min] of Object.entries(MIN)) {
  const score = Math.round(result.lhr.categories[key].score * 100);
  const ok = score >= min;
  if (!ok) failed = true;
  console.log(`${ok ? '✓' : '✗'} ${key}: ${score} (mínimo ${min})`);
}
process.exit(failed ? 1 : 0);
