# Nexora Labs — web del negocio del usuario

Sitio estático de una página (sin build, sin dependencias). El usuario habla español rioplatense; respondé en español.

## Arquitectura
- `index.html`: markup de secciones estáticas. Carga `js/productos.js` y luego `js/app.js` (scripts clásicos que comparten constantes globales).
- `js/productos.js`: única fuente de datos — `WHATSAPP`, `CATS`, `PRODUCTS_ALL` → `PRODUCTS` (filtra `oculto:true`). `price` es número entero en bolivianos.
- `js/app.js`: render de hero, grilla, lista de precios, modal de detalle (`<dialog id="modal">`), pedido (`<dialog id="bag">`, barra flotante `#bar`). Pedido guardado en `localStorage` (`nexora_cart`), siempre con try/catch.
- `css/styles.css`: tokens en `:root`; estética blanca cálida minimalista (bg `#F6F5F1`, tinta `#101317`, acento `#1F3A6E`, fuente Manrope).
- `assets/productos/*.webp`: frascos recortados con fondo transparente, ~900px de alto.
- Logo: hexágono sólido con N en negativo (SVG inline `.mark` en header/footer; archivos en `assets/logo/`, `favicon.svg`, `apple-touch-icon.png`).
- Atención, pagos y entregas: todo por WhatsApp (sección `#ayuda` con preguntas frecuentes, botón flotante `#fab`). No inventar ciudades, costos ni medios de pago: el usuario no los definió.

## Convenciones
- Mantener la estética minimalista: mucho aire, pocas palabras, un frasco protagonista, sin saturar.
- Datos de productos solo en `js/productos.js`; nada hardcodeado en `app.js`.
- Mensaje de WhatsApp: `orderMessage()` en `app.js`; enlaces con `wa.me/${WHATSAPP}?text=`.
- Probar en escritorio y en mobile (375px) sin scroll horizontal. Preview: `.claude/launch.json` → `nexora-web` (puerto 8765).
- Commits chicos y descriptivos en español después de cada mejora que el usuario apruebe.

## Pendientes / dudas abiertas
- Publicado en https://nexoratienda.netlify.app (Netlify, autodeploy desde GitHub josemariapaniagua3172-del/nexora-web, rama main). Si cambia el dominio, actualizar canonical/og:url/og:image en index.html, robots.txt y sitemap.xml. Vista previa al compartir: og-image.jpg (1200×630).
- Productos no incluidos: GHK-CU 70 mg (línea en inglés, sin precio), KLOW80 + KPV.
- No ayudar a evadir las políticas de anuncios de Meta (el usuario lo pidió antes y se rechazó).
