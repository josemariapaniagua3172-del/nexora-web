"""Genera los PDF para revendedores de Nexora Labs.

Uso:
    python3 generar.py            → todos los revendedores de revendedores.json
    python3 generar.py nexora     → solo uno (por su "id")

Por cada revendedor crea, en pdf/<id>/:
    Nexora_Catalogo.pdf          (para clientes: precios + su contacto)
    Nexora_Guia_de_productos.pdf (para clientes: ficha de cada péptido + su contacto)
Y una sola vez, en pdf/:
    Nexora_Guia_para_revendedores.pdf (uso interno)

Precios y productos salen de js/productos.js; textos extra de fichas.js.
Requiere Google Chrome y el paquete qrcode (pip install qrcode)."""
import json, os, re, subprocess, sys, urllib.parse
import qrcode, qrcode.image.svg

HERE = os.path.dirname(os.path.abspath(__file__))
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT = os.path.join(HERE, "pdf")


def qr_svg(url):
    img = qrcode.make(url, image_factory=qrcode.image.svg.SvgPathImage, box_size=10, border=1)
    svg = img.to_string(encoding="unicode")
    svg = re.sub(r'<\?xml[^>]*>', '', svg)
    return svg.replace('fill="#000000"', 'fill="#101317"')


def render(doc, reseller, out_pdf):
    tpl = open(os.path.join(HERE, "plantilla.html"), encoding="utf-8").read()
    inject = f"<script>window.DOC={json.dumps(doc)};window.RESELLER={json.dumps(reseller, ensure_ascii=False)};</script>"
    tmp = os.path.join(HERE, f"_tmp_{doc}.html")  # en la misma carpeta para que funcionen las rutas relativas
    open(tmp, "w", encoding="utf-8").write(tpl.replace("<!--RESELLER-->", inject))
    os.makedirs(os.path.dirname(out_pdf), exist_ok=True)
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                    "--virtual-time-budget=8000", f"--print-to-pdf={out_pdf}", "file://" + tmp],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.remove(tmp)
    print("  ✓", os.path.relpath(out_pdf, HERE))


def main():
    data = json.load(open(os.path.join(HERE, "revendedores.json"), encoding="utf-8"))
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for r in data["revendedores"]:
        if only and r["id"] != only:
            continue
        wa = re.sub(r"\D", "", r["telefono"])
        msg = f"Hola {r['nombre'].split()[0]}! Vi el catálogo de Nexora y quiero hacer una consulta."
        reseller = {"nombre": r["nombre"], "telefono": r["telefono"],
                    "qr": qr_svg(f"https://wa.me/{wa}?text={urllib.parse.quote(msg)}")}
        print(r["nombre"])
        render("catalogo", reseller, os.path.join(OUT, r["id"], "Nexora_Catalogo.pdf"))
        render("fichas", reseller, os.path.join(OUT, r["id"], "Nexora_Guia_de_productos.pdf"))
    if not only:
        print("Guía interna")
        render("guia", {"nombre": "Nexora Labs", "telefono": "+591 57022195", "qr": ""},
               os.path.join(OUT, "Nexora_Guia_para_revendedores.pdf"))


if __name__ == "__main__":
    main()
