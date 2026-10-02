export function initMenu(doc) {
  const toggle = doc.querySelector('.site-header__toggle');
  const panel = doc.querySelector('#menu-panel');
  if (!toggle || !panel) return { open() {}, close() {} };

  // Con el menú abierto, el foco no puede escapar al contenido que queda detrás.
  const behind = [doc.querySelector('main'), doc.querySelector('footer')].filter(Boolean);
  const setInert = (on) => behind.forEach((el) => { el.inert = on; });

  const announce = (open) => doc.dispatchEvent(new CustomEvent('menu:toggle', { detail: { open } }));

  function open() {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    doc.body.classList.add('menu-open');
    setInert(true);
    announce(true);
  }

  function close() {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    doc.body.classList.remove('menu-open');
    setInert(false);
    announce(false);
  }

  toggle.addEventListener('click', () => (panel.hidden ? open() : close()));
  panel.addEventListener('click', (e) => {
    if (e.target.closest('a')) close();
  });
  doc.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      close();
      toggle.focus();
    }
  });

  // Al pasar a escritorio el botón desaparece: se cierra para no dejar el scroll detenido.
  const desktop = doc.defaultView?.matchMedia?.('(min-width: 1024px)');
  desktop?.addEventListener('change', (e) => {
    if (e.matches && !panel.hidden) close();
  });

  return { open, close };
}
