# Sitio web pixely.pe — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir y publicar en `pixely.pe` un sitio de una sola página que clona la estructura, el ritmo y las animaciones de phenomenonstudio.com con el contenido, la marca y las imágenes propias de Pixely.

**Architecture:** HTML estático escrito a mano (el texto vive en el HTML), CSS por capas (tokens → base → componentes → secciones) y JavaScript en módulos pequeños e independientes: `core/` (enlaces de WhatsApp, interruptores), `ui/` (menú, pestañas, cabecera, planes), `motion/` (GSAP, que se carga en diferido y nunca si el usuario pide reducir movimiento). Vite compila y Vercel sirve el resultado estático.

**Tech Stack:** Vite 8.3, GSAP 3.15 (ScrollTrigger, SplitText, ScrambleText, CustomEase), Lenis 1.3, Vitest 5 + jsdom 30 (unitarias), Playwright 1.63 + @axe-core/playwright 4.13 (e2e y accesibilidad), Lighthouse 13.5, sharp 0.35, ffmpeg 8.1 (instalado), Magnific (conector MCP), Vercel CLI 62.

**Spec:** `docs/superpowers/specs/2026-10-01-pixely-web-design.md`. Léela antes de cualquier tarea; este plan la implementa sección por sección.

## Global Constraints

- Idioma del sitio: español de Perú (`lang="es-PE"`), trato de "tú".
- Título de la página: `Pixely — Publicidad que vende | Publicidad con IA para negocios`.
- WhatsApp: `51949268607` → `https://wa.me/51949268607?text=<mensaje codificado>`. Es el **único CTA** del sitio.
- Email `hola@pixely.pe` · Instagram `https://www.instagram.com/pixely_pe/` · Partners `https://partners.pixely.pe` · SYNTESIA LABS E.I.R.L. · RUC 20616010787.
- Interruptores iniciales: `mostrarPartners: false`, `mostrarCasos: false`, `mostrarTestimonios: false`.
- **Prohibido en cualquier texto del sitio:** precios (`S/` seguido de cifra), "barato/a(s)", "económico/a(s)", "plantilla(s)", "como todos", "Community Manager". "Canva" solo dentro de `#faq-canva`.
- Prohibido inventar casos, testimonios, logos de clientes o cifras de resultados de clientes. Las estadísticas llevan fuente enlazada.
- No nombrar herramientas internas (Magnific, Metricool, Airtable, Canva fuera de la FAQ).
- Colores: `--ink #0A0A0C`, `--carbon #141418`, `--carbon-2 #1C1C22`, `--paper #FFFFFF`, `--mist #F3F3F5`, `--magenta #EB0C6E`, `--magenta-cta #D90B66` (fondo de botón con texto blanco). Prohibidos: amarillo saturado, verde lima, azul corporativo, pasteles, tonos tierra.
- Tipografía: Bricolage Grotesque (títulos), Albert Sans (texto), desde Google Fonts.
- Curva de animación de referencia: `cubic-bezier(0.22, 1, 0.36, 1)`, palabras en 0,4 s, bloques en 0,3 s con 5 px de desplazamiento.
- Todo el contenido debe ser visible sin JavaScript y con `prefers-reduced-motion: reduce`.
- JavaScript total ≤ 90 KB comprimido. Lighthouse móvil: Rendimiento ≥ 90, Accesibilidad ≥ 95, Buenas prácticas ≥ 95, SEO ≥ 95.
- Sin scroll horizontal a 320 px. Contraste WCAG AA.
- Comandos en Git Bash desde la raíz `pixely-web/`. Cada commit termina con la línea `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## Mapa de archivos

| Archivo | Responsabilidad |
|---|---|
| `package.json`, `vite.config.js`, `playwright.config.js`, `vercel.json`, `.gitignore` | Herramientas y despliegue |
| `index.html` | Página completa; cada sección vive entre su marcador `<!-- @nombre -->` |
| `privacidad.html`, `terminos.html` | Páginas legales |
| `src/config.js` | Datos de contacto, mensajes de WhatsApp por CTA, interruptores |
| `src/main.js` | Arranque: interruptores, enlaces, UI y carga diferida del movimiento |
| `src/core/cta.js` | `buildWhatsAppUrl`, `applyCtaLinks` |
| `src/core/flags.js` | `applyFlags` |
| `src/ui/menu.js` | Menú móvil (abrir, cerrar, Escape, bloqueo de scroll) |
| `src/ui/header-theme.js` | Cabecera clara u oscura según la sección de debajo |
| `src/ui/tabs.js` | Pestañas accesibles del ecosistema |
| `src/ui/plans-nav.js` | Plan activo en el menú lateral de Planes y CTA que nombra el plan |
| `src/motion/index.js` | `bootMotion`: registra GSAP y arranca los efectos |
| `src/motion/ease.js`, `split-words.js`, `reveal.js`, `scramble.js`, `tilt-media.js`, `cursor.js`, `smooth-scroll.js` | Un efecto por archivo |
| `src/styles/main.css` | Importa el resto de hojas en orden |
| `src/styles/tokens.css`, `base.css`, `components.css` | Sistema visual |
| `src/styles/sections/*.css` | Una hoja por sección |
| `public/brand/` | Logo SVG, favicons, imagen OG |
| `public/media/` | Imágenes y vídeo optimizados |
| `media-src/` (ignorado por git) | Originales descargados de Magnific |
| `docs/media-prompts.md` | Prompts aprobados y registro de identificadores de Magnific |
| `scripts/check-content.mjs` | Guardia de contenido (palabras prohibidas, precios, Canva) |
| `scripts/make-icons.mjs`, `optimize-media.mjs`, `make-og.mjs`, `lighthouse.mjs` | Utilidades de build y QA |
| `tests/unit/*.test.js` | Vitest |
| `tests/e2e/*.spec.js` | Playwright |

---

### Task 1: Andamiaje del proyecto, tokens y página base

**Files:**
- Create: `package.json`, `vite.config.js`, `playwright.config.js`, `.gitignore`
- Create: `index.html`, `src/main.js`, `src/styles/main.css`, `src/styles/tokens.css`, `src/styles/base.css`
- Test: `tests/e2e/smoke.spec.js`

**Interfaces:**
- Consumes: nada.
- Produces: marcadores `<!-- @header -->`, `<!-- @hero -->`, `<!-- @rubros -->`, `<!-- @problemas -->`, `<!-- @planes -->`, `<!-- @como-funciona -->`, `<!-- @ecosistema -->`, `<!-- @partners -->`, `<!-- @historia -->`, `<!-- @casos -->`, `<!-- @testimonios -->`, `<!-- @garantias -->`, `<!-- @faq -->`, `<!-- @footer -->` en `index.html`; variables CSS de `tokens.css`; clases `.container`, `.visually-hidden`, `.skip-link`; clases de `<html>`: `no-js` → `js`, y `js-motion` + `window.__motionReady`.

- [ ] **Step 1: Crear `package.json` e instalar dependencias**

```json
{
  "name": "pixely-web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 4173 --strictPort",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "check:content": "node scripts/check-content.mjs dist",
    "icons": "node scripts/make-icons.mjs",
    "media": "node scripts/optimize-media.mjs",
    "og": "node scripts/make-og.mjs",
    "lighthouse": "node scripts/lighthouse.mjs",
    "verify": "npm run build && npm run check:content && npm test && npm run test:e2e"
  },
  "dependencies": {
    "gsap": "^3.15.0",
    "lenis": "^1.3.26"
  },
  "devDependencies": {
    "@axe-core/playwright": "^4.13.0",
    "@playwright/test": "^1.63.0",
    "jsdom": "^30.1.1",
    "lighthouse": "^13.5.0",
    "sharp": "^0.35.5",
    "vite": "^8.3.2",
    "vitest": "^5.0.3"
  }
}
```

Run: `npm install`
Expected: termina sin errores y crea `package-lock.json`.

- [ ] **Step 2: Crear `.gitignore`, `vite.config.js` y `playwright.config.js`**

`.gitignore`:

```
node_modules/
dist/
media-src/
test-results/
playwright-report/
.vercel/
.env*
```

`vite.config.js` (las páginas legales se añaden en la Task 13):

```js
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const root = import.meta.dirname;

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.js'],
  },
});
```

> Si Vite 8 avisa de que `rollupOptions` está obsoleto, renombra la clave a `rolldownOptions` con el mismo contenido.

`playwright.config.js` (usa el Chrome instalado, sin descargar navegadores):

```js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:4173',
    channel: 'chrome',
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run preview',
        url: 'http://localhost:4173',
        reuseExistingServer: true,
        timeout: 180_000,
      },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
});
```

- [ ] **Step 3: Escribir la prueba que falla**

`tests/e2e/smoke.spec.js`:

```js
import { test, expect } from '@playwright/test';

test('carga con título, idioma y clase js', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Pixely — Publicidad que vende | Publicidad con IA para negocios');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-PE');
  await expect(page.locator('html')).toHaveClass(/(^|\s)js(\s|$)/);
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('conserva la clase no-js y no activa el movimiento', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/(^|\s)no-js(\s|$)/);
    await expect(page.locator('html')).not.toHaveClass(/js-motion/);
  });
});

test.describe('con reducir movimiento', () => {
  test.use({ reducedMotion: 'reduce' });

  test('no añade js-motion', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/js-motion/);
  });
});
```

- [ ] **Step 4: Ejecutar la prueba y verificar que falla**

Run: `npx playwright test tests/e2e/smoke.spec.js`
Expected: FAIL. El build falla porque no existe `index.html`.

- [ ] **Step 5: Crear `index.html`**

```html
<!doctype html>
<html lang="es-PE" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pixely — Publicidad que vende | Publicidad con IA para negocios</title>
  <meta name="description" content="Tu publicidad no sale de la ocurrencia de un diseñador. Sale de datos reales. Publicidad con IA para negocios que quieren verse a la altura de su producto.">
  <meta name="theme-color" content="#0A0A0C">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400..600&family=Bricolage+Grotesque:opsz,wght@12..96,400..600&display=swap">
  <link rel="stylesheet" href="/src/styles/main.css">
  <script>
    (function (d) {
      var h = d.documentElement;
      h.classList.replace('no-js', 'js');
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        h.classList.add('js-motion');
        setTimeout(function () {
          if (!window.__motionReady) h.classList.remove('js-motion');
        }, 4000);
      }
    })(document);
  </script>
  <script type="module" src="/src/main.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Saltar al contenido</a>
  <!-- @header -->
  <main id="main">
    <!-- @hero -->
    <!-- @rubros -->
    <!-- @problemas -->
    <!-- @planes -->
    <!-- @como-funciona -->
    <!-- @ecosistema -->
    <!-- @partners -->
    <!-- @historia -->
    <!-- @casos -->
    <!-- @testimonios -->
    <!-- @garantias -->
    <!-- @faq -->
  </main>
  <!-- @footer -->
</body>
</html>
```

- [ ] **Step 6: Crear las hojas de estilo y `src/main.js`**

`src/styles/tokens.css`:

```css
:root {
  --ink: #0A0A0C;
  --carbon: #141418;
  --carbon-2: #1C1C22;
  --paper: #FFFFFF;
  --mist: #F3F3F5;
  --magenta: #EB0C6E;
  --magenta-cta: #D90B66;
  --text-on-ink: #FFFFFF;
  --text-on-ink-2: rgba(255, 255, 255, 0.62);
  --text-on-paper: #0A0A0C;
  --text-on-paper-2: #5B5E66;
  --line-ink: rgba(255, 255, 255, 0.10);
  --line-paper: #E4E4E8;

  --font-display: 'Bricolage Grotesque', Arial, sans-serif;
  --font-body: 'Albert Sans', Arial, sans-serif;
  --fs-xl: clamp(2.5rem, 4.72vw, 5.5rem);
  --fs-l: clamp(2rem, 3.33vw, 4rem);
  --fs-m: clamp(1.6rem, 2.78vw, 3.2rem);
  --fs-lead: clamp(1.125rem, 1.5vw, 1.5rem);
  --fs-body: 1.0625rem;
  --fs-caption: 0.78rem;

  --gutter: 16px;
  --header-h: 64px;
  --section-pad: 96px;
  --radius-btn: 8px;
  --radius-card: 12px;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);

  /* Pestaña de borde inferior: punta del logo P (móvil) */
  --notch: polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 0.8px) calc(100% - 17.8px), calc(100% - 3.2px) calc(100% - 12px), calc(100% - 7px) calc(100% - 7px), calc(100% - 12px) calc(100% - 3.2px), calc(100% - 17.8px) calc(100% - 0.8px), calc(100% - 24px) 100%, calc(50% + 62.4px) 100%, calc(50% + 55.4px) calc(100% - 0.8px), calc(50% + 48.5px) calc(100% - 2.9px), calc(50% + 42px) calc(100% - 6.2px), calc(50% + 35.8px) calc(100% - 10.6px), calc(50% + 30.2px) calc(100% - 15.8px), calc(50% + 25.3px) calc(100% - 21.6px), calc(50% + 21.3px) calc(100% - 28px), calc(50% + 18.2px) calc(100% - 34.6px), calc(50% + 16.3px) calc(100% - 41.4px), calc(50% + 15.6px) calc(100% - 48.1px), calc(50% - 22.1px) 100%, calc(50% - 22.1px) calc(100% - 48.1px), calc(50% - 22.8px) calc(100% - 41.4px), calc(50% - 24.7px) calc(100% - 34.6px), calc(50% - 27.8px) calc(100% - 28px), calc(50% - 31.8px) calc(100% - 21.6px), calc(50% - 36.7px) calc(100% - 15.8px), calc(50% - 42.3px) calc(100% - 10.6px), calc(50% - 48.5px) calc(100% - 6.2px), calc(50% - 55px) calc(100% - 2.9px), calc(50% - 61.9px) calc(100% - 0.8px), calc(50% - 68.9px) 100%, 24px 100%, 17.8px calc(100% - 0.8px), 12px calc(100% - 3.2px), 7px calc(100% - 7px), 3.2px calc(100% - 12px), 0.8px calc(100% - 17.8px), 0px calc(100% - 24px));
  --notch-depth: 48px;
}

@media (min-width: 768px) {
  :root {
    --gutter: 2.5vw;
    --header-h: 76px;
    --section-pad: 200px;
    --notch: polygon(0 0, 100% 0, 100% calc(100% - 40px), calc(100% - 1.4px) calc(100% - 29.6px), calc(100% - 5.4px) calc(100% - 20px), calc(100% - 11.7px) calc(100% - 11.7px), calc(100% - 20px) calc(100% - 5.4px), calc(100% - 29.6px) calc(100% - 1.4px), calc(100% - 40px) 100%, calc(50% + 96px) 100%, calc(50% + 85.2px) calc(100% - 1.2px), calc(50% + 74.7px) calc(100% - 4.4px), calc(50% + 64.6px) calc(100% - 9.6px), calc(50% + 55.1px) calc(100% - 16.3px), calc(50% + 46.5px) calc(100% - 24.2px), calc(50% + 39px) calc(100% - 33.3px), calc(50% + 32.7px) calc(100% - 43px), calc(50% + 28px) calc(100% - 53.2px), calc(50% + 25px) calc(100% - 63.7px), calc(50% + 24px) calc(100% - 74px), calc(50% - 34px) 100%, calc(50% - 34px) calc(100% - 74px), calc(50% - 35px) calc(100% - 63.7px), calc(50% - 38px) calc(100% - 53.2px), calc(50% - 42.7px) calc(100% - 43px), calc(50% - 49px) calc(100% - 33.3px), calc(50% - 56.5px) calc(100% - 24.2px), calc(50% - 65.1px) calc(100% - 16.3px), calc(50% - 74.6px) calc(100% - 9.6px), calc(50% - 84.7px) calc(100% - 4.4px), calc(50% - 95.2px) calc(100% - 1.2px), calc(50% - 106px) 100%, 40px 100%, 29.6px calc(100% - 1.4px), 20px calc(100% - 5.4px), 11.7px calc(100% - 11.7px), 5.4px calc(100% - 20px), 1.4px calc(100% - 29.6px), 0px calc(100% - 40px));
    --notch-depth: 74px;
  }
}
```

`src/styles/base.css`:

```css
*, *::before, *::after { box-sizing: border-box; }

html {
  background: var(--ink);
  -webkit-text-size-adjust: 100%;
  scroll-padding-top: var(--header-h);
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--text-on-paper);
  font-family: var(--font-body);
  font-size: var(--fs-body);
  line-height: 1.5;
  overflow-x: clip;
  -webkit-font-smoothing: antialiased;
}

img, video, svg { display: block; max-width: 100%; height: auto; }
[hidden] { display: none !important; }
h1, h2, h3, h4, p, ul, ol, figure, blockquote { margin: 0; }
ul, ol { padding: 0; list-style: none; }
a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }

:focus-visible { outline: 2px solid var(--magenta); outline-offset: 3px; }

.container { width: 100%; padding-inline: var(--gutter); }

.visually-hidden {
  position: absolute !important;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0);
  white-space: nowrap; border: 0;
}

