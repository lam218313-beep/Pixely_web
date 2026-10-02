# Publicación — pixely.pe

- **Producción (Vercel):** https://pixely-web.vercel.app — proyecto `pixely-web`, cuenta `lam218313-beep`. Publicado el 2026-10-02 desde el commit `9e018a0`.
- **Republicar:** desde la raíz del repo, `npx vercel@62.1.0 deploy --prod` (el repo ya está enlazado en `.vercel/`, ignorado por git).

## Dominio pixely.pe (GoDaddy → Vercel)

Los dominios `pixely.pe` y `www.pixely.pe` ya están añadidos al proyecto. Falta cambiar el DNS en GoDaddy (los nameservers siguen siendo los de GoDaddy, `ns35/ns36.domaincontrol.com`).

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
