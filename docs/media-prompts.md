# Prompts de imágenes (Magnific, modelo `imagen-nano-banana-2`)

Cada prompt final = texto de la fila + (sufijo de personas si la columna "personas" dice sí) + sufijo de estilo.

**Sufijo de estilo**

> Cinematic photorealistic photograph, high contrast, dark moody background with deep shadows, dramatic directional side lighting, one subtle magenta neon accent light (#EB0C6E) as the only vivid color, shallow depth of field, premium commercial look. Absolutely no text, letters, numbers, logos, watermarks, signage, price tags, or readable screens anywhere in the image. No yellow, no lime green, no corporate blue, no pastel colors.

**Sufijo de personas**

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

## Registro

| id | creationIdentifier | intento | estado |
|---|---|---|---|
| showreel-1 | 1lZyG1hr4r | 1 | aprobada |
| showreel-2 | VXqvkpcMMU | 1 | aprobada |
| showreel-3 | dt1ujWtXSL | 1 | aprobada |
| showreel-4 | BhxFSMAoQR | 3 | aprobada (intento 1: persona no latina y etiquetas legibles; intento 2: neón con texto "#EBOC", se añadió "plain glowing tube light, no symbols/hashtags", sin el hex en el prompt) |
| rubro-moda | vQU1OuAa47 | 1 | aprobada |
| rubro-accesorios | MBbakYaDCm | 1 | aprobada |
| rubro-tecnologia | 8aLqS5GIrU | 1 | aprobada |
| rubro-minimarket | EbOL9UquuO | 1 | aprobada |
| rubro-alimentos | iG8VhXU3uK | 1 | aprobada |
| rubro-galerias | 9ZXcIEBNYZ | 1 | aprobada |
| problema-fotos | gOW3VYHSXO | 1 | aprobada |
| problema-diseno | 9ZXcIBWNYZ | 1 | aprobada |
| problema-tiempo | bx6wA4y5Y2 | 2 | aprobada (intento 1: dígitos legibles en la caja registradora; se añadió "no cash register display, no numbers") |
| paso-entrevista | WDuIq3ScXe | 1 | aprobada |
| paso-lab | P3eYoEw42C | 1 | aprobada |
| paso-estrategia | rg2PnXyxtc | 1 | aprobada |
| paso-produccion | nVCoFlwYQD | 1 | aprobada |
| eco-investigar | EbOL9IWuuO | 1 | aprobada |
| eco-planificar | bx6wZCC5Y2 | 1 | aprobada |
| eco-producir | ksROGH716B | 1 | aprobada (rótulo ilegible en un softbox) |
| eco-publicar | mEgK9ZfhJQ | 2 | aprobada (intento 1 bx6wZQQ5Y2 fallo: pantalla azul-violeta/lavanda y tienda con teléfono tipo iPhone; intento 2 con "solid deep magenta only, no blue/violet/lavender; generic unbranded phone; small independent shop counter", sin el hex) |
| historia | CqJj9QYEEy | 1 | aprobada |
| og-fondo | CqJjNwmEEy | 2 | aprobada (intento 1: brillo rosa pastel; se añadió "saturated deep hot magenta, not pale pink") |

### Vídeo

Modelo `grok-default`, 3 s, 4:3, 720p, fotograma inicial = imagen aprobada; prompt: `Slow cinematic camera push-in, subtle natural motion of light and fabric, no new objects, no text`.

| clip | creationIdentifier | origen |
|---|---|---|
| showreel-1 | VXqvrs5MMU | showreel-1 |
| showreel-2 | 0eFmkLqTfW | showreel-2 |
| showreel-3 | BhxFSyLoQR | showreel-3 |
| showreel-4 | 8aLq71GIrU | showreel-4 (BhxFSMAoQR) |
| showreel (unido, 12 s) | lJYiDHHgv9 | `video_concatenate` "Pixely showreel" |
