/* Información extra para las fichas de producto de los PDF de revendedores.
   Nombres, precios y beneficios salen de js/productos.js (única fuente).
   - que:     qué es el producto (descripción objetiva, sin promesas ni dosis)
   - vial:    tamaño del frasco
   - lab:     análisis de laboratorio SOLO si el certificado coincide con esta presentación
              (verificado el 30/09/2026). Si no hay, dejar null: no inventar. */
const FICHAS = {
  tr120: {
    que: "Péptido de acción dual sobre los receptores GIP y GLP-1, dos hormonas que participan en la regulación del apetito y del azúcar en sangre.",
    vial: "Vial de 10 ml", lab: null },
  tr100: {
    que: "Péptido de acción dual sobre los receptores GIP y GLP-1, dos hormonas que participan en la regulación del apetito y del azúcar en sangre.",
    vial: "Vial de 10 ml", lab: null },
  rt60: {
    que: "Péptido de triple acción sobre los receptores GIP, GLP-1 y glucagón. Es una de las moléculas más estudiadas hoy en el área metabólica.",
    vial: "Vial de 3 ml",
    lab: { quien: "Janoshik Analytical · test #169206", datos: ["Contenido: 59,00 mg", "Pureza: 99,56 %"] } },
  ghk100: {
    que: "Tripéptido (glicina-histidina-lisina) unido a cobre. Está presente naturalmente en el organismo y se asocia a la producción de colágeno y la regeneración de la piel y el cabello.",
    vial: "Vial de 3 ml",
    lab: { quien: "Freedom Diagnostics · #2606260524", datos: ["Contenido: 108,59 mg", "Pureza: 99,32 %"] } },
  klow80: {
    que: "Combinación de cuatro péptidos en un solo frasco: GHK-Cu 50 mg, BPC-157 10 mg, TB-500 10 mg y KPV 10 mg, pensada para la recuperación de tejidos.",
    vial: "Vial de 3 ml",
    lab: { quien: "Janoshik Analytical · test #169213", datos: ["GHK-Cu: 49,69 mg", "BPC-157: 11,38 mg", "TB-500: 11,15 mg", "KPV: 10,32 mg"] } },
  nad: {
    que: "Coenzima presente en todas las células del cuerpo, clave en la producción de energía celular y en la reparación del ADN. Sus niveles disminuyen con la edad.",
    vial: "Vial de 10 ml", lab: null },
  cjc: {
    que: "Combinación de CJC-1295 sin DAC (análogo de GHRH) e ipamorelina (secretagogo de hormona de crecimiento). Juntos estimulan la liberación natural de hormona de crecimiento.",
    vial: "Vial de 3 ml",
    lab: { quien: "Janoshik Analytical · test #169217", datos: ["CJC-1295: 4,95 mg", "Ipamorelina: 4,93 mg"] } },
  tesa: {
    que: "Análogo de la hormona liberadora de hormona de crecimiento (GHRH). Estimula la liberación natural de hormona de crecimiento y se estudia especialmente por su efecto sobre la grasa visceral.",
    vial: "Vial de 3 ml", lab: null },
};
