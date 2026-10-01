# Especificación de diseño — Sitio web pixely.pe

- **Fecha:** 2026-10-01
- **Estado:** diseño aprobado en conversación; documento pendiente de revisión
- **Repositorio:** `0.-Publicidad_nivel_01/pixely-web/`
- **Referencia visual:** https://phenomenonstudio.com/ (analizada el 2026-10-01)

---

## 1. Objetivo y alcance

Sustituir la página "Próximo lanzamiento" de GoDaddy en `pixely.pe` por un sitio de una sola página que:

1. **Respalde la venta presencial.** El asesor lo abre en el celular durante la visita y el prospecto lo revisa después para decidir.
2. **Capte leads online** con **un único CTA: WhatsApp.** No hay formularios ni lead magnet.
3. **Presente el ecosistema completo de Pixely**, incluida la plataforma Pixely Partners (todavía en desarrollo; ver §4.7).

**Relación con la referencia.** El sitio replica la estructura, el ritmo, el sistema visual y las interacciones de phenomenonstudio.com. Todo el código, las imágenes, los vídeos y los textos son propios. No se copia ningún asset, fragmento de código, logo ni texto de Phenomenon.

**Enfoque técnico aprobado:** página larga estática (enfoque A), sin backend.

---

## 2. Restricciones de contenido (no negociables)

**Fuentes de verdad.** Todo el contenido sale de:
- `Pixely/Inputs/docs/1.-identidad.md` a `7.-lineamientos.md`
- `Pixely/Inputs/investigacion_mercado_agosto2026.md`
- Los procesos `.agents/workflows/00_genesis_cliente.md` a `06_reportar_cliente.md`

**Reglas:**
- **Sin precios.** Ni los de Pixely ni los de la competencia. No aparece "S/" en ningún lugar del sitio.
- **Sin competidores nombrados.**
- **Palabras prohibidas:** "barato", "económico", "plantilla", "como todos", "Community Manager".
  - "Canva" solo puede aparecer en la pregunta frecuente que contrasta con Pixely, que es la objeción documentada en `4.-buyer.md`.
- **Nada inventado.** Ni casos, ni testimonios, ni logos de clientes, ni cifras de resultados de clientes.
- **Estadísticas solo con fuente citada.**
  - Las cifras internacionales llevan el matiz "estudios de e-commerce internacional", según las advertencias de la propia investigación.
  - La cifra "73 %" de `5.-formato.md` no se usa, porque no tiene fuente.
- **Disclaimer obligatorio** junto a cualquier mención de resultados: *"Los resultados pueden variar según el negocio, el sector y la constancia en la publicación."*
- **Herramientas internas sin nombre.** Se habla de "producción visual con IA", "publicación automatizada", etc. No se nombran Magnific, Metricool, Airtable ni Canva (salvo en la pregunta frecuente).
- **Voz:** de "tú"; formal 6/10, serio 4/10, pragmático 7/10. Frases cortas que funcionen en móvil.
- **Emojis:** solo ✅, 🚫 y 📌 como viñetas, en garantías y límites del servicio.
- **Imágenes etiquetadas con honestidad.** Toda imagen generada es "producción Pixely". Nunca se presenta como trabajo para un cliente.
- **Sin Antes/Después simulados.**

---

## 3. Datos del negocio (confirmados por el usuario el 2026-10-01)

| Dato | Valor |
|---|---|
| Dominio | `pixely.pe` (registrado en GoDaddy) |
| WhatsApp | +51 949 268 607 → `https://wa.me/51949268607` |
| Instagram | `@pixely_pe` (única red social que se enlaza en la v1) |
| Email | `hola@pixely.pe` |
| Pixely Partners | `https://partners.pixely.pe` (enlace oculto mientras `mostrarPartners = false`) |
| Logo | Solo la P rosa (`#EB0C6E`), sin nombre al lado. Se reconstruyó en SVG desde `logo_pixely.png` con una coincidencia del 98,9 % |
| Razón social | SYNTESIA LABS E.I.R.L. |
| RUC | 20616010787 |
| Cobertura | 100 % digital, toda Latinoamérica; asesoría presencial en Lima Metropolitana |
| Primera campaña | 7–14 días hábiles desde que termina la entrevista de marca |

**Planes.** Fuente: `3.-inputs_comercial.md`, consistente con el desglose "Express" del proceso 02.

