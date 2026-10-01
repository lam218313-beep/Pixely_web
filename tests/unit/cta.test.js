import { describe, it, expect, beforeEach } from 'vitest';
import { buildWhatsAppUrl, applyCtaLinks } from '../../src/core/cta.js';

const cfg = {
  whatsapp: '51949268607',
  mensajes: {
    default: 'Hola Pixely',
    hero: 'Hola Pixely, vengo de su web y quiero saber qué plan me conviene.',
  },
};

describe('buildWhatsAppUrl', () => {
  it('codifica el mensaje en la URL de wa.me', () => {
    expect(buildWhatsAppUrl('51949268607', 'Hola Pixely, ¿qué tal?'))
      .toBe('https://wa.me/51949268607?text=Hola%20Pixely%2C%20%C2%BFqu%C3%A9%20tal%3F');
  });
});

describe('applyCtaLinks', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <a id="a" data-cta="hero" href="https://wa.me/51949268607">A</a>
      <a id="b" data-cta="desconocida" href="https://wa.me/51949268607">B</a>`;
  });

  it('pone href, target y rel según la clave', () => {
    applyCtaLinks(document, cfg);
    const a = document.getElementById('a');
    expect(a.getAttribute('href')).toBe(buildWhatsAppUrl(cfg.whatsapp, cfg.mensajes.hero));
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toBe('noopener');
  });

  it('usa el mensaje por defecto con una clave desconocida', () => {
    applyCtaLinks(document, cfg);
    expect(document.getElementById('b').getAttribute('href'))
      .toBe(buildWhatsAppUrl(cfg.whatsapp, cfg.mensajes.default));
  });
});