.skip-link {
  position: absolute; left: var(--gutter); top: -100px; z-index: 100;
  padding: 12px 16px; border-radius: var(--radius-btn);
  background: var(--paper); color: var(--ink); font-weight: 600;
}
.skip-link:focus { top: 12px; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

`src/styles/main.css`:

```css
@import './tokens.css';
@import './base.css';
```

`src/main.js` (de momento solo marca el arranque; las tareas siguientes lo amplían):

```js
document.documentElement.dataset.boot = 'ok';
```

- [ ] **Step 7: Ejecutar la prueba y verificar que pasa**

Run: `npx playwright test tests/e2e/smoke.spec.js`
Expected: PASS en `desktop` y `mobile` (6 pruebas).

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json .gitignore vite.config.js playwright.config.js index.html src tests
git commit -m "Scaffold Vite site with tokens, base styles and smoke tests" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Configuración, enlaces de WhatsApp e interruptores

**Files:**
- Create: `src/config.js`, `src/core/cta.js`, `src/core/flags.js`
- Modify: `src/main.js`
- Test: `tests/unit/cta.test.js`, `tests/unit/flags.test.js`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `config` (export nombrado de `src/config.js`): `{ whatsapp: string, email: string, instagram: string, partnersUrl: string, mensajes: Record<string,string>, flags: { mostrarPartners: boolean, mostrarCasos: boolean, mostrarTestimonios: boolean } }`.
  - `buildWhatsAppUrl(numero: string, mensaje: string): string`.
  - `applyCtaLinks(root: ParentNode, cfg: typeof config): void`. Toma todo `[data-cta="<clave>"]` y le pone `href`, `target="_blank"` y `rel="noopener"`. Si la clave no existe en `mensajes`, usa `mensajes.default`.
  - `applyFlags(root: ParentNode, flags: object): void`. `[data-flag="<clave>"]` se oculta si el interruptor es falso; `[data-flag-off="<clave>"]` se oculta si es verdadero.
  - Claves de mensajes que usarán las secciones: `default`, `header`, `hero`, `menu`, `rubro-otro`, `problema-fotos`, `problema-diseno`, `problema-tiempo`, `planes`, `plan-pro`, `plan-basic`, `plan-lite`, `partners`, `faq`, `footer`.

- [ ] **Step 1: Escribir las pruebas que fallan**

`tests/unit/cta.test.js`:

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { buildWhatsAppUrl, applyCtaLinks } from '../../src/core/cta.js';

const cfg = {
  whatsapp: '51949268607',
  mensajes: {
    default: 'Hola Pixely',
    hero: 'Hola Pixely, vengo de su web y quiero saber qué plan me conviene.',
  },
};

describe('buildWhatsAppUrl', () => {
  it('codifica el mensaje en la URL de wa.me', () => {
    expect(buildWhatsAppUrl('51949268607', 'Hola Pixely, ¿qué tal?'))
      .toBe('https://wa.me/51949268607?text=Hola%20Pixely%2C%20%C2%BFqu%C3%A9%20tal%3F');
  });
});

describe('applyCtaLinks', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <a id="a" data-cta="hero" href="https://wa.me/51949268607">A</a>
      <a id="b" data-cta="desconocida" href="https://wa.me/51949268607">B</a>`;
  });

  it('pone href, target y rel según la clave', () => {
    applyCtaLinks(document, cfg);
    const a = document.getElementById('a');
    expect(a.getAttribute('href')).toBe(buildWhatsAppUrl(cfg.whatsapp, cfg.mensajes.hero));
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toBe('noopener');
  });

  it('usa el mensaje por defecto con una clave desconocida', () => {
    applyCtaLinks(document, cfg);
    expect(document.getElementById('b').getAttribute('href'))
      .toBe(buildWhatsAppUrl(cfg.whatsapp, cfg.mensajes.default));
  });
});
```

`tests/unit/flags.test.js`:

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { applyFlags } from '../../src/core/flags.js';

describe('applyFlags', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="casos" data-flag="mostrarCasos" hidden></section>
      <a id="acceso" data-flag="mostrarPartners" hidden></a>
      <span id="pronto" data-flag-off="mostrarPartners">Próximamente</span>`;
  });

  it('mantiene oculto lo que tiene el interruptor apagado', () => {
    applyFlags(document, { mostrarCasos: false, mostrarPartners: false });
    expect(document.getElementById('casos').hidden).toBe(true);
    expect(document.getElementById('acceso').hidden).toBe(true);
    expect(document.getElementById('pronto').hidden).toBe(false);
  });

  it('muestra lo encendido y oculta su alternativa', () => {
    applyFlags(document, { mostrarCasos: true, mostrarPartners: true });
    expect(document.getElementById('casos').hidden).toBe(false);
    expect(document.getElementById('acceso').hidden).toBe(false);
    expect(document.getElementById('pronto').hidden).toBe(true);
  });

  it('trata un interruptor ausente como apagado', () => {
    applyFlags(document, {});
    expect(document.getElementById('casos').hidden).toBe(true);
  });
});
```

- [ ] **Step 2: Ejecutar las pruebas y verificar que fallan**

Run: `npx vitest run tests/unit`
Expected: FAIL con "Failed to resolve import ../../src/core/cta.js".

- [ ] **Step 3: Implementar**

`src/core/cta.js`:

```js
export function buildWhatsAppUrl(numero, mensaje) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

export function applyCtaLinks(root, cfg) {
  root.querySelectorAll('[data-cta]').forEach((el) => {
    const mensaje = cfg.mensajes[el.dataset.cta] ?? cfg.mensajes.default;
    el.setAttribute('href', buildWhatsAppUrl(cfg.whatsapp, mensaje));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
}
```

`src/core/flags.js`:

```js
export function applyFlags(root, flags) {
  root.querySelectorAll('[data-flag]').forEach((el) => {
    el.hidden = !flags[el.dataset.flag];
  });
  root.querySelectorAll('[data-flag-off]').forEach((el) => {
    el.hidden = Boolean(flags[el.dataset.flagOff]);
  });
}
```

`src/config.js`:

```js
export const config = {
  whatsapp: '51949268607',
  email: 'hola@pixely.pe',
  instagram: 'https://www.instagram.com/pixely_pe/',
  partnersUrl: 'https://partners.pixely.pe',
  mensajes: {
    default: 'Hola Pixely, vengo de su web y quiero más información.',
    header: 'Hola Pixely, vengo de su web y quiero más información.',
    menu: 'Hola Pixely, vengo de su web y quiero más información.',
    hero: 'Hola Pixely, vengo de su web y quiero saber qué plan me conviene.',
    'rubro-otro': 'Hola Pixely, mi rubro no aparece en su web. ¿Trabajan con negocios como el mío?',
    'problema-fotos': 'Hola Pixely, mis fotos son de celular y quiero que mi producto se vea profesional.',
    'problema-diseno': 'Hola Pixely, quiero publicidad con estrategia, no solo diseños.',
    'problema-tiempo': 'Hola Pixely, no tengo tiempo para publicar. ¿Ustedes pueden encargarse?',
    planes: 'Hola Pixely, quiero que me recomienden el plan adecuado para mi negocio.',
    'plan-pro': 'Hola Pixely, me interesa el Plan Pro.',
    'plan-basic': 'Hola Pixely, me interesa el Plan Basic.',
    'plan-lite': 'Hola Pixely, me interesa el Plan Lite.',
    partners: 'Hola Pixely, quiero saber cuándo sale Pixely Partners.',
    faq: 'Hola Pixely, tengo una pregunta que no está en su web.',
    footer: 'Hola Pixely, vengo de su web y quiero empezar.',
  },
  flags: {
    mostrarPartners: false,
    mostrarCasos: false,
    mostrarTestimonios: false,
  },
};
```

`src/main.js` (reemplaza el contenido completo):

```js
import { config } from './config.js';
import { applyFlags } from './core/flags.js';
import { applyCtaLinks } from './core/cta.js';

applyFlags(document, config.flags);
applyCtaLinks(document, config);
document.documentElement.dataset.boot = 'ok';
```

- [ ] **Step 4: Ejecutar las pruebas y verificar que pasan**

Run: `npx vitest run tests/unit`
Expected: PASS (6 pruebas).

- [ ] **Step 5: Commit**

```bash
git add src tests/unit
git commit -m "Add site config, WhatsApp CTA links and feature flags" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Guardia de contenido

**Files:**
- Create: `scripts/check-content.mjs`
- Test: `tests/unit/check-content.test.js`

**Interfaces:**
- Consumes: el HTML compilado en `dist/`.
- Produces: `findViolations(html: string): Array<{ rule: string, match: string }>` y la CLI `node scripts/check-content.mjs dist`, que sale con código 1 si hay infracciones. Reglas: `precio`, `barato`, `economico`, `plantilla`, `como-todos`, `community-manager`, `canva-fuera-de-faq`.

- [ ] **Step 1: Escribir la prueba que falla**

`tests/unit/check-content.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { findViolations } from '../../scripts/check-content.mjs';

const page = (body, head = '') => `<!doctype html><html><head><title>T</title>${head}</head><body>${body}</body></html>`;

describe('findViolations', () => {
  it('acepta un texto limpio', () => {
    expect(findViolations(page('<p>Publicidad que vende.</p>'))).toEqual([]);
  });

  it('detecta precios con S/', () => {
    const rules = findViolations(page('<p>Desde S/ 600 al mes</p>')).map((v) => v.rule);
    expect(rules).toContain('precio');
  });

  it('detecta palabras prohibidas sin importar mayúsculas ni tildes', () => {
    const rules = findViolations(page('<p>Barato, ECONÓMICA, plantillas, como todos, community manager</p>')).map((v) => v.rule);
    expect(rules).toEqual(expect.arrayContaining(['barato', 'economico', 'plantilla', 'como-todos', 'community-manager']));
  });

  it('revisa también atributos alt y meta description', () => {
    const html = page('<img alt="foto barata" src="x.jpg">', '<meta name="description" content="Plantilla gratis">');
    const rules = findViolations(html).map((v) => v.rule);
    expect(rules).toEqual(expect.arrayContaining(['barato', 'plantilla']));
  });

  it('permite Canva solo dentro de #faq-canva', () => {
    expect(findViolations(page('<details id="faq-canva"><summary>¿Y Canva?</summary></details>'))).toEqual([]);
    const rules = findViolations(page('<p>Mejor que Canva</p>')).map((v) => v.rule);
    expect(rules).toContain('canva-fuera-de-faq');
  });
});
```

- [ ] **Step 2: Ejecutar la prueba y verificar que falla**

Run: `npx vitest run tests/unit/check-content.test.js`
Expected: FAIL con "Failed to resolve import ../../scripts/check-content.mjs".

- [ ] **Step 3: Implementar `scripts/check-content.mjs`**

```js
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

export const RULES = [
  { id: 'precio', re: /S\/\.?\s*\d/ },
  { id: 'barato', re: /\bbarat[oa]s?\b/i },
  { id: 'economico', re: /econ[oó]mic[oa]s?/i },
  { id: 'plantilla', re: /\bplantillas?\b/i },
  { id: 'como-todos', re: /\bcomo todos\b/i },
  { id: 'community-manager', re: /community\s+manager/i },
];

function extractText(doc) {
  const parts = [doc.title, doc.body ? doc.body.textContent : ''];
  doc.querySelectorAll('[alt], [aria-label], [title], meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]')
    .forEach((el) => {
      for (const attr of ['alt', 'aria-label', 'title', 'content']) {
        const value = el.getAttribute(attr);
        if (value) parts.push(value);
      }
    });
  return parts.join('\n');
}

export function findViolations(html) {
  const doc = new JSDOM(html).window.document;
  const violations = [];
  const text = extractText(doc);
  for (const rule of RULES) {
    const match = text.match(rule.re);
    if (match) violations.push({ rule: rule.id, match: match[0] });
  }
  doc.getElementById('faq-canva')?.remove();
  const canva = extractText(doc).match(/\bcanva\b/i);
  if (canva) violations.push({ rule: 'canva-fuera-de-faq', match: canva[0] });
  return violations;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dir = process.argv[2] ?? 'dist';
  const files = readdirSync(dir).filter((f) => f.endsWith('.html'));
  let total = 0;
  for (const file of files) {
    const found = findViolations(readFileSync(join(dir, file), 'utf8'));
    for (const v of found) console.error(`${file}: [${v.rule}] "${v.match}"`);
    total += found.length;
  }
  if (files.length === 0) {
    console.error(`No hay archivos .html en ${dir}. ¿Corriste el build?`);
    process.exit(1);
  }
  console.log(`${files.length} páginas revisadas, ${total} infracciones.`);
  process.exit(total > 0 ? 1 : 0);
}
```

- [ ] **Step 4: Ejecutar las pruebas y verificar que pasan**

Run: `npx vitest run tests/unit/check-content.test.js`
Expected: PASS (5 pruebas).

Run: `npm run build && npm run check:content`
Expected: `1 páginas revisadas, 0 infracciones.`

- [ ] **Step 5: Commit**

```bash
git add scripts/check-content.mjs tests/unit/check-content.test.js
git commit -m "Add content guard for forbidden words, prices and Canva" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 4: Logo SVG y favicons

**Files:**
- Create: `docs/brand-source/logo_pixely.png` (copia del original), `public/brand/pixely-p.svg`, `scripts/make-icons.mjs`
- Generate: `public/brand/favicon-32.png`, `public/brand/apple-touch-icon.png`, `public/brand/icon-512.png`
- Modify: `index.html` (`<head>`)
- Test: `tests/unit/logo.test.js`, `tests/e2e/brand.spec.js`

**Interfaces:**
- Consumes: nada.
- Produces: `/brand/pixely-p.svg`, cuya relación de aspecto es 585:882 (para mostrarlo a 28 px de ancho, el alto es 42 px), y los tres PNG de iconos.

- [ ] **Step 1: Copiar el logo original al repo**

```bash
mkdir -p docs/brand-source public/brand
cp "../Pixely/Inputs/docs/logo_pixely.png" docs/brand-source/logo_pixely.png
```

- [ ] **Step 2: Escribir las pruebas que fallan**

`tests/unit/logo.test.js`:

```js
// @vitest-environment node
import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const isMagenta = (r, g, b) => r > 175 && g < 120 && b > 40 && b < 180;

it('el SVG del logo coincide al menos un 98 % con el PNG original', async () => {
  const svg = readFileSync('public/brand/pixely-p.svg', 'utf8')
    .replace(/viewBox="[^"]*"/, 'viewBox="0 0 1245 1245" width="1245" height="1245"');
  const a = await sharp(Buffer.from(svg)).flatten({ background: '#ffffff' }).removeAlpha().raw().toBuffer();
  const b = await sharp('docs/brand-source/logo_pixely.png').flatten({ background: '#ffffff' }).removeAlpha().raw().toBuffer();
  expect(a.length).toBe(b.length);
  let inter = 0;
  let union = 0;
  for (let i = 0; i < a.length; i += 3) {
    const ma = isMagenta(a[i], a[i + 1], a[i + 2]);
    const mb = isMagenta(b[i], b[i + 1], b[i + 2]);
    if (ma && mb) inter += 1;
    if (ma || mb) union += 1;
  }
  expect(inter / union).toBeGreaterThanOrEqual(0.98);
});
```

`tests/e2e/brand.spec.js`:

```js
import { test, expect } from '@playwright/test';

for (const path of ['/brand/pixely-p.svg', '/brand/favicon-32.png', '/brand/apple-touch-icon.png', '/brand/icon-512.png']) {
  test(`sirve ${path}`, async ({ request }) => {
    const res = await request.get(path);
    expect(res.status()).toBe(200);
  });
}

test('el head enlaza los iconos', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/brand/pixely-p.svg');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/brand/apple-touch-icon.png');
});
```

- [ ] **Step 3: Ejecutar las pruebas y verificar que fallan**

Run: `npx vitest run tests/unit/logo.test.js`
Expected: FAIL con "ENOENT ... public/brand/pixely-p.svg".

- [ ] **Step 4: Crear el SVG**

La geometría se midió en los píxeles del PNG: anillo con centro (645,75; 501,5), radio exterior 292 e interior 205; punto con centro (646; 505,5) y radio 71,25; tallo y punta trazados con los vértices medidos. La verificación previa dio un IoU de 0,9886.

`public/brand/pixely-p.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="354 209 585 882" role="img" aria-labelledby="pixely-logo-title"><title id="pixely-logo-title">Pixely</title><path fill="#EB0C6E" fill-rule="evenodd" d="M354 1089V501.5A292 292 0 1 1 599 790L537 966Z M440.75 501.5A205 205 0 1 1 583 697L545 685L464.5 910L442.5 925V503Z"/><circle cx="646" cy="505.5" r="71.25" fill="#EB0C6E"/></svg>
```

- [ ] **Step 5: Crear `scripts/make-icons.mjs` y generar los iconos**

```js
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const svg = readFileSync('public/brand/pixely-p.svg');

async function onInk(size, logoHeight, out) {
  const logo = await sharp(svg).resize({ height: logoHeight }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#0A0A0C' } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(out);
}

await sharp(svg, { density: 300 })
  .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png().toFile('public/brand/favicon-32.png');
await onInk(180, 128, 'public/brand/apple-touch-icon.png');
await onInk(512, 360, 'public/brand/icon-512.png');
console.log('Iconos generados en public/brand/');
```

Run: `npm run icons`
Expected: `Iconos generados en public/brand/`.

- [ ] **Step 6: Enlazar los iconos en el `<head>` de `index.html`**

Añade estas líneas justo después de `<meta name="theme-color" content="#0A0A0C">`:

```html
  <link rel="icon" href="/brand/pixely-p.svg" type="image/svg+xml">
  <link rel="icon" href="/brand/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">
```

- [ ] **Step 7: Ejecutar las pruebas y verificar que pasan**

Run: `npx vitest run tests/unit/logo.test.js && npx playwright test tests/e2e/brand.spec.js`
Expected: PASS. El IoU es ≥ 0,98 y los 4 recursos responden 200 en ambos proyectos.

- [ ] **Step 8: Commit**

```bash
git add docs/brand-source public/brand scripts/make-icons.mjs index.html tests
git commit -m "Add vector Pixely logo and favicons" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Componentes base, cabecera y menú móvil

**Files:**
- Create: `src/styles/components.css`, `src/styles/sections/header.css`, `src/ui/menu.js`, `src/ui/header-theme.js`
- Modify: `src/styles/main.css`, `src/main.js`, `index.html` (marcador `<!-- @header -->`)
- Test: `tests/unit/menu.test.js`, `tests/unit/header-theme.test.js`, `tests/e2e/header.spec.js`

**Interfaces:**
- Consumes: `applyCtaLinks` y `applyFlags` (Task 2), logo (Task 4).
- Produces:
  - Clases CSS: `.section`, `.section--ink`, `.section--paper`, `.has-notch`, `.caption`, `.title-xl`, `.title-l`, `.title-m`, `.lead`, `.btn`, `.btn--primary`, `.btn--ghost`, `.btn--sm`, `.btn__label`, `.btn__arrow`, `.badge`, `.cells`, `.cell`, `.tag`, `.source-note`.
  - Atributo `data-theme="dark|light"` en cada `<section>` y en el `<footer>`. La cabecera lo copia en su propio `data-theme`.
  - `initMenu(doc: Document): { open(): void, close(): void }`.
  - `themeAt(probeY: number, rects: Array<{ top: number, bottom: number, theme: string }>): string | null` e `initHeaderTheme(doc: Document): void`.

- [ ] **Step 1: Escribir las pruebas unitarias que fallan**

`tests/unit/menu.test.js`:

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { initMenu } from '../../src/ui/menu.js';

describe('initMenu', () => {
  beforeEach(() => {
    document.body.className = '';
    document.body.innerHTML = `
      <button class="site-header__toggle" aria-expanded="false" aria-controls="menu-panel" aria-label="Abrir menú"></button>
      <div id="menu-panel" hidden><a id="link" href="#planes">Planes</a></div>`;
  });

  it('abre y cierra con el botón', () => {
    initMenu(document);
    const toggle = document.querySelector('.site-header__toggle');
    const panel = document.getElementById('menu-panel');
    toggle.click();
    expect(panel.hidden).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-label')).toBe('Cerrar menú');
    expect(document.body.classList.contains('menu-open')).toBe(true);
    toggle.click();
    expect(panel.hidden).toBe(true);
    expect(document.body.classList.contains('menu-open')).toBe(false);
  });

  it('cierra con Escape y al pulsar un enlace', () => {
    const menu = initMenu(document);
    const panel = document.getElementById('menu-panel');
    menu.open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(panel.hidden).toBe(true);
    menu.open();
    document.getElementById('link').click();
    expect(panel.hidden).toBe(true);
  });
});
```

`tests/unit/header-theme.test.js`:

```js
import { it, expect } from 'vitest';
import { themeAt } from '../../src/ui/header-theme.js';

const rects = [
  { top: -500, bottom: 300, theme: 'dark' },
  { top: 300, bottom: 1200, theme: 'light' },
];

it('devuelve el tema de la sección que contiene la sonda', () => {
  expect(themeAt(38, rects)).toBe('dark');
  expect(themeAt(400, rects)).toBe('light');
});

it('devuelve null si ninguna sección contiene la sonda', () => {
  expect(themeAt(5000, rects)).toBeNull();
});
```

- [ ] **Step 2: Ejecutar y verificar que fallan**

Run: `npx vitest run tests/unit/menu.test.js tests/unit/header-theme.test.js`
Expected: FAIL con "Failed to resolve import".

- [ ] **Step 3: Implementar `menu.js` y `header-theme.js`**

`src/ui/menu.js`:

```js
export function initMenu(doc) {
  const toggle = doc.querySelector('.site-header__toggle');
  const panel = doc.querySelector('#menu-panel');
  if (!toggle || !panel) return { open() {}, close() {} };

  function open() {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    doc.body.classList.add('menu-open');
  }

  function close() {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    doc.body.classList.remove('menu-open');
  }

  toggle.addEventListener('click', () => (panel.hidden ? open() : close()));
  panel.addEventListener('click', (e) => {
    if (e.target.closest('a')) close();
  });
  doc.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      close();
      toggle.focus();
    }
  });

  return { open, close };
}
```

`src/ui/header-theme.js`:

```js
export function themeAt(probeY, rects) {
  const hit = rects.find((r) => probeY >= r.top && probeY < r.bottom);
  return hit ? hit.theme : null;
}

export function initHeaderTheme(doc) {
  const header = doc.querySelector('.site-header');
  const sections = [...doc.querySelectorAll('main > section[data-theme], footer[data-theme]')];
  if (!header || sections.length === 0) return;

  let queued = false;
  function update() {
    queued = false;
    const probe = header.offsetHeight / 2;
    const rects = sections
      .filter((s) => !s.hidden)
      .map((s) => {
        const r = s.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, theme: s.dataset.theme };
      });
    const theme = themeAt(probe, rects);
    if (theme) header.dataset.theme = theme;
  }

  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  update();
}
```

- [ ] **Step 4: Ejecutar las pruebas unitarias y verificar que pasan**

Run: `npx vitest run tests/unit/menu.test.js tests/unit/header-theme.test.js`
Expected: PASS (4 pruebas).

- [ ] **Step 5: Escribir la prueba e2e que falla**

`tests/e2e/header.spec.js`:

```js
import { test, expect } from '@playwright/test';

test('la cabecera muestra el logo y el CTA de WhatsApp', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Pixely — inicio' })).toBeVisible();
  const cta = page.locator('.site-header [data-cta="header"]');
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', /^https:\/\/wa\.me\/51949268607\?text=/);
  await expect(cta).toHaveCSS('background-color', 'rgb(217, 11, 102)');
  await expect(page.locator('.site-header__access')).toBeHidden();
});

test('escritorio: anclas visibles y sin botón de menú', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await expect(page.locator('.site-header__nav')).toBeVisible();
  await expect(page.locator('.site-header__toggle')).toBeHidden();
});

test('móvil: el menú se abre y se cierra', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Abrir menú' });
  await toggle.click();
  await expect(page.locator('#menu-panel')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu-panel')).toBeHidden();
});
```

Run: `npx playwright test tests/e2e/header.spec.js`
Expected: FAIL (no existe `.site-header`).

- [ ] **Step 6: Escribir `components.css`**

`src/styles/components.css`:

```css
/* Secciones */
.section { position: relative; padding-block: var(--section-pad); }
.section--ink { background: var(--ink); color: var(--text-on-ink); }
.section--paper { background: var(--paper); color: var(--text-on-paper); }
.has-notch {
  clip-path: var(--notch);
  padding-bottom: calc(var(--section-pad) + var(--notch-depth));
}

/* Tipografía */
.caption {
  font-family: var(--font-display);
  font-size: var(--fs-caption);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.section--ink .caption { color: var(--text-on-ink-2); }
.section--paper .caption { color: var(--text-on-paper-2); }
.title-xl, .title-l, .title-m { font-family: var(--font-display); font-weight: 500; letter-spacing: -0.01em; }
.title-xl { font-size: var(--fs-xl); line-height: 1.12; }
.title-l { font-size: var(--fs-l); line-height: 1.1; }
.title-m { font-size: var(--fs-m); line-height: 1.15; }
.lead { font-size: var(--fs-lead); line-height: 1.45; }
.section--ink .muted { color: var(--text-on-ink-2); }
.section--paper .muted { color: var(--text-on-paper-2); }
.accent { color: var(--magenta); }

/* Botones: un círculo se expande desde el centro al pasar el cursor */
.btn {
  position: relative;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  min-height: 56px; padding: 0 28px;
  border-radius: var(--radius-btn);
  overflow: hidden; isolation: isolate;
  font-family: var(--font-display); font-size: 0.85rem; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap;
}
.btn::before {
  content: ''; position: absolute; z-index: -1;
  left: 50%; top: 50%; width: 220%; aspect-ratio: 1;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.8s var(--ease-out);
}
.btn:hover::before, .btn:focus-visible::before { transform: translate(-50%, -50%) scale(1); }
.btn__arrow { transition: transform 0.3s var(--ease-out); }
.btn:hover .btn__arrow { transform: translateX(3px); }
.btn--primary { background: var(--magenta-cta); color: #fff; }
.btn--primary::before { background: #fff; }
.btn--primary:hover, .btn--primary:focus-visible { color: var(--ink); }
.section--ink .btn--ghost { background: var(--carbon-2); color: #fff; }
.section--ink .btn--ghost::before { background: #fff; }
.section--ink .btn--ghost:hover { color: var(--ink); }
.section--paper .btn--ghost { background: var(--mist); color: var(--ink); }
.section--paper .btn--ghost::before { background: var(--ink); }
.section--paper .btn--ghost:hover { color: #fff; }
.btn--sm { min-height: 40px; padding: 0 16px; font-size: 0.75rem; }

.badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 12px; border-radius: 4px;
  font-family: var(--font-display); font-size: var(--fs-caption); font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
}
.section--ink .badge { background: var(--carbon-2); color: #fff; }
.badge__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--magenta); }

/* Rejilla de celdas con bordes finos */
.cells { display: grid; border-top: 1px solid; border-left: 1px solid; }
.cell { border-right: 1px solid; border-bottom: 1px solid; padding: 24px; }
.section--ink .cells, .section--ink .cell { border-color: var(--line-ink); }
.section--paper .cells, .section--paper .cell { border-color: var(--line-paper); }

.tag { font-family: var(--font-display); font-size: var(--fs-caption); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
.source-note { font-size: 0.8rem; }
.source-note a { text-decoration: underline; text-underline-offset: 2px; }
.section--ink .source-note { color: var(--text-on-ink-2); }
.section--paper .source-note { color: var(--text-on-paper-2); }
```

- [ ] **Step 7: Escribir el HTML y el CSS de la cabecera**

En `index.html`, reemplaza `<!-- @header -->` por:

```html
  <header class="site-header" data-theme="dark">
    <div class="site-header__bar container">
      <a class="site-header__logo" href="/" aria-label="Pixely — inicio">
        <img src="/brand/pixely-p.svg" alt="" width="28" height="42">
      </a>
      <nav class="site-header__nav" aria-label="Principal">
        <ul>
          <li><a href="#planes">Planes</a></li>
          <li><a href="#como-funciona">Cómo funciona</a></li>
          <li><a href="#ecosistema">Ecosistema</a></li>
          <li><a href="#preguntas">Preguntas</a></li>
        </ul>
      </nav>
      <div class="site-header__actions">
        <a class="site-header__access" data-flag="mostrarPartners" hidden href="https://partners.pixely.pe">Acceso clientes</a>
        <a class="btn btn--primary btn--sm" data-cta="header" href="https://wa.me/51949268607"><span class="btn__label">Escríbenos</span><span class="btn__arrow" aria-hidden="true">→</span></a>
        <button class="site-header__toggle" type="button" aria-expanded="false" aria-controls="menu-panel" aria-label="Abrir menú"><span></span><span></span></button>
      </div>
    </div>
    <div class="menu-panel" id="menu-panel" hidden>
      <nav aria-label="Menú móvil">
        <ul>
          <li><a href="#planes">Planes</a></li>
          <li><a href="#como-funciona">Cómo funciona</a></li>
          <li><a href="#ecosistema">Ecosistema</a></li>
          <li><a href="#preguntas">Preguntas</a></li>
          <li data-flag="mostrarPartners" hidden><a href="https://partners.pixely.pe">Acceso clientes</a></li>
        </ul>
      </nav>
      <a class="btn btn--primary" data-cta="menu" href="https://wa.me/51949268607"><span class="btn__label">Escríbenos por WhatsApp</span><span class="btn__arrow" aria-hidden="true">→</span></a>
    </div>
  </header>
```

`src/styles/sections/header.css`:

```css
.site-header {
  position: fixed; inset: 0 0 auto 0; z-index: 50;
  color: var(--text-on-ink); background: var(--ink);
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  border-bottom: 1px solid transparent;
}
.site-header[data-theme="light"] { background: var(--paper); color: var(--text-on-paper); border-bottom-color: var(--line-paper); }
.site-header__bar { height: var(--header-h); display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.site-header__logo img { width: 24px; height: auto; }
.site-header__nav { display: none; }
.site-header__nav ul { display: flex; gap: 40px; }
.site-header__nav a, .site-header__access {
  font-family: var(--font-display); font-size: var(--fs-caption); font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
}
.site-header__nav a:hover, .site-header__access:hover { color: var(--magenta); }
.site-header__actions { display: flex; align-items: center; gap: 12px; }
.site-header__access { display: none; }
.site-header__toggle {
  width: 44px; height: 44px; border-radius: var(--radius-btn);
  display: grid; place-content: center; gap: 6px;
  background: var(--carbon-2);
}
.site-header[data-theme="light"] .site-header__toggle { background: var(--mist); }
.site-header__toggle span { display: block; width: 16px; height: 2px; background: currentColor; transition: transform 0.3s; }
.site-header__toggle[aria-expanded="true"] span:first-child { transform: translateY(4px) rotate(45deg); }
.site-header__toggle[aria-expanded="true"] span:last-child { transform: translateY(-4px) rotate(-45deg); }

.menu-panel {
  position: fixed; inset: var(--header-h) 0 0 0;
  background: var(--ink); color: var(--text-on-ink);
  padding: 32px var(--gutter);
  display: flex; flex-direction: column; justify-content: space-between;
}
.menu-panel[hidden] { display: none; }
.menu-panel ul { display: grid; gap: 8px; }
.menu-panel a:not(.btn) { font-family: var(--font-display); font-size: 2rem; font-weight: 500; }
body.menu-open { overflow: hidden; }

@media (min-width: 1024px) {
  .site-header__nav { display: block; }
  .site-header__access:not([hidden]) { display: inline; }
  .site-header__toggle { display: none; }
  .site-header__logo img { width: 28px; }
}
```

`src/styles/main.css` (contenido completo):

```css
@import './tokens.css';
@import './base.css';
@import './components.css';
@import './sections/header.css';
```

- [ ] **Step 8: Conectar la UI en `src/main.js`**

```js
import { config } from './config.js';
import { applyFlags } from './core/flags.js';
import { applyCtaLinks } from './core/cta.js';
import { initMenu } from './ui/menu.js';
import { initHeaderTheme } from './ui/header-theme.js';

applyFlags(document, config.flags);
applyCtaLinks(document, config);
initMenu(document);
initHeaderTheme(document);
document.documentElement.dataset.boot = 'ok';
```

- [ ] **Step 9: Ejecutar todas las pruebas y verificar que pasan**

Run: `npx vitest run && npx playwright test tests/e2e/header.spec.js tests/e2e/smoke.spec.js`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add index.html src tests
git commit -m "Add base components, fixed header and mobile menu" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Imágenes y showreel con Magnific

> Esta tarea usa el conector MCP de Magnific (`mcp__050fc3f5-...`), cuyas herramientas se cargan con ToolSearch. Las relaciones de aspecto **16:10** de la spec §7.1 no existen en Magnific; se usan las más cercanas que sí admite: **4:3** (showreel y rubros), **3:2** (cómo funciona y ecosistema), **4:5** (problemas e historia) y **16:9** (fondo OG).

**Files:**
- Create: `scripts/media-manifest.mjs`, `scripts/optimize-media.mjs`, `docs/media-prompts.md`
- Generate: `media-src/images/*` (ignorado por git), `public/media/*`
- Test: `tests/unit/media.test.js`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `IMAGES` (de `scripts/media-manifest.mjs`): `Array<{ id: string, ratio: string, widths: number[], formats: string[] }>`.
  - Archivos `public/media/<id>-<ancho>.<avif|webp|jpg>` con anchos 800 y 1600, más `public/media/og-fondo-1600.jpg`.
  - Vídeo: `public/media/showreel.mp4`, `public/media/showreel.webm` y `public/media/showreel-poster.jpg`.
  - Las secciones usan estos ids: `showreel-1…4`, `rubro-moda`, `rubro-accesorios`, `rubro-tecnologia`, `rubro-minimarket`, `rubro-alimentos`, `rubro-galerias`, `problema-fotos`, `problema-diseno`, `problema-tiempo`, `paso-entrevista`, `paso-lab`, `paso-estrategia`, `paso-produccion`, `eco-investigar`, `eco-planificar`, `eco-producir`, `eco-publicar`, `historia`, `og-fondo`.

- [ ] **Step 1: Crear el manifiesto**

`scripts/media-manifest.mjs`:

```js
const std = { widths: [800, 1600], formats: ['avif', 'webp', 'jpg'] };

export const IMAGES = [
  { id: 'showreel-1', ratio: '4:3', ...std },
  { id: 'showreel-2', ratio: '4:3', ...std },
  { id: 'showreel-3', ratio: '4:3', ...std },
  { id: 'showreel-4', ratio: '4:3', ...std },
  { id: 'rubro-moda', ratio: '4:3', ...std },
  { id: 'rubro-accesorios', ratio: '4:3', ...std },
  { id: 'rubro-tecnologia', ratio: '4:3', ...std },
  { id: 'rubro-minimarket', ratio: '4:3', ...std },
  { id: 'rubro-alimentos', ratio: '4:3', ...std },
  { id: 'rubro-galerias', ratio: '4:3', ...std },
  { id: 'problema-fotos', ratio: '4:5', ...std },
  { id: 'problema-diseno', ratio: '4:5', ...std },
  { id: 'problema-tiempo', ratio: '4:5', ...std },
  { id: 'paso-entrevista', ratio: '3:2', ...std },
  { id: 'paso-lab', ratio: '3:2', ...std },
  { id: 'paso-estrategia', ratio: '3:2', ...std },
  { id: 'paso-produccion', ratio: '3:2', ...std },
  { id: 'eco-investigar', ratio: '3:2', ...std },
  { id: 'eco-planificar', ratio: '3:2', ...std },
  { id: 'eco-producir', ratio: '3:2', ...std },
  { id: 'eco-publicar', ratio: '3:2', ...std },
  { id: 'historia', ratio: '4:5', ...std },
  { id: 'og-fondo', ratio: '16:9', widths: [1600], formats: ['jpg'] },
];

export const VIDEO_FILES = ['showreel.mp4', 'showreel.webm', 'showreel-poster.jpg'];
export const VIDEO_MAX_BYTES = 4 * 1024 * 1024;
```

- [ ] **Step 2: Escribir la prueba que falla**

`tests/unit/media.test.js`:

```js
// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { IMAGES, VIDEO_FILES, VIDEO_MAX_BYTES } from '../../scripts/media-manifest.mjs';

describe('medios optimizados', () => {
  it('hay 23 imágenes en el manifiesto', () => {
    expect(IMAGES).toHaveLength(23);
  });

  for (const img of IMAGES) {
    for (const w of img.widths) {
      for (const ext of img.formats) {
        const file = `public/media/${img.id}-${w}.${ext}`;
        it(`existe ${file}`, () => expect(existsSync(file)).toBe(true));
      }
    }
  }

  for (const name of VIDEO_FILES) {
    it(`existe public/media/${name} y pesa ≤ 4 MB`, () => {
      const file = `public/media/${name}`;
      expect(existsSync(file)).toBe(true);
      expect(statSync(file).size).toBeLessThanOrEqual(VIDEO_MAX_BYTES);
    });
  }
});
```

Run: `npx vitest run tests/unit/media.test.js`
Expected: FAIL (no existe ningún archivo en `public/media/`).

- [ ] **Step 3: Escribir `docs/media-prompts.md` con los 23 prompts**

Todos los prompts terminan con el **sufijo de estilo**:

> Cinematic photorealistic photograph, high contrast, dark moody background with deep shadows, dramatic directional side lighting, one subtle magenta neon accent light (#EB0C6E) as the only vivid color, shallow depth of field, premium commercial look. Absolutely no text, letters, numbers, logos, watermarks, signage, price tags, or readable screens anywhere in the image. No yellow, no lime green, no corporate blue, no pastel colors.

Y cuando aparecen personas, también con el **sufijo de personas**:

> Latin American person aged 25 to 45, smart casual clothing, confident and focused attitude, looking at the product or their work, natural expression, no exaggerated smile, no handshake, no pointing at charts.

| id | ratio | prompt (antes de los sufijos) | personas |
|---|---|---|---|
| showreel-1 | 4:3 | A clothing boutique owner in her thirties folding a premium dark jacket on a display table inside her small store in Lima at night | sí |
| showreel-2 | 4:3 | Close-up of a pair of white leather sneakers on a black studio pedestal, crisp rim light, magenta reflection on the floor | no |
| showreel-3 | 4:3 | A young man behind a phone accessories counter holding a pair of wireless earbuds in their charging case under dramatic side light | sí |
| showreel-4 | 4:3 | A neighborhood minimarket owner in his forties arranging glass bottles of drinks on a perfectly ordered shelf, warm practical light | sí |
| rubro-moda | 4:3 | A rack of tailored garments in a small fashion boutique, fabrics in black, deep red and cream, one jacket highlighted by a spotlight | no |
| rubro-accesorios | 4:3 | Leather handbags and minimal silver jewelry displayed on dark wooden shelves, each piece lit like a museum object | no |
| rubro-tecnologia | 4:3 | Smartphones and phone cases arranged on a dark glass counter in a small tech store, screens off and reflective | no |
| rubro-minimarket | 4:3 | Wide shot of a clean, ordered minimarket aisle at closing time, products in tidy rows, warm light spilling from the shelves | no |
| rubro-alimentos | 4:3 | A gourmet burger on a dark slate board in a small kitchen, steam rising, side light revealing texture | no |
| rubro-galerias | 4:3 | A corridor of small storefronts inside a commercial gallery like Gamarra at dusk, shutters half open, no readable signs | no |
| problema-fotos | 4:5 | A small business owner holding a smartphone, about to photograph a handbag on a dark tabletop, a softbox light in the background | sí |
| problema-diseno | 4:5 | A business owner reviewing a spread of printed product photographs on a dark table, choosing the best ones | sí |
| problema-tiempo | 4:5 | A busy store owner attending a customer at the counter at dusk, smartphone lying face down beside the register | sí |
| paso-entrevista | 3:2 | Two people talking across a table in a quiet studio, one listening and taking handwritten notes in a closed notebook, warm side light | sí |
| paso-lab | 3:2 | Close-up of hands holding a smartphone whose screen glows magenta with blurred unreadable content, dark background | no |
| paso-estrategia | 3:2 | A planning wall with blank cards and printed product photographs pinned in a grid, connected by thin magenta thread | no |
| paso-produccion | 3:2 | A perfume bottle on a studio set under dramatic light, a camera on a tripod softly out of focus in the foreground | no |
| eco-investigar | 3:2 | Aerial view of a busy commercial street in Lima at dusk, storefront lights glowing, no readable signs | no |
| eco-planificar | 3:2 | A minimal dark desk with a closed notebook, a pen and a smartphone face down, one magenta light streak across the surface | no |
| eco-producir | 3:2 | A product photography studio with softboxes surrounding a sneaker on a pedestal, behind-the-scenes wide shot | no |
| eco-publicar | 3:2 | A smartphone on a small stand on a store counter, screen glowing with blurred unreadable images, customers out of focus behind | no |
| historia | 4:5 | A shop owner in his forties standing proudly inside his clothing store in Gamarra at closing time, looking at his neatly displayed products | sí |
| og-fondo | 16:9 | Dark abstract studio background with a single soft magenta neon glow on the right third, smooth gradient, large empty negative space on the left, no objects | no |

Añade al final del archivo una sección `## Registro` con una tabla `id | creationIdentifier | intento | estado`, que se rellena en los pasos siguientes.

- [ ] **Step 4: Estimar el costo e informar al usuario**

1. Con ToolSearch, carga: `images_models_list`, `images_generate`, `simulate_cost`, `creations_wait`, `creations_get`, `video_models_list`, `video_generate`, `video_concatenate`, `account_balance`, `folders_create`.
2. Llama a `images_models_list` y confirma que existe el slug `imagen-nano-banana-2` (Nano Banana Pro, el mismo modelo que usa `04_ensamblar.md`). Anota la resolución más alta que admite.
3. Llama a `simulate_cost` con `tool: "images_generate"` y los argumentos de una imagen (`mode: "imagen-nano-banana-2"`, `aspectRatio: "4:3"`, `count: 1`, la resolución elegida y un prompt cualquiera). Multiplica por 23.
4. Llama a `video_models_list` y elige un modelo de imagen a vídeo que admita fotograma inicial (`keyframes.start`), relación 4:3 o 16:9 y la duración mínima disponible. Estima su costo con `simulate_cost` (`tool: "video_generate"`) y multiplica por 4.
5. Llama a `account_balance`. Informa al usuario en una línea: "Costo estimado: N créditos (imágenes) + M (vídeo); saldo: S". **Si el total supera el saldo, detente y pregunta.** En otro caso, continúa: el usuario lo aprobó por adelantado.

- [ ] **Step 5: Generar las 23 imágenes**

1. `folders_create` con nombre `Pixely Web`. Usa su referencia en **todas** las llamadas siguientes (`folderReference`).
2. Para cada fila del Step 3, llama a `images_generate` con `mode: "imagen-nano-banana-2"`, `aspectRatio` de la fila, `count: 1`, la resolución elegida y el `prompt` completo: texto de la fila + sufijo de personas (si la fila dice "sí") + sufijo de estilo. Lanza hasta 6 en paralelo.
3. Registra cada `creationIdentifier` en la sección `## Registro`.
4. Espera con `creations_wait`, en lotes de hasta 8.

- [ ] **Step 6: Revisar cada imagen y regenerar las que fallen**

1. `creations_get` con todos los identificadores, para obtener las URLs `url` (resolución completa).
2. Descarga cada una:

```bash
mkdir -p media-src/images media-src/video
curl -sSL -o "media-src/images/<id>.png" "<url>"
```

(usa la extensión real que indique la URL o el campo de formato).

3. Abre cada archivo con la herramienta Read y comprueba:
   a. No hay texto, letras, números ni logos legibles.
   b. No aparecen amarillo saturado, verde lima ni azul corporativo.
   c. El magenta es un acento y no inunda la imagen.
   d. Las personas cumplen el sufijo de personas.
   e. No se ve ninguna deformación evidente (manos, caras, productos).
4. Si una imagen falla, regenérala una vez con el mismo prompt y, si vuelve a fallar, una segunda vez añadiendo al prompt la corrección concreta (por ejemplo, "remove all signage"). Anota los intentos en el registro. Si falla tres veces, detente e informa al usuario con la imagen.

- [ ] **Step 7: Generar y unir el showreel**

1. Para cada `showreel-1…4`, llama a `video_generate` con el modelo elegido, `keyframes: { start: { type: "image", url: "<creationIdentifier de la imagen>" } }`, `aspectRatio` igual al de la imagen (o el más cercano que admita el modelo), la duración mínima del modelo, sin efectos de sonido, y este prompt: `Slow cinematic camera push-in, subtle natural motion of light and fabric, no new objects, no text`.
2. Cuando estén listos (`creations_wait`), llama a `video_concatenate` con los 4 identificadores en orden y `name: "Pixely showreel"`.
3. Descarga el resultado en `media-src/video/showreel-raw.mp4`.
4. Codifica para web con ffmpeg:

```bash
ffmpeg -y -i media-src/video/showreel-raw.mp4 -an -vf "scale=1280:-2" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart public/media/showreel.mp4
ffmpeg -y -i media-src/video/showreel-raw.mp4 -an -vf "scale=1280:-2" -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 public/media/showreel.webm
ffmpeg -y -i public/media/showreel.mp4 -frames:v 1 -q:v 3 public/media/showreel-poster.jpg
```

5. Si algún archivo supera 4 MB, repite la codificación subiendo `-crf` de 2 en 2 hasta que quepa.

- [ ] **Step 8: Crear `scripts/optimize-media.mjs` y optimizar**

```js
import { mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { IMAGES } from './media-manifest.mjs';

const SRC = 'media-src/images';
const OUT = 'public/media';
mkdirSync(OUT, { recursive: true });
const sources = readdirSync(SRC);

const encoders = {
  avif: (p) => p.avif({ quality: 50 }),
  webp: (p) => p.webp({ quality: 72 }),
  jpg: (p) => p.jpeg({ quality: 78, mozjpeg: true }),
};

for (const img of IMAGES) {
  const file = sources.find((f) => f.startsWith(`${img.id}.`));
  if (!file) throw new Error(`Falta el original de ${img.id} en ${SRC}`);
  for (const w of img.widths) {
    const base = sharp(join(SRC, file)).resize({ width: w, withoutEnlargement: true });
    for (const ext of img.formats) {
      await encoders[ext](base.clone()).toFile(join(OUT, `${img.id}-${w}.${ext}`));
    }
  }
  console.log(`✓ ${img.id}`);
}
```

Run: `npm run media`
Expected: 23 líneas `✓ <id>`.

- [ ] **Step 9: Ejecutar la prueba y verificar que pasa**

Run: `npx vitest run tests/unit/media.test.js`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add scripts/media-manifest.mjs scripts/optimize-media.mjs docs/media-prompts.md public/media tests/unit/media.test.js
git commit -m "Add Magnific-generated imagery and showreel" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Hero (spec §4.1)

**Files:**
- Create: `src/styles/sections/hero.css`, `src/ui/autoplay.js`, `public/media/showreel.vtt`
- Modify: `index.html` (marcador `<!-- @hero -->`), `src/styles/main.css`, `src/main.js`
- Test: `tests/e2e/hero.spec.js`

**Interfaces:**
- Consumes: componentes (Task 5), `config.mensajes.hero` (Task 2), medios `showreel.*` (Task 6).
- Produces:
  - Atributos que usará el movimiento (Tasks 14–15): `data-split` (titulares que entran palabra a palabra), `data-reveal` (bloques que aparecen), `data-scramble` (etiquetas que se revuelven), `data-tilt-wrap` y `data-tilt` (showreel inclinado).
  - `initAutoplay(doc: Document, reduced: boolean): void`. Reproduce los `video[data-autoplay]` solo si `reduced === false` y los pausa cuando salen de pantalla.

- [ ] **Step 1: Escribir la prueba que falla**

`tests/e2e/hero.spec.js`:

```js
import { test, expect } from '@playwright/test';
import { config } from '../../src/config.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

test('hero: titular, CTA, insignia y números', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('#inicio');
  await expect(hero.locator('h1')).toHaveText('Tu publicidad no sale de la ocurrencia de un diseñador. Sale de datos reales.');
  await expect(hero.locator('[data-cta="hero"]')).toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes.hero));
  await expect(hero.getByText('Pixely Partners · Próximamente')).toBeVisible();
  await expect(hero.locator('.hero__number')).toHaveText(['48', '7–14', '10', '100 %']);
  await expect(hero.locator('.hero__formats li')).toHaveCount(4);
  const clip = await hero.evaluate((el) => getComputedStyle(el).clipPath);
  expect(clip.startsWith('polygon(')).toBe(true);
  await expect(page.locator('.site-header')).toHaveAttribute('data-theme', 'dark');
});

test('hero: el showreel tiene portada y se reproduce', async ({ page }) => {
  await page.goto('/');
  const video = page.locator('.hero__video');
  await expect(video).toHaveAttribute('poster', '/media/showreel-poster.jpg');
  await expect(video.locator('source')).toHaveCount(2);
  await expect.poll(() => video.evaluate((v) => v.paused)).toBe(false);
});

test.describe('con reducir movimiento', () => {
  test.use({ reducedMotion: 'reduce' });
  test('el showreel no se reproduce solo', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    expect(await page.locator('.hero__video').evaluate((v) => v.paused)).toBe(true);
  });
});
```

Run: `npx playwright test tests/e2e/hero.spec.js`
Expected: FAIL (no existe `#inicio`).

- [ ] **Step 2: Escribir el HTML**

En `index.html`, reemplaza `<!-- @hero -->` por:

```html
    <section class="hero section section--ink has-notch" id="inicio" data-theme="dark" aria-labelledby="hero-title">
      <div class="container">
        <div class="hero__eyebrow" data-reveal>
          <p class="caption">Publicidad estratégica con IA · Lima, Perú</p>
          <span class="badge">
            <span class="badge__dot" aria-hidden="true"></span>
            <span data-flag-off="mostrarPartners">Pixely Partners · Próximamente</span>
            <span data-flag="mostrarPartners" hidden>Pixely Partners · Nuevo</span>
          </span>
        </div>
        <h1 class="title-xl hero__title" id="hero-title" data-split>Tu publicidad no sale de la ocurrencia de un diseñador. <span class="accent">Sale de datos reales.</span></h1>
        <div class="hero__ctas" data-reveal>
          <a class="btn btn--primary" data-cta="hero" href="https://wa.me/51949268607"><span class="btn__label">Escríbenos por WhatsApp</span><span class="btn__arrow" aria-hidden="true">→</span></a>
          <a class="btn btn--ghost" href="#como-funciona"><span class="btn__label">Cómo funciona</span><span class="btn__arrow" aria-hidden="true">↓</span></a>
        </div>
        <div class="hero__grid">
          <div class="hero__media-col" data-tilt-wrap>
            <figure class="hero__media" data-tilt>
              <video class="hero__video" data-autoplay muted loop playsinline preload="metadata" poster="/media/showreel-poster.jpg" width="1280" height="960" aria-label="Showreel con piezas de producción Pixely">
                <source src="/media/showreel.webm" type="video/webm">
                <source src="/media/showreel.mp4" type="video/mp4">
                <track kind="captions" src="/media/showreel.vtt" srclang="es" label="Español" default>
              </video>
              <figcaption class="caption hero__media-label">Producción Pixely ▸</figcaption>
            </figure>
          </div>
          <div class="hero__info">
            <p class="lead muted" data-reveal>Transformamos cómo tu negocio comunica sus productos: analizamos lo que tu audiencia real quiere ver y lo convertimos en publicidad lista para publicar.</p>
            <p class="caption" data-scramble>Cada campaña incluye</p>
            <ul class="cells hero__formats" data-reveal>
              <li class="cell"><span class="hero__ratio">1:1</span>Pauta pagada</li>
              <li class="cell"><span class="hero__ratio">4:5</span>Feed</li>
              <li class="cell"><span class="hero__ratio">9:16</span>Estados</li>
              <li class="cell"><span class="hero__ratio">Reel</span>Reels animados</li>
            </ul>
            <p class="caption" data-scramble>Pixely en números</p>
            <ul class="cells hero__stats" data-reveal>
              <li class="cell"><strong class="hero__number">48</strong><span class="muted">piezas al mes en el Plan Pro</span></li>
              <li class="cell"><strong class="hero__number">7–14</strong><span class="muted">días hábiles para tu primera campaña</span></li>
              <li class="cell"><strong class="hero__number">10</strong><span class="muted">métricas visuales en el Lab</span></li>
              <li class="cell"><strong class="hero__number">100 %</strong><span class="muted">digital, en toda Latinoamérica</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Escribir el CSS**

`src/styles/sections/hero.css`:

```css
.hero { padding-top: calc(var(--header-h) + 64px); }
.hero__eyebrow { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 24px; }
.hero__title { max-width: 22ch; }
.hero__ctas { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 28px; }
.hero__grid { display: grid; gap: 40px; margin-top: 56px; }
.hero__media { position: relative; border-radius: var(--radius-card); overflow: hidden; }
.hero__video { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; background: var(--carbon); }
.hero__media-label {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  color: #fff; text-decoration: underline; text-underline-offset: 6px; white-space: nowrap;
}
.hero__info { display: flex; flex-direction: column; gap: 24px; }
.hero__formats { grid-template-columns: repeat(2, 1fr); }
.hero__formats .cell { display: grid; gap: 6px; font-weight: 500; }
.hero__ratio { font-family: var(--font-display); font-size: 1.5rem; color: var(--magenta); }
.hero__stats { grid-template-columns: repeat(2, 1fr); }
.hero__stats .cell { display: grid; gap: 8px; text-align: center; padding-block: 32px; }
.hero__number { font-family: var(--font-display); font-size: clamp(2.25rem, 3.6vw, 3.75rem); font-weight: 500; line-height: 1; }

@media (max-width: 767px) {
  .hero__ctas .btn { width: 100%; }
}

@media (min-width: 768px) {
  .hero__formats { grid-template-columns: repeat(4, 1fr); }
}

@media (min-width: 1024px) {
  .hero__grid { grid-template-columns: 1fr 1fr; column-gap: 32px; margin-top: 60px; }
  .hero__media { position: sticky; top: calc(var(--header-h) + 40px); }
  .js-motion .hero__media { transform: rotate(-15deg); }
  .hero__info { padding-block: 32px; }
}
```

Añade al final de `src/styles/main.css`:

```css
@import './sections/hero.css';
```

Crea `public/media/showreel.vtt`. El vídeo no tiene audio y los subtítulos lo dicen; así se cumple la regla `video-caption` de WCAG que revisa axe en la Task 16:

```
WEBVTT

00:00:00.000 --> 00:00:30.000
[Sin audio: secuencia de piezas de producción Pixely]
```

- [ ] **Step 4: Crear `src/ui/autoplay.js` y conectarlo**

```js
export function initAutoplay(doc, reduced) {
  const videos = [...doc.querySelectorAll('video[data-autoplay]')];
  if (reduced || videos.length === 0) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.muted = true;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  }, { threshold: 0.1 });
  videos.forEach((v) => io.observe(v));
}
```

En `src/main.js`, añade el import y la llamada:

```js
import { initAutoplay } from './ui/autoplay.js';
```

```js
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
initAutoplay(document, reduced);
```

(ambas líneas antes de `document.documentElement.dataset.boot = 'ok';`).

- [ ] **Step 5: Ejecutar la prueba y verificar que pasa**

Run: `npx playwright test tests/e2e/hero.spec.js`
Expected: PASS en `desktop` y `mobile`.

Run: `npm run build && npm run check:content`
Expected: `0 infracciones`.

- [ ] **Step 6: Commit**

```bash
git add index.html src public/media/showreel.vtt tests/e2e/hero.spec.js
git commit -m "Build hero section with showreel, formats and numbers" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Rubros y Problemas (spec §4.2 y §4.3)

**Files:**
- Create: `src/styles/sections/rubros.css`, `src/styles/sections/problemas.css`
- Modify: `index.html` (marcadores `<!-- @rubros -->` y `<!-- @problemas -->`), `src/styles/main.css`
- Test: `tests/e2e/rubros-problemas.spec.js`

**Interfaces:**
- Consumes: componentes (Task 5), `data-split`/`data-reveal` (Task 7), imágenes `rubro-*` y `problema-*` (Task 6), mensajes `rubro-otro`, `problema-fotos`, `problema-diseno` y `problema-tiempo` (Task 2).
- Produces: `#rubros` y `#problemas`, ambas con `data-theme="light"`. El patrón `<picture>` de esta tarea (AVIF → WebP → JPG, anchos 800/1600) es el que repiten las tareas siguientes.

- [ ] **Step 1: Escribir la prueba que falla**

`tests/e2e/rubros-problemas.spec.js`:

```js
import { test, expect } from '@playwright/test';
import { config } from '../../src/config.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

async function expectLoaded(img) {
  await img.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate((i) => i.complete && i.naturalWidth > 0)).toBe(true);
}

test('rubros: 8 celdas, 6 imágenes cargadas y CTA para otros rubros', async ({ page }) => {
  await page.goto('/');
  const rubros = page.locator('#rubros');
  await expect(rubros.locator('.rubro')).toHaveCount(8);
  const imgs = rubros.locator('img');
  await expect(imgs).toHaveCount(6);
  for (let i = 0; i < 6; i += 1) {
    await expect(imgs.nth(i)).not.toHaveAttribute('alt', '');
    await expectLoaded(imgs.nth(i));
  }
  await expect(rubros.locator('[data-cta="rubro-otro"]'))
    .toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes['rubro-otro']));
});

test('la cabecera se vuelve clara sobre Rubros', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.getElementById('rubros').offsetTop + 10));
  await expect(page.locator('.site-header')).toHaveAttribute('data-theme', 'light');
});

test('problemas: 3 filas con CTA, fuentes y disclaimer', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#problemas');
  await expect(sec.locator('.problema__q')).toHaveText([
    '¿Tus fotos las tomas con el celular sobre una sábana blanca?',
    '¿Te hace los diseños un familiar?',
    '¿No tienes tiempo para publicar?',
  ]);
  for (const key of ['problema-fotos', 'problema-diseno', 'problema-tiempo']) {
    await expect(sec.locator(`[data-cta="${key}"]`)).toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes[key]));
  }
  await expect(sec.locator('.source-note a')).toHaveCount(2);
  await expect(sec.getByText('Los resultados pueden variar según el negocio, el sector y la constancia en la publicación.')).toBeVisible();
  const imgs = sec.locator('img');
  await expect(imgs).toHaveCount(3);
  for (let i = 0; i < 3; i += 1) await expectLoaded(imgs.nth(i));
});
```

Run: `npx playwright test tests/e2e/rubros-problemas.spec.js`
Expected: FAIL (no existe `#rubros`).

- [ ] **Step 2: Escribir el HTML de Rubros**

En `index.html`, reemplaza `<!-- @rubros -->` por:

```html
    <section class="rubros section section--paper" id="rubros" data-theme="light" aria-labelledby="rubros-title">
      <div class="container">
        <p class="caption" data-reveal>Con quién trabajamos</p>
        <h2 class="title-l rubros__title" id="rubros-title" data-split>Para negocios que ya venden y quieren verse a la altura de su producto.</h2>
        <ul class="cells rubros__grid">
          <li class="cell rubro">
            <picture class="rubro__media">
              <source type="image/avif" srcset="/media/rubro-moda-800.avif 800w, /media/rubro-moda-1600.avif 1600w" sizes="(min-width: 1024px) 25vw, 50vw">
              <source type="image/webp" srcset="/media/rubro-moda-800.webp 800w, /media/rubro-moda-1600.webp 1600w" sizes="(min-width: 1024px) 25vw, 50vw">
              <img src="/media/rubro-moda-800.jpg" srcset="/media/rubro-moda-800.jpg 800w, /media/rubro-moda-1600.jpg 1600w" sizes="(min-width: 1024px) 25vw, 50vw" width="800" height="600" loading="lazy" decoding="async" alt="Prendas de vestir en una boutique, iluminadas como en una producción de moda">
            </picture>
            <span class="rubro__name">Moda y ropa</span>
          </li>
          <li class="cell rubro">
            <picture class="rubro__media">
              <source type="image/avif" srcset="/media/rubro-accesorios-800.avif 800w, /media/rubro-accesorios-1600.avif 1600w" sizes="(min-width: 1024px) 25vw, 50vw">
              <source type="image/webp" srcset="/media/rubro-accesorios-800.webp 800w, /media/rubro-accesorios-1600.webp 1600w" sizes="(min-width: 1024px) 25vw, 50vw">
              <img src="/media/rubro-accesorios-800.jpg" srcset="/media/rubro-accesorios-800.jpg 800w, /media/rubro-accesorios-1600.jpg 1600w" sizes="(min-width: 1024px) 25vw, 50vw" width="800" height="600" loading="lazy" decoding="async" alt="Carteras de cuero y joyería en repisas oscuras">
            </picture>
            <span class="rubro__name">Accesorios</span>
          </li>
          <li class="cell rubro">
            <picture class="rubro__media">
              <source type="image/avif" srcset="/media/rubro-tecnologia-800.avif 800w, /media/rubro-tecnologia-1600.avif 1600w" sizes="(min-width: 1024px) 25vw, 50vw">
              <source type="image/webp" srcset="/media/rubro-tecnologia-800.webp 800w, /media/rubro-tecnologia-1600.webp 1600w" sizes="(min-width: 1024px) 25vw, 50vw">
              <img src="/media/rubro-tecnologia-800.jpg" srcset="/media/rubro-tecnologia-800.jpg 800w, /media/rubro-tecnologia-1600.jpg 1600w" sizes="(min-width: 1024px) 25vw, 50vw" width="800" height="600" loading="lazy" decoding="async" alt="Celulares y fundas ordenados sobre un mostrador de vidrio">
            </picture>
            <span class="rubro__name">Tecnología y celulares</span>
          </li>
          <li class="cell rubro">
            <picture class="rubro__media">
              <source type="image/avif" srcset="/media/rubro-minimarket-800.avif 800w, /media/rubro-minimarket-1600.avif 1600w" sizes="(min-width: 1024px) 25vw, 50vw">
              <source type="image/webp" srcset="/media/rubro-minimarket-800.webp 800w, /media/rubro-minimarket-1600.webp 1600w" sizes="(min-width: 1024px) 25vw, 50vw">
              <img src="/media/rubro-minimarket-800.jpg" srcset="/media/rubro-minimarket-800.jpg 800w, /media/rubro-minimarket-1600.jpg 1600w" sizes="(min-width: 1024px) 25vw, 50vw" width="800" height="600" loading="lazy" decoding="async" alt="Pasillo de minimarket ordenado al cierre del día">
            </picture>
            <span class="rubro__name">Minimarkets</span>
          </li>
          <li class="cell rubro">
            <picture class="rubro__media">
              <source type="image/avif" srcset="/media/rubro-alimentos-800.avif 800w, /media/rubro-alimentos-1600.avif 1600w" sizes="(min-width: 1024px) 25vw, 50vw">
              <source type="image/webp" srcset="/media/rubro-alimentos-800.webp 800w, /media/rubro-alimentos-1600.webp 1600w" sizes="(min-width: 1024px) 25vw, 50vw">
              <img src="/media/rubro-alimentos-800.jpg" srcset="/media/rubro-alimentos-800.jpg 800w, /media/rubro-alimentos-1600.jpg 1600w" sizes="(min-width: 1024px) 25vw, 50vw" width="800" height="600" loading="lazy" decoding="async" alt="Hamburguesa gourmet sobre una tabla de pizarra">
            </picture>
            <span class="rubro__name">Alimentos y bebidas</span>
          </li>
          <li class="cell rubro">
            <picture class="rubro__media">
              <source type="image/avif" srcset="/media/rubro-galerias-800.avif 800w, /media/rubro-galerias-1600.avif 1600w" sizes="(min-width: 1024px) 25vw, 50vw">
              <source type="image/webp" srcset="/media/rubro-galerias-800.webp 800w, /media/rubro-galerias-1600.webp 1600w" sizes="(min-width: 1024px) 25vw, 50vw">
              <img src="/media/rubro-galerias-800.jpg" srcset="/media/rubro-galerias-800.jpg 800w, /media/rubro-galerias-1600.jpg 1600w" sizes="(min-width: 1024px) 25vw, 50vw" width="800" height="600" loading="lazy" decoding="async" alt="Pasillo de una galería comercial con tiendas pequeñas al atardecer">
            </picture>
            <span class="rubro__name">Galerías comerciales</span>
          </li>
          <li class="cell rubro rubro--text">
            <span class="rubro__name">Pequeñas empresas de 2 a 10 personas</span>
            <span class="muted">Que quieren ordenar y sistematizar su publicidad.</span>
          </li>
          <li class="cell rubro rubro--cta">
            <a class="rubro__cta" data-cta="rubro-otro" href="https://wa.me/51949268607">
              <span class="rubro__name">¿Tu rubro no está?</span>
              <span class="caption">Escríbenos →</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
```

- [ ] **Step 3: Escribir el HTML de Problemas**

Reemplaza `<!-- @problemas -->` por:

```html
    <section class="problemas section section--paper" id="problemas" data-theme="light" aria-labelledby="problemas-title">
      <div class="container">
        <p class="caption" data-reveal>Problemas que resolvemos</p>
        <h2 class="title-l problemas__title" id="problemas-title" data-split>El problema de tu negocio no es tu producto. Es cómo lo muestras.</h2>
        <ol class="problemas__list">
          <li class="problema">
            <h3 class="problema__q">¿Tus fotos las tomas con el celular sobre una sábana blanca?</h3>
            <div class="problema__a">
              <p class="lead">Nuestro proceso con IA está hecho justo para eso: partimos de lo que tienes y lo convertimos en fotografía publicitaria de nivel profesional.</p>
              <p class="source-note">En estudios de e-commerce internacional, cambiar a imágenes con IA subió la conversión de 2,1 % a 2,9 % en tiendas de moda. <a href="https://focalflow.app/en/blog/product-photography-ab-testing" target="_blank" rel="noopener">Fuente: FocalFlow</a>.</p>
              <a class="btn btn--primary" data-cta="problema-fotos" href="https://wa.me/51949268607"><span class="btn__label">Quiero que mi producto luzca así</span><span class="btn__arrow" aria-hidden="true">→</span></a>
            </div>
            <picture class="problema__media">
              <source type="image/avif" srcset="/media/problema-fotos-800.avif 800w, /media/problema-fotos-1600.avif 1600w" sizes="(min-width: 1024px) 25vw, 100vw">
              <source type="image/webp" srcset="/media/problema-fotos-800.webp 800w, /media/problema-fotos-1600.webp 1600w" sizes="(min-width: 1024px) 25vw, 100vw">
              <img src="/media/problema-fotos-800.jpg" srcset="/media/problema-fotos-800.jpg 800w, /media/problema-fotos-1600.jpg 1600w" sizes="(min-width: 1024px) 25vw, 100vw" width="800" height="1000" loading="lazy" decoding="async" alt="Dueña de negocio a punto de fotografiar una cartera con su celular">
            </picture>
          </li>
          <li class="problema">
            <h3 class="problema__q">¿Te hace los diseños un familiar?</h3>
            <div class="problema__a">
              <p class="lead">Diseñar no es lo mismo que hacer publicidad. Partimos de lo que tu audiencia comenta y responde, y le damos dirección estratégica a cada pieza.</p>
              <a class="btn btn--primary" data-cta="problema-diseno" href="https://wa.me/51949268607"><span class="btn__label">Quiero publicidad con estrategia</span><span class="btn__arrow" aria-hidden="true">→</span></a>
            </div>
            <picture class="problema__media">
              <source type="image/avif" srcset="/media/problema-diseno-800.avif 800w, /media/problema-diseno-1600.avif 1600w" sizes="(min-width: 1024px) 25vw, 100vw">
              <source type="image/webp" srcset="/media/problema-diseno-800.webp 800w, /media/problema-diseno-1600.webp 1600w" sizes="(min-width: 1024px) 25vw, 100vw">
              <img src="/media/problema-diseno-800.jpg" srcset="/media/problema-diseno-800.jpg 800w, /media/problema-diseno-1600.jpg 1600w" sizes="(min-width: 1024px) 25vw, 100vw" width="800" height="1000" loading="lazy" decoding="async" alt="Dueño de negocio eligiendo entre fotografías de producto impresas">
            </picture>
          </li>
          <li class="problema">
            <h3 class="problema__q">¿No tienes tiempo para publicar?</h3>
            <div class="problema__a">
              <p class="lead">Con el Plan Pro programamos y publicamos por ti. Tú solo atiendes los mensajes de compra que llegan.</p>
              <p class="source-note">Los dueños de pequeños negocios dedican entre 6 y 10 horas a la semana a crear contenido (encuestas internacionales 2025-26). <a href="https://blog.picmim.com/blog/how-much-time-small-businesses-actually-spend-on-social-media-survey-of-200-owners" target="_blank" rel="noopener">Fuente: Picmim</a>.</p>
              <a class="btn btn--primary" data-cta="problema-tiempo" href="https://wa.me/51949268607"><span class="btn__label">Quiero que publiquen por mí</span><span class="btn__arrow" aria-hidden="true">→</span></a>
            </div>
            <picture class="problema__media">
              <source type="image/avif" srcset="/media/problema-tiempo-800.avif 800w, /media/problema-tiempo-1600.avif 1600w" sizes="(min-width: 1024px) 25vw, 100vw">
              <source type="image/webp" srcset="/media/problema-tiempo-800.webp 800w, /media/problema-tiempo-1600.webp 1600w" sizes="(min-width: 1024px) 25vw, 100vw">
              <img src="/media/problema-tiempo-800.jpg" srcset="/media/problema-tiempo-800.jpg 800w, /media/problema-tiempo-1600.jpg 1600w" sizes="(min-width: 1024px) 25vw, 100vw" width="800" height="1000" loading="lazy" decoding="async" alt="Dueño de tienda atendiendo a un cliente en el mostrador">
            </picture>
          </li>
        </ol>
        <p class="source-note problemas__disclaimer">Los resultados pueden variar según el negocio, el sector y la constancia en la publicación.</p>
      </div>
    </section>
```

- [ ] **Step 4: Escribir el CSS**

`src/styles/sections/rubros.css`:

```css
.rubros__title { max-width: 24ch; margin: 16px 0 48px; }
.rubros__grid { grid-template-columns: repeat(2, 1fr); }
.rubro { position: relative; display: grid; align-content: end; gap: 12px; min-height: 200px; overflow: hidden; }
.rubro__media img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 8px; }
.rubro__name { position: relative; z-index: 1; font-family: var(--font-display); font-size: 1.25rem; font-weight: 500; line-height: 1.2; transition: color 0.3s; }
.rubro--text { gap: 8px; }
.rubro--cta { padding: 0; }
.rubro__cta { display: grid; align-content: end; gap: 8px; height: 100%; padding: 24px; background: var(--ink); color: #fff; transition: background-color 0.3s; }
.rubro__cta:hover, .rubro__cta:focus-visible { background: var(--magenta-cta); }
.rubro__cta .caption { color: rgba(255, 255, 255, 0.8); }

@media (min-width: 1024px) {
  .rubros__grid { grid-template-columns: repeat(4, 1fr); }
  .rubro { min-height: 280px; }
}

@media (hover: hover) and (min-width: 1024px) {
  .rubro__media { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s var(--ease-out); }
  .rubro__media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(10, 10, 12, 0.8), transparent 60%); }
  .rubro__media img { height: 100%; aspect-ratio: auto; border-radius: 0; transform: scale(1.06); transition: transform 0.8s var(--ease-out); }
  .rubro:hover .rubro__media { opacity: 1; }
  .rubro:hover .rubro__media img { transform: scale(1); }
  .rubro:hover .rubro__name { color: #fff; }
}
```

`src/styles/sections/problemas.css`:

```css
.problemas__title { max-width: 22ch; margin: 16px 0 48px; }
.problema {
  display: grid; gap: 24px;
  padding-block: 32px;
  border-top: 1px solid var(--line-paper);
  background: var(--paper);
}
.problema__q { font-family: var(--font-display); font-size: 1.15rem; font-weight: 500; line-height: 1.3; }
.problema__a { display: grid; gap: 20px; align-content: start; justify-items: start; }
.problema__media img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; border-radius: var(--radius-card); }
.problemas__disclaimer { margin-top: 32px; }

@media (max-width: 767px) {
  .problema__a .btn { width: 100%; white-space: normal; text-align: center; }
}

@media (min-width: 1024px) {
  .problema {
    grid-template-columns: 1fr 2fr 1.1fr;
    column-gap: 48px;
    position: sticky;
    top: calc(var(--header-h) + 16px);
  }
  .problema__media img { aspect-ratio: 4 / 4.2; }
}
```

Añade al final de `src/styles/main.css`:

```css
@import './sections/rubros.css';
@import './sections/problemas.css';
```

- [ ] **Step 5: Ejecutar las pruebas y verificar que pasan**

Run: `npx playwright test tests/e2e/rubros-problemas.spec.js && npm run build && npm run check:content`
Expected: PASS y `0 infracciones`.

- [ ] **Step 6: Commit**

```bash
git add index.html src tests/e2e/rubros-problemas.spec.js
git commit -m "Add industries grid and stacked problems section" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Planes con menú lateral fijo (spec §4.4)

> **Desviación consciente de la spec §6:** el menú lateral se fija con `position: sticky` y el plan activo se detecta con `IntersectionObserver`, en lugar de `ScrollTrigger.pin`. El efecto visual es el mismo, no depende de GSAP (así también funciona con "reducir movimiento") y evita los saltos de maquetación típicos de `pin`.

**Files:**
- Create: `src/styles/sections/planes.css`, `src/ui/plans-nav.js`
- Modify: `index.html` (marcador `<!-- @planes -->`), `src/styles/main.css`, `src/main.js`
- Test: `tests/unit/plans-nav.test.js`, `tests/e2e/planes.spec.js`

**Interfaces:**
- Consumes: `buildWhatsAppUrl` (Task 2), mensajes `planes`, `plan-pro`, `plan-basic` y `plan-lite`, componentes (Task 5).
- Produces:
  - `setActivePlan(doc: Document, plan: 'pro'|'basic'|'lite', cfg): void`. Marca `aria-current="true"` en el enlace `#plan-<plan>` del menú y actualiza el `[data-plan-cta]` a `data-cta="plan-<plan>"` con su `href`.
  - `initPlansNav(doc: Document, cfg): void`. Observa `article[data-plan]` y llama a `setActivePlan` según el scroll.
  - `#planes` con `data-theme="dark"` y la pestaña recortada.

- [ ] **Step 1: Escribir las pruebas que fallan**

`tests/unit/plans-nav.test.js`:

```js
import { it, expect, beforeEach } from 'vitest';
import { setActivePlan } from '../../src/ui/plans-nav.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

const cfg = { whatsapp: '51949268607', mensajes: { default: 'x', 'plan-basic': 'Hola Pixely, me interesa el Plan Basic.' } };

beforeEach(() => {
  document.body.innerHTML = `
    <nav class="planes__nav"><a href="#plan-pro" aria-current="true">Pro</a><a href="#plan-basic">Basic</a><a href="#plan-lite">Lite</a></nav>
    <a data-plan-cta data-cta="planes" href="#">CTA</a>`;
});

it('marca el plan activo y actualiza el CTA', () => {
  setActivePlan(document, 'basic', cfg);
  expect(document.querySelector('a[href="#plan-basic"]').getAttribute('aria-current')).toBe('true');
  expect(document.querySelector('a[href="#plan-pro"]').hasAttribute('aria-current')).toBe(false);
  const cta = document.querySelector('[data-plan-cta]');
  expect(cta.dataset.cta).toBe('plan-basic');
  expect(cta.getAttribute('href')).toBe(buildWhatsAppUrl(cfg.whatsapp, cfg.mensajes['plan-basic']));
});
```

`tests/e2e/planes.spec.js`:

```js
import { test, expect } from '@playwright/test';
import { config } from '../../src/config.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

const QTY = {
  pro: ['×4', '×4', '×16', '×20', '×4'],
  basic: ['×2', '×2', '×8', '×10', '×2'],
  lite: ['×1', '×1', '×4', '×5', '×1'],
};

test('planes: orden Top-Down, cantidades y CTA por plan', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#planes');
  await expect(sec.locator('.plan h3')).toHaveText(['Plan Pro', 'Plan Basic', 'Plan Lite']);
  for (const [plan, qty] of Object.entries(QTY)) {
    await expect(sec.locator(`#plan-${plan} .plan__qty`)).toHaveText(qty);
    await expect(sec.locator(`#plan-${plan} [data-cta="plan-${plan}"]`))
      .toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes[`plan-${plan}`]));
  }
  expect(await sec.innerText()).not.toMatch(/S\/\.?\s*\d/);
  const clip = await sec.evaluate((el) => getComputedStyle(el).clipPath);
  expect(clip.startsWith('polygon(')).toBe(true);
});

