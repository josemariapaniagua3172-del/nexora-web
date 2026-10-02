/* Nexora — lógica de la web (catálogo, detalle, pedido por WhatsApp).
   Los datos están en js/productos.js */

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const byId = id => PRODUCTS.find(p => p.id === id);
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const bs = n => `<small>Bs</small>${fmt(n)}`;
const wa = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
const esc = s => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const plus = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>';
const minus = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14"/></svg>';
const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m5 12 5 5 9-10"/></svg>';

// ---------- Pedido (se guarda en este navegador) ----------
let cart = {};
try { cart = JSON.parse(localStorage.getItem("nexora_cart") || "{}") || {}; } catch (e) { cart = {}; }
for (const id in cart) if (!byId(id) || !(cart[id] > 0)) delete cart[id];
const save = () => { try { localStorage.setItem("nexora_cart", JSON.stringify(cart)); } catch (e) {} };
const items = () => Object.entries(cart).map(([id, q]) => ({ p: byId(id), q }));
const count = () => items().reduce((a, x) => a + x.q, 0);
const total = () => items().reduce((a, x) => a + x.q * x.p.price, 0);

// Opciones elegidas en el pedido (entrega y pago), recordadas en este navegador
let choice = { entrega: NEGOCIO.entrega[0], pago: NEGOCIO.pago[0] };
try { Object.assign(choice, JSON.parse(localStorage.getItem("nexora_choice") || "{}")); } catch (e) {}
if (!NEGOCIO.entrega.includes(choice.entrega)) choice.entrega = NEGOCIO.entrega[0];
if (!NEGOCIO.pago.includes(choice.pago)) choice.pago = NEGOCIO.pago[0];

function orderMessage() {
  const lines = items().map(({p, q}) => `• ${q} × ${p.name} (${p.sub}, ${p.mg}) — Bs ${fmt(q * p.price)}`);
  const name = $("#fName").value.trim(), note = $("#fNote").value.trim();
  const out = ["Hola Nexora, quiero hacer este pedido:", "", ...lines, "", `Total: Bs ${fmt(total())}`,
    `Entrega: ${choice.entrega}${choice.entrega.startsWith("Delivery") ? ` (${NEGOCIO.ciudad})` : ""}`,
    `Pago: ${choice.pago}`];
  if (note) out.push(`Zona: ${note}`);
  if (name) out.push(`Nombre: ${name}`);
  out.push("", "¿Me confirman disponibilidad y horario de entrega? Gracias.");
  return out.join("\n");
}

function renderSeg(el, key) {
  el.innerHTML = NEGOCIO[key].map(v =>
    `<button type="button" role="radio" aria-checked="${choice[key] === v}" data-seg="${key}">${v}</button>`).join("");
}

