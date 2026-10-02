import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function initSmoothScroll(gsap, ScrollTrigger) {
  if (!window.matchMedia('(pointer: fine)').matches) return null;
  // Lenis ya descuenta el scroll-padding-top del html (altura de la cabecera).
  const lenis = new Lenis({ lerp: 0.1, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  // Con el menú abierto la página de fondo no se desplaza.
  document.addEventListener('menu:toggle', (e) => (e.detail.open ? lenis.stop() : lenis.start()));
  return lenis;
}
