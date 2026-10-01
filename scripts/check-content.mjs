import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

export const RULES = [
  { id: 'precio', re: /S\/\.?\s*\d/ },
  { id: 'barato', re: /\bbarat[oa]s?\b/i },
  { id: 'economico', re: /econ[oó]mic[oa]s?/i },
  { id: 'plantilla', re: /\bplantillas?\b/i },
  { id: 'como-todos', re: /\bcomo todos\b/i },
  { id: 'community-manager', re: /community\s+manager/i },
];

function extractText(doc) {
  const parts = [doc.title, doc.body ? doc.body.textContent : ''];
  doc.querySelectorAll('script[type="application/ld+json"]').forEach((el) => parts.push(el.textContent));
  doc.querySelectorAll('[alt], [aria-label], [title], [placeholder], meta[content]')
    .forEach((el) => {
      for (const attr of ['alt', 'aria-label', 'title', 'placeholder', 'content']) {
        const value = el.getAttribute(attr);
        if (value) parts.push(value);
      }
    });
  return parts.join('\n').normalize('NFC');
}

export function findViolations(html) {
  const doc = new JSDOM(html).window.document;
  const violations = [];
  const text = extractText(doc);
  for (const rule of RULES) {
    const match = text.match(rule.re);
    if (match) violations.push({ rule: rule.id, match: match[0] });
  }
  doc.getElementById('faq-canva')?.remove();
  const canva = extractText(doc).match(/\bcanva\b/i);
  if (canva) violations.push({ rule: 'canva-fuera-de-faq', match: canva[0] });
  return violations;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dir = process.argv[2] ?? 'dist';
  const files = readdirSync(dir).filter((f) => f.endsWith('.html'));
  let total = 0;
  for (const file of files) {
    const found = findViolations(readFileSync(join(dir, file), 'utf8'));
    for (const v of found) console.error(`${file}: [${v.rule}] "${v.match}"`);
    total += found.length;
  }
  if (files.length === 0) {
    console.error(`No hay archivos .html en ${dir}. ¿Corriste el build?`);
    process.exit(1);
  }
  console.log(`${files.length} páginas revisadas, ${total} infracciones.`);
  process.exit(total > 0 ? 1 : 0);
}
