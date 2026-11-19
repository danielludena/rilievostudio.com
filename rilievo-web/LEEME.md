# Rilievo Studio · sitio web

Web estática (HTML, CSS y JavaScript, sin servidor ni base de datos). Funciona en GitHub Pages o en cualquier hosting gratuito.

## Estructura

```
index.html            → toda la página
css/estilos.css       → colores, tipografías y diseño
js/galeria.js         → LISTA DE FOTOS de la galería (lo único que tocarás seguido)
js/main.js            → menú, galería, calculadora de capas y formulario de WhatsApp
fotos/                → aquí van las fotos de tus piezas
assets/fonts/         → Dongle (títulos) y Nunito (textos), ya optimizadas para web
assets/logos/         → logos en SVG (gris, beige, redondo y espiral)
assets/og-imagen.png  → imagen que aparece al compartir el link por WhatsApp/Facebook
CNAME                 → tu dominio para GitHub Pages
```

## Ver la página en tu Mac

Abre `index.html` con doble clic. Para verla exactamente como en internet:

```bash
cd ruta/a/rilievo-web
python3 -m http.server 8000
```

y entra a http://localhost:8000

## Publicar en GitHub Pages con tu dominio

1. Crea un repositorio público en GitHub (por ejemplo `rilievo-web`) y sube **el contenido** de esta carpeta (que `index.html` quede en la raíz).
2. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
3. En la misma pantalla, en **Custom domain**, escribe tu dominio (el mismo que está en el archivo `CNAME`) y guarda.
4. En el panel donde compraste el dominio, agrega estos registros DNS:

| Tipo  | Nombre / Host | Valor                      |
|-------|---------------|----------------------------|
| A     | @             | 185.199.108.153            |
| A     | @             | 185.199.109.153            |
| A     | @             | 185.199.110.153            |
| A     | @             | 185.199.111.153            |
| CNAME | www           | TU-USUARIO.github.io       |

5. Espera a que propague (de minutos a unas horas) y activa **Enforce HTTPS** en Settings → Pages.

> Si tu dominio no es `rilievostudio.com`, cámbialo en el archivo `CNAME` y en las etiquetas `canonical`, `og:image`, `og:url` y el bloque `ld+json` al inicio de `index.html` (busca "rilievostudio.com").

## Agregar fotos a la galería

1. Guarda la foto en `fotos/` con un nombre sin espacios ni tildes, por ejemplo `perrito-max.jpg`.
   - Lo ideal: vertical 4:5 (1080 × 1350), fondo limpio y menos de 400 KB. Puedes comprimirla en https://squoosh.app
2. Abre `js/galeria.js` y agrega una línea:

```js
{ foto: "fotos/perrito-max.jpg", titulo: "Figura de mascota", categoria: "regalos" },
```

Categorías: `"figuras"`, `"regalos"` o `"decoracion"`.

3. Sube los cambios a GitHub. En uno o dos minutos la foto aparece en la web.

Mientras la lista esté vacía, la galería muestra un aviso con el enlace a Instagram. Los filtros solo aparecen para las categorías que tengan fotos.

## Cambiar datos de contacto

- Número de WhatsApp e Instagram: al inicio de `js/main.js` (`WHATSAPP` e `INSTAGRAM`).
- El texto visible del número en el pie de página está en `index.html` (busca "096 866 5914").
- Los mensajes que se escriben solos al tocar cada botón de WhatsApp están en los atributos `data-wa="..."` de `index.html`.

## Licencias de tipografías

Dongle y Nunito usan la SIL Open Font License (ver `assets/fonts/*-OFL.txt`), que permite usarlas en la web.