function setQty(id, q) {
  if (q > 0) cart[id] = Math.min(q, 99); else delete cart[id];
  // al redibujar, el botón con foco se reemplaza: devolver el foco al mismo selector
  const wrap = document.activeElement && document.activeElement.closest && document.activeElement.closest("[data-p]");
  save(); sync();
  if (wrap) (wrap.querySelector("[data-inc]") || wrap.querySelector("[data-add]")).focus();
}
function add(id) {
  setQty(id, (cart[id] || 0) + 1);
  const b = $("#bagBtn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
}

function sync() {
  const n = count();
  $("#bagBtn").classList.toggle("has", n > 0);
  $("#bagCount").textContent = n;
  const showBar = n > 0 && !$("#bag").open;
  $("#bar").classList.toggle("show", showBar);
  document.body.classList.toggle("has-bar", showBar);
  $("#barText").innerHTML = `<b>${n} ${n === 1 ? "producto" : "productos"}</b> · Bs ${fmt(total())}`;
  // Botón de cada producto: "+" si no está en el pedido, o "− cantidad +" si ya está
  $$("[data-p]").forEach(w => {
    const id = w.dataset.p, p = byId(id), q = cart[id] || 0, big = w.classList.contains("big");
    w.classList.toggle("in", q > 0);
    w.innerHTML = q > 0
      ? `<button type="button" data-dec="${id}" aria-label="Quitar un ${p.name}">${minus}</button>`
        + `<span aria-live="polite">${big ? `En tu pedido: ${q}` : q}</span>`
        + `<button type="button" data-inc="${id}" aria-label="Agregar otro ${p.name}">${plus}</button>`
      : `<button type="button" data-add="${id}" aria-label="Agregar ${p.name} al pedido">${plus}${big ? " Agregar al pedido" : ""}</button>`;
  });
  // bolsa
  const list = $("#bagList");
  if (!n) {
    list.innerHTML = `<div class="bag-empty">Tu pedido está vacío.<br>Agregá productos desde el catálogo.</div>`;
    $("#bagFoot").style.display = "none";
  } else {
    $("#bagFoot").style.display = "";
    list.innerHTML = items().map(({p, q}) => `
      <div class="bag-item">
        <img src="assets/productos/${p.img}" width="400" height="900" alt="">
        <div><b>${p.name}</b><div class="sub">${p.sub} · ${p.mg}</div>
          <div class="step-q"><button data-dec="${p.id}" aria-label="Quitar uno">−</button><span>${q}</span><button data-inc="${p.id}" aria-label="Agregar uno">+</button></div></div>
        <div><div class="lt">Bs ${fmt(q * p.price)}</div><button class="rm" data-rm="${p.id}">Quitar</button></div>
      </div>`).join("");
    $("#bagTotal").innerHTML = bs(total());
  }
  renderSeg($("#segEntrega"), "entrega");
  renderSeg($("#segPago"), "pago");
  updateSend();
}
function updateSend() { if (count()) $("#bagSend").href = wa(orderMessage()); }

// ---------- Render catálogo ----------
// Frascos de la portada (ids de productos.js), de izquierda a derecha
const lineupIds = ["nad","rt60","tr120","ghk100","klow80"].filter(byId), hs = [.62,.8,1,.8,.62];
$("#lineup").innerHTML = lineupIds.map((id,i)=>
  `<img src="assets/productos/${byId(id).img}" width="400" height="900" alt="" style="--h:calc(${hs[i]} * clamp(150px,36vw,470px));animation-delay:${.15+Math.abs(i-2)*.12}s;z-index:${3-Math.abs(i-2)}">`).join("");

const chips = [["all","Todos"],...Object.entries(CATS)];
$("#chips").innerHTML = chips.map(([k,v],i)=>`<button class="chip" data-f="${k}" aria-pressed="${i===0}">${v}</button>`).join("");
$("#chips").addEventListener("click", e=>{
  const b = e.target.closest(".chip"); if(!b) return;
  $$(".chip").forEach(c=>c.setAttribute("aria-pressed", c===b));
  $$(".card").forEach(c=>c.classList.toggle("hide", b.dataset.f!=="all" && c.dataset.cat!==b.dataset.f));
});

$("#grid").innerHTML = PRODUCTS.map(p=>`
  <article class="card rv" data-cat="${p.cat}">
    <button class="open" data-open="${p.id}" aria-label="Ver detalle de ${p.name}">
      <div class="ph"><span class="tag">${CATS[p.cat]}</span><img src="assets/productos/${p.img}" width="400" height="900" alt="Frasco ${p.name} ${p.mg}" loading="lazy"></div>
      <h3>${p.name}</h3><div class="sub">${p.sub} · ${p.mg}</div>
    </button>
    <div class="row"><span class="price">${bs(p.price)}</span><div class="add" data-p="${p.id}"></div></div>
  </article>`).join("");

$("#plist").innerHTML = PRODUCTS.map(p=>`
  <div class="prow">
    <img src="assets/productos/${p.img}" width="400" height="900" alt="" loading="lazy" data-open="${p.id}">
    <button class="pname" data-open="${p.id}" aria-label="Ver detalle de ${p.name}"><b>${p.name}</b><span class="m">${p.sub} · ${p.mg}</span></button>
    <span class="c" data-open="${p.id}">${p.sub} · ${p.mg}</span>
    <span class="price">${bs(p.price)}</span>
    <div class="add" data-p="${p.id}"></div>
  </div>`).join("");

// ---------- Detalle ----------
const modal = $("#modal"), bag = $("#bag");
function openP(id){
  const p = byId(id); if(!p) return;
  modal.dataset.id = id;
  $("#mAdd").dataset.p = id;
  $("#mImg").src = `assets/productos/${p.img}`; $("#mImg").alt = `Frasco ${p.name}`;
  $("#mCat").textContent = CATS[p.cat]; $("#mName").textContent = p.name;
  $("#mSub").textContent = `${p.sub} · ${p.mg}`; $("#mTag").textContent = p.tag;
  $("#mList").innerHTML = p.b.map(x=>`<li>${esc(x)}</li>`).join("");
  $("#mPrice").innerHTML = bs(p.price);
  $("#mAsk").href = wa(`Hola Nexora, quiero consultar por ${p.name} (${p.sub}, ${p.mg}) — Bs ${fmt(p.price)}.`);
  sync(); modal.showModal();
}
function openBag(){ if (modal.open) modal.close(); bag.showModal(); sync(); }

document.addEventListener("click", e=>{
  const t = e.target;
  const a = t.closest("[data-add]"); if (a) { add(a.dataset.add); return; }
  const o = t.closest("[data-open]"); if (o) { openP(o.dataset.open); return; }
  const inc = t.closest("[data-inc]"); if (inc) { add(inc.dataset.inc); return; }
  const dec = t.closest("[data-dec]"); if (dec) { setQty(dec.dataset.dec, (cart[dec.dataset.dec]||0)-1); return; }
  const rm = t.closest("[data-rm]"); if (rm) { setQty(rm.dataset.rm, 0); return; }
  const sg = t.closest("[data-seg]");
  if (sg) { choice[sg.dataset.seg] = sg.textContent; try { localStorage.setItem("nexora_choice", JSON.stringify(choice)); } catch (e) {} sync(); return; }
  const c = t.closest("[data-close]"); if (c) { c.closest("dialog").close(); return; }
});
$("#bagBtn").onclick = openBag;
$("#barBtn").onclick = openBag;
$("#bagClear").onclick = () => { cart = {}; save(); bag.classList.remove("was-sent"); sync(); };
$("#bagSend").addEventListener("click", () => setTimeout(() => bag.classList.add("was-sent"), 600));
// Enlaces de WhatsApp reales (funcionan también con clic largo / "abrir en pestaña nueva")
$$("a.wa").forEach(a => a.href = wa(a.dataset.msg));
["#fName","#fNote"].forEach(s => $(s).addEventListener("input", updateSend));
[modal, bag].forEach(d => {
  d.addEventListener("click", e => { if (e.target === d) d.close(); });
  d.addEventListener("close", () => { delete d.dataset.id; sync(); });
});

// Menu móvil
const sheet = $("#sheet"), mb = $("#menuBtn");
mb.onclick = ()=>{ const o = sheet.classList.toggle("open"); mb.setAttribute("aria-expanded", o); };
sheet.addEventListener("click", e=>{ if(e.target.tagName==="A") { sheet.classList.remove("open"); mb.setAttribute("aria-expanded", false); } });

// Header + animaciones de entrada
const hdr = $("header");
addEventListener("scroll", ()=>hdr.classList.toggle("scrolled", scrollY>8), {passive:true});
const io = new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); setTimeout(()=>en.target.style.transitionDelay="0ms",1000);} }), {threshold:.12});
$$(".rv").forEach((el,i)=>{ el.style.transitionDelay = (el.classList.contains("card")? (i%4)*70 : 0)+"ms"; io.observe(el); });
$("#y").textContent = new Date().getFullYear();
sync();
