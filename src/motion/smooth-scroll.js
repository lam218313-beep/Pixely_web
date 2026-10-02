import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function initSmoothScroll(gsap, ScrollTrigger) {
  if (!window.matchMedia('(pointer: fine)').matches) return null;
  const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -80 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
