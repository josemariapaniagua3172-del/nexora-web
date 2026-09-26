# Nexora Labs — web del negocio del usuario

Sitio estático de una página (sin build, sin dependencias). El usuario habla español rioplatense; respondé en español.

## Arquitectura
- `index.html`: markup de secciones estáticas. Carga `js/productos.js` y luego `js/app.js` (scripts clásicos que comparten constantes globales).
- `js/productos.js`: única fuente de datos — `WHATSAPP`, `CATS`, `PRODUCTS_ALL` → `PRODUCTS` (filtra `oculto:true`). `price` es número entero en bolivianos.
- `js/app.js`: render de hero, grilla, lista de precios, modal de detalle (`<dialog id="modal">`), pedido (`<dialog id="bag">`, barra flotante `#bar`). Pedido guardado en `localStorage` (`nexora_cart`), siempre con try/catch.
- `css/styles.css`: tokens en `:root`; estética blanca cálida minimalista (bg `#F6F5F1`, tinta `#101317`, acento `#1F3A6E`, fuente Manrope).
- `assets/productos/*.webp`: frascos recortados con fondo transparente, ~900px de alto.

## Convenciones
- Mantener la estética minimalista: mucho aire, pocas palabras, un frasco protagonista, sin saturar.
- Datos de productos solo en `js/productos.js`; nada hardcodeado en `app.js`.
- Mensaje de WhatsApp: `orderMessage()` en `app.js`; enlaces con `wa.me/${WHATSAPP}?text=`.
- Probar en escritorio y en mobile (375px) sin scroll horizontal. Preview: `.claude/launch.json` → `nexora-web` (puerto 8765).
- Commits chicos y descriptivos en español después de cada mejora que el usuario apruebe.

## Pendientes / dudas abiertas
- NAD+: catálogo dice 1000 mg (Bs 900), un anuncio viejo decía 500 mg.
- Logo: se usa un hexágono SVG provisorio; reemplazar si el usuario pasa el logo real.
- Productos no incluidos: GHK-CU 70 mg (línea en inglés, sin precio), KLOW80 + KPV.
- No ayudar a evadir las políticas de anuncios de Meta (el usuario lo pidió antes y se rechazó).
