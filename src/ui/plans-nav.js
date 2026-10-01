import { buildWhatsAppUrl } from '../core/cta.js';

export function setActivePlan(doc, plan, cfg) {
  doc.querySelectorAll('.planes__nav a[href^="#plan-"]').forEach((a) => {
    if (a.getAttribute('href') === `#plan-${plan}`) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });
  const cta = doc.querySelector('[data-plan-cta]');
  if (cta) {
    const key = `plan-${plan}`;
    cta.dataset.cta = key;
    cta.setAttribute('href', buildWhatsAppUrl(cfg.whatsapp, cfg.mensajes[key] ?? cfg.mensajes.default));
  }
}

export function initPlansNav(doc, cfg) {
  const plans = [...doc.querySelectorAll('article[data-plan]')];
  if (plans.length === 0 || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) setActivePlan(doc, entry.target.dataset.plan, cfg);
    }
  }, { rootMargin: '-40% 0px -55% 0px' });
  plans.forEach((p) => io.observe(p));
}
