const INTERACTIVE = 'a, button, summary, [role="tab"], label, .plan__card';

/** Is this colour the brand magenta (or close to it)? Then the cursor turns black over it. */
export function isMagenta(rgb) {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/.exec(rgb ?? '');
  if (!m || (m[4] !== undefined && Number(m[4]) < 0.5)) return false;
  const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
  return r > 180 && g < 80 && b > 60 && b < 160;
}

/** The first solid background behind an element (walking up its ancestors). */
function backgroundOf(el) {
  for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
    const bg = getComputedStyle(n).backgroundColor;
    const a = /rgba\([^)]*,\s*([\d.]+)\)/.exec(bg);
    if (bg !== 'transparent' && !(a && Number(a[1]) < 0.5)) return bg;
  }
  return '';
}

/**
 * The brand cursor, on the whole page (mouse/trackpad only): a magenta dot that turns black over
 * magenta, grows over anything clickable, and becomes the big arrow over "Hablemos".
 */
export function initCursor(doc) {
  if (!window.matchMedia('(pointer: fine)').matches) return null;

  const dot = doc.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  dot.innerHTML = '<span class="cursor-dot__ball"><span>→</span></span>';
  doc.body.appendChild(dot);
  doc.documentElement.classList.add('has-cursor');

  let x = -100; let y = -100;
  let frame = null;
  let last = null;

  const paint = () => {
    frame = null;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  doc.addEventListener('pointermove', (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    dot.classList.add('is-visible');
    const target = e.target;
    if (target !== last && target instanceof Element) {
      last = target;
      const zone = target.closest('[data-cursor-zone]');
      dot.classList.toggle('is-big', Boolean(zone));
      dot.classList.toggle('is-hover', !zone && Boolean(target.closest(INTERACTIVE)));
      dot.classList.toggle('is-dark', isMagenta(backgroundOf(target)));
    }
    if (!frame) frame = requestAnimationFrame(paint);
  }, { passive: true });
  doc.documentElement.addEventListener('pointerleave', () => dot.classList.remove('is-visible'));
  doc.addEventListener('pointerdown', () => dot.classList.add('is-down'));
  doc.addEventListener('pointerup', () => dot.classList.remove('is-down'));

  return dot;
}
