# PDF para revendedores

| Archivo | Para quién | Contenido |
|---|---|---|
| `pdf/<revendedor>/Nexora_Catalogo.pdf` | Clientes | Portada, productos con precio, lista de precios y contacto del revendedor (con QR a su WhatsApp) |
| `pdf/<revendedor>/Nexora_Guia_de_productos.pdf` | Clientes | Qué es cada péptido, beneficios, presentación, conservación y análisis de laboratorio (cuando coincide con la presentación) |
| `pdf/Nexora_Guia_para_revendedores.pdf` | Solo revendedores | Cómo trabajar, condiciones (a completar), resumen de productos, qué decir y qué no, mensajes listos |

## Agregar un revendedor
1. En `revendedores.json`, agregar: `{ "id": "maria", "nombre": "María Pérez", "telefono": "+591 70000000" }`
2. Correr `python3 generar.py maria` (o pedírselo a Claude).
3. Los PDF quedan en `pdf/maria/`.

## Cambiar datos
- Precios, nombres y beneficios: `js/productos.js` (los mismos de la web). Después, volver a correr `python3 generar.py`.
- "Qué es", envase y análisis de laboratorio: `fichas.js`. Solo poner análisis que coincidan con la presentación vendida.
- Diseño y textos fijos: `plantilla.html`.
