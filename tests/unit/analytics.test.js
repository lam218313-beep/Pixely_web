import { describe, it, expect, beforeEach } from 'vitest';
import { readOrigin, refLabel, withRef, initAnalytics } from '../../src/core/analytics.js';
import { applyCtaLinks, buildWhatsAppUrl } from '../../src/core/cta.js';

describe('readOrigin', () => {
  it('lee utm_source, medio y campaña', () => {
    expect(readOrigin('?utm_source=instagram&utm_medium=bio&utm_campaign=prueba1'))
      .toEqual({ source: 'instagram', medium: 'bio', campaign: 'prueba1' });
  });
  it('devuelve null sin origen', () => {
    expect(readOrigin('')).toBeNull();
    expect(readOrigin('?foo=bar')).toBeNull();
  });
  it('deduce el origen del identificador de clic de cada plataforma', () => {
    expect(readOrigin('?gclid=abc')).toEqual({ source: 'google' });
    expect(readOrigin('?fbclid=abc')).toEqual({ source: 'meta' });
    expect(readOrigin('?ttclid=abc')).toEqual({ source: 'tiktok' });
  });
  it('limpia caracteres raros y recorta el largo', () => {
    expect(readOrigin('?utm_source=Insta%20gram<script>').source).toBe('instagramscript');
    expect(readOrigin(`?utm_source=${'a'.repeat(80)}`).source).toHaveLength(30);
  });
});

describe('withRef', () => {
  it('no cambia el mensaje sin origen', () => {
    expect(withRef('Hola Pixely', null)).toBe('Hola Pixely');
  });
  it('agrega la referencia al final', () => {
    expect(withRef('Hola Pixely', { source: 'tiktok' })).toBe('Hola Pixely (Ref: tiktok)');
    expect(refLabel({ source: 'tiktok', campaign: 'p1' })).toBe('tiktok/p1');
  });
});

describe('applyCtaLinks con origen', () => {
  const cfg = { whatsapp: '51949268607', mensajes: { default: 'Hola Pixely' } };
  beforeEach(() => { document.body.innerHTML = '<a id="a" data-cta="x" href="#">A</a>'; });
  it('la referencia viaja en el mensaje de WhatsApp', () => {
    applyCtaLinks(document, cfg, { source: 'instagram' });
    expect(document.getElementById('a').getAttribute('href'))
      .toBe(buildWhatsAppUrl(cfg.whatsapp, 'Hola Pixely (Ref: instagram)'));
  });
  it('sin origen el enlace queda igual que antes', () => {
    applyCtaLinks(document, cfg);
    expect(document.getElementById('a').getAttribute('href')).toBe(buildWhatsAppUrl(cfg.whatsapp, 'Hola Pixely'));
  });
});

describe('initAnalytics', () => {
  const cfg = { partnersUrl: 'https://partners.pixely.pe', analytics: { gtm: '' } };
  let win;
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = `
      <a id="w" data-cta="hero" href="#"><span id="in">W</span></a>
      <a id="p" href="https://partners.pixely.pe">P</a>
      <a id="o" href="/privacidad">O</a>`;
    win = { dataLayer: [] };
  });

  it('sin ID de GTM no carga ningún script', () => {
    initAnalytics(document, cfg, null, win);
    expect(document.head.querySelector('script')).toBeNull();
  });
  it('con ID de GTM carga el script de Google', () => {
    initAnalytics(document, { ...cfg, analytics: { gtm: 'GTM-ABC123' } }, null, win);
    expect(document.head.querySelector('script').src).toBe('https://www.googletagmanager.com/gtm.js?id=GTM-ABC123');
  });
  it('registra la visita con su origen', () => {
    initAnalytics(document, cfg, { source: 'tiktok', medium: 'bio' }, win);
    expect(win.dataLayer.at(-1)).toEqual({ event: 'visita', origen: 'tiktok', medio: 'bio', campana: '' });
  });
  it('registra el clic a WhatsApp con su botón y origen, también si se toca un elemento interno', () => {
    initAnalytics(document, cfg, { source: 'instagram' }, win);
    document.getElementById('in').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(win.dataLayer.at(-1)).toEqual({ event: 'click_whatsapp', cta: 'hero', origen: 'instagram', medio: '', campana: '' });
  });
  it('registra el clic a Partners y ignora los demás enlaces', () => {
    initAnalytics(document, cfg, null, win);
    document.getElementById('p').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(win.dataLayer.at(-1).event).toBe('click_partners');
    const antes = win.dataLayer.length;
    document.getElementById('o').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(win.dataLayer).toHaveLength(antes);
  });
  it('sin origen informa "directo"', () => {
    initAnalytics(document, cfg, null, win);
    expect(win.dataLayer.at(-1).origen).toBe('directo');
  });
});