test('escritorio: el menú lateral sigue el plan visible', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await page.evaluate(() => {
    const el = document.getElementById('plan-basic');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3);
  });
  await expect(page.locator('.planes__nav a[href="#plan-basic"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-plan-cta]'))
    .toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes['plan-basic']));
});
```

Run: `npx vitest run tests/unit/plans-nav.test.js; npx playwright test tests/e2e/planes.spec.js`
Expected: FAIL en ambos (no existen el módulo ni `#planes`).

- [ ] **Step 2: Implementar `src/ui/plans-nav.js`**

```js
import { buildWhatsAppUrl } from '../core/cta.js';

export function setActivePlan(doc, plan, cfg) {
  doc.querySelectorAll('.planes__nav a[href^="#plan-"]').forEach((a) => {
    if (a.getAttribute('href') === `#plan-${plan}`) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });
  const cta = doc.querySelector('[data-plan-cta]');
  if (cta) {
    const key = `plan-${plan}`;
    cta.dataset.cta = key;
    cta.setAttribute('href', buildWhatsAppUrl(cfg.whatsapp, cfg.mensajes[key] ?? cfg.mensajes.default));
  }
}

export function initPlansNav(doc, cfg) {
  const plans = [...doc.querySelectorAll('article[data-plan]')];
  if (plans.length === 0 || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) setActivePlan(doc, entry.target.dataset.plan, cfg);
    }
  }, { rootMargin: '-40% 0px -55% 0px' });
  plans.forEach((p) => io.observe(p));
}
```

En `src/main.js`, añade `import { initPlansNav } from './ui/plans-nav.js';` y la llamada `initPlansNav(document, config);` antes de `document.documentElement.dataset.boot = 'ok';`.

- [ ] **Step 3: Escribir el HTML**

En `index.html`, reemplaza `<!-- @planes -->` por:

```html
    <section class="planes section section--ink has-notch" id="planes" data-theme="dark" aria-labelledby="planes-title">
      <div class="container">
        <p class="caption" data-reveal>Planes</p>
        <h2 class="title-l planes__title" id="planes-title" data-split>Tres planes. La misma exigencia de calidad.</h2>
        <p class="lead muted planes__intro" data-reveal>Cada campaña convierte uno de tus productos en 12 piezas publicitarias. Elige cuántas campañas necesitas al mes.</p>
        <div class="planes__layout">
          <aside class="planes__aside">
            <nav class="planes__nav" aria-label="Planes">
              <ul>
                <li><a href="#plan-pro" aria-current="true">Pro</a></li>
                <li><a href="#plan-basic">Basic</a></li>
                <li><a href="#plan-lite">Lite</a></li>
              </ul>
            </nav>
            <a class="btn btn--primary planes__cta" data-plan-cta data-cta="planes" href="https://wa.me/51949268607"><span class="btn__label">Pregúntanos por tu plan</span><span class="btn__arrow" aria-hidden="true">→</span></a>
          </aside>
          <div class="planes__groups">
            <article class="plan" id="plan-pro" data-plan="pro" aria-labelledby="plan-pro-title">
              <header class="plan__head">
                <h3 class="title-m" id="plan-pro-title">Plan Pro</h3>
                <p class="muted">Delegación total: tú solo atiendes los mensajes de compra que llegan.</p>
                <p class="caption">4 campañas · 48 piezas al mes · Publicación automatizada</p>
              </header>
              <ol class="cells plan__items">
                <li class="cell plan__item"><span class="plan__num">01</span><strong class="plan__qty">×4</strong><h4>Pauta pagada</h4><p class="muted">Formato 1:1 para tus anuncios.</p></li>
                <li class="cell plan__item"><span class="plan__num">02</span><strong class="plan__qty">×4</strong><h4>Feed</h4><p class="muted">Formato 4:5 para tu perfil.</p></li>
                <li class="cell plan__item"><span class="plan__num">03</span><strong class="plan__qty">×16</strong><h4>Estados</h4><p class="muted">Formato vertical 9:16.</p></li>
                <li class="cell plan__item"><span class="plan__num">04</span><strong class="plan__qty">×20</strong><h4>Variaciones del producto</h4><p class="muted">Tu producto en distintos contextos.</p></li>
                <li class="cell plan__item"><span class="plan__num">05</span><strong class="plan__qty">×4</strong><h4>Reels animados</h4><p class="muted">Video corto para tus redes.</p></li>
              </ol>
              <a class="btn btn--ghost plan__cta" data-cta="plan-pro" href="https://wa.me/51949268607"><span class="btn__label">Me interesa el Plan Pro</span><span class="btn__arrow" aria-hidden="true">→</span></a>
            </article>
            <article class="plan" id="plan-basic" data-plan="basic" aria-labelledby="plan-basic-title">
              <header class="plan__head">
                <h3 class="title-m" id="plan-basic-title">Plan Basic</h3>
                <p class="muted">Presencia digital constante y profesional, sin repetirte.</p>
                <p class="caption">2 campañas · 24 piezas al mes · Entrega en Google Drive con calendario</p>
              </header>
              <ol class="cells plan__items">
                <li class="cell plan__item"><span class="plan__num">01</span><strong class="plan__qty">×2</strong><h4>Pauta pagada</h4><p class="muted">Formato 1:1 para tus anuncios.</p></li>
                <li class="cell plan__item"><span class="plan__num">02</span><strong class="plan__qty">×2</strong><h4>Feed</h4><p class="muted">Formato 4:5 para tu perfil.</p></li>
                <li class="cell plan__item"><span class="plan__num">03</span><strong class="plan__qty">×8</strong><h4>Estados</h4><p class="muted">Formato vertical 9:16.</p></li>
                <li class="cell plan__item"><span class="plan__num">04</span><strong class="plan__qty">×10</strong><h4>Variaciones del producto</h4><p class="muted">Tu producto en distintos contextos.</p></li>
                <li class="cell plan__item"><span class="plan__num">05</span><strong class="plan__qty">×2</strong><h4>Reels animados</h4><p class="muted">Video corto para tus redes.</p></li>
              </ol>
              <a class="btn btn--ghost plan__cta" data-cta="plan-basic" href="https://wa.me/51949268607"><span class="btn__label">Me interesa el Plan Basic</span><span class="btn__arrow" aria-hidden="true">→</span></a>
            </article>
            <article class="plan" id="plan-lite" data-plan="lite" aria-labelledby="plan-lite-title">
              <header class="plan__head">
                <h3 class="title-m" id="plan-lite-title">Plan Lite</h3>
                <p class="muted">Valida la calidad de nuestro trabajo con un riesgo mínimo antes de escalar.</p>
                <p class="caption">1 campaña · 12 piezas al mes · Entrega en Google Drive</p>
              </header>
              <ol class="cells plan__items">
                <li class="cell plan__item"><span class="plan__num">01</span><strong class="plan__qty">×1</strong><h4>Pauta pagada</h4><p class="muted">Formato 1:1 para tus anuncios.</p></li>
                <li class="cell plan__item"><span class="plan__num">02</span><strong class="plan__qty">×1</strong><h4>Feed</h4><p class="muted">Formato 4:5 para tu perfil.</p></li>
                <li class="cell plan__item"><span class="plan__num">03</span><strong class="plan__qty">×4</strong><h4>Estados</h4><p class="muted">Formato vertical 9:16.</p></li>
                <li class="cell plan__item"><span class="plan__num">04</span><strong class="plan__qty">×5</strong><h4>Variaciones del producto</h4><p class="muted">Tu producto en distintos contextos.</p></li>
                <li class="cell plan__item"><span class="plan__num">05</span><strong class="plan__qty">×1</strong><h4>Reels animados</h4><p class="muted">Video corto para tus redes.</p></li>
              </ol>
              <a class="btn btn--ghost plan__cta" data-cta="plan-lite" href="https://wa.me/51949268607"><span class="btn__label">Me interesa el Plan Lite</span><span class="btn__arrow" aria-hidden="true">→</span></a>
            </article>
          </div>
        </div>
        <p class="planes__note muted" data-reveal>
          <span data-flag-off="mostrarPartners">Acceso a Pixely Partners: próximamente en todos los planes.</span>
          <span data-flag="mostrarPartners" hidden>Todos los planes incluyen acceso a Pixely Partners.</span>
          Te recomendamos el plan según tu negocio: escríbenos.
        </p>
      </div>
    </section>
