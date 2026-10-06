# Medición de pixely.pe

La web mide de dónde llega cada visita y qué botón de WhatsApp se toca. No carga ningún script de terceros mientras `analytics.gtm` esté vacío en `src/config.js`.

## Qué hace hoy (sin cuentas ni scripts de terceros)

- **Origen de la visita.** Lee `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` y `utm_term` del enlace. Si no hay `utm_source`, deduce el origen de `gclid` (Google), `fbclid` (Meta) o `ttclid` (TikTok). Todo se guarda solo en memoria de la página.
- **Referencia en el mensaje de WhatsApp.** Si hay origen, los botones de WhatsApp agregan al final del mensaje `(Ref: instagram)` o `(Ref: tiktok/campana)`. Así el equipo etiqueta cada conversación con su origen. Sin origen, el mensaje queda como siempre.
- **Eventos en `window.dataLayer`** (solo una lista local, no envía nada):
  - `visita`: `origen`, `medio`, `campana` (`directo` si no hay origen).
  - `click_whatsapp`: además, `cta` con el nombre del botón (`hero`, `plan-pro`, `footer`...).
  - `click_partners`: clic en "Acceso clientes" o "Entrar a Pixely Partners".

## Enlaces que debe usar el equipo

`https://pixely.pe/?utm_source=<red>&utm_medium=bio` en la biografía de cada red, y `utm_medium=anuncio&utm_campaign=<nombre>` en los anuncios. Ver el Kit de perfiles.

## Para activar Google, Meta y TikTok

1. Crear una cuenta de **Google Tag Manager** a nombre de Syntesia Labs y copiar el ID (`GTM-XXXXXXX`).
2. **Antes de ponerlo**, actualizar `privacidad.html`: hoy dice que el sitio no tiene cookies de seguimiento ni analítica. Con GTM y píxeles eso deja de ser cierto. Que lo revise quien lleve lo legal y decidir si hace falta un aviso de cookies.
3. Poner el ID en `analytics.gtm` de `src/config.js` y publicar.
4. En Tag Manager, crear los activadores a partir de los eventos del `dataLayer` (`click_whatsapp`, `click_partners`, `visita`) y las etiquetas de GA4, Google Ads, Meta y TikTok con sus plantillas oficiales. No hace falta tocar el código para eso.
5. Marcar `click_whatsapp` como conversión en cada plataforma.
