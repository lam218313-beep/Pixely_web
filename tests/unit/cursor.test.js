import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initCursor } from '../../src/motion/cursor.js';

function stubPointer(fine) {
  window.matchMedia = vi.fn().mockImplementation((q) => ({ matches: q.includes('pointer: fine') ? fine : false, media: q }));
}

beforeEach(() => {
  document.body.innerHTML = '<a data-cursor-zone href="#">Hablemos</a>';
  if (!globalThis.requestAnimationFrame) globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16);
});

describe('initCursor', () => {
  it('no hace nada en pantallas táctiles', () => {
    stubPointer(false);
    expect(initCursor(document)).toBeNull();
    expect(document.querySelector('.cursor-dot')).toBeNull();
  });

  it('muestra y oculta el cursor dentro de la zona', () => {
    stubPointer(true);
    const dot = initCursor(document);
    const zone = document.querySelector('[data-cursor-zone]');
    expect(dot.getAttribute('aria-hidden')).toBe('true');
    zone.dispatchEvent(new MouseEvent('pointerenter', { clientX: 20, clientY: 30 }));
    expect(dot.classList.contains('is-visible')).toBe(true);
    expect(zone.classList.contains('has-cursor')).toBe(true);
    zone.dispatchEvent(new MouseEvent('pointerleave'));
    expect(dot.classList.contains('is-visible')).toBe(false);
  });
});