```

- [ ] **Step 4: Escribir el CSS**

`src/styles/sections/planes.css`:

```css
.planes__title { max-width: 20ch; margin-top: 16px; }
.planes__intro { max-width: 52ch; margin: 20px 0 48px; }
.planes__layout { display: grid; gap: 32px; }
.planes__aside {
  position: sticky; top: var(--header-h); z-index: 2;
  margin-inline: calc(var(--gutter) * -1); padding: 12px var(--gutter);
  background: var(--ink);
}
.planes__nav ul { display: flex; gap: 8px; }
.planes__nav a {
  display: inline-flex; padding: 8px 16px; border-radius: 999px;
  font-family: var(--font-display); font-weight: 500;
  color: var(--text-on-ink-2); background: var(--carbon);
  transition: color 0.3s, background-color 0.3s;
}
.planes__nav a[aria-current="true"] { color: #fff; background: var(--carbon-2); }
.planes__cta { display: none; }
.plan { display: grid; gap: 24px; padding-bottom: 72px; scroll-margin-top: calc(var(--header-h) + 72px); }
.plan__head { display: grid; gap: 8px; }
.plan__items { grid-template-columns: 1fr; }
.plan__item { display: grid; grid-template-columns: auto 1fr; grid-template-areas: 'num qty' 'title title' 'desc desc'; gap: 6px 12px; min-height: 160px; align-content: space-between; }
.plan__num { grid-area: num; color: var(--text-on-ink-2); font-size: 0.85rem; }
.plan__qty { grid-area: qty; justify-self: end; font-family: var(--font-display); font-size: 2rem; font-weight: 500; color: var(--magenta); line-height: 1; }
.plan__item h4 { grid-area: title; font-family: var(--font-display); font-size: 1.25rem; font-weight: 500; }
.plan__item p { grid-area: desc; font-size: 0.95rem; }
.plan__cta { justify-self: start; }
.planes__note { margin-top: 24px; max-width: 60ch; }

@media (min-width: 768px) {
  .plan__items { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .planes__layout { grid-template-columns: 280px 1fr; gap: 48px; }
  .planes__aside {
    top: calc(var(--header-h) + 40px); align-self: start;
    margin: 0; padding: 0; background: none;
    display: grid; gap: 40px;
  }
  .planes__nav ul { display: grid; gap: 4px; }
  .planes__nav a { padding: 0; background: none; border-radius: 0; font-size: 1.6rem; }
  .planes__nav a[aria-current="true"] { background: none; }
  .planes__cta { display: inline-flex; justify-self: start; }
  .plan { padding-bottom: 140px; scroll-margin-top: calc(var(--header-h) + 40px); }
  .plan__item { min-height: 240px; padding: 32px; }
  .plan__qty { font-size: 2.6rem; }
}
```

Añade al final de `src/styles/main.css`:

```css
@import './sections/planes.css';
```

- [ ] **Step 5: Ejecutar las pruebas y verificar que pasan**

Run: `npx vitest run tests/unit/plans-nav.test.js && npx playwright test tests/e2e/planes.spec.js && npm run build && npm run check:content`
Expected: PASS y `0 infracciones`.

- [ ] **Step 6: Commit**

```bash
git add index.html src tests
git commit -m "Add plans section with sticky plan navigator" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Cómo funciona y Ecosistema con pestañas (spec §4.5 y §4.6)

**Files:**
- Create: `src/styles/sections/como.css`, `src/styles/sections/eco.css`, `src/ui/tabs.js`
- Modify: `index.html` (marcadores `<!-- @como-funciona -->` y `<!-- @ecosistema -->`), `src/styles/main.css`, `src/main.js`
- Test: `tests/unit/tabs.test.js`, `tests/e2e/como-eco.spec.js`

**Interfaces:**
- Consumes: componentes (Task 5), imágenes `paso-*` y `eco-*` (Task 6).
- Produces:
  - `initTabs(doc: Document): void` para todo `[data-tabs]`. Clic y teclado (←, →, Inicio, Fin); el panel no seleccionado queda `hidden`.
  - Sin JavaScript, los cuatro paneles se ven uno debajo de otro y la barra de pestañas se oculta.
  - `#como-funciona` (`data-theme="light"`) y `#ecosistema` (`data-theme="dark"`, sin pestaña recortada porque le sigue otra sección negra).

- [ ] **Step 1: Escribir las pruebas que fallan**

`tests/unit/tabs.test.js`:

```js
import { it, expect, beforeEach } from 'vitest';
import { initTabs } from '../../src/ui/tabs.js';

beforeEach(() => {
  document.body.innerHTML = `
    <div data-tabs>
      <div role="tablist">
        <button role="tab" id="t1" aria-controls="p1" aria-selected="true">Uno</button>
        <button role="tab" id="t2" aria-controls="p2" aria-selected="false">Dos</button>
        <button role="tab" id="t3" aria-controls="p3" aria-selected="false">Tres</button>
      </div>
      <div role="tabpanel" id="p1"></div><div role="tabpanel" id="p2"></div><div role="tabpanel" id="p3"></div>
    </div>`;
  initTabs(document);
});

const $ = (id) => document.getElementById(id);

it('al iniciar muestra solo el panel seleccionado', () => {
  expect([$('p1').hidden, $('p2').hidden, $('p3').hidden]).toEqual([false, true, true]);
  expect([$('t1').tabIndex, $('t2').tabIndex]).toEqual([0, -1]);
});

it('cambia de panel con clic', () => {
  $('t2').click();
  expect($('t2').getAttribute('aria-selected')).toBe('true');
  expect([$('p1').hidden, $('p2').hidden]).toEqual([true, false]);
});

it('navega con flechas, Inicio y Fin', () => {
  $('t1').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  expect($('t3').getAttribute('aria-selected')).toBe('true');
  $('t3').dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
  expect($('t1').getAttribute('aria-selected')).toBe('true');
  $('t1').dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  expect($('p3').hidden).toBe(false);
});
```

`tests/e2e/como-eco.spec.js`:

```js
import { test, expect } from '@playwright/test';

test('cómo funciona: 4 pasos con imagen y tiempo de entrega', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#como-funciona');
  await expect(sec.locator('.paso h3')).toHaveText([
    '01 · Entrevista de marca', '02 · Lab de audiencia', '03 · Estrategia y calendario', '04 · Producción y entrega',
  ]);
  const imgs = sec.locator('img');
  await expect(imgs).toHaveCount(4);
  for (let i = 0; i < 4; i += 1) {
    await imgs.nth(i).scrollIntoViewIfNeeded();
    await expect.poll(() => imgs.nth(i).evaluate((im) => im.naturalWidth > 0)).toBe(true);
  }
  await expect(sec.getByText('7 y 14 días hábiles', { exact: false })).toBeVisible();
});

test('ecosistema: las pestañas cambian el panel', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#ecosistema');
  await expect(sec.getByRole('tab')).toHaveText(['Investigar', 'Planificar', 'Producir', 'Publicar y medir']);
  await expect(sec.locator('#panel-investigar')).toBeVisible();
  await expect(sec.locator('#panel-producir')).toBeHidden();
  await sec.getByRole('tab', { name: 'Producir' }).click();
  await expect(sec.locator('#panel-producir')).toBeVisible();
  await sec.getByRole('tab', { name: 'Producir' }).press('ArrowRight');
  await expect(sec.locator('#panel-publicar')).toBeVisible();
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('los cuatro paneles se ven', async ({ page }) => {
    await page.goto('/');
    for (const id of ['investigar', 'planificar', 'producir', 'publicar']) {
      await expect(page.locator(`#panel-${id}`)).toBeVisible();
    }
  });
});
```

Run: `npx vitest run tests/unit/tabs.test.js; npx playwright test tests/e2e/como-eco.spec.js`
Expected: FAIL en ambos.

- [ ] **Step 2: Implementar `src/ui/tabs.js`**

```js
export function initTabs(doc) {
  doc.querySelectorAll('[data-tabs]').forEach((root) => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) => root.querySelector(`#${t.getAttribute('aria-controls')}`));

    function select(index, focus) {
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) tabs[index].focus();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i, false));
      tab.addEventListener('keydown', (e) => {
        const last = tabs.length - 1;
        const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
        if (next !== undefined) {
          e.preventDefault();
          select(next, true);
        }
      });
    });

    const start = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    select(start === -1 ? 0 : start, false);
  });
}
```

En `src/main.js`, añade `import { initTabs } from './ui/tabs.js';` y la llamada `initTabs(document);` antes de `document.documentElement.dataset.boot = 'ok';`.

- [ ] **Step 3: Escribir el HTML de Cómo funciona**

En `index.html`, reemplaza `<!-- @como-funciona -->` por:

```html
    <section class="como section section--paper" id="como-funciona" data-theme="light" aria-labelledby="como-title">
      <div class="container">
        <p class="caption" data-reveal>Cómo funciona</p>
        <h2 class="title-l como__title" id="como-title" data-split>Así convertimos lo que tu audiencia quiere ver en publicidad que vende.</h2>
        <ol class="pasos">
          <li class="paso" data-reveal>
            <picture class="paso__media">
              <source type="image/avif" srcset="/media/paso-entrevista-800.avif 800w, /media/paso-entrevista-1600.avif 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <source type="image/webp" srcset="/media/paso-entrevista-800.webp 800w, /media/paso-entrevista-1600.webp 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <img src="/media/paso-entrevista-800.jpg" srcset="/media/paso-entrevista-800.jpg 800w, /media/paso-entrevista-1600.jpg 1600w" sizes="(min-width: 1024px) 48vw, 100vw" width="800" height="533" loading="lazy" decoding="async" alt="Dos personas conversando en un estudio mientras una toma notas">
            </picture>
            <div class="paso__body">
              <p class="tag muted">#Entrevista #ManualDeMarca</p>
              <h3 class="title-m">01 · Entrevista de marca</h3>
              <dl class="paso__meta">
                <div><dt class="caption">Qué hacemos</dt><dd>Una conversación guiada para entender tu negocio, tu producto y a tu cliente.</dd></div>
                <div><dt class="caption">Qué recibes</dt><dd>Tu Manual de Marca.</dd></div>
              </dl>
            </div>
          </li>
          <li class="paso" data-reveal>
            <picture class="paso__media">
              <source type="image/avif" srcset="/media/paso-lab-800.avif 800w, /media/paso-lab-1600.avif 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <source type="image/webp" srcset="/media/paso-lab-800.webp 800w, /media/paso-lab-1600.webp 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <img src="/media/paso-lab-800.jpg" srcset="/media/paso-lab-800.jpg 800w, /media/paso-lab-1600.jpg 1600w" sizes="(min-width: 1024px) 48vw, 100vw" width="800" height="533" loading="lazy" decoding="async" alt="Manos sosteniendo un celular con la pantalla iluminada en magenta">
            </picture>
            <div class="paso__body">
              <p class="tag muted">#Lab #Audiencia</p>
              <h3 class="title-m">02 · Lab de audiencia</h3>
              <dl class="paso__meta">
                <div><dt class="caption">Qué hacemos</dt><dd>Analizamos comentarios reales de Instagram para entender qué quiere ver tu audiencia.</dd></div>
                <div><dt class="caption">Qué recibes</dt><dd>10 métricas visuales sobre tu audiencia.</dd></div>
              </dl>
            </div>
          </li>
          <li class="paso" data-reveal>
            <picture class="paso__media">
              <source type="image/avif" srcset="/media/paso-estrategia-800.avif 800w, /media/paso-estrategia-1600.avif 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <source type="image/webp" srcset="/media/paso-estrategia-800.webp 800w, /media/paso-estrategia-1600.webp 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <img src="/media/paso-estrategia-800.jpg" srcset="/media/paso-estrategia-800.jpg 800w, /media/paso-estrategia-1600.jpg 1600w" sizes="(min-width: 1024px) 48vw, 100vw" width="800" height="533" loading="lazy" decoding="async" alt="Muro de planificación con fotografías de producto unidas por hilo magenta">
            </picture>
            <div class="paso__body">
              <p class="tag muted">#Estrategia #Calendario</p>
              <h3 class="title-m">03 · Estrategia y calendario</h3>
              <dl class="paso__meta">
                <div><dt class="caption">Qué hacemos</dt><dd>Convertimos lo que encontró el Lab en un plan de contenido.</dd></div>
                <div><dt class="caption">Qué recibes</dt><dd>Tu estrategia y tu calendario de publicación del mes.</dd></div>
              </dl>
            </div>
          </li>
          <li class="paso" data-reveal>
            <picture class="paso__media">
              <source type="image/avif" srcset="/media/paso-produccion-800.avif 800w, /media/paso-produccion-1600.avif 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <source type="image/webp" srcset="/media/paso-produccion-800.webp 800w, /media/paso-produccion-1600.webp 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <img src="/media/paso-produccion-800.jpg" srcset="/media/paso-produccion-800.jpg 800w, /media/paso-produccion-1600.jpg 1600w" sizes="(min-width: 1024px) 48vw, 100vw" width="800" height="533" loading="lazy" decoding="async" alt="Frasco de perfume en un set de fotografía con luz dramática">
            </picture>
            <div class="paso__body">
              <p class="tag muted">#Producción #Entrega</p>
              <h3 class="title-m">04 · Producción y entrega</h3>
              <dl class="paso__meta">
                <div><dt class="caption">Qué hacemos</dt><dd>Producimos cada pieza con IA y la revisamos antes de entregarla.</dd></div>
                <div><dt class="caption">Qué recibes</dt><dd>Tus piezas en Google Drive, o publicadas automáticamente con el Plan Pro.</dd></div>
              </dl>
            </div>
          </li>
        </ol>
        <p class="lead como__timeline" data-reveal><strong>Tiempo:</strong> tu primera campaña llega entre 7 y 14 días hábiles después de la entrevista de marca.</p>
        <p class="source-note">Los resultados pueden variar según el negocio, el sector y la constancia en la publicación.</p>
      </div>
    </section>
