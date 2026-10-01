import { config } from './config.js';
import { applyFlags } from './core/flags.js';
import { applyCtaLinks } from './core/cta.js';

applyFlags(document, config.flags);
applyCtaLinks(document, config);
document.documentElement.dataset.boot = 'ok';
