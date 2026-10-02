import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { EASE } from './ease.js';

const FONT_WAIT_MS = 1200;

// Se divide cuando ya cargaron las fuentes (o tras un tope) para que el cambio
// de fuente no vuelva a partir las palabras ya visibles (evita CLS).
function fontsSettled(doc) {
  if (!doc.fonts) return Promise.resolve();
  return Promise.race([doc.fonts.ready, new Promise((r) => setTimeout(r, FONT_WAIT_MS))]);
}

// Los títulos están ocultos hasta dividirse: si algo falla, se muestran sin animación.
const show = (el) => { el.style.visibility = 'visible'; };

export function initSplitWords(doc) {
  return fontsSettled(doc)
    .then(() => {
      doc.querySelectorAll('[data-split]').forEach((el) => {
        try {
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
        } catch {
          show(el);
        }
      });
    })
    .catch(() => doc.querySelectorAll('[data-split]').forEach(show));
}