```

- [ ] **Step 4: Escribir el HTML del Ecosistema**

Reemplaza `<!-- @ecosistema -->` por:

```html
    <section class="eco section section--ink" id="ecosistema" data-theme="dark" aria-labelledby="eco-title">
      <div class="container">
        <p class="caption" data-reveal>Ecosistema Pixely</p>
        <h2 class="title-l eco__title" id="eco-title" data-split>De los datos de tu audiencia real, a contenido listo para publicar.</h2>
        <div class="tabs" data-tabs>
          <div class="tabs__list" role="tablist" aria-label="Etapas del ecosistema Pixely">
            <button class="tabs__tab" type="button" role="tab" id="tab-investigar" aria-controls="panel-investigar" aria-selected="true">Investigar</button>
            <button class="tabs__tab" type="button" role="tab" id="tab-planificar" aria-controls="panel-planificar" aria-selected="false">Planificar</button>
            <button class="tabs__tab" type="button" role="tab" id="tab-producir" aria-controls="panel-producir" aria-selected="false">Producir</button>
            <button class="tabs__tab" type="button" role="tab" id="tab-publicar" aria-controls="panel-publicar" aria-selected="false">Publicar y medir</button>
          </div>
          <div class="tabs__panel" role="tabpanel" id="panel-investigar" aria-labelledby="tab-investigar">
            <picture class="eco__media">
              <source type="image/avif" srcset="/media/eco-investigar-800.avif 800w, /media/eco-investigar-1600.avif 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <source type="image/webp" srcset="/media/eco-investigar-800.webp 800w, /media/eco-investigar-1600.webp 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <img src="/media/eco-investigar-800.jpg" srcset="/media/eco-investigar-800.jpg 800w, /media/eco-investigar-1600.jpg 1600w" sizes="(min-width: 1024px) 48vw, 100vw" width="800" height="533" loading="lazy" decoding="async" alt="Vista aérea de una calle comercial de Lima al atardecer">
            </picture>
            <div class="eco__body">
              <h3 class="title-m">Investigar</h3>
              <div class="eco__cols">
                <div><p class="caption">Qué hacemos</p><ul class="eco__list"><li>Estudiamos tu mercado y a tu competencia directa.</li><li>Vigilamos de forma continua qué publica tu competencia y qué le funciona.</li></ul></div>
                <div><p class="caption">Qué recibes</p><ul class="eco__list"><li>Un mapa claro de tu mercado y tus oportunidades.</li><li>Ideas de contenido con respaldo en datos.</li></ul></div>
              </div>
            </div>
          </div>
          <div class="tabs__panel" role="tabpanel" id="panel-planificar" aria-labelledby="tab-planificar">
            <picture class="eco__media">
              <source type="image/avif" srcset="/media/eco-planificar-800.avif 800w, /media/eco-planificar-1600.avif 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <source type="image/webp" srcset="/media/eco-planificar-800.webp 800w, /media/eco-planificar-1600.webp 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <img src="/media/eco-planificar-800.jpg" srcset="/media/eco-planificar-800.jpg 800w, /media/eco-planificar-1600.jpg 1600w" sizes="(min-width: 1024px) 48vw, 100vw" width="800" height="533" loading="lazy" decoding="async" alt="Escritorio oscuro con una libreta cerrada y una línea de luz magenta">
            </picture>
            <div class="eco__body">
              <h3 class="title-m">Planificar</h3>
              <div class="eco__cols">
                <div><p class="caption">Qué hacemos</p><ul class="eco__list"><li>Diseñamos tu calendario mensual según el plan que contrataste.</li><li>Elegimos el formato de cada pieza según su ángulo.</li></ul></div>
                <div><p class="caption">Qué recibes</p><ul class="eco__list"><li>El calendario del mes, pieza por pieza.</li><li>Ángulos de contenido conectados con tu estrategia.</li></ul></div>
              </div>
            </div>
          </div>
          <div class="tabs__panel" role="tabpanel" id="panel-producir" aria-labelledby="tab-producir">
            <picture class="eco__media">
              <source type="image/avif" srcset="/media/eco-producir-800.avif 800w, /media/eco-producir-1600.avif 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <source type="image/webp" srcset="/media/eco-producir-800.webp 800w, /media/eco-producir-1600.webp 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <img src="/media/eco-producir-800.jpg" srcset="/media/eco-producir-800.jpg 800w, /media/eco-producir-1600.jpg 1600w" sizes="(min-width: 1024px) 48vw, 100vw" width="800" height="533" loading="lazy" decoding="async" alt="Estudio de fotografía de producto con luces alrededor de una zapatilla">
            </picture>
            <div class="eco__body">
              <h3 class="title-m">Producir</h3>
              <div class="eco__cols">
                <div><p class="caption">Qué hacemos</p><ul class="eco__list"><li>Escribimos el copy y definimos la dirección de arte.</li><li>Producimos las imágenes con IA respetando tu identidad.</li></ul></div>
                <div><p class="caption">Qué recibes</p><ul class="eco__list"><li>Piezas listas para publicar, revisadas una a una.</li><li>Guiones para tus Reels.</li></ul></div>
              </div>
            </div>
          </div>
          <div class="tabs__panel" role="tabpanel" id="panel-publicar" aria-labelledby="tab-publicar">
            <picture class="eco__media">
              <source type="image/avif" srcset="/media/eco-publicar-800.avif 800w, /media/eco-publicar-1600.avif 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <source type="image/webp" srcset="/media/eco-publicar-800.webp 800w, /media/eco-publicar-1600.webp 1600w" sizes="(min-width: 1024px) 48vw, 100vw">
              <img src="/media/eco-publicar-800.jpg" srcset="/media/eco-publicar-800.jpg 800w, /media/eco-publicar-1600.jpg 1600w" sizes="(min-width: 1024px) 48vw, 100vw" width="800" height="533" loading="lazy" decoding="async" alt="Celular en un soporte sobre el mostrador de una tienda, con la pantalla encendida">
            </picture>
            <div class="eco__body">
              <h3 class="title-m">Publicar y medir</h3>
              <div class="eco__cols">
                <div><p class="caption">Qué hacemos</p><ul class="eco__list"><li>Programamos y publicamos tus piezas con el Plan Pro.</li><li>Medimos el desempeño de tu contenido.</li></ul></div>
                <div><p class="caption">Qué recibes</p><ul class="eco__list"><li>Presencia constante sin estar pegado al celular.</li><li>Un reporte mensual en PDF con lo que funcionó.</li></ul></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 5: Escribir el CSS**

