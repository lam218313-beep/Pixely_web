import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { registerEase } from './ease.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initReveal } from './reveal.js';
import { initSplitWords } from './split-words.js';
import { initScramble } from './scramble.js';
import { initTiltMedia } from './tilt-media.js';
import { initStackFade } from './stack-fade.js';
import { initCursor } from './cursor.js';

export function bootMotion(doc) {
  if (!doc.documentElement.classList.contains('js-motion')) return false;
  window.__motionReady = true;
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
  registerEase(gsap);
  initSmoothScroll(gsap, ScrollTrigger);
  initReveal(doc);
  initSplitWords(doc);
  initScramble(doc);
  initTiltMedia(doc);
  initStackFade(doc);
  initCursor(doc);
  if (doc.fonts) doc.fonts.ready.then(() => ScrollTrigger.refresh());
  return true;
}
