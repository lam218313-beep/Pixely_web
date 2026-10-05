import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initCursor, isMagenta } from '../../src/motion/cursor.js';

function stubPointer(fine) {
  window.matchMedia = vi.fn().mockImplementation((q) => ({ matches: q.includes('pointer: fine') ? fine : false, media: q }));
}
const move = (el, x = 20, y = 30) => el.dispatchEvent(new MouseEvent('pointermove', { clientX: x, clientY: y, bubbles: true }));

beforeEach(() => {
  document.documentElement.className = '';
  document.body.innerHTML = `
    <section id="negro" style="background: rgb(10, 10, 12)"><p id="texto">Hola</p><a id="link" href="#">Link</a></section>
    <section id="rosa" style="background: rgb(235, 12, 110)"><p id="texto-rosa">Hola</p></section>
    <a data-cursor-zone id="zona" href="#">Hablemos</a>`;
  if (!globalThis.requestAnimationFrame) globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16);
});

describe('initCursor', () => {
  it('no hace nada en pantallas táctiles', () => {
    stubPointer(false);
    expect(initCursor(document)).toBeNull();
    expect(document.querySelector('.cursor-dot')).toBeNull();
  });

  it('acompaña al mouse en toda la página: rosa sobre negro, negro sobre rosa', () => {
    stubPointer(true);
    const dot = initCursor(document);
    expect(dot.getAttribute('aria-hidden')).toBe('true');
    expect(document.documentElement.classList.contains('has-cursor')).toBe(true);
    move(document.getElementById('texto'));
    expect(dot.classList.contains('is-visible')).toBe(true);
    expect(dot.classList.contains('is-dark')).toBe(false);
    move(document.getElementById('texto-rosa'));
    expect(dot.classList.contains('is-dark')).toBe(true);
  });

  it('crece sobre enlaces y se vuelve la flecha grande sobre "Hablemos"', () => {
    stubPointer(true);
    const dot = initCursor(document);
    move(document.getElementById('link'));
    expect(dot.classList.contains('is-hover')).toBe(true);
    move(document.getElementById('zona'));
    expect(dot.classList.contains('is-big')).toBe(true);
    expect(dot.classList.contains('is-hover')).toBe(false);
  });
});

describe('isMagenta', () => {
  it('reconoce el magenta de marca y descarta negros y transparentes', () => {
    expect(isMagenta('rgb(235, 12, 110)')).toBe(true);
    expect(isMagenta('rgb(10, 10, 12)')).toBe(false);
    expect(isMagenta('rgba(235, 12, 110, 0.2)')).toBe(false);
    expect(isMagenta('')).toBe(false);
  });
});
