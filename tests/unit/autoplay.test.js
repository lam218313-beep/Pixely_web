import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initAutoplay } from '../../src/ui/autoplay.js';

let observerCallback;
let video;
let button;
let label;

function stubMedia() {
  let paused = true;
  Object.defineProperty(video, 'paused', { configurable: true, get: () => paused });
  video.play = vi.fn(() => { paused = false; video.dispatchEvent(new Event('play')); return Promise.resolve(); });
  video.pause = vi.fn(() => { paused = true; video.dispatchEvent(new Event('pause')); });
}

function intersect(isIntersecting) {
  observerCallback([{ target: video, isIntersecting }]);
}

describe('initAutoplay', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <figure class="hero__media">
        <video data-autoplay muted loop></video>
        <button type="button" data-video-toggle aria-pressed="false">
          <span aria-hidden="true" data-video-toggle-icon>❚❚</span><span class="visually-hidden" data-video-toggle-label>Pausar showreel</span>
        </button>
      </figure>`;
    video = document.querySelector('video');
    button = document.querySelector('[data-video-toggle]');
    label = document.querySelector('[data-video-toggle-label]');
    stubMedia();
    globalThis.IntersectionObserver = class {
      constructor(cb) { observerCallback = cb; }
      observe() {}
    };
  });

  it('reproduce al entrar en pantalla y el botón pausa y reanuda', () => {
    initAutoplay(document, false);
    intersect(true);
    expect(video.paused).toBe(false);
    expect(label.textContent).toBe('Pausar showreel');
    expect(button.getAttribute('aria-pressed')).toBe('false');

    button.click();
    expect(video.paused).toBe(true);
    expect(label.textContent).toBe('Reproducir showreel');
    expect(button.getAttribute('aria-pressed')).toBe('true');

    button.click();
    expect(video.paused).toBe(false);
    expect(label.textContent).toBe('Pausar showreel');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('si el usuario pausa, el observador no lo reanuda al volver a entrar', () => {
    initAutoplay(document, false);
    intersect(true);
    button.click();
    intersect(false);
    intersect(true);
    expect(video.paused).toBe(true);
  });

  it('con movimiento reducido no reproduce solo, pero el botón lo inicia', () => {
    initAutoplay(document, true);
    expect(video.play).not.toHaveBeenCalled();
    expect(label.textContent).toBe('Reproducir showreel');
    expect(button.getAttribute('aria-pressed')).toBe('true');

    button.click();
    expect(video.paused).toBe(false);
    expect(label.textContent).toBe('Pausar showreel');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });
});
