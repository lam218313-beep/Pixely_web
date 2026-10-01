import { it, expect, beforeEach } from 'vitest';
import { initTabs } from '../../src/ui/tabs.js';

beforeEach(() => {
  document.body.innerHTML = `
    <div data-tabs>
      <div role="tablist">
        <button role="tab" id="t1" aria-controls="p1" aria-selected="true">Uno</button>
        <button role="tab" id="t2" aria-controls="p2" aria-selected="false">Dos</button>
        <button role="tab" id="t3" aria-controls="p3" aria-selected="false">Tres</button>
      </div>
      <div role="tabpanel" id="p1"></div><div role="tabpanel" id="p2"></div><div role="tabpanel" id="p3"></div>
    </div>`;
  initTabs(document);
});

const $ = (id) => document.getElementById(id);

it('al iniciar muestra solo el panel seleccionado', () => {
  expect([$('p1').hidden, $('p2').hidden, $('p3').hidden]).toEqual([false, true, true]);
  expect([$('t1').tabIndex, $('t2').tabIndex]).toEqual([0, -1]);
});

it('cambia de panel con clic', () => {
  $('t2').click();
  expect($('t2').getAttribute('aria-selected')).toBe('true');
  expect([$('p1').hidden, $('p2').hidden]).toEqual([true, false]);
});

it('navega con flechas, Inicio y Fin', () => {
  $('t1').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  expect($('t3').getAttribute('aria-selected')).toBe('true');
  $('t3').dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
  expect($('t1').getAttribute('aria-selected')).toBe('true');
  $('t1').dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  expect($('p3').hidden).toBe(false);
});
