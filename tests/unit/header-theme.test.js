import { it, expect } from 'vitest';
import { themeAt } from '../../src/ui/header-theme.js';

const rects = [
  { top: -500, bottom: 300, theme: 'dark' },
  { top: 300, bottom: 1200, theme: 'light' },
];

it('devuelve el tema de la sección que contiene la sonda', () => {
  expect(themeAt(38, rects)).toBe('dark');
  expect(themeAt(400, rects)).toBe('light');
});

it('devuelve null si ninguna sección contiene la sonda', () => {
  expect(themeAt(5000, rects)).toBeNull();
});
