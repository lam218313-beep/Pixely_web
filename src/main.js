import { config } from './config.js';
import { applyFlags } from './core/flags.js';
import { applyCtaLinks } from './core/cta.js';
import { initMenu } from './ui/menu.js';
import { initHeaderTheme } from './ui/header-theme.js';
import { initAutoplay } from './ui/autoplay.js';
import { initPlansNav } from './ui/plans-nav.js';
import { initTabs } from './ui/tabs.js';

applyFlags(document, config.flags);
applyCtaLinks(document, config);
initMenu(document);
initHeaderTheme(document);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
initAutoplay(document, reduced);
initPlansNav(document, config);
initTabs(document);
document.documentElement.dataset.boot = 'ok';
