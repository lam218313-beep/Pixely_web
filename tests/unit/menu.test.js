import { describe, it, expect, beforeEach } from 'vitest';
import { initMenu } from '../../src/ui/menu.js';

describe('initMenu', () => {
  beforeEach(() => {
    document.body.className = '';
    document.body.innerHTML = `
      <button class="site-header__toggle" aria-expanded="false" aria-controls="menu-panel" aria-label="Abrir menú"></button>
      <div id="menu-panel" hidden><a id="link" href="#planes">Planes</a></div>
      <main id="main"><a href="#x">x</a></main>
      <footer class="site-footer"><a href="#y">y</a></footer>`;
  });

  it('vuelve inertes main y footer mientras está abierto', () => {
    const menu = initMenu(document);
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    menu.open();
    expect(main.inert).toBe(true);
    expect(footer.inert).toBe(true);
    menu.close();
    expect(main.inert).toBe(false);
    expect(footer.inert).toBe(false);
  });

  it('se cierra al pasar a escritorio (min-width: 1024px)', () => {
    let onChange;
    const original = window.matchMedia;
    window.matchMedia = () => ({ matches: false, addEventListener: (type, fn) => { if (type === 'change') onChange = fn; } });
    try {
      const menu = initMenu(document);
      const panel = document.getElementById('menu-panel');
      menu.open();
      onChange({ matches: true });
      expect(panel.hidden).toBe(true);
      expect(document.querySelector('main').inert).toBe(false);
    } finally {
      window.matchMedia = original;
    }
  });

  it('abre y cierra con el botón', () => {
    initMenu(document);
    const toggle = document.querySelector('.site-header__toggle');
    const panel = document.getElementById('menu-panel');
    toggle.click();
    expect(panel.hidden).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-label')).toBe('Cerrar menú');
    expect(document.body.classList.contains('menu-open')).toBe(true);
    toggle.click();
    expect(panel.hidden).toBe(true);
    expect(document.body.classList.contains('menu-open')).toBe(false);
  });

  it('cierra con Escape y al pulsar un enlace', () => {
    const menu = initMenu(document);
    const panel = document.getElementById('menu-panel');
    menu.open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(panel.hidden).toBe(true);
    menu.open();
    document.getElementById('link').click();
    expect(panel.hidden).toBe(true);
  });

  it('avisa con menu:toggle al abrir y cerrar', () => {
    const menu = initMenu(document);
    const seen = [];
    document.addEventListener('menu:toggle', (e) => seen.push(e.detail.open));
    menu.open();
    menu.close();
    expect(seen).toEqual([true, false]);
  });
});
