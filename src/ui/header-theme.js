export function themeAt(probeY, rects) {
  const hit = rects.find((r) => probeY >= r.top && probeY < r.bottom);
  return hit ? hit.theme : null;
}

export function initHeaderTheme(doc) {
  const header = doc.querySelector('.site-header');
  const sections = [...doc.querySelectorAll('main > section[data-theme], footer[data-theme]')];
  if (!header || sections.length === 0) return;

  let queued = false;
  function update() {
    queued = false;
    const probe = header.offsetHeight / 2;
    const rects = sections
      .filter((s) => !s.hidden)
      .map((s) => {
        const r = s.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, theme: s.dataset.theme };
      });
    const theme = themeAt(probe, rects);
    if (theme) header.dataset.theme = theme;
  }

  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  update();
}
