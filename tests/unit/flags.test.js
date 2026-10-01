import { describe, it, expect, beforeEach } from 'vitest';
import { applyFlags } from '../../src/core/flags.js';

describe('applyFlags', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="casos" data-flag="mostrarCasos" hidden></section>
      <a id="acceso" data-flag="mostrarPartners" hidden></a>
      <span id="pronto" data-flag-off="mostrarPartners">Próximamente</span>`;
  });

  it('mantiene oculto lo que tiene el interruptor apagado', () => {
    applyFlags(document, { mostrarCasos: false, mostrarPartners: false });
    expect(document.getElementById('casos').hidden).toBe(true);
    expect(document.getElementById('acceso').hidden).toBe(true);
    expect(document.getElementById('pronto').hidden).toBe(false);
  });

  it('muestra lo encendido y oculta su alternativa', () => {
    applyFlags(document, { mostrarCasos: true, mostrarPartners: true });
    expect(document.getElementById('casos').hidden).toBe(false);
    expect(document.getElementById('acceso').hidden).toBe(false);
    expect(document.getElementById('pronto').hidden).toBe(true);
  });

  it('trata un interruptor ausente como apagado', () => {
    applyFlags(document, {});
    expect(document.getElementById('casos').hidden).toBe(true);
  });
});
