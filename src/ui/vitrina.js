// Vitrina: real Pixely Partners screens (demo brand "Casa Norte") inside a phone or a laptop,
// played as a guided walk-through: a finger taps the real buttons, scrolls, swipes a piece to
// approve it, and a label says what is happening. Plain Web Animations, no library.
// The screens and button positions come from the Partners repo (see scripts/vitrina.mjs).
import SPOTS from './vitrina-hotspots.json';

/** Bump when the captures change, so browsers that cached the old ones fetch them again. */
const MEDIA_V = '3';
const SRC = (name) => `/media/vitrina/${name}.webp?v=${MEDIA_V}`;

/** Each walk-through: a list of steps. Positions are the real ones, in % of the screenshot. */
export const SCENES = {
  negocio: [
    { go: 'm-marca', label: 'Tu marca, en Partners' },
    { hold: 1400 },
    { tap: 'marca.voz', label: 'Abres tu voz de marca' },
    { go: 'm-voz', via: 'push', label: 'La revisas y la apruebas' },
    { hold: 2600 },
  ],
  mercado: [
    { go: 'm-mercado-largo', pie: 'm-mercado-pie', label: 'Radar Pixely, en tu bolsillo' },
    { hold: 1400 },
    { scroll: 62, ms: 2600, label: 'Hallazgos nuevos de tu competencia' },
    { hold: 1600 },
    { scroll: 0, ms: 1400 },
  ],
  'mercado-pc': [
    { go: 'd-mercado' },
    { hold: 2600 },
    { go: 'd-mercado-2', via: 'rise' },
    { hold: 2600 },
  ],
  plan: [
    { go: 'm-plan-largo', pie: 'm-plan-pie', label: 'Las ideas del mes' },
    { hold: 1200 },
    { scroll: 'plan.idea', ms: 2400, label: 'Cada idea, con su porqué' },
    { tap: 'plan.idea' },
    { go: 'm-idea-larga', pie: 'm-idea-pie', via: 'push', label: 'Qué contaremos y cómo' },
    { hold: 1000 },
    { scroll: 'idea.dato', ms: 2200, label: 'El dato de mercado detrás', mark: 'idea.dato' },
    { hold: 1600 },
    { tap: 'idea.aprobar', fixed: true, label: 'Apruebas la idea' },
    { hold: 1400 },
  ],
  validar: [
    { go: 'm-validar', label: 'La pieza terminada, como saldrá' },
    { hold: 1500 },
    { swipe: 'validar.card', dx: 38, to: 'm-validar-aprobar', label: 'Deslizas para aprobar' },
    { go: 'm-validar-siguiente', via: 'fly', label: 'Aprobada. Va la siguiente' },
    { hold: 1600 },
    { tap: 'validar.cambios', label: 'O pides un cambio' },
    { go: 'm-cambios-vacio', via: 'sheet' },
    { tap: 'cambios.imagen', label: 'Eliges qué cambiar' },
    { tap: 'cambios.luz' },
    { go: 'm-cambios', via: 'fade' },
    { hold: 900 },
    { tap: 'cambios.enviar', label: 'Y llega directo al equipo' },
    { hold: 1200 },
  ],
  inicio: [
    { go: 'm-inicio', label: 'Todo lo que te toca, de un vistazo' },
    { hold: 2200 },
    { tap: 'inicio.revisar' },
    { go: 'm-validar', via: 'push', label: 'Validas desde cualquier lugar' },
    { hold: 2200 },
    { go: 'm-resultado', via: 'push', label: 'Y ves cómo le fue' },
    { hold: 2600 },
  ],
  'partners-pc': [
    { go: 'd-planificacion-2' },
    { hold: 3000 },
    { go: 'd-validacion', via: 'rise' },
    { hold: 3000 },
    { go: 'd-publicaciones-2', via: 'rise' },
    { hold: 3000 },
  ],
  radar: [
    { go: 'd-mercado-2', label: 'Tu competencia, en un mapa' },
    { hold: 3200 },
    { go: 'd-mercado', via: 'rise', label: 'Tu mercado, en cifras' },
    { hold: 3200 },
  ],
  decidir: [
    { go: 'm-idea-larga', pie: 'm-idea-pie', label: 'Cada idea nace de un dato' },
    { hold: 1000 },
    { scroll: 'idea.dato', ms: 2200, label: 'El dato de mercado detrás', mark: 'idea.dato' },
    { hold: 3000 },
    { scroll: 0, ms: 1200 },
  ],
  resultado: [
    { go: 'm-resultado', label: 'Cada pieza, con sus números' },
    { hold: 4000 },
  ],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

class Player {
  constructor(fig, steps, reduced) {
    this.fig = fig;
    this.steps = steps;
    this.reduced = reduced;
    this.screen = fig.querySelector('.vitrina__screen');
    this.label = fig.closest('.vitrina')?.querySelector('.vitrina__label') ?? null;
    this.visible = false;
    this.waiters = [];
    this.layer = null;
    this.finger = document.createElement('span');
    this.finger.className = 'vitrina__finger';
    this.finger.setAttribute('aria-hidden', 'true');
    this.screen.append(this.finger);
  }

  setVisible(v) {
    this.visible = v;
    if (v) this.waiters.splice(0).forEach((r) => r());
  }

  gate() { return this.visible ? Promise.resolve() : new Promise((r) => this.waiters.push(r)); }

  /** Builds a screen layer: the (possibly long) capture plus what stays pinned at the bottom. */
  makeLayer(name, pie) {
    const layer = document.createElement('div');
    layer.className = 'vitrina__layer';
    const img = new Image();
    img.className = 'vitrina__img';
    img.alt = '';
    img.decoding = 'async';
    img.src = SRC(name);
    layer.append(img);
    if (pie) {
      const p = new Image();
      p.className = 'vitrina__pie';
      p.alt = '';
      p.src = SRC(pie);
      layer.append(p);
    }
    layer.dataset.shot = name;
    layer.scrollY = 0;
    return layer;
  }

  async go({ go, pie, via = 'fade' }) {
    const next = this.makeLayer(go, pie);
    await next.querySelector('img').decode().catch(() => {});
    this.screen.insertBefore(next, this.finger);
    const prev = this.layer;
    this.layer = next;
    const d = this.reduced ? 1 : 650;
    const enter = {
      fade: [{ opacity: 0 }, { opacity: 1 }],
      push: [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }],
      sheet: [{ transform: 'translateY(35%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
      rise: [{ transform: 'translateY(4%) scale(0.985)', opacity: 0 }, { transform: 'none', opacity: 1 }],
      fly: [{ opacity: 0, transform: 'scale(0.98)' }, { opacity: 1, transform: 'none' }],
    }[via];
    const anims = [next.animate(enter, { duration: d, easing: EASE, fill: 'both' })];
    if (prev) {
      const leave = via === 'push'
        ? [{ transform: 'translateX(0)' }, { transform: 'translateX(-28%)', opacity: 0.4 }]
        : [{ opacity: 1 }, { opacity: 0 }];
      anims.push(prev.animate(leave, { duration: d, easing: EASE, fill: 'both' }));
    }
    await Promise.all(anims.map((a) => a.finished));
    prev?.remove();
  }

  /** Where a hotspot sits on the screen right now, in px (scroll included). */
  point(key, fixed = false) {
    const s = SPOTS[key];
    const W = this.screen.clientWidth;
    const H = this.screen.clientHeight;
    if (!s) return { x: W / 2, y: H / 2 };
    if (fixed) return { x: (s.x / 100) * W, y: (s.y / 100) * H };
    const img = this.layer.querySelector('img');
    const imgH = W * (img.naturalHeight / img.naturalWidth);
    return { x: (s.x / 100) * W, y: (s.y / 100) * imgH - this.layer.scrollY };
  }

  async scroll({ scroll, ms = 1600, mark }) {
    const img = this.layer.querySelector('img');
    const W = this.screen.clientWidth;
    const H = this.screen.clientHeight;
    const imgH = W * (img.naturalHeight / img.naturalWidth);
    const max = Math.max(0, imgH - H);
    const target = typeof scroll === 'number'
      ? (scroll / 100) * max
      : Math.min(max, Math.max(0, ((SPOTS[scroll]?.y ?? 0) / 100) * imgH - H * 0.42));
    const from = this.layer.scrollY;
    this.layer.scrollY = target;
    await img.animate([{ transform: `translateY(${-from}px)` }, { transform: `translateY(${-target}px)` }],
      { duration: this.reduced ? 1 : ms, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }).finished;
    if (mark && !this.reduced) this.highlight(mark);
  }

  /** A soft pink frame around something worth noticing (e.g. the market fact behind an idea). */
  highlight(key) {
    const s = SPOTS[key];
    if (!s) return;
    const p = this.point(key);
    const W = this.screen.clientWidth;
    const img = this.layer.querySelector('img');
    const imgH = W * (img.naturalHeight / img.naturalWidth);
    const w = (s.w / 100) * W + 10;
    const h = (s.h / 100) * imgH + 10;
    const ring = document.createElement('span');
    ring.className = 'vitrina__mark';
    Object.assign(ring.style, { left: `${p.x - w / 2}px`, top: `${p.y - h / 2}px`, width: `${w}px`, height: `${h}px` });
    this.layer.append(ring);
    ring.animate([{ opacity: 0, transform: 'scale(0.96)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 500, easing: EASE, fill: 'forwards' });
  }

  async moveFinger(to, ms = 650) {
    const f = this.finger;
    const from = f.dataset.pos ? JSON.parse(f.dataset.pos) : { x: to.x + 40, y: to.y + 120 };
    f.dataset.pos = JSON.stringify(to);
    await f.animate([
      { transform: `translate(${from.x}px, ${from.y}px)`, opacity: f.style.opacity === '1' ? 1 : 0 },
      { transform: `translate(${to.x}px, ${to.y}px)`, opacity: 1 },
    ], { duration: ms, easing: EASE, fill: 'forwards' }).finished;
    f.style.opacity = '1';
  }

  async tap({ tap, fixed }) {
    if (this.reduced) return;
    await this.moveFinger(this.point(tap, fixed));
    await this.finger.animate([{ scale: 1 }, { scale: 0.78 }, { scale: 1 }], { duration: 320, easing: EASE }).finished;
    const ripple = document.createElement('span');
    ripple.className = 'vitrina__ripple';
    const p = this.point(tap, fixed);
    Object.assign(ripple.style, { left: `${p.x}px`, top: `${p.y}px` });
    this.screen.append(ripple);
    ripple.animate([{ transform: 'translate(-50%, -50%) scale(0.2)', opacity: 0.7 }, { transform: 'translate(-50%, -50%) scale(1.6)', opacity: 0 }], { duration: 600, easing: 'ease-out' })
      .finished.then(() => ripple.remove());
    await sleep(220);
  }

  async swipe({ swipe, dx, to }) {
    const start = this.point(swipe);
    const W = this.screen.clientWidth;
    if (!this.reduced) await this.moveFinger(start);
    const lean = this.makeLayer(to);
    await lean.querySelector('img').decode().catch(() => {});
    lean.style.opacity = '0';
    this.screen.insertBefore(lean, this.finger);
    const ms = this.reduced ? 1 : 700;
    await Promise.all([
      this.reduced ? Promise.resolve() : this.finger.animate([
        { transform: `translate(${start.x}px, ${start.y}px)` },
        { transform: `translate(${start.x + (dx / 100) * W}px, ${start.y + 14}px)` },
      ], { duration: ms, easing: 'cubic-bezier(0.45, 0, 0.2, 1)', fill: 'forwards' }).finished,
      lean.animate([{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 1 }], { duration: ms, easing: 'linear', fill: 'forwards' }).finished,
      this.layer.animate([{ opacity: 1 }, { opacity: 0, offset: 0.3 }, { opacity: 0 }], { duration: ms, easing: 'linear', fill: 'forwards' }).finished,
    ]);
    this.finger.dataset.pos = JSON.stringify({ x: start.x + (dx / 100) * W, y: start.y + 14 });
    this.layer.remove();
    this.layer = lean;
    await sleep(350);
  }

  say(text) {
    if (!this.label || !text) return;
    this.label.textContent = text;
    this.label.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: EASE, fill: 'forwards' });
  }

  async run() {
    for (;;) {
      for (const step of this.steps) {
        await this.gate();
        if (step.label) this.say(step.label);
        if (step.go) await this.go(step);
        else if (step.scroll !== undefined) await this.scroll(step);
        else if (step.tap) await this.tap(step);
        else if (step.swipe) await this.swipe(step);
        if (step.hold) await sleep(this.reduced ? step.hold * 2 : step.hold);
      }
      this.finger.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
      this.finger.style.opacity = '0';
      delete this.finger.dataset.pos;
      if (this.reduced) return;   // one calm pass, then it rests on the last screen
      await sleep(600);
    }
  }
}

/** Starts every [data-vitrina] when it scrolls into view; pauses it when it leaves. */
export function initVitrinas(doc, reduced) {
  const figs = [...doc.querySelectorAll('[data-vitrina]')];
  if (!figs.length || !('animate' in Element.prototype)) return [];
  const players = figs.filter((fig) => !(reduced && fig.closest('.escena'))).map((fig) => {
    const steps = SCENES[fig.dataset.vitrina];
    if (!steps) return null;
    // In a laptop + phone pair, only the phone narrates.
    if (fig.matches('.vitrina__device--laptop') && fig.closest('.vitrina--duo')) steps.forEach((st) => delete st.label);
    const player = new Player(fig, steps, reduced);
    fig.querySelector('.vitrina__still')?.remove();
    fig.classList.add('is-live');
    fig.closest('.escena')?.classList.add('is-live');
    player.run();
    return player;
  }).filter(Boolean);
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    players.find((p) => p.fig === e.target)?.setVisible(e.isIntersecting);
  }), { threshold: 0.3 });
  players.forEach((p) => io.observe(p.fig));
  return players;
}
