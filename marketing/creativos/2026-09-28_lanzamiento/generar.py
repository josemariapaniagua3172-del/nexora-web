"""Genera el kit de lanzamiento de redes (Nexora Labs) con Chrome headless.
Uso:  python3 generar.py      → crea los PNG en esta misma carpeta.
Para cambiar un texto, editalo acá abajo y volvé a correrlo."""
import os, subprocess, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

MARK = ('<svg class="mk" viewBox="0 0 64 64"><path d="M32 2 58 17v30L32 62 6 47V17Z" class="h"/>'
        '<g class="n"><rect x="20" y="20" width="5" height="24"/><rect x="39" y="20" width="5" height="24"/>'
        '<path d="M25 20h5.2l8.8 17.5V44h-.2L25 26.5Z"/></g></svg>')
I = {  # íconos de línea (mismos que la web)
 "hand": '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M3 11h18M7 15h3"/>',
 "truck": '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
 "eye": '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 "chat": '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>',
 "q": '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>',
 "hex": '<path d="M12 2.5 20.5 7.3v9.4L12 21.5 3.5 16.7V7.3Z"/>',
 "bag": '<path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
 "snow": '<path d="M12 2v20M4.2 6.5l15.6 9M4.2 17.5l15.6-9M9 3.5 12 6l3-2.5M9 20.5 12 18l3 2.5"/>',
 "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 "doc": '<path d="M7 3h7l5 5v13H7Z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
}
# Bandera cruceña (verde, blanco, verde), con borde sutil para que se vea sobre fondo claro u oscuro
def flag(w=48):
    return (f'<svg width="{w}" height="{round(w*2/3)}" viewBox="0 0 30 20" style="flex:none">'
            '<rect width="30" height="20" rx="3" fill="#fff"/>'
            '<path d="M3 0h24a3 3 0 0 1 3 3v3.67H0V3a3 3 0 0 1 3-3Z" fill="#00953B"/>'
            '<path d="M0 13.33h30V17a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3Z" fill="#00953B"/>'
            '<rect x=".5" y=".5" width="29" height="19" rx="2.5" fill="none" stroke="rgba(16,19,23,.16)"/></svg>')

def ic(k, size=64, color="currentColor", sw=1.5):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" '
            f'stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">{I[k]}</svg>')

CSS = """
*{margin:0;box-sizing:border-box}
body{font-family:Manrope,sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden;position:relative}
.light{background:#F6F5F1;color:#101317}.dark{background:#101317;color:#F6F5F1}
.light .mk .h{fill:#101317}.light .mk .n{fill:#F6F5F1}.dark .mk .h{fill:#F6F5F1}.dark .mk .n{fill:#101317}
.brand{position:absolute;left:90px;top:84px;display:flex;align-items:center;gap:16px;font-weight:600;letter-spacing:.38em;font-size:24px}
.brand .mk{width:44px;height:44px}
.num{position:absolute;right:90px;top:92px;font-size:22px;letter-spacing:.2em;opacity:.55;font-weight:500}
.loc{display:inline-flex;align-items:center;gap:16px}
.foot{align-items:center;position:absolute;left:90px;right:90px;bottom:84px;display:flex;justify-content:space-between;font-size:22px;letter-spacing:.24em;font-weight:600;text-transform:uppercase}
.foot span{opacity:.6}.foot .loc{opacity:1}
.body{position:absolute;left:90px;right:90px;top:50%;transform:translateY(-50%)}
.eyebrow{font-size:24px;letter-spacing:.34em;text-transform:uppercase;font-weight:600;opacity:.6}
h1{font-weight:500;letter-spacing:-.035em;line-height:1.02}
h1 em{font-style:normal;font-weight:300;opacity:.55}
p.s{font-size:38px;line-height:1.4;margin-top:40px;opacity:.72;max-width:22ch}
.acc{color:#1F3A6E}.dark .acc{color:#9DB4E0}
.arch{position:absolute;left:50%;transform:translateX(-50%);border-radius:999px 999px 0 0;background:linear-gradient(180deg,#ECEAE4,rgba(236,234,228,0))}
.pill{display:inline-flex;align-items:center;gap:14px;margin-top:56px;padding:22px 34px;border-radius:999px;font-weight:600;font-size:30px}
.light .pill{background:#101317;color:#fff}.dark .pill{background:#F6F5F1;color:#101317}
.list{margin-top:50px;border-top:2px solid currentColor}
.list div{display:flex;align-items:center;gap:26px;padding:30px 0;border-bottom:1px solid rgba(16,19,23,.14);font-size:40px;font-weight:500}
.dark .list div{border-color:rgba(255,255,255,.16)}
"""

