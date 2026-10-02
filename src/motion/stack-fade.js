import { gsap } from 'gsap';

// Filas de problemas apiladas: como en la referencia, el contenido de cada fila
// se desvanece mientras la siguiente sube a cubrirla (solo donde son sticky).
export function initStackFade(doc) {
  const rows = [...doc.querySelectorAll('.problemas__list > .problema')];
  if (rows.length < 2) return;
  gsap.matchMedia().add('(min-width: 1024px)', () => {
    rows.slice(0, -1).forEach((row, i) => {
      gsap.to(row.children, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: rows[i + 1],
          start: 'top bottom',
          end: () => `top ${parseFloat(getComputedStyle(row).top) || 0}px`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });
  });
}