`src/styles/sections/como.css`:

```css
.como__title { max-width: 24ch; margin: 16px 0 56px; }
.pasos { display: grid; gap: 64px; }
.paso { display: grid; gap: 24px; }
.paso__media img { width: 100%; aspect-ratio: 3 / 2; object-fit: cover; border-radius: var(--radius-card); }
.paso__body { display: grid; gap: 16px; align-content: start; }
.paso__meta { display: grid; }
.paso__meta div { display: grid; gap: 4px; padding-block: 16px; border-top: 1px solid var(--line-paper); }
.paso__meta dd { margin: 0; }
.como__timeline { margin-top: 56px; max-width: 48ch; }
.como__timeline + .source-note { margin-top: 12px; }

@media (min-width: 1024px) {
  .paso { grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
  .paso__meta div { grid-template-columns: 160px 1fr; }
}
```

`src/styles/sections/eco.css`:

```css
.eco__title { max-width: 22ch; margin: 16px 0 48px; }
.tabs__list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
.no-js .tabs__list { display: none; }
.tabs__tab {
  padding: 12px 18px; border-radius: 4px;
  font-family: var(--font-display); font-size: var(--fs-caption); font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-on-ink-2); border: 1px solid var(--line-ink);
  transition: color 0.3s, background-color 0.3s;
}
.tabs__tab[aria-selected="true"] { background: var(--paper); color: var(--ink); border-color: var(--paper); }
.tabs__panel { display: grid; gap: 32px; }
.no-js .tabs__panel + .tabs__panel { margin-top: 64px; }
.tabs__panel:not([hidden]) { animation: eco-fade 0.4s var(--ease-out); }
@keyframes eco-fade { from { opacity: 0; } to { opacity: 1; } }
.eco__media img { width: 100%; aspect-ratio: 3 / 2; object-fit: cover; border-radius: var(--radius-card); }
.eco__body { display: grid; gap: 24px; align-content: start; }
.eco__cols { display: grid; gap: 24px; padding-top: 24px; border-top: 1px solid var(--line-ink); }
.eco__cols .caption { margin-bottom: 12px; }
.eco__list { display: grid; gap: 12px; }
.eco__list li { position: relative; padding-left: 20px; }
.eco__list li::before { content: ''; position: absolute; left: 0; top: 0.6em; width: 8px; height: 8px; border-radius: 50%; background: var(--magenta); }

@media (min-width: 1024px) {
  .tabs__panel { grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
  .eco__cols { grid-template-columns: 1fr 1fr; }
}
```

Añade al final de `src/styles/main.css`:

```css
@import './sections/como.css';
@import './sections/eco.css';
```

- [ ] **Step 6: Ejecutar las pruebas y verificar que pasan**

Run: `npx vitest run tests/unit/tabs.test.js && npx playwright test tests/e2e/como-eco.spec.js && npm run build && npm run check:content`
Expected: PASS y `0 infracciones`.

- [ ] **Step 7: Commit**

```bash
git add index.html src tests
git commit -m "Add how-it-works steps and ecosystem tabs" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Pixely Partners, Historia y valores, y secciones ocultas (spec §4.7–§4.10)

**Files:**
- Create: `src/styles/sections/partners.css`, `src/styles/sections/historia.css`
- Modify: `index.html` (marcadores `<!-- @partners -->`, `<!-- @historia -->`, `<!-- @casos -->` y `<!-- @testimonios -->`), `src/styles/main.css`
- Test: `tests/e2e/partners-historia.spec.js`

**Interfaces:**
- Consumes: `applyFlags` (Task 2) con `mostrarPartners`, `mostrarCasos` y `mostrarTestimonios`; mensaje `partners`; imagen `historia`.
- Produces: `#partners` (`data-theme="dark"`, con pestaña recortada), `#historia` (`light`), y `#casos` y `#testimonios` (`light`, ocultas con `hidden` y `data-flag`).

- [ ] **Step 1: Escribir la prueba que falla**

`tests/e2e/partners-historia.spec.js`:

```js
import { test, expect } from '@playwright/test';
import { config } from '../../src/config.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

test('partners: próximamente, 4 funciones y CTA de aviso', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#partners');
  await expect(sec.locator('.badge')).toHaveText(/Próximamente/);
  await expect(sec.locator('.partners__features h3')).toHaveText([
    'Diagnóstico de marca', 'Lab de audiencia', 'Estrategia de contenido', 'Calendario de publicación',
  ]);
  await expect(sec.locator('[data-cta="partners"]')).toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes.partners));
  await expect(sec.locator('a[href="https://partners.pixely.pe"]')).toBeHidden();
  await expect(sec.locator('.partners__devices')).toHaveAttribute('aria-hidden', 'true');
  const clip = await sec.evaluate((el) => getComputedStyle(el).clipPath);
  expect(clip.startsWith('polygon(')).toBe(true);
});

test('historia: relato, imagen y 5 valores', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#historia');
  await expect(sec.locator('h2')).toHaveText('Nacimos de una frustración.');
  await expect(sec.locator('.valor h3')).toHaveText([
    'Resultados medibles', 'Accesibilidad real', 'Coherencia de marca', 'Velocidad de ejecución', 'Transparencia operativa',
  ]);
  const img = sec.locator('img');
  await img.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate((i) => i.naturalWidth > 0)).toBe(true);
});

test('casos y testimonios siguen ocultos', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#casos')).toBeHidden();
  await expect(page.locator('#testimonios')).toBeHidden();
});
```

Run: `npx playwright test tests/e2e/partners-historia.spec.js`
Expected: FAIL (no existe `#partners`).

- [ ] **Step 2: Escribir el HTML de Partners**

En `index.html`, reemplaza `<!-- @partners -->` por:

```html
    <section class="partners section section--ink has-notch" id="partners" data-theme="dark" aria-labelledby="partners-title">
      <div class="container partners__grid">
        <div class="partners__copy">
          <span class="badge">
            <span class="badge__dot" aria-hidden="true"></span>
            <span data-flag-off="mostrarPartners">Próximamente</span>
            <span data-flag="mostrarPartners" hidden>Ya disponible</span>
          </span>
          <h2 class="title-l" id="partners-title" data-split>Pixely Partners: tu marca, tus datos y tu estrategia en un solo lugar.</h2>
          <ul class="cells partners__features" data-reveal>
            <li class="cell"><h3>Diagnóstico de marca</h3><p class="muted">Dónde está tu marca hoy y qué mejorar primero.</p></li>
            <li class="cell"><h3>Lab de audiencia</h3><p class="muted">10 métricas visuales a partir de comentarios reales.</p></li>
            <li class="cell"><h3>Estrategia de contenido</h3><p class="muted">El porqué de cada pieza que publicamos.</p></li>
            <li class="cell"><h3>Calendario de publicación</h3><p class="muted">Qué sale, cuándo y dónde, siempre a la vista.</p></li>
          </ul>
          <a class="btn btn--primary" data-cta="partners" data-flag-off="mostrarPartners" href="https://wa.me/51949268607"><span class="btn__label">Quiero saber cuándo sale</span><span class="btn__arrow" aria-hidden="true">→</span></a>
          <a class="btn btn--primary" data-flag="mostrarPartners" hidden href="https://partners.pixely.pe"><span class="btn__label">Entrar a Pixely Partners</span><span class="btn__arrow" aria-hidden="true">→</span></a>
        </div>
        <div class="partners__devices" aria-hidden="true">
          <!-- Cuando Partners esté listo: reemplaza cada .ui-skeleton por <img src="/media/partners-<laptop|phone>.jpg" alt=""> con capturas de una cuenta demo sin datos de clientes. -->
          <div class="device device--laptop">
            <div class="device__screen">
              <div class="ui-skeleton">
                <span class="ui-skeleton__side"></span>
                <span class="ui-skeleton__bar ui-skeleton__bar--wide"></span>
                <span class="ui-skeleton__bar"></span>
                <span class="ui-skeleton__chart"></span>
                <span class="ui-skeleton__bar ui-skeleton__bar--short"></span>
              </div>
            </div>
            <div class="device__base"></div>
          </div>
          <div class="device device--phone">
            <div class="device__screen">
              <div class="ui-skeleton ui-skeleton--phone">
                <span class="ui-skeleton__bar ui-skeleton__bar--wide"></span>
                <span class="ui-skeleton__chart"></span>
                <span class="ui-skeleton__bar"></span>
                <span class="ui-skeleton__bar ui-skeleton__bar--short"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Escribir el HTML de Historia y de las secciones ocultas**

Reemplaza `<!-- @historia -->` por:

```html
    <section class="historia section section--paper" id="historia" data-theme="light" aria-labelledby="historia-title">
      <div class="container">
        <div class="historia__grid">
          <div class="historia__copy">
            <p class="caption" data-reveal>Por qué existe Pixely</p>
            <h2 class="title-l" id="historia-title" data-split>Nacimos de una frustración.</h2>
            <div class="historia__text" data-reveal>
              <p class="lead">Veíamos miles de negocios con productos de calidad que vendían menos de lo que merecían, solo porque sus fotos de celular con fondos improvisados no comunicaban su valor.</p>
              <p>Por eso construimos un sistema que pone la producción publicitaria profesional al alcance de cualquier negocio, con inteligencia artificial y datos reales de audiencia, sin depender de diseñadores costosos ni de agencias lentas.</p>
              <p>Nuestra misión: eliminar la brecha entre la calidad de tu producto y la calidad de su comunicación visual.</p>
            </div>
          </div>
          <picture class="historia__media">
            <source type="image/avif" srcset="/media/historia-800.avif 800w, /media/historia-1600.avif 1600w" sizes="(min-width: 1024px) 40vw, 100vw">
            <source type="image/webp" srcset="/media/historia-800.webp 800w, /media/historia-1600.webp 1600w" sizes="(min-width: 1024px) 40vw, 100vw">
            <img src="/media/historia-800.jpg" srcset="/media/historia-800.jpg 800w, /media/historia-1600.jpg 1600w" sizes="(min-width: 1024px) 40vw, 100vw" width="800" height="1000" loading="lazy" decoding="async" alt="Dueño de una tienda de ropa mirando con orgullo sus productos al cierre del día">
          </picture>
        </div>
        <p class="caption historia__values-title" data-scramble>Por qué Pixely</p>
        <ul class="cells valores" data-reveal>
          <li class="cell valor"><span class="valor__num">01</span><h3>Resultados medibles</h3><p class="muted">Todo lo que producimos tiene una dirección estratégica basada en datos, nunca en ocurrencias.</p></li>
          <li class="cell valor"><span class="valor__num">02</span><h3>Accesibilidad real</h3><p class="muted">Tecnología de nivel agencia premium, al alcance del emprendedor.</p></li>
          <li class="cell valor"><span class="valor__num">03</span><h3>Coherencia de marca</h3><p class="muted">Cada pieza refleja fielmente la identidad de tu negocio, sin improvisación.</p></li>
          <li class="cell valor"><span class="valor__num">04</span><h3>Velocidad de ejecución</h3><p class="muted">Un sistema pensado para producir rápido sin bajar la calidad.</p></li>
          <li class="cell valor"><span class="valor__num">05</span><h3>Transparencia operativa</h3><p class="muted">Siempre sabes qué estamos haciendo con tu marca y por qué.</p></li>
        </ul>
      </div>
    </section>
```

Reemplaza `<!-- @casos -->` por:

```html
    <section class="casos section section--paper" id="casos" data-theme="light" data-flag="mostrarCasos" hidden aria-labelledby="casos-title">
      <div class="container">
        <p class="caption">Casos</p>
        <h2 class="title-l" id="casos-title">Negocios que ya trabajan con Pixely</h2>
        <!-- Activar con config.flags.mostrarCasos cuando exista el primer par Antes/Después autorizado por escrito por el cliente. Cada caso: <article class="caso"> con dos <picture> (antes y después), rubro y ciudad. -->
      </div>
    </section>
```

Reemplaza `<!-- @testimonios -->` por:

```html
    <section class="testimonios section section--paper" id="testimonios" data-theme="light" data-flag="mostrarTestimonios" hidden aria-labelledby="testimonios-title">
      <div class="container">
        <p class="caption">Testimonios</p>
        <h2 class="title-l" id="testimonios-title">Lo que dicen nuestros clientes</h2>
        <!-- Activar con config.flags.mostrarTestimonios cuando exista el primer testimonio real con permiso. Cada testimonio: <blockquote class="testimonio"> con nombre, negocio y rubro. -->
      </div>
    </section>
```

- [ ] **Step 4: Escribir el CSS**

`src/styles/sections/partners.css`:

```css
.partners__grid { display: grid; gap: 56px; }
.partners__copy { display: grid; gap: 28px; justify-items: start; }
.partners__features { grid-template-columns: 1fr; width: 100%; }
.partners__features h3 { font-family: var(--font-display); font-size: 1.15rem; font-weight: 500; margin-bottom: 6px; }
.partners__devices { position: relative; min-height: 320px; }
.device--laptop { width: 88%; }
.device--laptop .device__screen { aspect-ratio: 16 / 10; border: 10px solid var(--carbon-2); border-radius: 14px 14px 0 0; background: var(--carbon); overflow: hidden; }
.device__base { height: 14px; margin-inline: -6%; border-radius: 0 0 14px 14px; background: var(--carbon-2); }
.device--phone { position: absolute; right: 0; bottom: -24px; width: 30%; }
.device--phone .device__screen { aspect-ratio: 9 / 19; border: 8px solid var(--carbon-2); border-radius: 28px; background: var(--carbon); overflow: hidden; }

.ui-skeleton { display: grid; grid-template-columns: 22% 1fr; grid-auto-rows: min-content; gap: 10px; height: 100%; padding: 14px; }
.ui-skeleton--phone { grid-template-columns: 1fr; }
.ui-skeleton__side { grid-row: span 4; border-radius: 6px; background: var(--carbon-2); }
.ui-skeleton__bar, .ui-skeleton__chart { display: block; border-radius: 6px; background: linear-gradient(90deg, var(--carbon-2) 0%, rgba(235, 12, 110, 0.35) 50%, var(--carbon-2) 100%); background-size: 200% 100%; animation: skeleton-shine 2.4s linear infinite; }
.ui-skeleton__bar { height: 14px; width: 70%; }
.ui-skeleton__bar--wide { width: 100%; }
.ui-skeleton__bar--short { width: 40%; }
.ui-skeleton__chart { height: 90px; }
@keyframes skeleton-shine { from { background-position: 200% 0; } to { background-position: -200% 0; } }

@media (min-width: 768px) {
  .partners__features { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .partners__grid { grid-template-columns: 1fr 1fr; align-items: center; gap: 64px; }
}
```

`src/styles/sections/historia.css`:

```css
.historia__grid { display: grid; gap: 40px; }
.historia__copy { display: grid; gap: 20px; align-content: start; }
.historia__text { display: grid; gap: 16px; max-width: 56ch; }
.historia__media img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; border-radius: var(--radius-card); }
.historia__values-title { margin: 80px 0 24px; }
.valores { grid-template-columns: 1fr; }
.valor { display: grid; gap: 10px; align-content: start; min-height: 200px; }
.valor__num { color: var(--magenta-cta); font-family: var(--font-display); font-weight: 600; } /* #EB0C6E sobre blanco da 4,37:1; #D90B66 da 5,0:1 */
.valor h3 { font-family: var(--font-display); font-size: 1.3rem; font-weight: 500; }