def page(W, H, cls, inner):
    return (f'<!doctype html><html><head><meta charset="utf-8">'
            f'<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&display=swap" rel="stylesheet">'
            f'<style>{CSS}body{{width:{W}px;height:{H}px}}</style></head><body class="{cls}">{inner}</body></html>')

def brand(): return f'<div class="brand">{MARK}NEXORA LABS</div>'
def foot(l="Santa Cruz · Bolivia", r="Pagás al recibir"):
    if l == "Santa Cruz · Bolivia": right = r
    elif r == "Santa Cruz": right = l
    else: right = f"{l} · {r}"
    return (f'<div class="foot"><span class="loc">{flag()}<span>Santa Cruz · Bolivia</span></span>'
            f'<span>{right}</span></div>')

def render(name, W, H, cls, inner):
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as f:
        f.write(page(W, H, cls, inner)); src = f.name
    out = os.path.join(HERE, name + ".png")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                    f"--window-size={W},{H}", "--virtual-time-budget=6000", f"--screenshot={out}", "file://" + src],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.remove(src)

P = (1080, 1350)  # post 4:5

POSTS = {
 # 01 — presentación de marca
 "post-01_comprar-sin-miedo": ("light", brand() + '<div class="body"><div class="eyebrow">Nexora Labs · Santa Cruz</div>'
    '<h1 style="font-size:112px;margin-top:40px">Comprar online <em>no debería darte miedo.</em></h1>'
    '<p class="s">Por eso trabajamos distinto: recibís, revisás y recién ahí pagás.</p></div>' + foot()),
 # 02 — carrusel "cómo comprar sin riesgo" (5 láminas)
 "post-02a_como-comprar": ("dark", brand() + '<div class="num">01 / 05</div><div class="body"><div class="eyebrow">Guía</div>'
    '<h1 style="font-size:120px;margin-top:40px">Cómo comprar <em>sin riesgo.</em></h1>'
    '<p class="s">En 4 pasos simples. Deslizá →</p></div>' + foot("Nexora Labs", "Santa Cruz")),
 "post-02b_paso-1": ("light", brand() + '<div class="num">02 / 05</div><div class="body">' + ic("chat", 96, "#1F3A6E") +
    '<div class="eyebrow" style="margin-top:50px">Paso 1</div><h1 style="font-size:104px;margin-top:22px">Escribinos por WhatsApp.</h1>'
    '<p class="s">O armá tu pedido en la web: el mensaje llega listo.</p></div>' + foot()),
 "post-02c_paso-2": ("light", brand() + '<div class="num">03 / 05</div><div class="body">' + ic("truck", 96, "#1F3A6E") +
    '<div class="eyebrow" style="margin-top:50px">Paso 2</div><h1 style="font-size:104px;margin-top:22px">Te lo llevamos.</h1>'
    '<p class="s">Contamos con delivery en Santa Cruz. Coordinamos día y horario.</p></div>' + foot()),
 "post-02d_paso-3": ("light", brand() + '<div class="num">04 / 05</div><div class="body">' + ic("eye", 96, "#1F3A6E") +
    '<div class="eyebrow" style="margin-top:50px">Paso 3</div><h1 style="font-size:104px;margin-top:22px">Lo revisás.</h1>'
    '<p class="s">Con tranquilidad, en tus manos.</p></div>' + foot()),
 "post-02e_paso-4": ("dark", brand() + '<div class="num">05 / 05</div><div class="body">' + ic("hand", 96, "#9DB4E0") +
    '<div class="eyebrow" style="margin-top:50px">Paso 4</div><h1 style="font-size:104px;margin-top:22px">Y recién ahí pagás.</h1>'
    '<p class="s">Efectivo o QR. Sin adelantos.</p><div class="pill">Escribinos · link en la bio</div></div>' + foot("Nexora Labs", "Santa Cruz")),
 # 03 — pago al recibir
 "post-03_pagas-al-recibir": ("dark", brand() + '<div class="body"><h1 style="font-size:150px">Pagás <em>al recibir.</em></h1>'
    '<p class="s">Efectivo o QR, en el momento de la entrega. No te pedimos adelantos.</p></div>' + foot("Nexora Labs", "Santa Cruz")),
 # 04 — delivery
 "post-04_delivery": ("light", brand() +
    '<div class="body">' + ic("truck", 110, "#1F3A6E") +
    '<h1 style="font-size:128px;margin-top:46px">Contamos <em>con delivery.</em></h1><p class="s">Te lo llevamos a tu zona en Santa Cruz.</p></div>' + foot()),
 # 05 — estilo de vida
 "post-05_disciplina": ("dark", brand() + '<div class="body"><h1 style="font-size:140px">Disciplina hoy.</h1>'
    '<h1 style="font-size:140px;margin-top:6px"><em>Un mejor mañana.</em></h1></div>' + foot("Nexora Labs", "Constancia")),
 # 06 — revisás antes de pagar
 "post-06_revisas-antes": ("light", brand() + '<div class="body"><div class="eyebrow">Nuestro compromiso</div>'
    '<div class="list" style="margin-top:44px">'
    f'<div>{ic("hand",56,"#1F3A6E")}Pagás al recibir</div>'
    f'<div>{ic("truck",56,"#1F3A6E")}Contamos con delivery</div>'
    f'<div>{ic("eye",56,"#1F3A6E")}Revisás antes de pagar</div>'
    f'<div>{ic("chat",56,"#1F3A6E")}Atención directa</div></div></div>' + foot()),
 # 07 — educativo: conservación (3 láminas)
 "post-07a_conservacion": ("light", brand() + '<div class="num">01 / 03</div><div class="body"><div class="eyebrow">Buenas prácticas</div>'
    '<h1 style="font-size:116px;margin-top:40px">Cómo se conserva <em>un liofilizado.</em></h1><p class="s">Deslizá →</p></div>' + foot("Educación", "Nexora Labs")),
 "post-07b_frio": ("light", brand() + '<div class="num">02 / 03</div><div class="body"><div class="list">'
    f'<div>{ic("snow",56,"#1F3A6E")}Refrigerado, entre 2 y 8 °C</div>'
    f'<div>{ic("hex",56,"#1F3A6E")}Sin congelar</div>'
    f'<div>{ic("sun",56,"#1F3A6E")}Protegido de la luz</div>'
    f'<div>{ic("doc",56,"#1F3A6E")}Seguí las indicaciones del envase</div></div></div>' + foot("Educación", "Nexora Labs")),
 "post-07c_profesional": ("dark", brand() + '<div class="num">03 / 03</div><div class="body">'
    '<h1 style="font-size:104px">Ante cualquier duda, <em>consultá a un profesional de la salud.</em></h1>'
    '<p class="s">Y si querés saber cómo trabajamos, escribinos.</p></div>' + foot("Educación", "Nexora Labs")),
 # 08 — atención
 "post-08_escribinos": ("light", brand() +
    '<div class="body">' + ic("chat", 110, "#1F3A6E") +
    '<h1 style="font-size:124px;margin-top:46px">¿Dudas? <em>Escribinos.</em></h1>'
    '<p class="s">Te respondemos por WhatsApp, antes y después de tu compra.</p>'
    '<div class="pill">Link en la bio</div></div>' + foot()),
 # 09 — estilo de vida
 "post-09_constancia": ("light", brand() + '<div class="body"><div class="eyebrow">Recordatorio</div>'
    '<h1 style="font-size:150px;margin-top:40px">Constancia <em>&gt; intensidad.</em></h1>'
    '<p class="s">Dormí bien. Tomá agua. Entrená. Repetí.</p></div>' + foot("Nexora Labs", "Disciplina")),
}

