/** Plans: the cards come in when the section is in view, and a soft light follows the cursor on each card. */
export function initPlanes(doc, reduced) {
  const grid = doc.querySelector('[data-planes]');
  if (!grid) return;
  if (reduced || !('IntersectionObserver' in window)) {
    grid.classList.add('is-in');
  } else {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { grid.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(grid);
  }
  grid.querySelectorAll('.plan__card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}
