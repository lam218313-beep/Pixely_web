export function buildWhatsAppUrl(numero, mensaje) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

export function applyCtaLinks(root, cfg) {
  root.querySelectorAll('[data-cta]').forEach((el) => {
    const mensaje = cfg.mensajes[el.dataset.cta] ?? cfg.mensajes.default;
    el.setAttribute('href', buildWhatsAppUrl(cfg.whatsapp, mensaje));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
}