| | Pro | Basic | Lite |
|---|---|---|---|
| Campañas al mes | 4 | 2 | 1 |
| Piezas totales | 48 (44 imágenes + 4 reels) | 24 (22 + 2) | 12 (11 + 1) |
| Pauta pagada 1:1 | 4 | 2 | 1 |
| Feed 4:5 | 4 | 2 | 1 |
| Estados 9:16 | 16 | 8 | 4 |
| Variaciones del producto | 20 | 10 | 5 |
| Reels animados | 4 | 2 | 1 |
| Entrega | Publicación automatizada | Google Drive + calendario | Google Drive |

---

## 4. Mapa de secciones

El orden es el de la página. **N** = fondo negro, **B** = fondo blanco. Los bloques negros ocupan al menos el 50 % de la altura total. Cada bloque negro seguido de uno blanco termina con la "pestaña" recortada (§5.4).

| # | Sección | Fondo | Equivale en Phenomenon a |
|---|---|---|---|
| 0 | Cabecera fija | transparente sobre N / blanca sobre B | Header |
| 1 | Hero | N | Hero |
| 2 | Rubros | B | Logos de "client wins" |
| 3 | Problemas que resolvemos | B | "Building products is hard…" |
| 4 | Planes | N | Servicios con menú fijo |
| 5 | Cómo funciona | B | Casos destacados |
| 6 | Ecosistema Pixely | N | Pestañas de industrias |
| 7 | Pixely Partners | N | (nueva) |
| 8 | Historia y valores | B | Equipo + "Why choose us" |
| 9 | Casos *(oculta, interruptor)* | B | Casos |
| 10 | Testimonios *(oculta, interruptor)* | B | Testimonios |
| 11 | Garantías y límites | N | Premios |
| 12 | Preguntas frecuentes | B | (página FAQ de Phenomenon) |
| 13 | CTA gigante + pie | N | "Let's collaborate" + footer |

### 4.0 Cabecera

- **Izquierda:** el logo P rosa, solo, con `aria-label="Pixely — inicio"`.
- **Centro (escritorio):** anclas a Planes, Cómo funciona, Ecosistema y Preguntas.
- **Derecha:** botón "Escríbenos" que abre WhatsApp. El enlace "Acceso clientes" a Partners solo aparece si `mostrarPartners = true`.
- **Móvil:** marca, botón compacto de WhatsApp y hamburguesa. La hamburguesa abre un panel oscuro a pantalla completa con las anclas.
- El color de la cabecera cambia según el fondo de la sección que hay debajo, como en la referencia (`checker-header`).

### 4.1 Hero (N)

- **Etiqueta superior** (mayúsculas): "Publicidad estratégica con IA · Lima, Perú".
- **Insignia:** "Pixely Partners · Próximamente". Pasa a "Nuevo" cuando `mostrarPartners = true`.
- **Titular** (aparece palabra por palabra): **"Tu publicidad no sale de la ocurrencia de un diseñador. Sale de datos reales."**
- **CTAs:** "Escríbenos por WhatsApp" (principal, magenta) y "Cómo funciona" (secundario, ancla).
- **Rejilla de 2 columnas:**
  - **Izquierda:** showreel en vídeo (§7), inclinado −15°, que se queda fijo y se endereza con el scroll. Lleva la etiqueta "Producción Pixely ▸".
  - **Derecha:** párrafo de entrada basado en la misión ("analizamos lo que tu audiencia real quiere ver y lo convertimos en publicidad lista para publicar").
    - Etiqueta con efecto scramble: "Cada campaña incluye". Debajo, una rejilla con bordes de 4 celdas: Pauta pagada 1:1 · Feed 4:5 · Estados 9:16 · Reels animados.
    - Etiqueta: "Pixely en números". Rejilla 2×2: **48** piezas al mes en el Plan Pro · **7–14** días hábiles para tu primera campaña · **10** métricas visuales en el Lab · **100 %** digital, en toda Latinoamérica.

### 4.2 Rubros (B)

- **Título:** "Para negocios que ya venden y quieren verse a la altura de su producto."
- **Rejilla de 4×2 celdas** con bordes finos: Moda y ropa · Accesorios · Tecnología y celulares · Minimarkets · Alimentos y bebidas · Galerías comerciales · Pequeñas empresas de 2 a 10 personas · celda CTA "¿Tu rubro no está? Escríbenos".
- **Al pasar el cursor**, cada celda muestra una imagen de Magnific de ese rubro. En móvil la imagen se ve siempre, en tamaño reducido.

