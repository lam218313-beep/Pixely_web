import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const create = vi.fn();
vi.mock('gsap/SplitText', () => ({ SplitText: { create: (...args) => create(...args) } }));
vi.mock('gsap', () => ({ gsap: { set: vi.fn(), from: vi.fn() } }));

const { initSplitWords } = await import('../../src/motion/split-words.js');

const visibilities = () => [...document.querySelectorAll('[data-split]')].map((el) => el.style.visibility);

beforeEach(() => {
  create.mockReset();
  document.body.innerHTML = '<h1 data-split>Uno</h1><h2 data-split>Dos</h2>';
  Object.defineProperty(document, 'fonts', { value: { ready: Promise.resolve() }, configurable: true });
});

afterEach(() => {
  delete document.fonts;
});

describe('initSplitWords', () => {
  it('si SplitText falla en un título, ese título se muestra igual y los demás se dividen', async () => {
    create.mockImplementationOnce(() => { throw new Error('split roto'); });
    await initSplitWords(document);
    expect(create).toHaveBeenCalledTimes(2);
    expect(document.querySelector('h1').style.visibility).toBe('visible');
  });

  it('si la espera de fuentes falla, muestra todos los títulos', async () => {
    Object.defineProperty(document, 'fonts', { value: { ready: Promise.reject(new Error('fuentes')) }, configurable: true });
    await initSplitWords(document);
    expect(create).not.toHaveBeenCalled();
    expect(visibilities()).toEqual(['visible', 'visible']);
  });
});
