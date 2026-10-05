# Publicación — pixely.pe

- **Producción (Vercel):** https://pixely.pe — proyecto `pixely-web`, cuenta `lam218313-beep`.
- **Publicación automática:** el proyecto está conectado al repositorio de GitHub `lam218313-beep/Pixely_web`. Cada push a `main` se publica solo en producción; las demás ramas generan una vista previa.
- **Publicación manual (solo si hiciera falta):** desde la raíz del repo, `npx vercel@62.1.0 deploy --prod`.

## Dominio pixely.pe (GoDaddy → Vercel)

Los dominios `pixely.pe` y `www.pixely.pe` ya están añadidos al proyecto. El DNS de GoDaddy ya apunta a Vercel (comprobado el 2026-10-05). Referencia de los valores:

Valores exactos que pidió Vercel el 2026-10-02:

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` | `216.198.79.1` |
| A | `@` | `64.29.17.1` |
| CNAME | `www` | `42fceef1c2524f72.vercel-dns-017.com.` |

Pasos en GoDaddy:
1. Mis productos → `pixely.pe` → DNS.
2. Desconecta el sitio de GoDaddy Website Builder ("Próximo lanzamiento") si sigue conectado al dominio.
3. Borra los registros A actuales de `@` (`76.223.105.230` y `13.248.243.5`) y crea los dos A de la tabla.
4. Cambia el CNAME `www` (hoy apunta a `pixely.pe.`) por el valor de la tabla.
5. Guarda. La propagación puede tardar de minutos a 48 h.

Comprobar: `npx vercel@62.1.0 domains verify pixely.pe` y `npx vercel@62.1.0 domains verify www.pixely.pe` deben dar configuración válida; Vercel emite el certificado HTTPS solo.
