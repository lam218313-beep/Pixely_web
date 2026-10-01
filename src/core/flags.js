export function applyFlags(root, flags) {
  root.querySelectorAll('[data-flag]').forEach((el) => {
    el.hidden = !flags[el.dataset.flag];
  });
  root.querySelectorAll('[data-flag-off]').forEach((el) => {
    el.hidden = Boolean(flags[el.dataset.flagOff]);
  });
}
