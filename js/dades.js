/* ===========================================================================
   CONFIGURACIÓ DEL JOC
   Regles i connexió amb el full de Google. Les cartes són a cartes.js.
   =========================================================================== */
var CONFIG_JOC = {
  nom: "UWCL Stars",
  temporada: "2026/27",
  descripcio: "{cromos} cromos de les {grups} plantilles de la Champions femenina 2026/27. Obre sobres, omple l'àlbum i munta el teu onze.",

  // Adreça de l'aplicació web de Google Apps Script (acaba en /exec).
  // Buida = mode local: la partida només es desa al navegador.
  urlServidor: "https://script.google.com/macros/s/AKfycbxUkwQGPgpFNexwnC92MSwJqiou2DyHByEqDfzh1Lo5pfTs6rERlSm-RoOtFaGIrCuZYQ/exec",

  // Mode local: gemmes que rep cada codi en entrar.
  // Amb servidor, les gemmes surten de la pestanya «Sessions» del full.
  gemmesInicials: 20,
  preuSobre: 1,
  cartesPerSobre: 5,

  // Butlletes de cada carta segons la raresa.
  // Amb 277 bronze, 110 plata, 40 or i 10 llegendes surt per carta extreta:
  // bronze 70,2%, plata 23,7%, or 5,6%, llegenda 0,51%.
  butlletesPerRaresa: { bronze: 20, plata: 17, or: 11, llegenda: 4 },

  // A la partida de classe no hi ha ajudes. Es proven al laboratori.
  garantia: null,         // exemple: { raresa: "llegenda", cadaSobres: 40 }
  repetidesPerCanvi: 0,   // exemple: 20

  // Mode local: mostra el laboratori. Amb servidor, l'activa el professor
  // des de la pestanya «Configuració» del full.
  laboratoriLocal: true,

  // Només en mode local: permet esborrar la partida per provar.
  permetReiniciar: true,
};

// Categories dels cromos (al futbol, les posicions), en l'ordre en què surten
// a la banqueta. Al camp es dibuixen al revés: l'última, a dalt.
var POSICIONS_JOC = {
  POR: "Portera",
  DEF: "Defensa",
  MIG: "Migcampista",
  DAV: "Davantera",
};
var POSICIONS_PLURAL_JOC = { POR: "Porteres", DEF: "Defenses", MIG: "Migcampistes", DAV: "Davanteres" };

// Formacions possibles: quantes places hi ha de cada categoria.
// Totes han de sumar el mateix (aquí, 11).
var FORMACIONS_JOC = {
  "4-3-3": { POR: 1, DEF: 4, MIG: 3, DAV: 3 },
  "4-4-2": { POR: 1, DEF: 4, MIG: 4, DAV: 2 },
  "3-5-2": { POR: 1, DEF: 3, MIG: 5, DAV: 2 },
  "3-4-3": { POR: 1, DEF: 3, MIG: 4, DAV: 3 },
};

// Noms de les rareses. Els colors són a css/estil.css.
var RARESES_JOC = { bronze: "Bronze", plata: "Plata", or: "Or", llegenda: "Llegenda" };

if (typeof FILES_CARTES === "undefined" && typeof require === "function") {
  var _c = require("./cartes.js");
  var FILES_CARTES = _c.FILES_CARTES;
  var CLUBS_JOC = _c.CLUBS_JOC;
}

var CARTES_JOC = FILES_CARTES.map(function (f, i) {
  return { id: f[0], num: i + 1, club: f[1], pos: f[2], dorsal: f[3], nom: f[4], valor: f[5], raresa: f[6], butlletes: f[7] };
});

if (typeof module === "object" && module.exports) {
  module.exports = { CONFIG_JOC: CONFIG_JOC, CLUBS_JOC: CLUBS_JOC, POSICIONS_JOC: POSICIONS_JOC, FORMACIONS_JOC: FORMACIONS_JOC, RARESES_JOC: RARESES_JOC, CARTES_JOC: CARTES_JOC };
}
