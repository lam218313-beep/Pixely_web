import { gsap } from 'gsap';

// Filas de problemas apiladas: como en la referencia, el contenido de cada fila
// se desvanece (la foto se encoge) mientras la siguiente sube a cubrirla (solo donde son sticky).
export function initStackFade(doc) {
  const rows = [...doc.querySelectorAll('.problemas__list > .problema')];
  if (rows.length < 2) return;
  gsap.matchMedia().add('(min-width: 1024px)', () => {
    rows.slice(0, -1).forEach((row, i) => {
      const scrollTrigger = () => ({
        trigger: rows[i + 1],
        start: 'top bottom',
        end: () => `top ${parseFloat(getComputedStyle(row).top) || 0}px`,
        scrub: true,
        invalidateOnRefresh: true,
      });
      // Text fades; the photo only shrinks back (fading it would tint it with the magenta behind).
      gsap.to(row.querySelectorAll('.problema__q, .problema__a'), { opacity: 0, ease: 'none', scrollTrigger: scrollTrigger() });
      gsap.to(row.querySelectorAll('.problema__media'), { scale: 0.9, ease: 'none', transformOrigin: '50% 0%', scrollTrigger: scrollTrigger() });
    });
  });
}
