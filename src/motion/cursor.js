export function initCursor(doc) {
  if (!window.matchMedia('(pointer: fine)').matches) return null;
  const zone = doc.querySelector('[data-cursor-zone]');
  if (!zone) return null;

  const dot = doc.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  dot.innerHTML = '<span>→</span>';
  doc.body.appendChild(dot);

  let x = 0; let y = 0; let cx = 0; let cy = 0;
  let active = false;
  let frame = null;

  function loop() {
    cx += (x - cx) * 0.2;
    cy += (y - cy) * 0.2;
    dot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    frame = active ? requestAnimationFrame(loop) : null;
  }

  zone.addEventListener('pointerenter', (e) => {
    active = true;
    x = cx = e.clientX;
    y = cy = e.clientY;
    zone.classList.add('has-cursor');
    dot.classList.add('is-visible');
    if (!frame) frame = requestAnimationFrame(loop);
  });
  zone.addEventListener('pointermove', (e) => {
    x = e.clientX;
    y = e.clientY;
  });
  zone.addEventListener('pointerleave', () => {
    active = false;
    zone.classList.remove('has-cursor');
    dot.classList.remove('is-visible');
  });

  return dot;
}
