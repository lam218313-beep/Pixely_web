import { describe, it, expect } from 'vitest';
import { findViolations } from '../../scripts/check-content.mjs';

const page = (body, head = '') => `<!doctype html><html><head><title>T</title>${head}</head><body>${body}</body></html>`;

describe('findViolations', () => {
  it('acepta un texto limpio', () => {
    expect(findViolations(page('<p>Publicidad que vende.</p>'))).toEqual([]);
  });

  it('acepta precios con S/ (van en la web desde el 10 oct)', () => {
    expect(findViolations(page('<p>S/ 600 al mes, más IGV</p>'))).toEqual([]);
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

  it('revisa JSON-LD en el head', () => {
    const head = '<script type="application/ld+json">{"description":"El plan más barato"}</script>';
    const rules = findViolations(page('<p>Hola</p>', head)).map((v) => v.rule);
    expect(rules).toContain('barato');
  });

  it('revisa cualquier meta content, no solo description', () => {
    const rules = findViolations(page('<p>Hola</p>', '<meta name="keywords" content="barato">')).map((v) => v.rule);
    expect(rules).toContain('barato');
  });

  it('revisa el atributo placeholder', () => {
    const rules = findViolations(page('<input placeholder="Plantilla">')).map((v) => v.rule);
    expect(rules).toContain('plantilla');
  });

  it('detecta tildes descompuestas (NFD)', () => {
    const rules = findViolations(page('<p>económico</p>')).map((v) => v.rule);
    expect(rules).toContain('economico');
  });
});