### 4.3 Problemas que resolvemos (B)

- **Titular** (palabra por palabra): "El problema de tu negocio no es tu producto. Es cómo lo muestras."
- **Tres filas apiladas** que se quedan fijas al hacer scroll. Cada una tiene: pregunta (izquierda), respuesta (centro), CTA a WhatsApp e imagen (derecha):
  1. **"¿Tus fotos las tomas con el celular sobre una sábana blanca?"** El proceso con IA está hecho justo para eso. Dato: en estudios de e-commerce internacional, cambiar a imágenes con IA subió la conversión de 2,1 % a 2,9 % en tiendas de moda (fuente: FocalFlow).
  2. **"¿Te hace los diseños un familiar?"** Diseñar no es lo mismo que hacer publicidad con dirección estratégica basada en lo que tu audiencia comenta.
  3. **"¿No tienes tiempo para publicar?"** Dato: los dueños de pequeños negocios dedican 6–10 horas a la semana a crear contenido (encuestas internacionales 2025-26, fuente: Picmim). El Plan Pro publica por ti.
- Las fuentes aparecen como notas pequeñas, con enlace.

### 4.4 Planes (N), con menú lateral fijo

- **Título:** "Tres planes. La misma exigencia de calidad."
- **Menú lateral fijo:** Pro → Basic → Lite, en ese orden (metodología Top-Down).
  - El ítem activo se resalta según el scroll.
  - Debajo del menú va el botón "Pregúntanos por tu plan", que abre WhatsApp con un mensaje que nombra el plan activo.
- **Cada plan** muestra:
  - Una línea de beneficio, tomada de `3.-inputs_comercial.md`.
  - Tarjetas numeradas 01–05 con cada entregable y su cantidad (tabla del §3).
  - Una línea de modalidad de entrega.
- **Nota común:** "Acceso a Pixely Partners: próximamente en todos los planes".
- **Sin precios.** Línea final: "Te recomendamos el plan según tu negocio. Escríbenos."

### 4.5 Cómo funciona (B), tarjetas tipo "caso"

Cuatro tarjetas grandes, una tras otra. Cada una tiene la imagen a la izquierda y, a la derecha: etiquetas, título y tres filas de metadatos ("Qué hacemos", "Qué recibes", "Tiempo").

| # | Paso | Contenido |
|---|---|---|
| 01 | Entrevista de marca | Conversación guiada que da lugar a tu Manual de Marca |
| 02 | Lab de audiencia | 10 métricas visuales a partir de comentarios reales de Instagram |
| 03 | Estrategia y calendario | Plan de contenido mensual basado en lo que encontró el Lab |
| 04 | Producción y entrega | Piezas revisadas, en Drive o publicadas automáticamente (Pro) |

Las cuatro tarjetas comparten una sola línea de tiempo: primera campaña en 7–14 días hábiles. Debajo va el disclaimer de resultados.

### 4.6 Ecosistema Pixely (N), con pestañas

- **Título:** "De los datos de tu audiencia real, a contenido listo para publicar."
- **Cuatro pestañas**, que agrupan los procesos 00–06:

| Pestaña | Procesos | "Qué hacemos" / "Qué recibes" |
|---|---|---|
| Investigar | 00, 01 | Estudio de tu mercado y vigilancia continua de la competencia |
| Planificar | 02 | Calendario mensual según tu plan contratado |
| Producir | 03, 04 | Copy, dirección de arte y producción visual con IA |
| Publicar y medir | 05, 06 | Publicación programada y reporte mensual en PDF |

- Cada pestaña tiene imagen a la izquierda y dos columnas de viñetas a la derecha, como "Challenges / How we solve" en la referencia.

### 4.7 Pixely Partners (N)

- **Título:** "Pixely Partners: tu marca, tus datos y tu estrategia en un solo lugar."
- **Cuatro funciones:** Diagnóstico de marca · Lab de audiencia (10 métricas) · Estrategia de contenido · Calendario de publicación.
- **Mockups de dispositivo** (portátil y celular) dibujados en CSS.
  - Mientras `mostrarPartners = false`, las pantallas muestran un estado elegante de "Próximamente": esqueleto de interfaz animado en magenta y negro, sin datos falsos.
  - Cuando la plataforma esté lista, se cambian por capturas reales de una cuenta de demostración, sin datos de clientes.