@media (min-width: 768px) {
  .valores { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .historia__grid { grid-template-columns: 1.2fr 1fr; gap: 64px; align-items: center; }
  .valores { grid-template-columns: repeat(5, 1fr); }
}
```

Añade al final de `src/styles/main.css`:

```css
@import './sections/partners.css';
@import './sections/historia.css';
```

- [ ] **Step 5: Ejecutar las pruebas y verificar que pasan**

Run: `npx playwright test tests/e2e/partners-historia.spec.js && npm run build && npm run check:content`
Expected: PASS y `0 infracciones`.

- [ ] **Step 6: Commit**

```bash
git add index.html src tests/e2e/partners-historia.spec.js
git commit -m "Add Partners preview, founding story, values and hidden case slots" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Garantías, Preguntas frecuentes, CTA gigante y pie (spec §4.11–§4.13)

**Files:**
- Create: `src/styles/sections/garantias.css`, `src/styles/sections/faq.css`, `src/styles/sections/footer.css`
- Modify: `index.html` (marcadores `<!-- @garantias -->`, `<!-- @faq -->` y `<!-- @footer -->`), `src/styles/main.css`
- Test: `tests/e2e/cierre.spec.js`

**Interfaces:**
- Consumes: mensajes `faq` y `footer`; componentes (Task 5).
- Produces:
  - `#garantias` (`dark`, con pestaña recortada) y `#preguntas` (`light`), acordeón nativo `<details name="faq">` en el que la primera pregunta tiene `id="faq-canva"`.
  - `<footer class="site-footer" data-theme="dark">` con `.footer-cta[data-cursor-zone]`, que es la zona del cursor personalizado (Task 15).
  - Enlaces a `/terminos.html` y `/privacidad.html` (las páginas se crean en la Task 13).

- [ ] **Step 1: Escribir la prueba que falla**

`tests/e2e/cierre.spec.js`:

```js
import { test, expect } from '@playwright/test';
import { config } from '../../src/config.js';
import { buildWhatsAppUrl } from '../../src/core/cta.js';

test('garantías: 3 garantías, 4 límites y disclaimer', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#garantias');
  await expect(sec.locator('.garantia--si')).toHaveCount(3);
  await expect(sec.locator('.garantia--no')).toHaveCount(4);
  await expect(sec.getByText('Los resultados pueden variar según el negocio', { exact: false })).toBeVisible();
  const clip = await sec.evaluate((el) => getComputedStyle(el).clipPath);
  expect(clip.startsWith('polygon(')).toBe(true);
});

test('preguntas: 9 preguntas, Canva solo en la primera y acordeón exclusivo', async ({ page }) => {
  await page.goto('/');
  const sec = page.locator('#preguntas');
  await expect(sec.locator('summary')).toHaveCount(9);
  await expect(sec.locator('summary').first()).toHaveText('¿Por qué Pixely si mi sobrino usa Canva?');
  await expect(sec.locator('details').first()).toHaveAttribute('id', 'faq-canva');
  await sec.locator('summary').nth(0).click();
  await expect(sec.locator('details').nth(0)).toHaveAttribute('open', '');
  await sec.locator('summary').nth(1).click();
  await expect(sec.locator('details').nth(0)).not.toHaveAttribute('open', '');
  await expect(sec.locator('[data-cta="faq"]')).toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes.faq));
});

test('pie: CTA gigante, contacto y datos legales', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('.site-footer');
  await expect(footer.locator('.footer-cta')).toHaveAttribute('href', buildWhatsAppUrl(config.whatsapp, config.mensajes.footer));
  await expect(footer.locator('.footer-cta__text')).toHaveText('Hablemos');
  await expect(footer.locator('a[href="mailto:hola@pixely.pe"]')).toBeVisible();
  await expect(footer.locator('a[href="https://www.instagram.com/pixely_pe/"]')).toBeVisible();
  await expect(footer.getByText('© 2026 Pixely · SYNTESIA LABS E.I.R.L. · RUC 20616010787')).toBeVisible();
  await expect(footer.locator('a[href="/terminos.html"]')).toBeVisible();
  await expect(footer.locator('a[href="/privacidad.html"]')).toBeVisible();
});
```

Run: `npx playwright test tests/e2e/cierre.spec.js`
Expected: FAIL (no existe `#garantias`).

- [ ] **Step 2: Escribir el HTML de Garantías y Preguntas**

En `index.html`, reemplaza `<!-- @garantias -->` por:

```html
    <section class="garantias section section--ink has-notch" id="garantias" data-theme="dark" aria-labelledby="garantias-title">
      <div class="container">
        <p class="caption" data-reveal>Garantías</p>
        <h2 class="title-l garantias__title" id="garantias-title" data-split>Lo que garantizamos y lo que no hacemos.</h2>
        <ul class="cells garantias__grid" data-reveal>
          <li class="cell garantia garantia--si"><span class="garantia__icon" aria-hidden="true">✅</span><p>Revisión de calidad antes de cada entrega.</p></li>
          <li class="cell garantia garantia--si"><span class="garantia__icon" aria-hidden="true">✅</span><p>Coherencia de marca en todas las piezas.</p></li>
          <li class="cell garantia garantia--si"><span class="garantia__icon" aria-hidden="true">✅</span><p>Tu primera campaña en 7–14 días hábiles.</p></li>
          <li class="cell garantia garantia--no"><span class="garantia__icon" aria-hidden="true">🚫</span><p>No hacemos sesiones fotográficas.</p></li>
          <li class="cell garantia garantia--no"><span class="garantia__icon" aria-hidden="true">🚫</span><p>No administramos tus redes, salvo la publicación automatizada del Plan Pro.</p></li>
          <li class="cell garantia garantia--no"><span class="garantia__icon" aria-hidden="true">🚫</span><p>No respondemos mensajes ni comentarios de tus redes.</p></li>
          <li class="cell garantia garantia--no"><span class="garantia__icon" aria-hidden="true">🚫</span><p>No diseñamos logotipos ni material corporativo fuera de las campañas.</p></li>
          <li class="cell garantia garantia--cta"><a class="garantia__link" data-cta="faq" href="https://wa.me/51949268607"><span class="title-m">¿Dudas?</span><span class="caption">Escríbenos →</span></a></li>
        </ul>
        <p class="source-note garantias__note">Los resultados pueden variar según el negocio, el sector y la constancia en la publicación. No garantizamos resultados de ventas específicos: garantizamos contenido profesional y estratégico.</p>
      </div>
    </section>
```

Reemplaza `<!-- @faq -->` por:

```html
    <section class="faq section section--paper" id="preguntas" data-theme="light" aria-labelledby="faq-title">
      <div class="container faq__grid">
        <div class="faq__intro">
          <p class="caption" data-reveal>Preguntas frecuentes</p>
          <h2 class="title-l" id="faq-title" data-split>Lo que más nos preguntan.</h2>
          <a class="btn btn--primary" data-cta="faq" href="https://wa.me/51949268607"><span class="btn__label">¿Otra pregunta? Escríbenos</span><span class="btn__arrow" aria-hidden="true">→</span></a>
        </div>
        <div class="faq__list">
          <details class="faq__item" id="faq-canva" name="faq">
            <summary>¿Por qué Pixely si mi sobrino usa Canva?</summary>
            <div class="faq__answer"><p>Canva sirve para diseñar piezas. Pixely hace publicidad estratégica: partimos de lo que tu audiencia real comenta y responde, y cada pieza tiene una dirección basada en datos.</p></div>
          </details>
          <details class="faq__item" name="faq">
            <summary>Mis fotos son malas o mi celular es antiguo, ¿igual sirve?</summary>
            <div class="faq__answer"><p>Sí. Justamente para eso existe Pixely: nuestro proceso con IA está diseñado para partir de fotos simples y convertirlas en publicidad de nivel profesional.</p></div>
          </details>
          <details class="faq__item" name="faq">
            <summary>No tengo tiempo para publicar, ¿ustedes lo hacen?</summary>
            <div class="faq__answer"><p>Con el Plan Pro, sí: programamos y publicamos por ti. Con Basic y Lite te entregamos las piezas listas en Google Drive, y Basic incluye calendario. En ningún plan respondemos los mensajes ni comentarios de tus redes.</p></div>
          </details>
          <details class="faq__item" name="faq">
            <summary>¿La IA no se ve falsa?</summary>
            <div class="faq__answer"><p>Cada pieza pasa por una revisión de calidad antes de la entrega y respeta la identidad de tu marca. Si algo no se ve bien, no sale.</p></div>
          </details>
          <details class="faq__item" name="faq">
            <summary>¿Cuánto cuesta?</summary>
            <div class="faq__answer"><p>Depende del plan y de tu negocio. Escríbenos y te recomendamos el plan adecuado. Los precios son netos; si necesitas factura electrónica, se añade el IGV.</p></div>
          </details>
          <details class="faq__item" name="faq">
            <summary>¿Cuánto tarda la primera campaña?</summary>
            <div class="faq__answer"><p>Entre 7 y 14 días hábiles desde que terminamos la entrevista de marca. Ese tiempo incluye tu Manual de Marca, el análisis del Lab, la estrategia y la producción visual.</p></div>
          </details>
          <details class="faq__item" name="faq">
            <summary>¿Garantizan ventas?</summary>
            <div class="faq__answer"><p>No. Garantizamos contenido profesional y estratégico, revisado y coherente con tu marca. Los resultados pueden variar según el negocio, el sector y la constancia en la publicación.</p></div>
          </details>
          <details class="faq__item" name="faq">
            <summary>¿Atienden fuera de Lima?</summary>
            <div class="faq__answer"><p>Sí. El servicio es 100 % digital y llega a toda Latinoamérica. En Lima Metropolitana, además, un asesor puede visitar tu negocio.</p></div>
          </details>
          <details class="faq__item" name="faq">
            <summary>¿Cómo se renuevan los planes?</summary>
            <div class="faq__answer"><p>Los planes se renuevan mes a mes de forma automática.</p></div>
          </details>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Escribir el HTML del pie**

Reemplaza `<!-- @footer -->` por:

```html
  <footer class="site-footer" data-theme="dark">
    <a class="footer-cta container" data-cta="footer" data-cursor-zone href="https://wa.me/51949268607">
      <span class="footer-cta__text">Hablemos</span>
      <span class="footer-cta__arrow" aria-hidden="true">→</span>
    </a>
    <div class="container footer__grid">
      <nav aria-label="Pie de página">
        <ul class="footer__links">
          <li><a href="#planes">Planes</a></li>
          <li><a href="#como-funciona">Cómo funciona</a></li>
          <li><a href="#ecosistema">Ecosistema</a></li>
          <li><a href="#preguntas">Preguntas</a></li>
          <li data-flag="mostrarPartners" hidden><a href="https://partners.pixely.pe">Acceso clientes</a></li>
        </ul>
      </nav>
      <div class="footer__contact">
        <a href="https://www.instagram.com/pixely_pe/" target="_blank" rel="noopener">Instagram · @pixely_pe</a>
        <a data-cta="footer" href="https://wa.me/51949268607">WhatsApp · +51 949 268 607</a>
        <a href="mailto:hola@pixely.pe">hola@pixely.pe</a>
        <p class="footer__place">Lima, Perú · Atención en toda Latinoamérica</p>
      </div>
    </div>
    <div class="container footer__legal">
      <p>© 2026 Pixely · SYNTESIA LABS E.I.R.L. · RUC 20616010787</p>
      <ul>
        <li><a href="/terminos.html">Términos</a></li>
        <li><a href="/privacidad.html">Privacidad</a></li>
      </ul>
    </div>
  </footer>
```

- [ ] **Step 4: Escribir el CSS**

`src/styles/sections/garantias.css`:

```css
.garantias__title { max-width: 22ch; margin: 16px 0 48px; }
.garantias__grid { grid-template-columns: 1fr; }
.garantia { display: grid; gap: 16px; align-content: space-between; min-height: 160px; }
.garantia__icon { font-size: 1.5rem; }
.garantia p { font-family: var(--font-display); font-size: 1.15rem; line-height: 1.35; }
.garantia--cta { padding: 0; }
.garantia__link { display: grid; align-content: space-between; height: 100%; min-height: 160px; padding: 24px; background: var(--paper); color: var(--ink); transition: background-color 0.3s, color 0.3s; }
.garantia__link .caption { color: var(--text-on-paper-2); }
.garantia__link:hover, .garantia__link:focus-visible { background: var(--magenta-cta); color: #fff; }
.garantia__link:hover .caption { color: #fff; }
.garantias__note { margin-top: 24px; max-width: 70ch; }

@media (min-width: 768px) {
  .garantias__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .garantias__grid { grid-template-columns: repeat(4, 1fr); }
  .garantia { min-height: 220px; padding: 32px; }
}
```

`src/styles/sections/faq.css`:

```css
.faq__grid { display: grid; gap: 40px; }
.faq__intro { display: grid; gap: 20px; align-content: start; justify-items: start; }
.faq__item { border-top: 1px solid var(--line-paper); }
.faq__item:last-child { border-bottom: 1px solid var(--line-paper); }
.faq__item summary {
  list-style: none; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center; gap: 16px;
  padding: 22px 0;
  font-family: var(--font-display); font-size: 1.15rem; font-weight: 500;
}
.faq__item summary::-webkit-details-marker { display: none; }
.faq__item summary::after { content: '+'; font-size: 1.5rem; color: var(--magenta); transition: transform 0.3s var(--ease-out); }
.faq__item[open] summary::after { transform: rotate(45deg); }
.faq__answer { padding: 0 0 24px; max-width: 60ch; color: var(--text-on-paper-2); }

@media (min-width: 1024px) {
  .faq__grid { grid-template-columns: 1fr 1.4fr; gap: 64px; }
  .faq__intro { position: sticky; top: calc(var(--header-h) + 40px); align-self: start; }
}
```

`src/styles/sections/footer.css`:

```css
.site-footer { background: var(--ink); color: var(--text-on-ink); padding-bottom: 32px; }
.footer-cta {
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  padding-block: 64px 48px;
  border-bottom: 1px solid var(--line-ink);
  font-family: var(--font-display); font-weight: 500; line-height: 1;
}
.footer-cta__text { font-size: clamp(4rem, 11vw, 12rem); letter-spacing: -0.02em; transition: color 0.3s; }
.footer-cta__arrow { font-size: clamp(3rem, 8vw, 9rem); transition: transform 0.4s var(--ease-out); }
.footer-cta:hover .footer-cta__text, .footer-cta:focus-visible .footer-cta__text { color: var(--magenta); }
.footer-cta:hover .footer-cta__arrow { transform: translateX(12px); }
.footer__grid { display: grid; gap: 32px; padding-block: 40px; }
.footer__links { display: grid; gap: 6px; font-family: var(--font-display); font-size: 1.25rem; }
.footer__links a:hover, .footer__contact a:hover { color: var(--magenta); }
.footer__contact { display: grid; gap: 10px; align-content: start; }
.footer__place { color: var(--text-on-ink-2); }
.footer__legal {
  display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px;
  padding-top: 24px; border-top: 1px solid var(--line-ink);
  font-family: var(--font-display); font-size: var(--fs-caption); font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-on-ink-2);
}
.footer__legal ul { display: flex; gap: 16px; }
.footer__legal a:hover { color: #fff; }

@media (min-width: 1024px) {
  .footer-cta { padding-block: 96px 64px; }
  .footer__grid { grid-template-columns: 1fr 1fr; padding-block: 56px; }
}
```

Añade al final de `src/styles/main.css`:

```css
@import './sections/garantias.css';
@import './sections/faq.css';
@import './sections/footer.css';
```

- [ ] **Step 5: Ejecutar las pruebas y verificar que pasan**

Run: `npx playwright test tests/e2e/cierre.spec.js && npm run build && npm run check:content`
Expected: PASS y `0 infracciones` (Canva aparece solo dentro de `#faq-canva`).

- [ ] **Step 6: Commit**

```bash
git add index.html src tests/e2e/cierre.spec.js
git commit -m "Add guarantees, FAQ accordion and footer with giant CTA" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Páginas legales, SEO e imagen para redes (spec §8.3 y §8.4)

**Files:**
- Create: `privacidad.html`, `terminos.html`, `src/styles/sections/legal.css`, `public/robots.txt`, `public/sitemap.xml`, `vercel.json`, `scripts/make-og.mjs`
- Generate: `public/brand/og.jpg`
- Modify: `index.html` (`<head>`), `vite.config.js`, `src/styles/main.css`
- Test: `tests/e2e/seo-legal.spec.js`, `tests/unit/og.test.js`

**Interfaces:**
- Consumes: logo (Task 4), `public/media/og-fondo-1600.jpg` (Task 6), pie con enlaces legales (Task 12).
- Produces: build de 3 páginas (`dist/index.html`, `dist/privacidad.html`, `dist/terminos.html`). Vercel sirve URLs limpias (`/privacidad`).

- [ ] **Step 1: Escribir las pruebas que fallan**

`tests/unit/og.test.js`:

```js
// @vitest-environment node
import { it, expect } from 'vitest';
import sharp from 'sharp';

it('la imagen OG mide 1200×630', async () => {
  const meta = await sharp('public/brand/og.jpg').metadata();
  expect([meta.width, meta.height]).toEqual([1200, 630]);
});
```

`tests/e2e/seo-legal.spec.js`:

```js
import { test, expect } from '@playwright/test';

test('head: canonical, Open Graph y JSON-LD', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://pixely.pe/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://pixely.pe/brand/og.jpg');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(ld).toMatchObject({
    '@type': 'ProfessionalService',
    name: 'Pixely',
    legalName: 'SYNTESIA LABS E.I.R.L.',
    taxID: '20616010787',
    telephone: '+51949268607',
    email: 'hola@pixely.pe',
    sameAs: ['https://www.instagram.com/pixely_pe/'],
  });
});

for (const path of ['/brand/og.jpg', '/robots.txt', '/sitemap.xml']) {
  test(`sirve ${path}`, async ({ request }) => {
    expect((await request.get(path)).status()).toBe(200);
  });
}

for (const [path, title] of [['/privacidad.html', 'Política de privacidad'], ['/terminos.html', 'Términos y condiciones']]) {
  test(`página legal ${path}`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText(title);
    await expect(page.getByText('SYNTESIA LABS E.I.R.L.', { exact: false }).first()).toBeVisible();
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
  });
}
```

Run: `npx vitest run tests/unit/og.test.js; npx playwright test tests/e2e/seo-legal.spec.js`
Expected: FAIL en ambos.

- [ ] **Step 2: Añadir SEO al `<head>` de `index.html`**

Inserta justo después de la línea `<meta name="theme-color" content="#0A0A0C">`:

```html
  <link rel="canonical" href="https://pixely.pe/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_PE">
  <meta property="og:site_name" content="Pixely">
  <meta property="og:url" content="https://pixely.pe/">
  <meta property="og:title" content="Pixely — Publicidad que vende">
  <meta property="og:description" content="Tu publicidad no sale de la ocurrencia de un diseñador. Sale de datos reales.">
  <meta property="og:image" content="https://pixely.pe/brand/og.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Pixely — Publicidad que vende">
  <meta name="twitter:description" content="Tu publicidad no sale de la ocurrencia de un diseñador. Sale de datos reales.">
  <meta name="twitter:image" content="https://pixely.pe/brand/og.jpg">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Pixely",
    "legalName": "SYNTESIA LABS E.I.R.L.",
    "taxID": "20616010787",
    "url": "https://pixely.pe/",
    "logo": "https://pixely.pe/brand/icon-512.png",
    "image": "https://pixely.pe/brand/og.jpg",
    "slogan": "Publicidad que vende.",
    "telephone": "+51949268607",
    "email": "hola@pixely.pe",
    "address": { "@type": "PostalAddress", "addressLocality": "Lima", "addressCountry": "PE" },
    "areaServed": [{ "@type": "City", "name": "Lima Metropolitana" }, { "@type": "Place", "name": "Latinoamérica" }],
    "sameAs": ["https://www.instagram.com/pixely_pe/"]
  }
  </script>
```

- [ ] **Step 3: Crear las páginas legales**

`privacidad.html`:

```html
<!doctype html>
<html lang="es-PE" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Política de privacidad | Pixely</title>
  <meta name="description" content="Cómo trata Pixely (SYNTESIA LABS E.I.R.L.) los datos personales de quienes visitan pixely.pe o le escriben.">
  <link rel="canonical" href="https://pixely.pe/privacidad">
  <link rel="icon" href="/brand/pixely-p.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400..600&family=Bricolage+Grotesque:opsz,wght@12..96,400..600&display=swap">
  <link rel="stylesheet" href="/src/styles/main.css">
  <script>document.documentElement.classList.replace('no-js', 'js');</script>
  <script type="module" src="/src/main.js"></script>
</head>
<body class="legal-page">
  <header class="legal-header container">
    <a href="/" aria-label="Pixely — inicio"><img src="/brand/pixely-p.svg" alt="" width="24" height="36"></a>
    <a class="caption" href="/">← Volver a pixely.pe</a>
  </header>
  <main id="main" class="legal container">
    <h1 class="title-l">Política de privacidad</h1>
    <p class="muted">Última actualización: 1 de octubre de 2026</p>
    <h2>1. Responsable</h2>
    <p>El responsable del tratamiento es SYNTESIA LABS E.I.R.L. (RUC 20616010787), titular de la marca Pixely. Puedes escribirnos a <a href="mailto:hola@pixely.pe">hola@pixely.pe</a>.</p>
    <h2>2. Qué datos tratamos</h2>
    <p>Este sitio no tiene formularios, cookies de seguimiento ni herramientas de analítica. Solo tratamos los datos que tú nos envías cuando nos escribes por WhatsApp o por email (por ejemplo, tu nombre, tu número y tu mensaje).</p>
    <h2>3. Para qué los usamos</h2>
    <p>Para responder tu consulta y, si contratas un plan, para prestarte el servicio. No vendemos ni cedemos tus datos a terceros con fines comerciales.</p>
    <h2>4. WhatsApp y alojamiento</h2>
    <p>Las conversaciones por WhatsApp se rigen también por la política de privacidad de WhatsApp. El sitio está alojado en Vercel, que registra datos técnicos de las visitas (como la dirección IP y el navegador) para la seguridad y el funcionamiento del servicio.</p>
    <h2>5. Cuánto tiempo los conservamos</h2>
    <p>Mientras dure nuestra relación comercial o hasta que nos pidas eliminarlos, salvo que la ley exija conservarlos por más tiempo.</p>
    <h2>6. Tus derechos</h2>
    <p>Conforme a la Ley N.° 29733, Ley de Protección de Datos Personales, y su reglamento, puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición escribiendo a <a href="mailto:hola@pixely.pe">hola@pixely.pe</a>. También puedes acudir a la Autoridad Nacional de Protección de Datos Personales.</p>
    <h2>7. Cambios</h2>
    <p>Si actualizamos esta política, publicaremos aquí la nueva versión con su fecha.</p>
  </main>
  <footer class="legal-footer container">
    <p>© 2026 Pixely · SYNTESIA LABS E.I.R.L. · RUC 20616010787</p>
    <a href="/terminos.html">Términos y condiciones</a>
  </footer>
</body>
</html>
```

`terminos.html`:

```html
<!doctype html>
<html lang="es-PE" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Términos y condiciones | Pixely</title>
  <meta name="description" content="Condiciones de uso del sitio pixely.pe, operado por SYNTESIA LABS E.I.R.L.">
  <link rel="canonical" href="https://pixely.pe/terminos">
  <link rel="icon" href="/brand/pixely-p.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400..600&family=Bricolage+Grotesque:opsz,wght@12..96,400..600&display=swap">
  <link rel="stylesheet" href="/src/styles/main.css">
  <script>document.documentElement.classList.replace('no-js', 'js');</script>
  <script type="module" src="/src/main.js"></script>
</head>
<body class="legal-page">
  <header class="legal-header container">
    <a href="/" aria-label="Pixely — inicio"><img src="/brand/pixely-p.svg" alt="" width="24" height="36"></a>
    <a class="caption" href="/">← Volver a pixely.pe</a>
  </header>
  <main id="main" class="legal container">
    <h1 class="title-l">Términos y condiciones</h1>
    <p class="muted">Última actualización: 1 de octubre de 2026</p>
    <h2>1. Titular</h2>
    <p>El sitio pixely.pe es operado por SYNTESIA LABS E.I.R.L. (RUC 20616010787), titular de la marca Pixely.</p>
    <h2>2. Uso del sitio</h2>
    <p>El sitio tiene fines informativos. Describe los servicios de Pixely y los canales para contactarnos.</p>
    <h2>3. Planes y condiciones del servicio</h2>
    <p>Los planes, sus alcances y sus condiciones se acuerdan en conversación directa con nuestro equipo. Los planes se renuevan mes a mes de forma automática.</p>
    <h2>4. Alcance del servicio</h2>
    <p>Pixely no realiza sesiones fotográficas, no administra redes sociales (salvo la publicación automatizada del Plan Pro), no responde mensajes ni comentarios de las redes del cliente y no diseña logotipos ni material corporativo fuera de las campañas.</p>
    <h2>5. Resultados</h2>
    <p>Garantizamos contenido profesional y estratégico, revisado antes de cada entrega. No garantizamos resultados de ventas específicos: los resultados pueden variar según el negocio, el sector y la constancia en la publicación.</p>
    <h2>6. Propiedad intelectual</h2>
    <p>Los textos, imágenes y vídeos de este sitio son producción de Pixely y no pueden reutilizarse sin autorización.</p>
    <h2>7. Ley aplicable</h2>
    <p>Estos términos se rigen por las leyes de la República del Perú.</p>
    <h2>8. Contacto</h2>
    <p>Escríbenos a <a href="mailto:hola@pixely.pe">hola@pixely.pe</a> o por WhatsApp al <a data-cta="footer" href="https://wa.me/51949268607">+51 949 268 607</a>.</p>
  </main>
  <footer class="legal-footer container">
    <p>© 2026 Pixely · SYNTESIA LABS E.I.R.L. · RUC 20616010787</p>
    <a href="/privacidad.html">Política de privacidad</a>
  </footer>
</body>
</html>
```

`src/styles/sections/legal.css`:

```css
.legal-page { background: var(--paper); }
.legal-header { display: flex; align-items: center; justify-content: space-between; height: var(--header-h); border-bottom: 1px solid var(--line-paper); }
.legal { max-width: 760px; padding-block: 64px 96px; display: grid; gap: 16px; }
.legal h1 { margin-bottom: 4px; }
.legal h2 { margin-top: 24px; font-family: var(--font-display); font-size: 1.3rem; font-weight: 500; }
.legal a { text-decoration: underline; text-underline-offset: 2px; }
.legal .muted { color: var(--text-on-paper-2); }
.legal-footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; padding-block: 24px; border-top: 1px solid var(--line-paper); font-size: 0.9rem; color: var(--text-on-paper-2); }
```

Añade al final de `src/styles/main.css`:

```css
@import './sections/legal.css';
```

En `vite.config.js`, amplía `input`:

```js
      input: {
        main: resolve(root, 'index.html'),
        privacidad: resolve(root, 'privacidad.html'),
        terminos: resolve(root, 'terminos.html'),
      },
```

- [ ] **Step 4: Crear `robots.txt`, `sitemap.xml` y `vercel.json`**

`public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://pixely.pe/sitemap.xml
```

`public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://pixely.pe/</loc><lastmod>2026-10-01</lastmod></url>
  <url><loc>https://pixely.pe/privacidad</loc><lastmod>2026-10-01</lastmod></url>
  <url><loc>https://pixely.pe/terminos</loc><lastmod>2026-10-01</lastmod></url>