HIGHLIGHTS = [("destacada-1_como-comprar","bag","Cómo comprar"),("destacada-2_entregas","truck","Entregas"),
              ("destacada-3_pagos","hand","Pagos"),("destacada-4_preguntas","q","Preguntas"),("destacada-5_nosotros","hex","Nosotros")]

if __name__ == "__main__":
    for name, (cls, inner) in POSTS.items():
        render(name, *P, cls, inner)
    for name, k, label in HIGHLIGHTS:  # el ícono queda centrado: Instagram recorta un círculo al centro
        render(name, 1080, 1920, "dark",
               f'<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">{ic(k,260,"#F6F5F1",1.3)}</div>')
    # portada: todo centrado, porque Facebook recorta los costados en el celular
    render("portada-facebook_1640x624", 1640, 624, "light",
           '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">'
           f'<div style="display:inline-flex;align-items:center;gap:14px;padding:12px 24px 12px 16px;border:1px solid #E4E1DA;border-radius:999px;background:#fff;font-size:24px;font-weight:600;margin-bottom:30px">{flag(36)}Empresa cruceña</div>'
           '<h1 style="font-size:92px">Pagás <em>al recibir.</em></h1>'
           '<p class="s" style="font-size:32px;margin-top:22px;max-width:none">Contamos con delivery en Santa Cruz · Atención por WhatsApp</p></div>')
    print("listo")
