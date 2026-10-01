export function initTabs(doc) {
  doc.querySelectorAll('[data-tabs]').forEach((root) => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) => root.querySelector(`#${t.getAttribute('aria-controls')}`));

    function select(index, focus) {
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) tabs[index].focus();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i, false));
      tab.addEventListener('keydown', (e) => {
        const last = tabs.length - 1;
        const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
        if (next !== undefined) {
          e.preventDefault();
          select(next, true);
        }
      });
    });

    const start = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    select(start === -1 ? 0 : start, false);
  });
}