- **CTA:** "Quiero saber cuándo sale", que abre WhatsApp.

### 4.8 Historia y valores (B)

- **Historia fundacional** de `1.-identidad.md`, en 2–3 párrafos, más una imagen de Magnific (un dueño de tienda en su negocio). No se usan fotos del equipo.
- **"Por qué Pixely":** rejilla con los 5 valores: Resultados medibles · Accesibilidad real · Coherencia de marca · Velocidad de ejecución · Transparencia operativa.

### 4.9 y 4.10 Casos y Testimonios (ocultas)

- El marcado está en el HTML con el atributo `hidden` y `data-flag="casos"` / `data-flag="testimonios"`.
- Solo se muestran si se activa el interruptor correspondiente en `config.js`.
- Para activarlas hace falta el primer par Antes/Después autorizado o el primer testimonio real con permiso.

### 4.11 Garantías y límites (N), rejilla tipo "premios"

- **✅ Garantías:** revisión de calidad antes de cada entrega · coherencia de marca en todas las piezas · primera campaña en 7–14 días hábiles.
- **🚫 Lo que no hacemos:** sesiones fotográficas · administración de redes (salvo la publicación automatizada del Plan Pro) · responder mensajes o comentarios · logotipos o material corporativo fuera de las campañas.
- Disclaimer de resultados.

### 4.12 Preguntas frecuentes (B), acordeón

1. ¿Por qué Pixely si mi sobrino usa Canva?
2. Mis fotos son malas o mi celular es antiguo, ¿igual sirve?
3. No tengo tiempo para publicar, ¿ustedes lo hacen?
4. ¿La IA no se ve falsa? *(Se responde con el proceso: revisión de calidad y coherencia de marca. No se promete nada que no podamos demostrar.)*
5. ¿Cuánto cuesta? *(Depende del plan; escríbenos. Los precios son netos y, si necesitas factura electrónica, se añade el IGV.)*
6. ¿Cuánto tarda la primera campaña?
7. ¿Garantizan ventas? *(No, con el disclaimer.)*
8. ¿Atienden fuera de Lima?
9. ¿Cómo se renuevan los planes? *(Mes a mes, con renovación automática.)*

### 4.13 CTA gigante y pie (N)

- **Enlace a WhatsApp a todo el ancho:** "Hablemos →". En escritorio, el cursor se convierte en un círculo magenta con flecha al pasar por encima.
- **Pie de página:**
  - Las anclas.
  - Instagram `@pixely_pe`.
  - WhatsApp +51 949 268 607.
  - "Lima, Perú · Atención en toda Latinoamérica".
  - Línea legal: "© 2026 Pixely · SYNTESIA LABS E.I.R.L. · RUC 20616010787 · Términos · Privacidad".

---

## 5. Sistema visual

### 5.1 Tokens de color

| Token | Valor | Uso |
|---|---|---|
| `--ink` | `#0A0A0C` | Fondo negro principal |
| `--carbon` | `#141418` | Tarjetas y celdas sobre negro |
| `--carbon-2` | `#1C1C22` | Hover, botón secundario sobre negro |
| `--paper` | `#FFFFFF` | Fondo blanco |
| `--mist` | `#F3F3F5` | Tarjetas sobre blanco |
| `--magenta` | `#EB0C6E` | Color de marca, medido en `logo_pixely.png`. Para acentos, decoración y texto grande |
| `--magenta-cta` | `#D90B66` | Fondo de botón con texto blanco (≈5,0:1). El `#EB0C6E` con blanco da ≈4,4:1 y no llega a AA en texto pequeño |
| `--text-on-ink` / `--text-on-ink-2` | `#FFFFFF` / `rgba(255,255,255,.62)` | Texto sobre negro |
| `--text-on-paper` / `--text-on-paper-2` | `#0A0A0C` / `#5B5E66` | Texto sobre blanco |
| `--line-ink` / `--line-paper` | `rgba(255,255,255,.10)` / `#E4E4E8` | Bordes de las rejillas |

Colores prohibidos (de `2.-visual.md`): amarillo saturado, verde lima y azul corporativo. Tampoco se usan pasteles ni tonos tierra.

