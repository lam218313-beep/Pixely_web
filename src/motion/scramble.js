import { gsap } from 'gsap';

const CHARS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

export function initScramble(doc) {
  doc.querySelectorAll('[data-scramble]').forEach((el) => {
    const text = el.textContent.trim();
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
      .set(el, { opacity: 1 })
      .to(el, { duration: 1.1, scrambleText: { text, chars: CHARS, speed: 0.5, revealDelay: 0.2 } });
  });
}
