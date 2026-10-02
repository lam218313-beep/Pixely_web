import { gsap } from 'gsap';

export function initReveal(doc) {
  doc.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power1.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });
}
