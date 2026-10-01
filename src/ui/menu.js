export function initMenu(doc) {
  const toggle = doc.querySelector('.site-header__toggle');
  const panel = doc.querySelector('#menu-panel');
  if (!toggle || !panel) return { open() {}, close() {} };

  function open() {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    doc.body.classList.add('menu-open');
  }

  function close() {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    doc.body.classList.remove('menu-open');
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

  return { open, close };
}
