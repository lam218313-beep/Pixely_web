import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { EASE } from './ease.js';

export function initSplitWords(doc) {
  doc.querySelectorAll('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'words',
      mask: 'words',
      wordsClass: 'split-word',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(self.words, {
          yPercent: 100,
          duration: 0.4,
          ease: EASE,
          stagger: 0.04,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      },
    });
  });
}
