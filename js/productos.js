/* =====================================================================
   NEXORA LABS — DATOS DE LA WEB
   Este es el único archivo que necesitás tocar para:
     • cambiar el número de WhatsApp
     • cambiar precios, nombres, descripciones o beneficios
     • agregar, ocultar o quitar productos
   Cómo agregar un producto:
     1) Guardá la foto del frasco (fondo transparente) en assets/productos/  (ej: bpc157.webp)
     2) Copiá un bloque { ... } de la lista PRODUCTS, pegalo y cambiá los datos.
        - id:     identificador único, sin espacios (ej: "bpc157")
        - img:    nombre del archivo de la foto
        - price:  número SIN puntos (2200 = Bs 2.200)
        - cat:    una de las claves de CATS (met, rec, est, bien)
        - oculto: true  → no se muestra en la web (opcional)
   ===================================================================== */

// Número de WhatsApp: código de país + número, sin + ni espacios
const WHATSAPP = "59157022195";

// Categorías (filtros del catálogo). Clave: nombre visible.
const CATS = { met:"Metabólico", rec:"Recuperación", est:"Estética", bien:"Bienestar" };
// Productos, en el orden en que aparecen en la web.
const PRODUCTS_ALL = [
  { id:"tr120", img:"tr120.webp", name:"TR120", sub:"Tirzepatide", mg:"120 mg", price:2200, cat:"met",
    tag:"Control del peso más allá de tus límites. Un péptido avanzado que actúa sobre múltiples vías metabólicas.",
    b:["Control del apetito","Regula el azúcar en sangre","Favorece la pérdida de grasa","Mejora la salud metabólica","Apoya la salud cardiovascular","Aumenta la energía y el bienestar"] },
  { id:"tr100", img:"tr100.webp", name:"TR100", sub:"Tirzepatide", mg:"100 mg", price:1800, cat:"met",
    tag:"Control del peso, una vida más equilibrada. Actúa sobre múltiples vías metabólicas.",
    b:["Control del apetito","Regula el azúcar en sangre","Favorece la pérdida de grasa","Mejora la salud metabólica","Apoya la salud cardiovascular","Aumenta la energía y el bienestar"] },
  { id:"rt60", img:"rt60.webp", name:"RT60", sub:"Retatrutide", mg:"60 mg", price:1900, cat:"met",
    tag:"Un nuevo nivel en control de peso y salud metabólica.",
    b:["Control del apetito","Triple acción metabólica","Potente control del peso","Mejora la composición corporal","Acelera el gasto calórico"] },
  { id:"ghk100", img:"ghk100.webp", name:"GHK-Cu100", sub:"Copper Tripeptide", mg:"100 mg", price:800, cat:"est",
    tag:"Belleza desde la célula. Ciencia que realza tu belleza natural.",
    b:["Cabello: estimula el crecimiento y reduce la caída","Piel: colágeno, firmeza y elasticidad","Ayuda a la reparación celular","Uñas: fortalece y acelera el crecimiento"] },
  { id:"klow80", img:"klow80.webp", name:"KLOW80", sub:"Multi-Peptide Blend", mg:"80 mg", price:1400, cat:"rec",
    tag:"Recupera. Construye. Rinde mejor. Una combinación avanzada de péptidos para un cuerpo más fuerte, sano y resiliente.",
    b:["Soporte en la recuperación muscular","Salud articular","Mayor rendimiento físico","Salud de la piel y tejidos","Apoyo inmunológico"] },
  { id:"nad", img:"nad.webp", name:"NAD+", sub:"Nicotinamide Adenine Dinucleotide", mg:"1000 mg", price:900, cat:"bien",
    tag:"Energía celular, una vida extraordinaria. Activa tu salud desde el nivel celular.",
    b:["Más energía","Mejora la función cognitiva","Apoya la reparación del ADN","Fortalece el sistema inmunológico","Salud cardiovascular","Envejecimiento saludable"] },
  { id:"cjc", img:"cjc.webp", name:"CJC-1295", sub:"No DAC + IPA", mg:"5 mg + 5 mg", price:1000, cat:"rec",
    tag:"Sin DAC, acción sinérgica. Liberación natural de hormona de crecimiento.",
    b:["Estimula la hormona de crecimiento","Aumenta la masa muscular","Reduce la grasa corporal","Mejora la calidad del sueño","Salud articular y tendinosa","Recuperación más rápida"] },
  { id:"tesa", img:"tesa.webp", name:"Tesamorelin", sub:"GHRH análogo", mg:"20 mg", price:1400, cat:"rec",
    tag:"Estimula de forma natural la liberación de la hormona de crecimiento.",
    b:["Estimula la hormona de crecimiento","Ayuda a reducir la grasa visceral","Preserva y aumenta la masa muscular","Mejora la calidad del sueño","Fortalece el sistema inmunológico","Salud ósea y articular"] },
];

const PRODUCTS = PRODUCTS_ALL.filter(p => !p.oculto);
