/* ===========================================================================
   PANTALLES DEL JOC
   Aquest fitxer només dibuixa i reacciona. L'atzar el decideix motor.js
   i la connexió amb el full de Google, servidor.js.
   =========================================================================== */
(function () {
  "use strict";

  var C = CONFIG_JOC;
  var bossa = Motor.creaBossa(CARTES_JOC, C);
  var perId = {};
  CARTES_JOC.forEach(function (c) { perId[c.id] = c; });
  var atzar = Motor.creaAtzar();
  var CLAU = "uwcl-stars:";
  // Tot el que és propi del futbol és a dades.js: posicions, formacions i rareses.
  var ORDRE_POS = Object.keys(POSICIONS_JOC);
  var PLURAL_POS = POSICIONS_PLURAL_JOC;
  var NOM_RARESA = RARESES_JOC;
  var RARESES = ["llegenda", "or", "plata", "bronze"];
  var FORMACIONS = FORMACIONS_JOC;
  var MIDA_EQUIP = (function () { var f = FORMACIONS[Object.keys(FORMACIONS)[0]]; return Object.keys(f).reduce(function (a, k) { return a + f[k]; }, 0); })();
  function posDe(clau) { return clau.split(":")[0]; }
  var TOTAL_RARESA = {};
  CARTES_JOC.forEach(function (c) { TOTAL_RARESA[c.raresa] = (TOTAL_RARESA[c.raresa] || 0) + 1; });
  var CLUBS = Object.keys(CLUBS_JOC);
  var LENT = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var FITES = [
    { id: "primer", nom: "Primer sobre", desc: "Obre el teu primer sobre.", fet: function (x) { return x.sobres >= 1; } },
    { id: "or", nom: "Brillantor", desc: "Aconsegueix el primer cromo d'or.", fet: function (x) { return x.tinc.or >= 1; } },
    { id: "llegenda", nom: "Llegenda", desc: "Aconsegueix una de les " + (TOTAL_RARESA.llegenda || 0) + " llegendes.", fet: function (x) { return x.tinc.llegenda >= 1; } },
    { id: "c50", nom: "Mig centenar", desc: "Tingues 50 cromos diferents.", fet: function (x) { return x.diferents >= 50; } },
    { id: "c100", nom: "Centenar", desc: "Tingues 100 cromos diferents.", fet: function (x) { return x.diferents >= 100; } },
    { id: "c200", nom: "Gran col·lecció", desc: "Tingues 200 cromos diferents.", fet: function (x) { return x.diferents >= 200; } },
    { id: "gira", nom: "Gira europea", desc: "Tingues almenys un cromo de cada un dels " + CLUBS.length + " clubs.", fet: function (x) { return x.clubsAmb === CLUBS.length; } },
    { id: "club", nom: "Plantilla completa", desc: "Completa tots els cromos d'un club.", fet: function (x) { return x.clubsComplets >= 1; } },
    { id: "onze", nom: "Onze titular", desc: "Omple les " + MIDA_EQUIP + " posicions del teu equip.", fet: function (x) { return x.onzeN === MIDA_EQUIP; } },
    { id: "onze80", nom: "Nivell Champions", desc: "Arriba a 80 de valor d'equip.", fet: function (x) { return x.valorOnze >= 80; } },
    { id: "muralla", nom: "Línia d'or", desc: "Una línia completa de l'equip (de més d'una plaça) amb cromos d'or o llegenda.", fet: function (x) { return x.muralla; } },
    { id: "unclub", nom: "Fidelitat", desc: "Equip complet amb cromos d'un sol club.", fet: function (x) { return x.unClub; } },
    { id: "rep5", nom: "Quina mania", desc: "Tingues 5 còpies d'un mateix cromo.", fet: function (x) { return x.maxCopies >= 5; } },
    { id: "obrir100", nom: "100 cromos oberts", desc: "Obre 20 sobres en total.", fet: function (x) { return x.sobres >= 20; } },
  ];

  var app = document.getElementById("app");
  var s = {
    codi: null, nom: "", estat: null, onze: {}, formacio: Object.keys(FORMACIONS_JOC)[0], fitesVistes: [], atorgades: 0,
    vista: "sobres", darrer: null, lloc: null, suplent: null, detall: null,
    filtre: { club: "tots", raresa: "totes", mostra: "tots" },
    error: "", carregant: false, confirma: false, sincro: Servidor.actiu ? "ok" : "local", sincroError: "",
    classe: null, ordreClasse: "valorOnze", avisos: [], laboratori: false,
  };
  var temporitzadors = [];
  var esperaOnze = null;

  /* ---- Desar ---------------------------------------------------------- */
  function llegeix(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function escriu(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* el joc continua sense desar */ } }
  function esborra(k) { try { localStorage.removeItem(k); } catch (e) { /* res */ } }

  function partida() {
    return { estat: s.estat, onze: s.onze, formacio: s.formacio, fitesVistes: s.fitesVistes };
  }

  function desaLocal() {
    if (!s.codi) return;
    escriu(CLAU + s.codi, JSON.stringify(partida()));
    escriu(CLAU + "darrer", s.codi);
  }

  function carregaLocal(codi) {
    try {
      var d = JSON.parse(llegeix(CLAU + codi));
      if (d && d.estat) return d;
    } catch (e) { /* partida il·legible */ }
    return null;
  }

  function sincronitza() {
    desaLocal();
    if (!Servidor.actiu) return;
    marcaSincro("desant");
    var codi = s.codi;
    Servidor.desa(codi, partida(), resumPartida()).then(function (d) {
      if (codi !== s.codi) return;
      if (d.atorgades !== undefined && d.atorgades !== s.atorgades) { s.atorgades = d.atorgades; actualitzaGemmes(); }
      marcaSincro("ok");
    }).catch(function (e) {
      if (codi !== s.codi) return;
      s.sincroError = e.delServidor ? e.message : "";
      marcaSincro(e.delServidor ? "error" : "pendent");
    });
  }

  function marcaSincro(estat) {
    s.sincro = estat;
    var el = document.getElementById("sincro");
    if (el) { el.className = "sincro " + estat; el.textContent = textSincro(); el.title = s.sincroError || ""; }
  }

  function textSincro() {
    return { local: "Mode local", ok: "Desat", desant: "Desant…", pendent: "Sense connexió: es desarà després", error: "Error en desar" }[s.sincro];
  }

  setInterval(function () {
    if (s.codi && Servidor.actiu && (s.sincro === "pendent" || Servidor.hiHaPendents(s.codi))) sincronitza();
  }, 30000);

  /* ---- Càlculs -------------------------------------------------------- */
  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function plural(n, u, m) { return n + " " + (n === 1 ? u : m); }
  function coma(x) { return String(x).replace(".", ","); }
  function textCopies(n) { return n + (n === 1 ? " còpia disponible" : " còpies disponibles"); }
  function colorsClub(carta) {
    var club = CLUBS_JOC[carta.club];
    return "--c1:" + club.color1 + ";--c2:" + club.color2 + ";--ct:" + club.text;
  }

  function actualitzaGemmes() {
    if (!s.estat) return;
    s.estat.gemmes = Math.max(0, s.atorgades - s.estat.sobres * C.preuSobre);
  }

  function llocsFormacio() {
    var f = FORMACIONS[s.formacio];
    var llocs = [];
    ORDRE_POS.slice().reverse().forEach(function (pos) {
      var linia = [];
      for (var i = 0; i < f[pos]; i++) linia.push(pos + ":" + i);
      llocs.push(linia);
    });
    return llocs;
  }

  function valorEquip() {
    var ids = Object.keys(s.onze).map(function (k) { return s.onze[k]; }).filter(Boolean);
    var suma = ids.reduce(function (t, id) { return t + perId[id].valor; }, 0);
    return { mitjana: ids.length ? suma / MIDA_EQUIP : 0, n: ids.length };
  }

  function estadistiques() {
    var e = s.estat;
    var primera = null;
    var oberts = { bronze: 0, plata: 0, or: 0, llegenda: 0 };
    e.historial.forEach(function (sobre, i) {
      sobre.forEach(function (id) {
        var r = perId[id].raresa;
        oberts[r] += 1;
        if (r === "llegenda" && primera === null) primera = i + 1;
      });
    });
    var tinc = { bronze: 0, plata: 0, or: 0, llegenda: 0 };
    var perClub = {};
    var maxCopies = 0;
    Object.keys(e.coleccio).forEach(function (id) {
      var c = perId[id];
      if (!c) return;
      tinc[c.raresa] += 1;
      perClub[c.club] = (perClub[c.club] || 0) + 1;
      maxCopies = Math.max(maxCopies, e.coleccio[id]);
    });
    var totalClub = {};
    CARTES_JOC.forEach(function (c) { totalClub[c.club] = (totalClub[c.club] || 0) + 1; });
    var v = valorEquip();
    var ids = Object.keys(s.onze).map(function (k) { return s.onze[k]; }).filter(Boolean);
    var linies = {};
    Object.keys(s.onze).forEach(function (k) { if (s.onze[k]) (linies[posDe(k)] = linies[posDe(k)] || []).push(s.onze[k]); });
    var muralla = ORDRE_POS.some(function (pos) {
      var n = FORMACIONS[s.formacio][pos];
      var l = linies[pos] || [];
      return n > 1 && l.length === n && l.every(function (id) { var r = perId[id].raresa; return r === "or" || r === "llegenda"; });
    });
    var clubsOnze = {};
    ids.forEach(function (id) { clubsOnze[perId[id].club] = true; });
    return {
      sobres: e.sobres, primera: primera, oberts: oberts, tinc: tinc,
      diferents: Object.keys(e.coleccio).length,
      cromos: e.sobres * C.cartesPerSobre,
      clubsAmb: Object.keys(perClub).length,
      clubsComplets: CLUBS.filter(function (k) { return perClub[k] === totalClub[k]; }).length,
      perClub: perClub, totalClub: totalClub, maxCopies: maxCopies,
      onzeN: v.n, valorOnze: v.mitjana,
      muralla: muralla,
      unClub: v.n === MIDA_EQUIP && Object.keys(clubsOnze).length === 1,
    };
  }

  function resumPartida() {
    var x = estadistiques();
    return { diferents: x.diferents, llegendes: x.tinc.llegenda, valorOnze: Math.round(x.valorOnze * 10) / 10 };
  }

  // Comprova fites noves i les anuncia.
  function revisaFites() {
    if (!s.estat) return;
    var x = estadistiques();
    FITES.forEach(function (f) {
      if (f.fet(x) && s.fitesVistes.indexOf(f.id) < 0) {
        s.fitesVistes.push(f.id);
        avisa("Fita aconseguida: " + f.nom, "es-fita");
      }
    });
  }

  function avisa(text, tipus) {
    var zona = document.getElementById("avisos");
    if (!zona) return;
    var el = document.createElement("div");
    el.className = "avis-flotant " + (tipus || "");
    el.setAttribute("role", "status");
    el.textContent = text;
    zona.appendChild(el);
    setTimeout(function () { el.classList.add("marxa"); }, 3600);
    setTimeout(function () { el.remove(); }, 4200);
  }

  /* ---- Peces ---------------------------------------------------------- */
  function cromo(carta, o) {
    o = o || {};
    var club = CLUBS_JOC[carta.club];
    var marca = o.nova ? '<span class="cromo-marca">Nova</span>' : "";
    var peu = NOM_RARESA[carta.raresa] + (o.tens ? ". " + textCopies(o.tens) : "");
    var etiqueta = o.boto ? "button" : "article";
    var attrs = o.boto ? ' type="button" data-detall="' + carta.id + '" aria-label="' + esc(carta.nom) + ', obre la fitxa"' : "";
    return "<" + etiqueta + ' class="cromo ' + carta.raresa + '" style="' + colorsClub(carta) + '"' + attrs + ">" +
      '<span class="cromo-franja"><span>' + esc(club.curt) + "</span><span>" + carta.num + "</span></span>" + marca +
      '<span class="cromo-imatge"><span class="cromo-valor">' + carta.valor + '</span><span class="cromo-posicio">' + POSICIONS_JOC[carta.pos] + "</span></span>" +
      '<span class="cromo-peu"><span class="cromo-nom">' + esc(carta.nom) + '</span><span class="cromo-copies">' + peu + "</span></span></" + etiqueta + ">";
  }

  function fitxa(carta, atributs, classes, mostraCopies) {
    var n = s.estat.coleccio[carta.id];
    return '<button type="button" class="fitxa ' + carta.raresa + " " + (classes || "") + '" style="' + colorsClub(carta) + '" ' + atributs + ">" +
      '<span class="fitxa-club">' + esc(CLUBS_JOC[carta.club].curt) + "</span>" +
      '<span class="fitxa-cos"><span class="v">' + carta.valor + '</span><span class="n">' + esc(carta.nom) + "</span>" +
      (mostraCopies ? '<span class="x">' + plural(n, "còpia", "còpies") + "</span>" : "") + "</span></button>";
  }

  function paquet() {
    return '<div class="paquet" id="paquet"><span class="t1">' + esc(C.nom) + '</span><span class="t2">' + C.temporada + '</span><span class="t3">' + plural(C.cartesPerSobre, "cromo", "cromos") + "</span></div>";
  }

  /* ---- Entrada -------------------------------------------------------- */
  function vistaEntrada() {
    // Tres cromos de mostra: els de més valor de tres grups diferents.
    var vistos = {};
    var mostra = CARTES_JOC.slice().sort(function (a, b) { return b.valor - a.valor; })
      .filter(function (c) { if (vistos[c.club]) return false; vistos[c.club] = true; return true; }).slice(0, 3);
    return '<main class="pagina entrada"><div>' +
      "<h1>" + esc(C.nom) + "</h1>" +
      '<p class="sub">' + esc(C.descripcio.replace("{cromos}", CARTES_JOC.length).replace("{grups}", CLUBS.length)) + "</p>" +
      '<form class="formulari" id="form-entrada" novalidate>' +
      (s.error ? '<p class="error" role="alert">' + esc(s.error) + "</p>" : "") +
      '<div class="camp"><label for="codi">El teu codi</label><input id="codi" autocomplete="off" autocapitalize="characters" maxlength="12" placeholder="SK42"' + (s.carregant ? " disabled" : "") + '><span class="ajuda">És el codi que t\'ha donat el professor. Amb aquest mateix codi recuperes la partida des de qualsevol ordinador.</span></div>' +
      '<div><button class="boto" type="submit"' + (s.carregant ? " disabled" : "") + ">" + (s.carregant ? "Entrant…" : "Entra al joc") + "</button></div>" +
      "</form></div>" +
      '<div class="mostra" aria-label="Tres cromos de mostra">' + mostra.map(function (c) { return cromo(c); }).join("") + "</div></main>";
  }

  /* ---- Capçalera i peu ------------------------------------------------ */
  function capcalera() {
    var e = s.estat;
    var x = estadistiques();
    var pest = [["sobres", "Sobres"], ["album", "Àlbum"], ["onze", "El meu onze"], ["fites", "Fites"]];
    if (s.laboratori) pest.push(["lab", "Laboratori"]);
    if (Servidor.actiu) pest.push(["classe", "Classe"]);
    var htmlPest = pest.map(function (p) {
      return '<button type="button" class="pestanya" data-vista="' + p[0] + '"' + (s.vista === p[0] ? ' aria-current="page"' : "") + ">" + p[1] + "</button>";
    }).join("");
    return '<header class="cap"><div class="marca">' + esc(C.nom) + '</div>' + (s.nom ? '<div class="qui">' + esc(s.nom) + "</div>" : "") + '<div class="comptadors">' +
      "<span><b>" + e.gemmes + "</b>" + (e.gemmes === 1 ? "gemma" : "gemmes") + "</span>" +
      "<span><b>" + x.diferents + "/" + CARTES_JOC.length + "</b>cromos</span>" +
      '<span id="sincro" class="sincro ' + s.sincro + '">' + textSincro() + "</span>" +
      '</div><nav class="pestanyes" aria-label="Seccions">' + htmlPest + "</nav></header>";
  }

  function peu() {
    var reiniciar = "";
    if (!Servidor.actiu && C.permetReiniciar) {
      reiniciar = s.confirma
        ? '<button type="button" class="boto-discret perill" data-accio="reinicia-si">Esborra la partida de ' + esc(s.codi) + '</button><button type="button" class="boto-discret" data-accio="reinicia-no">Cancel·la</button>'
        : '<button type="button" class="boto-discret" data-accio="reinicia">Torna a començar</button>';
    }
    return '<footer class="peu"><p>Jugues com a <b>' + esc(s.nom || s.codi) + "</b>" + (s.nom ? " (" + esc(s.codi) + ")" : "") + ".</p>" +
      '<button type="button" class="boto-discret" data-accio="surt">Surt</button>' + reiniciar + "</footer>";
  }

  /* ---- Sobres --------------------------------------------------------- */
  function botonsObrir() {
    var g = Math.floor(s.estat.gemmes / C.preuSobre);
    var h = '<div class="accions"><button type="button" class="boto" data-accio="obre" data-n="1" data-bloq>Obre 1 sobre</button>';
    if (g >= 5) h += '<button type="button" class="boto segon" data-accio="obre" data-n="5" data-bloq>Obre 5 sobres</button>';
    else if (g > 1) h += '<button type="button" class="boto segon" data-accio="obre" data-n="' + g + '" data-bloq>Obre els ' + g + " que queden</button>";
    return h + "</div>";
  }

  function vistaSobres() {
    var acabat = s.estat.gemmes < C.preuSobre;
    var h = '<main class="pagina taula">';
    if (s.darrer) {
      h += '<div class="fila-cromos' + (s.darrer.sobres > 1 ? " multi" : "") + '" id="fila">' + s.darrer.cartes.map(function (r, i) {
        return '<div class="volta"><div class="volta-interior' + (s.darrer.vist ? " girada" : "") + '" data-i="' + i + '"><div class="cara">' +
          cromo(r.carta, { nova: r.nova, tens: r.tens }) + '</div><div class="dors"></div></div></div>';
      }).join("") + "</div>";
      h += '<p class="frase" id="frase" aria-live="polite">' + (s.darrer.vist ? fraseSobre(s.darrer.cartes) : "") + "</p>";
      if (!acabat) h += botonsObrir();
    } else if (!acabat) {
      h += '<button type="button" class="sobre-gran" data-accio="obre" data-n="1" aria-label="Obre un sobre per 1 gemma">' + paquet() + "</button>" + botonsObrir() +
        '<p class="ajuda-sobre">Tens ' + plural(s.estat.gemmes, "gemma", "gemmes") + ". Cada sobre costa " + plural(C.preuSobre, "gemma", "gemmes") + " i porta " + plural(C.cartesPerSobre, "cromo", "cromos") + ".</p>";
    }
    if (acabat) h += vistaFinal();
    return h + "</main>";
  }

  function fraseSobre(cartes) {
    var noves = cartes.filter(function (c) { return c.nova; }).length;
    var rares = cartes.filter(function (c) { return c.carta.raresa === "or" || c.carta.raresa === "llegenda"; }).length;
    return plural(noves, "cromo nou", "cromos nous") + " i " + plural(cartes.length - noves, "repetit", "repetits") +
      (rares ? ". " + (rares === 1 ? "Un cromo especial!" : rares + " cromos especials!") : ".");
  }

  function textResultat() {
    var x = estadistiques();
    return [s.codi, "sobres=" + s.estat.sobres, "primera_llegenda=" + (x.primera || "cap"), "diferents=" + x.diferents,
      "bronze=" + x.oberts.bronze, "plata=" + x.oberts.plata, "or=" + x.oberts.or, "llegenda=" + x.oberts.llegenda].join(";");
  }

  function vistaFinal() {
    var x = estadistiques();
    var fet = x.primera ? "La primera llegenda et va sortir al sobre " + x.primera + "." : "En " + plural(s.estat.sobres, "sobre", "sobres") + " no t'ha sortit cap llegenda.";
    var h = '<section class="final"><h2>Se t\'han acabat les gemmes</h2><p>Has obert ' + plural(s.estat.sobres, "sobre", "sobres") + ". " + fet + "</p>" +
      '<div class="xifres"><div><b>' + x.oberts.llegenda + "</b><span>" + (x.oberts.llegenda === 1 ? "llegenda" : "llegendes") + "</span></div>" +
      "<div><b>" + x.oberts.or + "</b><span>d'or</span></div><div><b>" + x.oberts.plata + "</b><span>de plata</span></div><div><b>" + x.oberts.bronze + "</b><span>de bronze</span></div>" +
      "<div><b>" + x.diferents + "</b><span>de " + CARTES_JOC.length + " cromos</span></div></div>";
    if (Servidor.actiu) {
      h += "<p>Tots els teus sobres queden registrats al full del professor. Quan comenci una sessió nova rebràs més gemmes.</p>" +
        '<button type="button" class="boto-discret" data-accio="refresca">Comprova si tens gemmes noves</button>';
    } else {
      h += '<label for="codi-resultat">Copia aquest resultat al full de la classe:</label>' +
        '<input class="codi-resultat" id="codi-resultat" readonly value="' + esc(textResultat()) + '">' +
        '<button type="button" class="boto-discret" data-accio="copia">Copia el resultat</button>';
    }
    return h + "</section>";
  }

  /* ---- Àlbum ---------------------------------------------------------- */
  function vistaAlbum() {
    var e = s.estat;
    var x = estadistiques();
    var f = s.filtre;
    var total = Object.keys(e.coleccio).reduce(function (t, id) { return t + e.coleccio[id]; }, 0);
    var h = '<main class="pagina"><h1 class="titol-seccio">Àlbum</h1>' +
      '<p class="resum-album">Tens ' + plural(total, "cromo", "cromos") + ": " + x.diferents + " de diferents i " + plural(total - x.diferents, "còpia repetida", "còpies repetides") + ".</p>" +
      '<div class="rareses">' + RARESES.map(function (r) {
        return '<span class="raresa-xip ' + r + '"><b>' + x.tinc[r] + "/" + TOTAL_RARESA[r] + "</b> " + NOM_RARESA[r] + "</span>";
      }).join("") + "</div>" +
      '<div class="filtres">' +
      '<div class="camp-petit"><label for="f-club">Club</label><select id="f-club" data-filtre="club"><option value="tots">Tots els clubs</option>' +
      CLUBS.map(function (k) { return '<option value="' + k + '"' + (f.club === k ? " selected" : "") + ">" + esc(CLUBS_JOC[k].nom) + "</option>"; }).join("") + "</select></div>" +
      '<div class="camp-petit"><label for="f-raresa">Raresa</label><select id="f-raresa" data-filtre="raresa"><option value="totes">Totes</option>' +
      RARESES.map(function (r) { return '<option value="' + r + '"' + (f.raresa === r ? " selected" : "") + ">" + NOM_RARESA[r] + "</option>"; }).join("") + "</select></div>" +
      '<div class="camp-petit"><label for="f-mostra">Mostra</label><select id="f-mostra" data-filtre="mostra">' +
      [["tots", "Tots"], ["tinc", "Els que tinc"], ["falten", "Els que em falten"], ["repetits", "Els repetits"]].map(function (o) {
        return '<option value="' + o[0] + '"' + (f.mostra === o[0] ? " selected" : "") + ">" + o[1] + "</option>";
      }).join("") + "</select></div></div>";

    var algun = false;
    CLUBS.forEach(function (k) {
      if (f.club !== "tots" && f.club !== k) return;
      var cartes = CARTES_JOC.filter(function (c) {
        if (c.club !== k) return false;
        if (f.raresa !== "totes" && c.raresa !== f.raresa) return false;
        var n = e.coleccio[c.id] || 0;
        if (f.mostra === "tinc") return n > 0;
        if (f.mostra === "falten") return n === 0;
        if (f.mostra === "repetits") return n > 1;
        return true;
      });
      if (!cartes.length) return;
      algun = true;
      var tens = x.perClub[k] || 0;
      var tot = x.totalClub[k];
      h += '<section class="club" style="' + colorsClub({ club: k }) + '"><div class="club-cap"><h2>' + esc(CLUBS_JOC[k].nom) + "</h2>" +
        '<span class="progres" role="img" aria-label="' + tens + " de " + tot + '"><span style="width:' + (tens / tot * 100).toFixed(1) + '%"></span></span><span>' + tens + " de " + tot + "</span></div>" +
        '<div class="reixa">' + cartes.map(function (c) {
          var n = e.coleccio[c.id];
          return n ? cromo(c, { tens: n, boto: true }) :
            '<div class="buit"><span class="num">' + c.num + '</span><span><span class="nom">' + esc(c.nom) + '</span><span class="pos">' + POSICIONS_JOC[c.pos] + "</span></span></div>";
        }).join("") + "</div></section>";
    });
    if (!algun) h += '<p class="buit-filtre">Cap cromo coincideix amb aquests filtres.</p>';
    return h + "</main>";
  }

  function vistaDetall() {
    var c = perId[s.detall];
    if (!c) return "";
    var n = s.estat.coleccio[c.id] || 0;
    var alOnze = Object.keys(s.onze).some(function (k) { return s.onze[k] === c.id; });
    return '<div class="velo" data-accio="tanca-detall"></div><div class="detall" role="dialog" aria-modal="true" aria-labelledby="detall-nom">' +
      '<div class="detall-cromo">' + cromo(c, { tens: n }) + "</div>" +
      '<div class="detall-info"><h2 id="detall-nom">' + esc(c.nom) + "</h2>" +
      "<dl><dt>Club</dt><dd>" + esc(CLUBS_JOC[c.club].nom) + "</dd><dt>Posició</dt><dd>" + POSICIONS_JOC[c.pos] + "</dd>" +
      "<dt>Dorsal</dt><dd>" + c.dorsal + "</dd><dt>Valor</dt><dd>" + c.valor + "</dd><dt>Raresa</dt><dd>" + NOM_RARESA[c.raresa] + "</dd>" +
      "<dt>Còpies</dt><dd>" + n + "</dd><dt>Al teu onze</dt><dd>" + (alOnze ? "Sí" : "No") + "</dd></dl>" +
      '<div class="accions" style="justify-content:flex-start">' +
      (alOnze ? "" : '<button type="button" class="boto" data-accio="al-onze" data-id="' + c.id + '">Posa-la al meu onze</button>') +
      '<button type="button" class="boto-discret" data-accio="tanca-detall" id="tanca-detall">Tanca</button></div></div></div>';
  }

  /* ---- Onze ----------------------------------------------------------- */
  function posicioActiva() {
    if (s.lloc) return posDe(s.lloc);
    if (s.suplent) return perId[s.suplent].pos;
    return null;
  }

  function vistaOnze() {
    var v = valorEquip();
    var activa = posicioActiva();
    var h = '<main class="pagina"><h1 class="titol-seccio">El meu onze</h1>' +
      '<div class="formacions" role="group" aria-label="Formació">' + Object.keys(FORMACIONS).map(function (f) {
        return '<button type="button" class="xip-formacio" data-formacio="' + f + '" aria-pressed="' + (s.formacio === f) + '">' + f + "</button>";
      }).join("") + "</div>" +
      '<div class="onze-disposicio"><div class="columna-camp"><div class="camp-futbol" id="camp-futbol">';
    llocsFormacio().forEach(function (linia) {
      h += '<div class="linia">';
      linia.forEach(function (clau) {
        var pos = posDe(clau);
        var id = s.onze[clau];
        var apagada = activa && activa !== pos ? "apagada" : "";
        var premut = s.lloc === clau;
        h += '<div class="lloc">' + (id
          ? fitxa(perId[id], 'data-lloc="' + clau + '" aria-pressed="' + premut + '"', apagada)
          : '<button type="button" class="lloc-buit ' + apagada + '" data-lloc="' + clau + '" aria-pressed="' + premut + '">' + POSICIONS_JOC[pos] + "</button>") + "</div>";
      });
      h += "</div>";
    });
    h += '</div><div class="llegenda-colors" aria-label="Color de la qualitat">' +
      RARESES.slice().reverse().map(function (r) { return '<span><i class="punt ' + r + '"></i>' + NOM_RARESA[r] + "</span>"; }).join("") + "</div></div>" +
      '<div class="panell"><div class="valor-equip"><b>' + (v.n ? coma(v.mitjana.toFixed(1)) : "0") + "</b><span>valor de l'equip, " + v.n + " de " + MIDA_EQUIP + " places</span></div>" +
      '<div class="accions" style="justify-content:flex-start"><button type="button" class="boto" data-accio="millor">Posa les millors</button>' +
      (s.lloc && s.onze[s.lloc] ? '<button type="button" class="boto-discret" data-accio="treu">Envia-la a la banqueta</button>' : "") + "</div>" +
      vistaBanqueta(activa) + "</div></div></main>";
    return h;
  }

  function vistaBanqueta(activa) {
    var alCamp = {};
    Object.keys(s.onze).forEach(function (k) { if (s.onze[k]) alCamp[s.onze[k]] = true; });
    var ajuda = s.lloc ? "Tria qui entra al camp." : s.suplent ? "Toca la posició del camp on ha de jugar." : "Toca una suplent i després una posició del camp, o al revés, per fer el canvi.";
    var h = "<h2>Suplents</h2><p>" + ajuda + "</p>";
    var algun = false;
    ORDRE_POS.forEach(function (pos) {
      if (activa && activa !== pos) return;
      var cand = CARTES_JOC.filter(function (c) { return c.pos === pos && s.estat.coleccio[c.id] && !alCamp[c.id]; })
        .sort(function (a, b) { return b.valor - a.valor; });
      if (!cand.length) return;
      algun = true;
      h += '<div class="grup-banqueta"><h3>' + PLURAL_POS[pos] + '</h3><div class="banqueta">' + cand.map(function (c) {
        return fitxa(c, 'data-suplent="' + c.id + '" aria-pressed="' + (s.suplent === c.id) + '"', "", true);
      }).join("") + "</div></div>";
    });
    if (!algun) h += "<p>No tens cap suplent " + (activa ? "per a aquesta posició" : "encara") + ". Obre més sobres per aconseguir-ne.</p>";
    return h;
  }

  /* ---- Fites ---------------------------------------------------------- */
  function vistaFites() {
    var x = estadistiques();
    var fetes = FITES.filter(function (f) { return f.fet(x); }).length;
    return '<main class="pagina"><h1 class="titol-seccio">Fites</h1><p>Has aconseguit ' + fetes + " de " + FITES.length + '.</p><div class="fites">' +
      FITES.map(function (f) {
        var fet = f.fet(x);
        return '<div class="fita' + (fet ? " feta" : "") + '"><span class="medalla" aria-hidden="true"></span><span><b>' + esc(f.nom) + "</b><span>" + esc(f.desc) + "</span></span>" +
          '<span class="estat-fita">' + (fet ? "Aconseguida" : "Pendent") + "</span></div>";
      }).join("") + "</div></main>";
  }

  /* ---- Classe --------------------------------------------------------- */
  function vistaClasse() {
    var h = '<main class="pagina"><h1 class="titol-seccio">Classe</h1>';
    if (!s.classe) return h + '<p>Carregant la classificació…</p></main>';
    if (s.classe.error) return h + '<p class="error">' + esc(s.classe.error) + '</p><button type="button" class="boto-discret" data-accio="classe">Torna-ho a provar</button></main>';
    var ordre = s.ordreClasse;
    var files = s.classe.files.slice().sort(function (a, b) { return (b[ordre] || 0) - (a[ordre] || 0); });
    var cols = [["valorOnze", "Valor de l'onze"], ["diferents", "Cromos diferents"], ["llegendes", "Llegendes"], ["sobres", "Sobres"]];
    h += '<div class="formacions" role="group" aria-label="Ordena per">' + cols.map(function (c) {
      return '<button type="button" class="xip-formacio" data-ordre="' + c[0] + '" aria-pressed="' + (ordre === c[0]) + '">' + c[1] + "</button>";
    }).join("") + '<button type="button" class="boto-discret" data-accio="classe">Actualitza</button></div>';
    if (!files.length) return h + "<p>Encara no ha jugat ningú.</p></main>";
    h += '<div class="taula-classe"><table><thead><tr><th scope="col">#</th><th scope="col">Codi</th>' +
      cols.map(function (c) { return '<th scope="col" class="n">' + c[1] + "</th>"; }).join("") + "</tr></thead><tbody>" +
      files.map(function (f, i) {
        return "<tr" + (f.codi === s.codi ? ' class="jo"' : "") + "><td>" + (i + 1) + "</td><td>" + esc(f.codi) + (f.codi === s.codi ? " (tu)" : "") + "</td>" +
          '<td class="n">' + coma(Number(f.valorOnze || 0).toFixed(1)) + '</td><td class="n">' + (f.diferents || 0) + '</td><td class="n">' + (f.llegendes || 0) + '</td><td class="n">' + (f.sobres || 0) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    return h + "</main>";
  }

  function carregaClasse() {
    s.classe = null;
    pinta();
    Servidor.classe().then(function (d) { s.classe = { files: d.files || [] }; })
      .catch(function (e) { s.classe = { error: "No s'ha pogut carregar la classificació. " + e.message }; })
      .then(function () { if (s.vista === "classe") pinta(); });
  }

  /* ---- Pintar --------------------------------------------------------- */
  function pinta() {
    temporitzadors.forEach(clearTimeout);
    temporitzadors = [];
    if (s.darrer && !s.darrer.vist && s.vista !== "sobres") s.darrer.vist = true;
    var avisos = '<div class="avisos" id="avisos" aria-live="polite"></div><div class="esclat" id="esclat" aria-hidden="true"><span>Llegenda</span></div>';
    if (!s.estat) { app.innerHTML = vistaEntrada() + avisos; return; }
    var vistes = { album: vistaAlbum, onze: vistaOnze, fites: vistaFites, classe: vistaClasse, sobres: vistaSobres, lab: Lab.vista };
    var cos = (vistes[s.vista] || vistaSobres)();
    app.innerHTML = capcalera() + cos.replace(/<\/main>\s*$/, peu() + "</main>") + (s.detall ? vistaDetall() : "") + avisos;
    if (s.detall) { var t = document.getElementById("tanca-detall"); if (t) t.focus(); }
    if (s.vista === "sobres" && s.darrer && !s.darrer.vist) revela();
  }

  function bloqueja(si) {
    app.querySelectorAll("[data-bloq]").forEach(function (b) { b.disabled = si; });
  }

  function esclata(raresa) {
    var el = document.getElementById("esclat");
    if (!el || LENT) return;
    el.className = "esclat " + raresa;
    el.querySelector("span").textContent = raresa === "llegenda" ? "Llegenda" : "Or";
    void el.offsetWidth;
    el.classList.add("actiu");
  }

  // Gira els cromos d'un en un. Les cartes més rares es fan esperar una mica.
  function revela() {
    bloqueja(true);
    var cartes = s.darrer.cartes;
    var multi = s.darrer.sobres > 1;
    var extra = multi ? { bronze: 0, plata: 0, or: 160, llegenda: 700 } : { bronze: 0, plata: 100, or: 500, llegenda: 1100 };
    var pas = multi ? 90 : 320;
    var t = LENT ? 0 : 200;
    cartes.forEach(function (r, i) {
      if (!LENT) t += pas + extra[r.carta.raresa];
      temporitzadors.push(setTimeout(function () {
        var el = app.querySelector('.volta-interior[data-i="' + i + '"]');
        if (!el) return;
        el.classList.add("girada");
        if (r.carta.raresa === "llegenda" || r.carta.raresa === "or") {
          el.classList.add("brilla");
          esclata(r.carta.raresa);
        }
      }, t));
      if (!LENT && (r.carta.raresa === "llegenda")) t += 900;
    });
    temporitzadors.push(setTimeout(function () {
      s.darrer.vist = true;
      var fr = document.getElementById("frase");
      if (fr) fr.textContent = fraseSobre(cartes);
      bloqueja(false);
      revisaFites();
    }, t + (LENT ? 0 : 420)));
  }

  function obre(n) {
    if (s.darrer && !s.darrer.vist) return;
    actualitzaGemmes();
    var cartes = [];
    var oberts = 0;
    for (var i = 0; i < n; i++) {
      var res = Motor.obreSobre(s.estat, bossa, C, atzar);
      if (!res) break;
      cartes = cartes.concat(res);
      oberts += 1;
      Servidor.afegeixPendent(s.codi, {
        num: s.estat.sobres,
        cartes: res.map(function (r) { return r.carta.id; }),
        rareses: res.map(function (r) { return r.carta.raresa; }),
      });
    }
    if (!oberts) return;
    sincronitza();
    var p = document.getElementById("paquet");
    var mostra = function () { s.darrer = { cartes: cartes, sobres: oberts, vist: false }; pinta(); };
    if (p && !LENT) {
      p.classList.add("obrint");
      setTimeout(mostra, 400);
    } else mostra();
  }

  /* ---- Onze: accions -------------------------------------------------- */
  function canviOnze() {
    desaLocal();
    revisaFites();
    clearTimeout(esperaOnze);
    esperaOnze = setTimeout(sincronitza, 1500);
  }

  function posaMillors() {
    var usades = {};
    s.onze = {};
    llocsFormacio().forEach(function (linia) {
      linia.forEach(function (clau) {
        var pos = posDe(clau);
        var millor = CARTES_JOC.filter(function (c) { return c.pos === pos && s.estat.coleccio[c.id] && !usades[c.id]; })
          .sort(function (a, b) { return b.valor - a.valor; })[0];
        if (millor) { usades[millor.id] = true; s.onze[clau] = millor.id; }
      });
    });
    s.lloc = null;
    s.suplent = null;
    canviOnze();
    pinta();
  }

  // En canviar de formació, cada posició conserva les seves millors jugadores.
  function canviaFormacio(f) {
    var perPos = {};
    ORDRE_POS.forEach(function (pos) { perPos[pos] = []; });
    Object.keys(s.onze).forEach(function (k) { if (s.onze[k]) perPos[posDe(k)].push(s.onze[k]); });
    s.formacio = f;
    s.onze = {};
    ORDRE_POS.forEach(function (pos) {
      perPos[pos].sort(function (a, b) { return perId[b].valor - perId[a].valor; });
      for (var i = 0; i < FORMACIONS[f][pos] && i < perPos[pos].length; i++) s.onze[pos + ":" + i] = perPos[pos][i];
    });
    // Les places noves s'omplen amb les millors suplents.
    var usades = {};
    Object.keys(s.onze).forEach(function (k) { usades[s.onze[k]] = true; });
    llocsFormacio().forEach(function (linia) {
      linia.forEach(function (clau) {
        if (s.onze[clau]) return;
        var pos = posDe(clau);
        var millor = CARTES_JOC.filter(function (c) { return c.pos === pos && s.estat.coleccio[c.id] && !usades[c.id]; })
          .sort(function (a, b) { return b.valor - a.valor; })[0];
        if (millor) { usades[millor.id] = true; s.onze[clau] = millor.id; }
      });
    });
    s.lloc = null;
    s.suplent = null;
    canviOnze();
    pinta();
  }

  function tocaLloc(clau) {
    var pos = posDe(clau);
    if (s.suplent && perId[s.suplent].pos === pos) {
      s.onze[clau] = s.suplent;
      s.suplent = null;
      canviOnze();
    } else if (s.lloc && s.lloc !== clau && posDe(s.lloc) === pos) {
      var a = s.onze[s.lloc];
      var b = s.onze[clau];
      if (b) s.onze[s.lloc] = b; else delete s.onze[s.lloc];
      if (a) s.onze[clau] = a; else delete s.onze[clau];
      s.lloc = null;
      canviOnze();
    } else {
      s.suplent = null;
      s.lloc = s.lloc === clau ? null : clau;
    }
    pinta();
  }

  function tocaSuplent(id) {
    if (s.lloc && posDe(s.lloc) === perId[id].pos) {
      s.onze[s.lloc] = id;
      s.lloc = null;
      canviOnze();
      pinta();
      return;
    }
    s.lloc = null;
    s.suplent = s.suplent === id ? null : id;
    pinta();
    var camp = document.getElementById("camp-futbol");
    if (s.suplent && camp && innerWidth <= 820) camp.scrollIntoView({ block: "center", behavior: LENT ? "auto" : "smooth" });
  }

  // Netegem l'onze si conté claus d'una versió anterior.
  function normalitzaOnze() {
    var valides = {};
    llocsFormacio().forEach(function (l) { l.forEach(function (k) { valides[k] = true; }); });
    var net = {};
    Object.keys(s.onze || {}).forEach(function (k) {
      var id = s.onze[k];
      if (valides[k] && perId[id] && s.estat.coleccio[id] && perId[id].pos === posDe(k)) net[k] = id;
    });
    s.onze = net;
  }

  /* ---- Entrar i sortir ------------------------------------------------ */
  function comenca(codi, dades) {
    var local = carregaLocal(codi);
    var p = dades.partida;
    // Si al navegador hi ha sobres que encara no han arribat al full, mana el navegador.
    if (local && Servidor.hiHaPendents(codi) && (!p || local.estat.sobres > p.estat.sobres)) p = local;
    if (!Servidor.actiu) p = local;
    s.codi = codi;
    s.atorgades = dades.atorgades;
    s.nom = dades.nom || "";
    s.laboratori = Servidor.actiu ? !!dades.laboratori : !!C.laboratoriLocal;
    Lab.inicia(codi, pinta);
    s.estat = p ? p.estat : Motor.estatInicial(C);
    s.onze = p && p.onze || {};
    s.formacio = p && FORMACIONS[p.formacio] ? p.formacio : Object.keys(FORMACIONS)[0];
    s.fitesVistes = p && p.fitesVistes || [];
    actualitzaGemmes();
    normalitzaOnze();
    s.vista = "sobres";
    s.darrer = null;
    s.carregant = false;
    s.error = "";
    desaLocal();
    pinta();
    if (Servidor.actiu && Servidor.hiHaPendents(codi)) sincronitza();
    window.scrollTo(0, 0);
  }

  function entra(codi) {
    s.carregant = true;
    s.error = "";
    pinta();
    Servidor.entra(codi).then(function (d) { comenca(codi, d); }).catch(function (e) {
      s.carregant = false;
      s.error = e.delServidor ? e.message : "No s'ha pogut connectar amb el servidor. Comprova la connexió i torna-ho a provar.";
      pinta();
      var camp = document.getElementById("codi");
      if (camp) camp.value = codi;
    });
  }

  function surt() {
    s.codi = null; s.estat = null; s.darrer = null; s.confirma = false; s.detall = null; s.classe = null;
    esborra(CLAU + "darrer");
    pinta();
  }

  /* ---- Esdeveniments -------------------------------------------------- */
  app.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var codi = document.getElementById("codi").value.trim().toUpperCase();
    if (!/^[A-Z0-9][A-Z0-9-]{1,11}$/.test(codi)) {
      s.error = "Escriu el teu codi amb lletres, números i guions, sense espais.";
      pinta();
      document.getElementById("codi").value = codi;
      return;
    }
    entra(codi);
  });

  app.addEventListener("change", function (ev) {
    if (ev.target.dataset && Lab.canvi(ev.target, false)) return;
    var f = ev.target.dataset && ev.target.dataset.filtre;
    if (!f) return;
    s.filtre[f] = ev.target.value;
    pinta();
    var el = document.getElementById(ev.target.id);
    if (el) el.focus();
  });

  app.addEventListener("input", function (ev) {
    if (ev.target.type === "range" && Lab.canvi(ev.target, true)) {
      var id = ev.target.id;
      var el = document.getElementById(id);
      if (el) el.focus();
    }
  });

  app.addEventListener("click", function (ev) {
    var b = ev.target.closest("button, .velo");
    if (!b) return;
    var d = b.dataset;
    if (Lab.clic(b)) return;
    if (d.vista) {
      s.vista = d.vista; s.confirma = false; s.lloc = null; s.suplent = null;
      if (d.vista === "classe") { carregaClasse(); } else pinta();
      window.scrollTo(0, 0);
      return;
    }
    if (d.lloc) { tocaLloc(d.lloc); return; }
    if (d.suplent) { tocaSuplent(d.suplent); return; }
    if (d.formacio) { canviaFormacio(d.formacio); return; }
    if (d.detall) { s.detall = d.detall; pinta(); return; }
    if (d.ordre) { s.ordreClasse = d.ordre; pinta(); return; }
    var a = d.accio;
    if (a === "obre") obre(parseInt(d.n, 10) || 1);
    else if (a === "millor") posaMillors();
    else if (a === "treu") { delete s.onze[s.lloc]; s.lloc = null; canviOnze(); pinta(); }
    else if (a === "tanca-detall") { var id = s.detall; s.detall = null; pinta(); var torna = app.querySelector('[data-detall="' + id + '"]'); if (torna) torna.focus(); }
    else if (a === "al-onze") { s.detall = null; s.vista = "onze"; s.lloc = null; s.suplent = d.id; pinta(); window.scrollTo(0, 0); }
    else if (a === "classe") carregaClasse();
    else if (a === "surt") surt();
    else if (a === "refresca") {
      b.disabled = true; b.textContent = "Comprovant…";
      Servidor.entra(s.codi).then(function (r) {
        var abans = s.atorgades;
        s.atorgades = r.atorgades; s.laboratori = !!r.laboratori; actualitzaGemmes(); pinta();
        avisa(r.atorgades > abans ? "Tens " + plural(r.atorgades - abans, "gemma nova", "gemmes noves") + "." : "Encara no hi ha gemmes noves.");
      }).catch(function () { pinta(); avisa("No s'ha pogut connectar amb el servidor."); });
    }
    else if (a === "reinicia") { s.confirma = true; pinta(); }
    else if (a === "reinicia-no") { s.confirma = false; pinta(); }
    else if (a === "reinicia-si") { esborra(CLAU + s.codi); surt(); }
    else if (a === "copia") {
      var camp = document.getElementById("codi-resultat");
      var fet = function () { b.textContent = "Resultat copiat"; };
      var manual = function () { camp.focus(); camp.select(); b.textContent = "Selecciona'l i copia'l a mà"; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(camp.value).then(fet, manual);
      else manual();
    }
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && s.detall) { s.detall = null; pinta(); }
  });

  /* ---- Arrencada ------------------------------------------------------ */
  var darrer = llegeix(CLAU + "darrer");
  if (darrer && (Servidor.actiu || carregaLocal(darrer))) entra(darrer);
  else pinta();
})();
