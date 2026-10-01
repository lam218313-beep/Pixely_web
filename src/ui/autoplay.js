export function initAutoplay(doc, reduced) {
  const videos = [...doc.querySelectorAll('video[data-autoplay]')];
  if (reduced || videos.length === 0) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.muted = true;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  }, { threshold: 0.1 });
  videos.forEach((v) => io.observe(v));
}
