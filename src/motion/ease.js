import { CustomEase } from 'gsap/CustomEase';

export const EASE = 'pixely';

export function registerEase(gsap) {
  gsap.registerPlugin(CustomEase);
  CustomEase.create(EASE, 'M0,0 C0.22,1 0.36,1 1,1');
}
