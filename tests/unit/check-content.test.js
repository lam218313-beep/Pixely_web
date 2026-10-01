import { describe, it, expect } from 'vitest';
import { findViolations } from '../../scripts/check-content.mjs';

const page = (body, head = '') => `<!doctype html><html><head><title>T</title>${head}</head><body>${body}</body></html>`;

describe('findViolations', () => {
  it('acepta un texto limpio', () => {
    expect(findViolations(page('<p>Publicidad que vende.</p>'))).toEqual([]);
  });

  it('detecta precios con S/', () => {
    const rules = findViolations(page('<p>Desde S/ 600 al mes</p>')).map((v) => v.rule);
    expect(rules).toContain('precio');
  });

  it('detecta palabras prohibidas sin importar mayúsculas ni tildes', () => {
    const rules = findViolations(page('<p>Barato, ECONÓMICA, plantillas, como todos, community manager</p>')).map((v) => v.rule);
    expect(rules).toEqual(expect.arrayContaining(['barato', 'economico', 'plantilla', 'como-todos', 'community-manager']));
  });

  it('revisa también atributos alt y meta description', () => {
    const html = page('<img alt="foto barata" src="x.jpg">', '<meta name="description" content="Plantilla gratis">');
    const rules = findViolations(html).map((v) => v.rule);
    expect(rules).toEqual(expect.arrayContaining(['barato', 'plantilla']));
  });

  it('permite Canva solo dentro de #faq-canva', () => {
    expect(findViolations(page('<details id="faq-canva"><summary>¿Y Canva?</summary></details>'))).toEqual([]);
    const rules = findViolations(page('<p>Mejor que Canva</p>')).map((v) => v.rule);
    expect(rules).toContain('canva-fuera-de-faq');
  });
});