### 5.2 Tipografía

- **Títulos:** Bricolage Grotesque, pesos 400–600. **Texto:** Albert Sans, pesos 400–600. Ambas de Google Fonts, con `preconnect` y `display=swap`.
- **Escala fluida,** con los valores de la referencia como objetivo en escritorio:

| Estilo | Tamaño |
|---|---|
| `title-xl` | `clamp(2.5rem, 4.72vw, 5.5rem)`, interlineado 1.2 |
| `title-l` | `clamp(2rem, 3.33vw, 4rem)`, interlineado 1.1 |
| `title-m` | `clamp(1.6rem, 2.78vw, 3.2rem)` |
| `lead` | `clamp(1.125rem, 1.5vw, 1.5rem)` |
| `caption` | 12–13 px, mayúsculas, tracking 0.08em, peso 600 |

### 5.3 Retícula y forma

- **Márgenes laterales:** 2,5vw en escritorio y 16 px en móvil, sin scroll horizontal.
- **Radios:** botones de 8 px, tarjetas de 12 px. Bordes de 1 px.
- **Botón:** al pasar el cursor, un círculo se expande desde el centro y rellena el botón (0,8 s). Flecha "→" a la derecha.

### 5.4 La "pestaña" entre secciones

- Es un recorte (`clip-path`) en el borde inferior de cada bloque negro: un saliente centrado de unos 186 × 74 px en escritorio y unos 120 × 48 px en móvil.
- **La silueta es propia:** se basa en la punta del globo de diálogo del logo P, no en la curva de Phenomenon.
- Se define en un solo lugar (una variable CSS con el polígono) y se reutiliza en todas las secciones.

---

## 6. Movimiento

Los parámetros de la columna "Referencia medida" se leyeron del CSS de phenomenonstudio.com.

| Efecto | Referencia medida | Implementación |
|---|---|---|
| Titular palabra a palabra | Cada palabra sube desde `translateY(100%)` en 0,4 s con `cubic-bezier(0.22,1,0.36,1)` y máscara por palabra | GSAP SplitText (`mask: "words"`) + ScrollTrigger, con un escalonado de unos 0,04 s entre palabras |
| Aparición de bloques | Suben 5 px mientras se funden, en 0,3 s | ScrollTrigger con `once: true` |
| Showreel inclinado | Rotación de −15° y columna fija | ScrollTrigger enlazado al scroll (`scrub`): de −15° a 0° mientras la columna está fija. En móvil, sin inclinación ni fijación |
| Etiquetas que se revuelven | Efecto scramble | GSAP ScrambleText, una vez al entrar en pantalla |
| Planes con menú fijo | Sección clavada; el ítem activo cambia | ScrollTrigger `pin` en escritorio. En móvil, los planes se apilan uno debajo de otro con un menú de pestañas fijo arriba |
| Problemas apilados | Filas fijas que se superponen | `position: sticky` con desplazamientos escalonados |
| Pestañas del ecosistema | Pestañas con fundido | Botones accesibles (`role=tablist`) con transición de opacidad |
| Cursor del CTA final | Cursor personalizado | Seguimiento con `requestAnimationFrame`. Solo con `pointer: fine` |
| Scroll suave | (la referencia no lo usa) | Lenis solo en escritorio; scroll nativo en pantallas táctiles |

**Reglas generales:**
- **Reducir movimiento:** con `prefers-reduced-motion: reduce` no se carga ninguna animación. Todo el contenido es visible desde el primer momento, sin transformaciones, y el vídeo no se reproduce solo (se muestra su imagen de portada).
- **Sin JavaScript:** el contenido completo es visible y legible. Las animaciones solo se activan cuando el JavaScript ya cargó (`.js-motion` en `<html>`).
- **Presupuesto:** como máximo unos 90 KB comprimidos de JavaScript en total, entre GSAP, sus plugins, Lenis y el código propio.

---

## 7. Imágenes y vídeo (Magnific)

**Conector:** Magnific, el mismo que usa `04_ensamblar.md` (`images_generate`, `video_generate`, `video_concatenate`, `simulate_cost`).

### 7.1 Lista de piezas

