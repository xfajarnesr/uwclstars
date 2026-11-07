/* ===========================================================================
   MOTOR DE SOBRES
   Tot l'atzar del joc passa per aquest fitxer. No toca la pantalla.

   Regla central: una carta amb el doble de butlletes surt el doble de sovint.
   P(carta) = butlletes de la carta / total de butlletes

   Si demanes a una IA que canviï l'estil del joc, digue-li que NO toqui aquest
   fitxer. Les regles es canvien a la configuració (dades.js).
   =========================================================================== */
(function (arrel, fabrica) {
  if (typeof module === "object" && module.exports) module.exports = fabrica();
  else arrel.Motor = fabrica();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ---- Atzar ---------------------------------------------------------- */

  // Generador amb llavor: la mateixa llavor repeteix la mateixa seqüència.
  function creaAtzar(llavor) {
    var s = llavor === undefined ? llavorNova() : llavor >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function llavorNova() {
    var c = typeof globalThis !== "undefined" ? globalThis.crypto : null;
    if (c && c.getRandomValues) return c.getRandomValues(new Uint32Array(1))[0];
    return (Math.random() * 4294967296) >>> 0;
  }

  /* ---- Bossa de butlletes ------------------------------------------------- */

  function butlletesDe(carta, config) {
    if (Number.isFinite(carta.butlletes)) return carta.butlletes;
    return config.butlletesPerRaresa[carta.raresa];
  }

  // Comprova les dades i prepara la bossa de la qual es treuen les cartes.
  function creaBossa(cartes, config) {
    if (!cartes.length) throw new Error("No hi ha cap carta a la base de dades.");
    var vistos = {};
    var acumulat = [];
    var total = 0;
    var perRaresa = {};
    cartes.forEach(function (carta, i) {
      if (vistos[carta.id]) throw new Error("Identificador repetit: " + carta.id);
      vistos[carta.id] = true;
      var c = butlletesDe(carta, config);
      if (!Number.isInteger(c) || c < 1)
        throw new Error("La carta " + carta.nom + " ha de tenir com a mínim 1 butlleta.");
      total += c;
      acumulat.push(total);
      if (!perRaresa[carta.raresa]) perRaresa[carta.raresa] = { indexs: [], acumulat: [], total: 0 };
      var r = perRaresa[carta.raresa];
      r.total += c;
      r.indexs.push(i);
      r.acumulat.push(r.total);
    });
    return { cartes: cartes, acumulat: acumulat, total: total, perRaresa: perRaresa };
  }

  function cerca(acumulat, x) {
    var a = 0;
    var b = acumulat.length - 1;
    while (a < b) {
      var m = (a + b) >> 1;
      if (x < acumulat[m]) b = m;
      else a = m + 1;
    }
    return a;
  }

  // Treu una butlleta. La butlleta torna a la bossa: cada sorteig és independent.
  function sorteja(bossa, atzar) {
    return cerca(bossa.acumulat, atzar() * bossa.total);
  }

  function sortejaRaresa(bossa, raresa, atzar) {
    var r = bossa.perRaresa[raresa];
    if (!r) throw new Error("No hi ha cartes de raresa " + raresa + ".");
    return r.indexs[cerca(r.acumulat, atzar() * r.total)];
  }

  // Probabilitats teòriques: el que el joc diu que passa.
  function probabilitats(bossa, config) {
    var mida = config.cartesPerSobre;
    var res = {};
    Object.keys(bossa.perRaresa).forEach(function (raresa) {
      var r = bossa.perRaresa[raresa];
      var p = r.total / bossa.total;
      res[raresa] = {
        cartes: r.indexs.length,
        butlletes: r.total,
        perCarta: p,
        perSobre: 1 - Math.pow(1 - p, mida),
      };
    });
    return res;
  }

  /* ---- Partida d'un jugador -------------------------------------------- */

  function estatInicial(config) {
    return {
      gemmes: config.gemmesInicials,
      sobres: 0,
      coleccio: {},        // id de carta -> quantes en tens
      repetides: 0,        // repetides disponibles per canviar
      senseGarantia: 0,    // sobres seguits sense la raresa garantida
      historial: [],       // llista de sobres oberts
    };
  }

  // Obre un sobre. Retorna les cartes o null si no queden gemmes.
  function obreSobre(estat, bossa, config, atzar) {
    if (estat.gemmes < config.preuSobre) return null;
    estat.gemmes -= config.preuSobre;
    estat.sobres += 1;

    var g = config.garantia;
    var indexs = [];
    var teGarantida = false;
    for (var j = 0; j < config.cartesPerSobre; j++) {
      var darrera = j === config.cartesPerSobre - 1;
      var forca = g && g.cadaSobres > 0 && darrera && !teGarantida && estat.senseGarantia + 1 >= g.cadaSobres;
      var i = forca ? sortejaRaresa(bossa, g.raresa, atzar) : sorteja(bossa, atzar);
      if (g && bossa.cartes[i].raresa === g.raresa) teGarantida = true;
      indexs.push(i);
    }
    estat.senseGarantia = teGarantida ? 0 : estat.senseGarantia + 1;

    var resultat = indexs.map(function (i) {
      var carta = bossa.cartes[i];
      var abans = estat.coleccio[carta.id] || 0;
      estat.coleccio[carta.id] = abans + 1;
      if (abans > 0) estat.repetides += 1;
      return { carta: carta, nova: abans === 0, tens: abans + 1 };
    });
    estat.historial.push(resultat.map(function (r) { return r.carta.id; }));
    return resultat;
  }

  // Canvia repetides per una carta concreta que falta.
  function canviaRepetides(estat, idCarta, config) {
    var cost = config.repetidesPerCanvi;
    if (!cost || estat.repetides < cost || estat.coleccio[idCarta]) return false;
    estat.repetides -= cost;
    estat.coleccio[idCarta] = 1;
    return true;
  }

  /* ---- Simulació de molts jugadors ------------------------------------- */

  // Quants sobres necessita un jugador per acabar l'àlbum i per a la primera
  // carta de la raresa indicada. L'estratègia de canvi demana sempre la carta
  // més rara que falta.
  function unJugador(bossa, config, atzar, raresaObjectiu, topall) {
    var n = bossa.cartes.length;
    var te = new Uint8Array(n);
    var falten = n;
    var sobres = 0;
    var repetides = 0;
    var sense = 0;
    var primera = null;
    var g = config.garantia;
    var cost = config.repetidesPerCanvi || 0;
    var mida = config.cartesPerSobre;
    var ordre = bossa.ordreRaresa;
    var cursor = 0;

    while (falten > 0 && sobres < topall) {
      sobres += 1;
      var ambGarantida = false;
      for (var j = 0; j < mida; j++) {
        var forca = g && g.cadaSobres > 0 && j === mida - 1 && !ambGarantida && sense + 1 >= g.cadaSobres;
        var i = forca ? sortejaRaresa(bossa, g.raresa, atzar) : sorteja(bossa, atzar);
        var raresa = bossa.cartes[i].raresa;
        if (g && raresa === g.raresa) ambGarantida = true;
        if (raresa === raresaObjectiu && primera === null) primera = sobres;
        if (te[i]) repetides += 1;
        else { te[i] = 1; falten -= 1; }
      }
      sense = ambGarantida ? 0 : sense + 1;
      if (cost) {
        while (repetides >= cost && falten > 0) {
          while (te[ordre[cursor]]) cursor += 1;
          te[ordre[cursor]] = 1;
          falten -= 1;
          repetides -= cost;
        }
      }
    }
    return { album: falten === 0 ? sobres : null, primera: primera };
  }

  function resum(valors) {
    if (!valors.length) return { n: 0, mitjana: null, mediana: null, p10: null, p90: null };
    var v = valors.slice().sort(function (a, b) { return a - b; });
    var q = function (p) { return v[Math.min(v.length - 1, Math.floor(p * v.length))]; };
    var suma = v.reduce(function (s, x) { return s + x; }, 0);
    return { n: v.length, mitjana: suma / v.length, mediana: q(0.5), p10: q(0.1), p90: q(0.9) };
  }

  function simula(bossa, config, opcions) {
    var o = opcions || {};
    var jugadors = o.jugadors || 1000;
    var topall = o.topall || 100000;
    var raresaObjectiu = o.raresaObjectiu || (config.garantia && config.garantia.raresa);
    var atzar = creaAtzar(o.llavor);
    bossa.ordreRaresa = bossa.cartes
      .map(function (_, i) { return i; })
      .sort(function (a, b) { return butlletesDe(bossa.cartes[a], config) - butlletesDe(bossa.cartes[b], config); });
    var album = [];
    var primera = [];
    var sensePrimera = 0;
    for (var k = 0; k < jugadors; k++) {
      var r = unJugador(bossa, config, atzar, raresaObjectiu, topall);
      if (r.album !== null) album.push(r.album);
      if (r.primera !== null) primera.push(r.primera);
      else sensePrimera += 1;
    }
    return {
      jugadors: jugadors,
      album: resum(album),
      primera: resum(primera),
      sensePrimera: sensePrimera,
      valorsAlbum: album,
      valorsPrimera: primera,
    };
  }

  return {
    creaAtzar: creaAtzar,
    butlletesDe: butlletesDe,
    creaBossa: creaBossa,
    sorteja: sorteja,
    probabilitats: probabilitats,
    estatInicial: estatInicial,
    obreSobre: obreSobre,
    canviaRepetides: canviaRepetides,
    simula: simula,
    resum: resum,
  };
});
