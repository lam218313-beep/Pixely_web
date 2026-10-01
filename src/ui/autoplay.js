const LABEL_PAUSE = 'Pausar showreel';
const LABEL_PLAY = 'Reproducir showreel';

function wireToggle(video, setUserPaused) {
  const button = video.closest('figure')?.querySelector('[data-video-toggle]');
  if (!button) return null;
  const label = button.querySelector('[data-video-toggle-label]');
  const icon = button.querySelector('[data-video-toggle-icon]');
  const sync = () => {
    const paused = video.paused;
    button.setAttribute('aria-pressed', String(paused));
    if (label) label.textContent = paused ? LABEL_PLAY : LABEL_PAUSE;
    if (icon) icon.textContent = paused ? '▶' : '❚❚';
  };
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  button.addEventListener('click', () => {
    if (video.paused) {
      setUserPaused(false);
      video.play().catch(sync);
    } else {
      setUserPaused(true);
      video.pause();
    }
  });
  return sync;
}

export function initAutoplay(doc, reduced) {
  const videos = [...doc.querySelectorAll('video[data-autoplay]')];
  if (videos.length === 0) return;
  const userPaused = new WeakMap();
  const syncs = new Map();
  for (const video of videos) {
    const sync = wireToggle(video, (value) => userPaused.set(video, value));
    if (sync) syncs.set(video, sync);
    if (reduced) sync?.();
  }
  if (reduced) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const video = entry.target;
      if (entry.isIntersecting) {
        if (userPaused.get(video)) continue;
        video.muted = true;
        video.play().catch(() => syncs.get(video)?.());
      } else {
        video.pause();
      }
    }
  }, { threshold: 0.1 });
  videos.forEach((v) => io.observe(v));
}
