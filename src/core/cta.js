import { withRef } from './analytics.js';

export function buildWhatsAppUrl(numero, mensaje) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

export function applyCtaLinks(root, cfg, origen = null) {
  root.querySelectorAll('[data-cta]').forEach((el) => {
    const mensaje = withRef(cfg.mensajes[el.dataset.cta] ?? cfg.mensajes.default, origen);
    el.setAttribute('href', buildWhatsAppUrl(cfg.whatsapp, mensaje));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
}
