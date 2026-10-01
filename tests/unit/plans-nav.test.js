import { it, expect, beforeEach } from 'vitest';
import { setActivePlan } from '../../src/ui/plans-nav.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

const cfg = { whatsapp: '51949268607', mensajes: { default: 'x', 'plan-basic': 'Hola Pixely, me interesa el Plan Basic.' } };

beforeEach(() => {
  document.body.innerHTML = `
    <nav class="planes__nav"><a href="#plan-pro" aria-current="true">Pro</a><a href="#plan-basic">Basic</a><a href="#plan-lite">Lite</a></nav>
    <a data-plan-cta data-cta="planes" href="#">CTA</a>`;
});

it('marca el plan activo y actualiza el CTA', () => {
  setActivePlan(document, 'basic', cfg);
  expect(document.querySelector('a[href="#plan-basic"]').getAttribute('aria-current')).toBe('true');
  expect(document.querySelector('a[href="#plan-pro"]').hasAttribute('aria-current')).toBe(false);
  const cta = document.querySelector('[data-plan-cta]');
  expect(cta.dataset.cta).toBe('plan-basic');
  expect(cta.getAttribute('href')).toBe(buildWhatsAppUrl(cfg.whatsapp, cfg.mensajes['plan-basic']));
});