</urlset>
```

`vercel.json`:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "headers": [
    {
      "source": "/media/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=604800" }]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

- [ ] **Step 5: Crear `scripts/make-og.mjs` y generar la imagen**

```js
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const bg = readFileSync('public/media/og-fondo-1600.jpg').toString('base64');
const logo = readFileSync('public/brand/pixely-p.svg').toString('base64');

const html = `<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500&family=Bricolage+Grotesque:opsz,wght@12..96,500&display=swap" rel="stylesheet">
<style>
  body { margin: 0; width: 1200px; height: 630px; background: #0A0A0C url(data:image/jpeg;base64,${bg}) center/cover; color: #fff; font-family: 'Albert Sans', sans-serif; }
  .wrap { padding: 72px 80px; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; }
  img { width: 56px; }
  h1 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 500; font-size: 84px; line-height: 1.02; margin: 0; letter-spacing: -1px; }
  p { font-size: 30px; margin: 16px 0 0; color: rgba(255,255,255,.75); }
  span { color: #EB0C6E; }
</style></head><body><div class="wrap">
  <img src="data:image/svg+xml;base64,${logo}" alt="">
  <div><h1>Publicidad<br>que vende<span>.</span></h1><p>Tu publicidad sale de datos reales.</p></div>
</div></body></html>`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/brand/og.jpg', type: 'jpeg', quality: 85 });
await browser.close();
console.log('public/brand/og.jpg generado');
```

Run: `npm run og`
Expected: `public/brand/og.jpg generado`. Abre la imagen con la herramienta Read y comprueba que el texto se lee y no tapa el brillo magenta.

- [ ] **Step 6: Ejecutar las pruebas y verificar que pasan**

Run: `npx vitest run tests/unit/og.test.js && npx playwright test tests/e2e/seo-legal.spec.js && npm run build && npm run check:content`
Expected: PASS y `3 páginas revisadas, 0 infracciones.`

- [ ] **Step 7: Commit**

```bash
git add index.html privacidad.html terminos.html vite.config.js vercel.json public/robots.txt public/sitemap.xml public/brand/og.jpg scripts/make-og.mjs src tests
git commit -m "Add legal pages, SEO metadata, sitemap and OG image" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Movimiento base: palabras, revelado, scramble y scroll suave (spec §6)

**Files:**
- Create: `src/motion/index.js`, `src/motion/ease.js`, `src/motion/split-words.js`, `src/motion/reveal.js`, `src/motion/scramble.js`, `src/motion/smooth-scroll.js`, `src/styles/motion.css`
- Modify: `src/main.js`, `src/styles/main.css`
- Test: `tests/e2e/motion.spec.js`

**Interfaces:**
- Consumes: atributos `data-split`, `data-reveal` y `data-scramble` (Tasks 7–12); clase `js-motion` y `window.__motionReady` (Task 1).
- Produces:
  - `bootMotion(doc: Document): boolean`. Sale sin hacer nada (`false`) si `<html>` ya no tiene `js-motion`, porque eso significa que venció el plazo de seguridad de 4 s. En otro caso marca `window.__motionReady = true` y arranca los efectos.
  - La curva `'pixely'` (CustomEase `0.22, 1, 0.36, 1`).
  - Clase `split-word` en cada palabra dividida.
  - `initSmoothScroll(gsap, ScrollTrigger): Lenis | null`; solo actúa con `pointer: fine`.

- [ ] **Step 1: Escribir la prueba que falla**

`tests/e2e/motion.spec.js`:

```js
import { test, expect } from '@playwright/test';

test('con movimiento: arranca GSAP, divide el titular y revela los bloques', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/js-motion/);
  await expect.poll(() => page.evaluate(() => window.__motionReady === true)).toBe(true);
  const h1 = page.locator('#hero-title');
  await expect(h1.locator('.split-word').first()).toBeAttached();
  await expect(h1).toHaveCSS('visibility', 'visible');
  const blocks = page.locator('[data-reveal]');
  const count = await blocks.count();
  for (let i = 0; i < count; i += 1) {
    const el = blocks.nth(i);
    if (!(await el.isVisible())) continue;
    await el.scrollIntoViewIfNeeded();
    await expect(el).toHaveCSS('opacity', '1', { timeout: 4000 });
  }
});

test('el scramble termina mostrando el texto original', async ({ page }) => {
  await page.goto('/');
  const el = page.locator('#inicio [data-scramble]').first();
  await el.scrollIntoViewIfNeeded();
  await expect(el).toHaveText('Cada campaña incluye', { timeout: 4000 });
  await expect(el).toHaveCSS('opacity', '1');
});

test.describe('con reducir movimiento', () => {
  test.use({ reducedMotion: 'reduce' });
  test('no carga GSAP y todo es visible de inmediato', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(() => window.__motionReady)).toBeUndefined();
    await expect(page.locator('#hero-title .split-word')).toHaveCount(0);
    const opacities = await page.locator('[data-reveal]').evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
    expect(opacities.every((o) => o === '1')).toBe(true);
  });
});
```

Run: `npx playwright test tests/e2e/motion.spec.js`
Expected: FAIL. El primer test se queda esperando a `__motionReady`; cuando vence el plazo de seguridad de 4 s desaparece `js-motion` y la aserción falla.

- [ ] **Step 2: Escribir los estados iniciales en `src/styles/motion.css`**

```css
.js-motion [data-reveal] { opacity: 0; transform: translateY(5px); }
.js-motion [data-split] { visibility: hidden; }
.js-motion [data-scramble] { opacity: 0; }
.split-word { will-change: transform; }
```

Añade al final de `src/styles/main.css`:

```css
@import './motion.css';
```

- [ ] **Step 3: Implementar los módulos de movimiento**

`src/motion/ease.js`:

```js
import { CustomEase } from 'gsap/CustomEase';

export const EASE = 'pixely';

export function registerEase(gsap) {
  gsap.registerPlugin(CustomEase);
  CustomEase.create(EASE, 'M0,0 C0.22,1 0.36,1 1,1');
}
```

`src/motion/split-words.js`:

```js
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
```

`src/motion/reveal.js`:

```js
import { gsap } from 'gsap';

export function initReveal(doc) {
  doc.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power1.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });
}
```

`src/motion/scramble.js`:

```js
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
```

`src/motion/smooth-scroll.js`:

```js
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
```

`src/motion/index.js`:

```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { registerEase } from './ease.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initReveal } from './reveal.js';
import { initSplitWords } from './split-words.js';
import { initScramble } from './scramble.js';

export function bootMotion(doc) {
  if (!doc.documentElement.classList.contains('js-motion')) return false;
  window.__motionReady = true;
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
  registerEase(gsap);
  initSmoothScroll(gsap, ScrollTrigger);
  initReveal(doc);
  initSplitWords(doc);
  initScramble(doc);
  if (doc.fonts) doc.fonts.ready.then(() => ScrollTrigger.refresh());
  return true;
}
```

- [ ] **Step 4: Cargar el movimiento en diferido desde `src/main.js`**

Añade al final de `src/main.js`:

```js
if (document.documentElement.classList.contains('js-motion')) {
  import('./motion/index.js')
    .then((m) => m.bootMotion(document))
    .catch(() => document.documentElement.classList.remove('js-motion'));
}
```

- [ ] **Step 5: Ejecutar las pruebas y verificar que pasan**

Run: `npx playwright test tests/e2e/motion.spec.js`
Expected: PASS en ambos proyectos.

Run: `npx playwright test`
Expected: toda la suite e2e en verde. Las pruebas anteriores siguen pasando con el movimiento activo.

- [ ] **Step 6: Commit**

```bash
git add src tests/e2e/motion.spec.js package.json package-lock.json
git commit -m "Add GSAP word reveals, scroll reveals, scramble and smooth scroll" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: Showreel inclinado y cursor personalizado (spec §6)

**Files:**
- Create: `src/motion/tilt-media.js`, `src/motion/cursor.js`
- Modify: `src/motion/index.js`, `src/styles/motion.css`
- Test: `tests/unit/cursor.test.js`, `tests/e2e/motion-advanced.spec.js`

**Interfaces:**
- Consumes: `[data-tilt-wrap]`/`[data-tilt]` (Task 7), `[data-cursor-zone]` (Task 12), `bootMotion` (Task 14).
- Produces:
  - `initTiltMedia(doc: Document): void`. Solo a ≥ 1024 px: rota el showreel de −15° a 0° enlazado al scroll.
  - `initCursor(doc: Document): HTMLElement | null`. Solo con `pointer: fine`; crea `.cursor-dot` y lo muestra dentro de la zona.

- [ ] **Step 1: Escribir las pruebas que fallan**

`tests/unit/cursor.test.js`:

```js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initCursor } from '../../src/motion/cursor.js';

function stubPointer(fine) {
  window.matchMedia = vi.fn().mockImplementation((q) => ({ matches: q.includes('pointer: fine') ? fine : false, media: q }));
}

beforeEach(() => {
  document.body.innerHTML = '<a data-cursor-zone href="#">Hablemos</a>';
  if (!globalThis.requestAnimationFrame) globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16);
});

describe('initCursor', () => {
  it('no hace nada en pantallas táctiles', () => {
    stubPointer(false);
    expect(initCursor(document)).toBeNull();
    expect(document.querySelector('.cursor-dot')).toBeNull();
  });

  it('muestra y oculta el cursor dentro de la zona', () => {
    stubPointer(true);
    const dot = initCursor(document);
    const zone = document.querySelector('[data-cursor-zone]');
    expect(dot.getAttribute('aria-hidden')).toBe('true');
    zone.dispatchEvent(new MouseEvent('pointerenter', { clientX: 20, clientY: 30 }));
    expect(dot.classList.contains('is-visible')).toBe(true);
    expect(zone.classList.contains('has-cursor')).toBe(true);
    zone.dispatchEvent(new MouseEvent('pointerleave'));
    expect(dot.classList.contains('is-visible')).toBe(false);
  });
});
```

`tests/e2e/motion-advanced.spec.js`:

```js
import { test, expect } from '@playwright/test';

const rotation = (el) => el.evaluate((node) => {
  const t = getComputedStyle(node).transform;
  if (t === 'none') return 0;
  const [a, b] = t.match(/matrix\(([^)]+)\)/)[1].split(',').map(Number);
  return Math.round((Math.atan2(b, a) * 180) / Math.PI);
});

test('escritorio: el showreel empieza a −15° y se endereza', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  const media = page.locator('[data-tilt]');
  await expect.poll(() => rotation(media)).toBe(-15);
  await page.evaluate(() => {
    const wrap = document.querySelector('[data-tilt-wrap]');
    window.scrollTo(0, wrap.getBoundingClientRect().bottom + window.scrollY);
  });
  await expect.poll(() => rotation(media), { timeout: 5000 }).toBe(0);
});

test('móvil: el showreel no se inclina', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  await page.waitForFunction(() => window.__motionReady === true);
  expect(await rotation(page.locator('[data-tilt]'))).toBe(0);
});

test('escritorio: el cursor magenta aparece sobre "Hablemos"', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await page.waitForFunction(() => window.__motionReady === true);
  await page.locator('.footer-cta').hover();
  await expect(page.locator('.cursor-dot')).toHaveClass(/is-visible/);
});
```

Run: `npx vitest run tests/unit/cursor.test.js; npx playwright test tests/e2e/motion-advanced.spec.js`
Expected: FAIL (no existen los módulos; el showreel no rota).

- [ ] **Step 2: Implementar los módulos**

`src/motion/tilt-media.js`:

```js
import { gsap } from 'gsap';

export function initTiltMedia(doc) {
  const wrap = doc.querySelector('[data-tilt-wrap]');
  const media = doc.querySelector('[data-tilt]');
  if (!wrap || !media) return;
  gsap.matchMedia().add('(min-width: 1024px)', () => {
    gsap.fromTo(media, { rotate: -15 }, {
      rotate: 0,
      ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top 40%', end: 'bottom 60%', scrub: true },
    });
  });
}
```

`src/motion/cursor.js`:

```js
export function initCursor(doc) {
  if (!window.matchMedia('(pointer: fine)').matches) return null;
  const zone = doc.querySelector('[data-cursor-zone]');
  if (!zone) return null;

  const dot = doc.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  dot.innerHTML = '<span>→</span>';
  doc.body.appendChild(dot);

  let x = 0; let y = 0; let cx = 0; let cy = 0;
  let active = false;
  let frame = null;

  function loop() {
    cx += (x - cx) * 0.2;
    cy += (y - cy) * 0.2;
    dot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    frame = active ? requestAnimationFrame(loop) : null;
  }

  zone.addEventListener('pointerenter', (e) => {
    active = true;
    x = cx = e.clientX;
    y = cy = e.clientY;
    zone.classList.add('has-cursor');
    dot.classList.add('is-visible');
    if (!frame) frame = requestAnimationFrame(loop);
  });
  zone.addEventListener('pointermove', (e) => {
    x = e.clientX;
    y = e.clientY;
  });
  zone.addEventListener('pointerleave', () => {
    active = false;
    zone.classList.remove('has-cursor');
    dot.classList.remove('is-visible');
  });

  return dot;
}
```

En `src/motion/index.js`, añade los imports:

```js
import { initTiltMedia } from './tilt-media.js';
import { initCursor } from './cursor.js';
```

y las llamadas justo después de `initScramble(doc);`:

```js
  initTiltMedia(doc);
  initCursor(doc);
```

Añade al final de `src/styles/motion.css`:

```css
.cursor-dot {
  position: fixed; left: 0; top: 0; z-index: 60;
  width: 120px; height: 120px; border-radius: 50%;
  display: grid; place-items: center;
  background: var(--magenta); color: #fff; font-size: 2rem;
  pointer-events: none; opacity: 0; scale: 0.6;
  transition: opacity 0.3s, scale 0.3s var(--ease-out);
}
.cursor-dot.is-visible { opacity: 1; scale: 1; }
.has-cursor, .has-cursor * { cursor: none; }
```

- [ ] **Step 3: Ejecutar las pruebas y verificar que pasan**

Run: `npx vitest run && npx playwright test`
Expected: todo en verde.

- [ ] **Step 4: Commit**

```bash
git add src tests
git commit -m "Add scroll-linked showreel tilt and magenta footer cursor" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 16: QA completo — accesibilidad, rendimiento y comparación con la referencia (spec §9)

**Files:**
- Create: `tests/e2e/qa.spec.js`, `tests/unit/bundle.test.js`, `scripts/lighthouse.mjs`, `docs/qa-2026-10-01.md`
- Modify: `package.json` (añade `chrome-launcher` en devDependencies) y los archivos que haya que corregir según los hallazgos
- Test: los anteriores más la suite completa

**Interfaces:**
- Consumes: el sitio completo (Tasks 1–15).
- Produces: `npm run verify` y `npm run lighthouse` en verde, y el informe `docs/qa-2026-10-01.md`.

- [ ] **Step 1: Escribir las pruebas de QA**

`tests/e2e/qa.spec.js`:

```js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('accesibilidad (WCAG 2 A/AA)', () => {
  test.use({ reducedMotion: 'reduce' });
  for (const path of ['/', '/privacidad.html', '/terminos.html']) {
    test(`sin infracciones axe en ${path}`, async ({ page }) => {
      await page.goto(path);
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).exclude('.cursor-dot').analyze();
      expect(result.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    });
  }
});

test('sin scroll horizontal a 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('el primer Tab muestra el enlace para saltar al contenido', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.locator('.skip-link');
  await expect(skip).toBeFocused();
  expect((await skip.boundingBox()).y).toBeGreaterThanOrEqual(0);
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('todas las secciones y sus títulos son visibles', async ({ page }) => {
    await page.goto('/');
    for (const id of ['inicio', 'rubros', 'problemas', 'planes', 'como-funciona', 'ecosistema', 'partners', 'historia', 'garantias', 'preguntas']) {
      const heading = page.locator(`#${id} :is(h1, h2)`).first();
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();
    }
    const hrefs = await page.locator('[data-cta]').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    expect(hrefs.every((h) => h.startsWith('https://wa.me/51949268607'))).toBe(true);
  });
});
```

`tests/unit/bundle.test.js`:

```js
// @vitest-environment node
import { it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

it.skipIf(!existsSync('dist/assets'))('el JavaScript compilado pesa ≤ 90 KB comprimido', () => {
  const files = readdirSync('dist/assets').filter((f) => f.endsWith('.js'));
  const total = files.reduce((sum, f) => sum + gzipSync(readFileSync(`dist/assets/${f}`)).length, 0);
  expect(total).toBeLessThanOrEqual(90 * 1024);
});
```

- [ ] **Step 2: Crear el script de Lighthouse**

Run: `npm install -D chrome-launcher`

`scripts/lighthouse.mjs`:

```js
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const url = process.argv[2] ?? 'http://localhost:4173/';
const MIN = { performance: 90, accessibility: 95, 'best-practices': 95, seo: 95 };

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });
const result = await lighthouse(url, {
  port: chrome.port,
  logLevel: 'error',
  onlyCategories: Object.keys(MIN),
});
await chrome.kill();

let failed = false;
for (const [key, min] of Object.entries(MIN)) {
  const score = Math.round(result.lhr.categories[key].score * 100);
  const ok = score >= min;
  if (!ok) failed = true;
  console.log(`${ok ? '✓' : '✗'} ${key}: ${score} (mínimo ${min})`);
}
process.exit(failed ? 1 : 0);
```

- [ ] **Step 3: Ejecutar la verificación automática**

Run: `npm run verify`
Expected: build correcto, `3 páginas revisadas, 0 infracciones.`, Vitest en verde (incluido el tamaño del bundle) y Playwright en verde.

Lighthouse (móvil): arranca `npm run preview` en segundo plano y, con el servidor en marcha, ejecuta:

Run: `npm run lighthouse`
Expected: cuatro líneas `✓`. Si alguna sale `✗`, abre el informe (`npx lighthouse http://localhost:4173/ --view`), corrige la causa (imágenes sin dimensiones, contraste, carga de fuentes, etc.) y repite. Haz un commit por corrección.

- [ ] **Step 4: Comparar lado a lado con phenomenonstudio.com**

Con el navegador integrado (`mcp__Claude_Browser__*`), abre `http://localhost:4173` y `https://phenomenonstudio.com/` en dos pestañas. Para cada ancho (1440, 768 y 375 px, con `resize_window`), recorre ambas páginas sección por sección con capturas. Anota en `docs/qa-2026-10-01.md`, sección por sección, si coinciden o en qué difieren:

1. Ritmo vertical y alturas relativas de las secciones.
2. Márgenes, espaciado y jerarquía tipográfica.
3. Titulares palabra a palabra.
4. Bloques que aparecen al hacer scroll.
5. Showreel inclinado que se endereza.
6. Etiquetas con scramble.
7. Pestaña recortada entre secciones.
8. Planes con menú fijo.
9. Filas de problemas apiladas.
10. Pestañas del ecosistema.
11. Botones con relleno circular.
12. Cursor del CTA final.
13. Cabecera que cambia de color.

Corrige las diferencias que no sean intencionales; cambios de marca, de contenido o secciones omitidas a propósito (§10 de la spec) no cuentan como diferencias. Haz un commit por corrección, vuelve a correr `npm run verify` y deja el informe con el estado final de cada punto.

- [ ] **Step 5: Commit**

```bash
git add tests scripts/lighthouse.mjs package.json package-lock.json docs/qa-2026-10-01.md
git commit -m "Add QA suite: axe, layout, no-JS, bundle size, Lighthouse and visual review" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 17: Publicación en Vercel y dominio pixely.pe (spec §8.5)

**Files:**
- Create: `docs/deploy.md`
- Generate: `.vercel/` (ignorado por git)
- Test: suites e2e existentes ejecutadas contra la URL publicada (`BASE_URL`)

**Interfaces:**
- Consumes: el sitio verificado (Task 16), la CLI de Vercel (sesión iniciada como `lam218313-beep`) y el conector MCP de Vercel (`add_project_domain`, `list_teams`, `list_projects`).
- Produces: el sitio en producción, el dominio `pixely.pe` (con `www` redirigido) añadido al proyecto, y las instrucciones de DNS para el usuario.

- [ ] **Step 1: Confirmar la cuenta de Vercel con el usuario**

Run: `npx vercel@62.1.0 whoami`
Expected: `lam218313-beep`.

**Pregunta al usuario y espera su respuesta:** "Voy a publicar pixely.pe en la cuenta de Vercel `lam218313-beep`. ¿Es la cuenta correcta?". No sigas sin un sí. El lanzamiento ya está autorizado, pero la cuenta de destino no se ha confirmado.

- [ ] **Step 2: Enlazar el proyecto y publicar en producción**

```bash
npx vercel@62.1.0 link --yes --project pixely-web
npx vercel@62.1.0 deploy --prod
```

Expected: la última línea muestra la URL de producción (`https://pixely-web-….vercel.app`). Anótala.

- [ ] **Step 3: Verificar la URL publicada**

```bash
BASE_URL=<url-de-produccion> npx playwright test tests/e2e/smoke.spec.js tests/e2e/hero.spec.js tests/e2e/seo-legal.spec.js tests/e2e/cierre.spec.js
```

Expected: PASS. Abre además la URL en el navegador integrado a 1440 y 375 px y revisa visualmente el hero y el pie.

- [ ] **Step 4: Añadir el dominio al proyecto**

1. Con ToolSearch, carga `list_teams`, `list_projects` y `add_project_domain` del conector de Vercel.
2. Busca el `teamId` y el proyecto `pixely-web`.
3. Llama a `add_project_domain` con `{ name: "pixely.pe" }`.
4. Llama a `add_project_domain` con `{ name: "www.pixely.pe", redirect: "pixely.pe", redirectStatusCode: 308 }`.

Run: `npx vercel@62.1.0 domains inspect pixely.pe`
Expected: muestra los registros DNS que Vercel pide (normalmente un registro **A** para `@` y un **CNAME** para `www`). Copia los valores **exactos** que muestre; no uses valores de memoria.

- [ ] **Step 5: Entregar al usuario las instrucciones de DNS**

Escribe `docs/deploy.md` con:
1. La URL de producción.
2. El comando de republicación (`npx vercel@62.1.0 deploy --prod`).
3. Los registros exactos del Step 4.
4. Los pasos en GoDaddy:
   a. Panel de GoDaddy → Mis productos → `pixely.pe` → DNS.
   b. Desconecta el sitio de GoDaddy Website Builder ("Próximo lanzamiento") si sigue conectado al dominio.
   c. Reemplaza el registro A de `@` por el valor de Vercel.
   d. Crea o reemplaza el CNAME `www` con el valor de Vercel.
   e. Guarda; la propagación puede tardar desde minutos hasta 48 h.

Envía al usuario un resumen breve con esos pasos. **El cambio de DNS lo hace el usuario**; no inicies sesión en GoDaddy.

- [ ] **Step 6: Verificar el dominio cuando el usuario confirme el cambio de DNS**

Run: `npx vercel@62.1.0 domains inspect pixely.pe`
Expected: configuración válida y certificado emitido.

```bash
BASE_URL=https://pixely.pe npx playwright test tests/e2e/smoke.spec.js tests/e2e/seo-legal.spec.js
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add docs/deploy.md
git commit -m "Document Vercel deployment and pixely.pe DNS setup" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Trabajo futuro (fuera de este plan)

- **Pixely Partners:** cuando la plataforma esté terminada, leer su repositorio para describir con precisión el Lab y las funciones de Partners. Después: activar `mostrarPartners` en `src/config.js`, sustituir los `.ui-skeleton` por capturas de una cuenta demo y revisar §4.1, §4.5 y §4.7.
- **Casos y testimonios:** activar `mostrarCasos` y `mostrarTestimonios` cuando exista el primer material autorizado por escrito.

