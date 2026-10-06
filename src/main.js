import { config } from './config.js';
import { applyFlags } from './core/flags.js';
import { applyCtaLinks } from './core/cta.js';
import { readOrigin, initAnalytics } from './core/analytics.js';
import { initMenu } from './ui/menu.js';
import { initAutoplay } from './ui/autoplay.js';
import { initPlanes } from './ui/planes.js';
import { initTabs } from './ui/tabs.js';
import { initVitrinas } from './ui/vitrina.js';

applyFlags(document, config.flags);
const origen = readOrigin(window.location.search);
applyCtaLinks(document, config, origen);
initAnalytics(document, config, origen);
initMenu(document);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
initAutoplay(document, reduced);
initPlanes(document, reduced);
initTabs(document);
initVitrinas(document, reduced);
document.documentElement.dataset.boot = 'ok';

if (document.documentElement.classList.contains('js-motion')) {
  import('./motion/index.js')
    .then((m) => m.bootMotion(document))
    .catch(() => document.documentElement.classList.remove('js-motion'));
}
