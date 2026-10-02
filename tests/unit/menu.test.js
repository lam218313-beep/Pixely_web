import { describe, it, expect, beforeEach } from 'vitest';
import { initMenu } from '../../src/ui/menu.js';

describe('initMenu', () => {
  beforeEach(() => {
    document.body.className = '';
    document.body.innerHTML = `
      <button class="site-header__toggle" aria-expanded="false" aria-controls="menu-panel" aria-label="Abrir menú"></button>
      <div id="menu-panel" hidden><a id="link" href="#planes">Planes</a></div>`;
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
