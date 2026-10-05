// Brings the Partners screenshots (demo brand "Casa Norte", no real client) into the site.
// They are made in the Partners repo: `VITRINA=1 npx playwright test vitrina` in frontend/app
// (phone, 3×) and frontend/layout (computer, 2×). Here they become light WebP files plus the
// positions of the buttons, so the animations can tap exactly on them. Run: npm run vitrina
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const PARTNERS = process.env.PARTNERS ?? '../pixely/frontend';
const SOURCES = [join(PARTNERS, 'app/e2e-vitrina'), join(PARTNERS, 'layout/e2e-vitrina')];
const OUT = 'public/media/vitrina';
mkdirSync(OUT, { recursive: true });

for (const dir of SOURCES) {
  for (const file of readdirSync(dir)) {
    if (file === 'hotspots.json') { copyFileSync(join(dir, file), 'src/ui/vitrina-hotspots.json'); continue; }
    if (!file.endsWith('.png')) continue;
    const name = file.replace(/\.png$/, '');
    // Phones show at ~380 px wide (×2 for retina); the computer at ~760 px (×2).
    const width = name.startsWith('m-') ? 760 : 1520;
    await sharp(join(dir, file)).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(OUT, `${name}.webp`));
    console.log(`✓ ${name}`);
  }
}

// What stays pinned at the bottom of a phone screen (tab bar, footer buttons), cut from the normal
// capture so it can sit on top while the long capture scrolls underneath. % of the screen height.
const PIES = { 'm-plan': 0.2, 'm-idea': 0.1, 'm-pieza': 0.1, 'm-mercado': 0.1 };
for (const [name, share] of Object.entries(PIES)) {
  const src = join(SOURCES[0], `${name}.png`);
  const { width, height } = await sharp(src).metadata();
  const h = Math.round(height * share);
  await sharp(src).extract({ left: 0, top: height - h, width, height: h }).resize({ width: 760 }).webp({ quality: 85 }).toFile(join(OUT, `${name}-pie.webp`));
  console.log(`✓ ${name}-pie`);
}