| Uso | Cantidad | Formato |
|---|---|---|
| Fotogramas del showreel | 4 | 16:10 |
| Clip del showreel (los fotogramas animados y unidos) | 1 | 8–12 s en bucle, MP4 H.264 + WebM, ≤ 4 MB, con imagen de portada |
| Rubros | 6 | 4:3 |
| Problemas | 3 | 4:5 |
| Cómo funciona | 4 | 16:10 |
| Ecosistema | 4 | 16:10 |
| Historia | 1 | 4:5 |
| Fondo de la imagen para compartir en redes (OG) | 1 | 1200×630; el logo y el titular se componen encima por código |

**Total:** 23 imágenes y 1 vídeo.

### 7.2 Reglas de los prompts (de `2.-visual.md`)

- Fotorrealismo cinemático y alto contraste.
- Base oscura, con magenta solo como luz de acento (neón sutil o destello).
- Luz lateral dramática en estudio, o luz de "hora dorada" en escenas de estilo de vida.
- Emprendedores latinos de 25–45 años, casual profesional, actitud activa, mirando el producto o su trabajo.
- **Prohibido:** texto, letras, logos, marcas de agua o interfaces dentro de la imagen; apretones de manos; gente señalando gráficas; sonrisas exageradas; amarillo saturado, verde lima, azul corporativo, pasteles.

### 7.3 Proceso

1. Redacto los prompts.
2. Calculo el costo con `simulate_cost` y lo informo al usuario.
3. **Aprobación:** el usuario aprobó por adelantado la lista y el costo el 2026-10-01. Solo me detengo a preguntar si el costo simulado supera el saldo de la cuenta.
4. Genero.
5. El usuario revisa las imágenes.
6. Optimizo: AVIF/WebP + JPG de respaldo, a 2× el tamaño en que se muestran, con `loading="lazy"` excepto en el hero.

Cada imagen lleva su texto alternativo en español.

---

## 8. Arquitectura técnica

### 8.1 Estructura

```
pixely-web/
├─ index.html              # página completa; el texto está en el HTML
├─ privacidad.html
├─ terminos.html
├─ public/
│  ├─ media/               # imágenes y vídeo optimizados
│  ├─ brand/               # logo P en SVG, favicons, imagen OG
│  ├─ robots.txt
│  └─ sitemap.xml
├─ src/
│  ├─ config.js            # WhatsApp, mensajes, interruptores
│  ├─ main.js              # arranque: interruptores, enlaces de WhatsApp, motion
│  ├─ styles/
│  │  ├─ tokens.css        # §5.1–5.3
│  │  ├─ base.css
│  │  ├─ components.css    # botones, rejillas, pestaña, acordeón, mockups
│  │  └─ sections/         # un archivo por sección del §4
│  └─ motion/              # un módulo por efecto del §6, independientes entre sí
│     ├─ split-words.js
│     ├─ reveal.js
│     ├─ scramble.js
│     ├─ tilt-media.js
│     ├─ pinned-plans.js
│     ├─ cursor.js
│     └─ smooth-scroll.js
├─ docs/superpowers/specs/ # este documento
├─ package.json            # vite, gsap, lenis
└─ vite.config.js          # build de varias páginas (index, privacidad, terminos)
```

### 8.2 `config.js`

- `whatsapp`: `"51949268607"`.
- `mensajes`: un mensaje prellenado por CTA, para saber de dónde viene cada contacto. Por ejemplo, `hero` → "Hola Pixely, vengo de su web y quiero saber qué plan me conviene.", `plan-pro` → "…me interesa el Plan Pro", `rubro-otro`, `partners`, `faq`, `footer`.
- `flags`: `{ mostrarPartners: false, mostrarCasos: false, mostrarTestimonios: false }`.

**Cómo se arman los enlaces.** Todos los enlaces de WhatsApp parten de `data-cta="<clave>"` y se construyen en `main.js`. Además, el HTML trae un `href` de respaldo a `https://wa.me/51949268607`, para que funcionen aunque no cargue el JavaScript.

### 8.3 SEO

- **Idioma:** `lang="es-PE"`.
- **Título:** "Pixely — Publicidad que vende | Publicidad con IA para negocios".
- **Meta descripción** a partir de la promesa principal.
- **Canonical:** `https://pixely.pe/`.
- **Datos estructurados (JSON-LD):** `ProfessionalService` con `name` "Pixely", `legalName` "SYNTESIA LABS E.I.R.L.", `taxID` "20616010787", `telephone` "+51949268607", `areaServed` (Lima Metropolitana y Latinoamérica) y `sameAs` (Instagram).
- **Imagen para redes:** Open Graph y Twitter card con la imagen OG.
- `robots.txt` y `sitemap.xml`.

