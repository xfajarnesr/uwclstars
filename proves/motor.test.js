// Proves del motor: node proves/motor.test.js
const assert = require("assert");
const M = require("../js/motor.js");
const D = require("../js/dades.js");

// 1. Mostra real del prototip
const bossa = M.creaBossa(D.CARTES_JOC, D.CONFIG_JOC);
const pr = M.probabilitats(bossa, D.CONFIG_JOC);
console.log("Cartes:", D.CARTES_JOC.length, "Butlletes totals:", bossa.total);
for (const [k, v] of Object.entries(pr))
  console.log(k.padEnd(9), "cartes", String(v.cartes).padStart(3), "butlletes", String(v.butlletes).padStart(5),
    "per carta", (v.perCarta * 100).toFixed(2) + "%", "per sobre", (v.perSobre * 100).toFixed(1) + "%");

// 2. Les freqüències observades coincideixen amb butlletes/total
const atzar = M.creaAtzar(12345);
const N = 2000000, comptes = new Array(D.CARTES_JOC.length).fill(0);
for (let i = 0; i < N; i++) comptes[M.sorteja(bossa, atzar)]++;
let pitjor = 0;
D.CARTES_JOC.forEach((c, i) => {
  const p = M.butlletesDe(c, D.CONFIG_JOC) / bossa.total;
  const z = Math.abs(comptes[i] - N * p) / Math.sqrt(N * p * (1 - p));
  pitjor = Math.max(pitjor, z);
});
console.log("Desviació màxima (z) en 2 M de sorteigs:", pitjor.toFixed(2));
assert(pitjor < 4.5, "Una carta surt amb una freqüència incompatible amb les seves butlletes");

// 3. Una partida: gemmes, comptes i repetides quadren
{
  const a = M.creaAtzar(7), e = M.estatInicial(D.CONFIG_JOC);
  let oberts = 0, r;
  while ((r = M.obreSobre(e, bossa, D.CONFIG_JOC, a))) { oberts++; assert.equal(r.length, 5); }
  assert.equal(oberts, 20); assert.equal(e.gemmes, 0); assert.equal(e.historial.length, 20);
  const tots = Object.values(e.coleccio).reduce((s, x) => s + x, 0);
  assert.equal(tots, 100);
  assert.equal(e.repetides, 100 - Object.keys(e.coleccio).length);
  assert.equal(M.obreSobre(e, bossa, D.CONFIG_JOC, a), null);
}

// 4. La mateixa llavor dona el mateix resultat
{
  const f = () => { const a = M.creaAtzar(99), e = M.estatInicial(D.CONFIG_JOC); M.obreSobre(e, bossa, D.CONFIG_JOC, a); return e.historial[0].join(); };
  assert.equal(f(), f());
}

// 5. La garantia no falla mai
{
  const cfg = { ...D.CONFIG_JOC, gemmesInicials: 20000, garantia: { raresa: "llegenda", cadaSobres: 40 } };
  const a = M.creaAtzar(5), e = M.estatInicial(cfg);
  let sense = 0, max = 0, r;
  const rar = Object.fromEntries(D.CARTES_JOC.map((c) => [c.id, c.raresa]));
  while ((r = M.obreSobre(e, bossa, cfg, a))) {
    if (r.some((x) => rar[x.carta.id] === "llegenda")) sense = 0; else sense++;
    max = Math.max(max, sense);
  }
  assert(max < 40, "Hi ha hagut 40 sobres seguits sense llegenda");
}

// 6. El canvi de repetides funciona i no regala res
{
  const cfg = { ...D.CONFIG_JOC, repetidesPerCanvi: 3 };
  const e = M.estatInicial(cfg); e.repetides = 2;
  assert.equal(M.canviaRepetides(e, "c1", cfg), false);
  e.repetides = 4;
  assert.equal(M.canviaRepetides(e, "c1", cfg), true);
  assert.equal(e.repetides, 1); assert.equal(e.coleccio.c1, 1);
  e.repetides = 5;
  assert.equal(M.canviaRepetides(e, "c1", cfg), false);
}

// 7. Dades dolentes: error clar
assert.throws(() => M.creaBossa([{ id: "a", nom: "X", raresa: "bronze", butlletes: 0 }], D.CONFIG_JOC), /com a mínim 1 butlleta/);
assert.throws(() => M.creaBossa([{ id: "a", nom: "X", raresa: "bronze" }, { id: "a", nom: "Y", raresa: "bronze" }], D.CONFIG_JOC), /repetit/);

// 8. Base completa de 400 cartes: reprodueix els números de la proposta
const sint = [];
const reparteix = { bronze: [240, 60], plata: [110, 45], or: [40, 28], llegenda: [10, 10] };
for (const [raresa, [n, butlletes]] of Object.entries(reparteix))
  for (let i = 0; i < n; i++) sint.push({ id: raresa + i, nom: raresa + i, raresa, butlletes });
const base = { ...D.CONFIG_JOC, garantia: null, repetidesPerCanvi: 0 };
const b400 = M.creaBossa(sint, base);
const p400 = M.probabilitats(b400, base);
console.log("\n400 cartes:", Object.entries(p400).map(([k, v]) => k + " " + (v.perCarta * 100).toFixed(2) + "%").join(", "),
  "| sobre amb llegenda", (p400.llegenda.perSobre * 100).toFixed(2) + "%");
const escenaris = [
  ["Sense ajuda", { garantia: null, repetidesPerCanvi: 0 }],
  ["Garantia cada 40", { garantia: { raresa: "llegenda", cadaSobres: 40 }, repetidesPerCanvi: 0 }],
  ["Garantia + canvi de 20", { garantia: { raresa: "llegenda", cadaSobres: 40 }, repetidesPerCanvi: 20 }],
];
for (const [nom, canvis] of escenaris) {
  const t0 = Date.now();
  const s = M.simula(b400, { ...base, ...canvis }, { jugadors: 1000, llavor: 11, raresaObjectiu: "llegenda" });
  console.log(nom.padEnd(24), "àlbum: mediana", s.album.mediana, "p10", s.album.p10, "p90", s.album.p90,
    "| 1a llegenda: mediana", s.primera.mediana, "mitjana", s.primera.mitjana.toFixed(1), "p90", s.primera.p90,
    "|", Date.now() - t0, "ms");
}
const s = M.simula(b400, base, { jugadors: 2000, llavor: 3, raresaObjectiu: "llegenda" });
const teo = 1 / p400.llegenda.perSobre;
assert(Math.abs(s.primera.mitjana - teo) / teo < 0.08, "La simulació no quadra amb la teoria");

// 9. Prototip: què passa amb 20 sobres
{
  const a = M.creaAtzar(2026);
  let cap = 0, albumMitja = 0, J = 20000;
  for (let j = 0; j < J; j++) {
    const e = M.estatInicial(D.CONFIG_JOC);
    while (M.obreSobre(e, bossa, D.CONFIG_JOC, a));
    if (!D.CARTES_JOC.some((c) => c.raresa === "llegenda" && e.coleccio[c.id])) cap++;
    albumMitja += Object.keys(e.coleccio).length;
  }
  console.log("\nPrototip amb 20 sobres: sense cap llegenda", (cap / J * 100).toFixed(1) + "%",
    "| cartes diferents de mitjana", (albumMitja / J).toFixed(1), "de", D.CARTES_JOC.length);
}
console.log("\nTotes les proves han passat.");
