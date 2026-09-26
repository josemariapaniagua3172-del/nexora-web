# Nexora Labs — Web

Web de una página: catálogo, detalle de producto, lista de precios y pedido por WhatsApp.
Es HTML, CSS y JavaScript sin dependencias ni paso de compilación: se sube la carpeta tal cual.

## Estructura

```
nexora-web/
├── index.html            Estructura y textos de las secciones (portada, calidad, cómo comprar, pie)
├── css/styles.css        Estilos. Colores base en :root (arriba de todo)
├── js/productos.js       ← DATOS: número de WhatsApp, categorías y productos
├── js/app.js             Lógica: catálogo, filtros, detalle, pedido y mensaje de WhatsApp
├── assets/productos/     Fotos de los frascos (.webp con fondo transparente)
├── assets/logo/          Logo: símbolo (SVG), horizontal claro/oscuro (PNG), foto de perfil 1080 (PNG)
├── favicon.svg           Ícono de la pestaña
└── apple-touch-icon.png  Ícono al guardar la web en el iPhone
```

## Cambios más comunes

| Quiero…                          | Dónde                                                        |
|----------------------------------|--------------------------------------------------------------|
| Cambiar un precio                | `js/productos.js` → `price` (número sin puntos: 2200)        |
| Cambiar el número de WhatsApp    | `js/productos.js` → `WHATSAPP`                               |
| Agregar un producto              | foto en `assets/productos/` + bloque nuevo en `js/productos.js` |
| Ocultar un producto sin borrarlo | `js/productos.js` → agregarle `oculto:true`                  |
| Cambiar textos de secciones      | `index.html`                                                 |
| Cambiar colores                  | `css/styles.css` → variables `--bg`, `--ink`, `--accent`…    |
| Cambiar el mensaje de WhatsApp   | `js/app.js` → función `orderMessage()`                       |
| Cambiar preguntas frecuentes     | `index.html` → sección `id="ayuda"`                          |
| Cambiar el aviso legal           | `index.html` → pie de página, bloque `legal`                 |

## Ver la web en tu compu

Doble clic en `index.html`, o desde la terminal:

```bash
python3 -m http.server 8765 --directory ~/nexora-web
```

y abrí http://localhost:8765

## Publicar

- **Netlify Drop** (lo más simple): arrastrá la carpeta `nexora-web` a https://app.netlify.com/drop
- **Netlify / Vercel conectado a GitHub**: cada cambio que subas se publica solo.

## Historial de cambios

El proyecto usa git: cada mejora queda guardada y se puede volver atrás.

```bash
git -C ~/nexora-web log --oneline
```
