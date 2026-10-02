// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');

describe('.vercelignore', () => {
  it('deja fuera las fuentes, los artefactos y las notas internas', () => {
    const lines = readFileSync(resolve(root, '.vercelignore'), 'utf8').split(/\r?\n/).map((l) => l.trim());
    for (const entry of ['media-src/', '.superpowers/', 'test-results/', 'playwright-report/', 'dist/', 'node_modules/', 'docs/brand-source/', '.claude/']) {
      expect(lines).toContain(entry);
    }
  });
});

describe('vercel.json', () => {
  it('cachea para siempre los assets con hash', () => {
    const { headers } = JSON.parse(readFileSync(resolve(root, 'vercel.json'), 'utf8'));
    const assets = headers.find((h) => h.source === '/assets/(.*)');
    expect(assets?.headers).toContainEqual({ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' });
  });
});