### 8.4 Legal

- **`privacidad.html`:**
  - Responsable del tratamiento: SYNTESIA LABS E.I.R.L., RUC 20616010787.
  - El sitio no tiene formularios, cookies de seguimiento ni analítica. El contacto ocurre en WhatsApp, que tiene su propia política. El alojamiento (Vercel) genera registros técnicos.
  - Hace referencia a la Ley N.° 29733.
- **`terminos.html`:** uso del sitio; los planes y condiciones se acuerdan por conversación; disclaimer de resultados.
- **Antes de publicar**, un abogado o contador debe revisar ambos textos (ver pendiente P1).

### 8.5 Publicación

- **Vercel:** proyecto estático, con build de Vite.
- **Vistas previas:** cada cambio genera una URL de prueba para revisarlo antes de pasarlo a producción.
- **Dominio:** se añade `pixely.pe` y `www.pixely.pe` en Vercel y se actualizan los registros DNS en GoDaddy con los valores exactos que indique Vercel.
- **No se publica en producción ni se toca el DNS sin la aprobación explícita del usuario.**

---

## 9. Verificación (criterios de aceptación)

1. **Comparación lado a lado** con phenomenonstudio.com en el navegador, a 1440, 768 y 375 px, sección por sección. Deben coincidir el ritmo, el espaciado relativo, la jerarquía tipográfica y cada efecto del §6.
2. **Reducir movimiento:** con la preferencia activada, todo el contenido es visible y no se carga ninguna animación.
3. **Sin JavaScript:** todo el texto es legible y los CTAs llevan a WhatsApp.
4. **Enlaces:** todos los `data-cta` abren `wa.me/51949268607` con su mensaje; las anclas funcionan; no hay enlaces rotos.
5. **Búsqueda automática en el HTML final:**
   - Ninguna aparición de "S/", "barato", "económico", "plantilla", "como todos" ni "Community Manager".
   - "Canva" solo en la pregunta frecuente n.º 1.
6. **Lighthouse en móvil:** Rendimiento ≥ 90, Accesibilidad ≥ 95, Buenas prácticas ≥ 95, SEO ≥ 95.
7. **Contraste:** todo el texto cumple WCAG AA. Se verifica con herramienta, especialmente el magenta.
8. **Teclado:** se puede navegar por menú, pestañas, acordeón y CTAs con foco visible.
9. **Sin scroll horizontal** a 320 px de ancho.
10. **Interruptores:** con los tres apagados no aparece nada de Casos, Testimonios ni el enlace a Partners. Con cada uno encendido, aparece su sección.

---

## 10. Fuera de alcance (v1)

- Megamenú.
- Quiz "Smart Search".
- Modal de vídeo a pantalla completa.
- Blog.
- Formularios o lead magnet.
- Analítica y banner de cookies.
- Precios.
- Beneficio para clientes de Quanta.
- Garantía de precio fijo.
- Varios idiomas.
- Logos de clientes.

---

## 11. Pendientes del usuario (resueltos el 2026-10-01)

| # | Pendiente | Resolución |
|---|---|---|
| P1 | Revisión legal y Libro de Reclamaciones | El abogado lo aprobó. La v1 no incluye Libro de Reclamaciones |
| P2 | Logotipo | Solo la P rosa |
| P3 | Email y redes | `hola@pixely.pe`; solo Instagram `@pixely_pe` |
| P4 | Handle desactualizado en los docs | `@pixely.pe` → `@pixely_pe` en `Pixely/Inputs/docs/5.-formato.md` y `Quanta/Inputs/docs/5.-formato.md` |
| P5 | Partners | URL `https://partners.pixely.pe`; las capturas llegan cuando esté terminado |
| P6 | Prompts y costo de Magnific | Aprobados por adelantado (§7.3) |
| P7 | Lab (10 métricas) | Se lanza tal cual. **Tarea futura:** cuando Partners esté terminado, leer su repositorio y mejorar las secciones de Partners y el Lab con datos reales |

**Publicación:** el usuario autorizó el lanzamiento a producción ("lánzalo así"). El cambio de DNS en GoDaddy lo hace el usuario, con los valores que indique Vercel.
