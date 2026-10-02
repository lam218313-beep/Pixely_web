import { gsap } from 'gsap';

export function initTiltMedia(doc) {
  const wrap = doc.querySelector('[data-tilt-wrap]');
  const media = doc.querySelector('[data-tilt]');
  if (!wrap || !media) return;
  gsap.matchMedia().add('(min-width: 1024px)', () => {
    gsap.fromTo(media, { rotate: -15 }, {
      rotate: 0,
      ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top 40%', end: 'bottom 60%', scrub: true },
    });
  });
}
