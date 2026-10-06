// Medición de origen de las visitas. Sin ID de Google Tag Manager no carga nada de terceros:
// solo lee de dónde llegó la visita (los parámetros del enlace) y avisa al dataLayer local.

const CLAVES_UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const ORIGEN_POR_CLICK_ID = { gclid: 'google', fbclid: 'meta', ttclid: 'tiktok' };

const limpio = (valor) => String(valor ?? '').toLowerCase().replace(/[^a-z0-9_\-]/g, '').slice(0, 30);

export function readOrigin(search = '') {
  const params = new URLSearchParams(search);
  const utm = {};
  for (const clave of CLAVES_UTM) {
    const valor = limpio(params.get(clave));
    if (valor) utm[clave.replace('utm_', '')] = valor;
  }
  if (!utm.source) {
    const click = Object.keys(ORIGEN_POR_CLICK_ID).find((c) => params.has(c));
    if (click) utm.source = ORIGEN_POR_CLICK_ID[click];
  }
  return utm.source ? utm : null;
}

export function refLabel(origen) {
  if (!origen?.source) return '';
  return origen.campaign ? `${origen.source}/${origen.campaign}` : origen.source;
}

export function withRef(mensaje, origen) {
  const ref = refLabel(origen);
  return ref ? `${mensaje} (Ref: ${ref})` : mensaje;
}

function cargarGtm(win, doc, id) {
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = doc.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  doc.head.appendChild(script);
}

export function initAnalytics(root, cfg, origen, win = window) {
  const doc = root.ownerDocument ?? root;
  win.dataLayer = win.dataLayer || [];
  const datos = () => ({ origen: origen?.source ?? 'directo', medio: origen?.medium ?? '', campana: origen?.campaign ?? '' });

  if (cfg.analytics?.gtm) cargarGtm(win, doc, cfg.analytics.gtm);

  doc.addEventListener('click', (e) => {
    const enlace = e.target.closest?.('a');
    if (!enlace) return;
    if (enlace.dataset.cta) {
      win.dataLayer.push({ event: 'click_whatsapp', cta: enlace.dataset.cta, ...datos() });
    } else if (enlace.getAttribute('href')?.startsWith(cfg.partnersUrl)) {
      win.dataLayer.push({ event: 'click_partners', ...datos() });
    }
  });

  win.dataLayer.push({ event: 'visita', ...datos() });
}
