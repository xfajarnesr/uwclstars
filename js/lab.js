/* ===========================================================================
   LABORATORI
   Quatre eines que no toquen la col·lecció de l'alumne:
   - Sobres il·limitats: obrir tants sobres com vulguis i comptar.
   - Com funciona: les butlletes i les probabilitats del joc real.
   - Simulador: canviar les regles i simular molts jugadors.
   - Auditoria: jocs misteriosos que poden mentir sobre les probabilitats.
   =========================================================================== */
var Lab = (function () {
  "use strict";

  var C = CONFIG_JOC;
  var RARESES = ["bronze", "plata", "or", "llegenda"];
  var NOM = { bronze: "Bronze", plata: "Plata", or: "Or", llegenda: "Llegenda" };
  var bossaReal = Motor.creaBossa(CARTES_JOC, C);
  var atzar = Motor.creaAtzar();
  var LIMIT_AUDITORIA = 200; // sobres per joc misteriós

  // Jocs misteriosos. Tots anuncien les probabilitats del joc real.
  // Les butlletes reals d'alguns són diferents. Ho diu el solucionari, no la pantalla.
  var MISTERIS = JSON.parse(atob("eyJBIjp7ImJyb256ZSI6MjAsInBsYXRhIjoxNywib3IiOjExLCJsbGVnZW5kYSI6NH0sIkIiOnsiYnJvbnplIjoyMCwicGxhdGEiOjE4LCJvciI6NywibGxlZ2VuZGEiOjR9LCJDIjp7ImJyb256ZSI6MjAsInBsYXRhIjoxNywib3IiOjExLCJsbGVnZW5kYSI6NH0sIkQiOnsiYnJvbnplIjoyMCwicGxhdGEiOjE3LCJvciI6MTEsImxsZWdlbmRhIjoxfSwiRSI6eyJicm9uemUiOjIyLCJwbGF0YSI6MTQsIm9yIjoxMSwibGxlZ2VuZGEiOjR9LCJGIjp7ImJyb256ZSI6MjAsInBsYXRhIjoxNywib3IiOjExLCJsbGVnZW5kYSI6NH19"));

  var s = {
    sub: "obert",
    obert: null,
    sim: { bronze: C.butlletesPerRaresa.bronze, plata: C.butlletesPerRaresa.plata, or: C.butlletesPerRaresa.or, llegenda: C.butlletesPerRaresa.llegenda,
      mida: C.cartesPerSobre, garantia: 0, canvi: 0, jugadors: 500, preu: 1, resultat: null, calculant: false },
    sobresN: 20,
    misteri: "A",
    auditoria: {},
  };
  var codi = null;
  var repinta = function () {};

  function clau() { return "uwcl-stars:lab:" + codi; }
  function desa() {
    try { localStorage.setItem(clau(), JSON.stringify({ obert: s.obert, auditoria: s.auditoria })); } catch (e) { /* res */ }
  }
  function carrega() {
    s.obert = null; s.auditoria = {};
    try {
      var d = JSON.parse(localStorage.getItem(clau()));
      if (d) { s.obert = d.obert || null; s.auditoria = d.auditoria || {}; }
    } catch (e) { /* res */ }
    if (!s.obert) s.obert = nouComptador();
  }

  function nouComptador() {
    return { sobres: 0, cartes: 0, perRaresa: { bronze: 0, plata: 0, or: 0, llegenda: 0 }, vistes: {}, primera: null, darreraLlegenda: 0, maxSense: 0, darrer: [] };
  }

  /* ---- Ajudes --------------------------------------------------------- */
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function num(x, d) {
    if (x === null || x === undefined || !isFinite(x)) return "–";
    return x.toLocaleString("ca-ES", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  }
  function pct(x, d) { return num(x * 100, d === undefined ? 2 : d) + "%"; }

  function configAmb(butlletes) {
    var c = {};
    Object.keys(C).forEach(function (k) { c[k] = C[k]; });
    c.butlletesPerRaresa = butlletes;
    return c;
  }

  /* ---- Sobres il·limitats --------------------------------------------- */
  function obreLliure(n) {
    var o = s.obert;
    var cfg = configAmb(C.butlletesPerRaresa);
    var darrer = [];
    for (var k = 0; k < n; k++) {
      o.sobres += 1;
      var ambLlegenda = false;
      for (var j = 0; j < cfg.cartesPerSobre; j++) {
        var carta = bossaReal.cartes[Motor.sorteja(bossaReal, atzar)];
        o.cartes += 1;
        o.perRaresa[carta.raresa] += 1;
        o.vistes[carta.id] = 1;
        if (carta.raresa === "llegenda") {
          ambLlegenda = true;
          if (o.primera === null) o.primera = o.sobres;
        }
        if (n === 1) darrer.push(carta.id);
      }
      if (ambLlegenda) o.darreraLlegenda = o.sobres;
      o.maxSense = Math.max(o.maxSense, o.sobres - o.darreraLlegenda);
    }
    o.darrer = darrer;
    desa();
  }

  function taulaRareses(compt, total, perCarta, ambTeoria) {
    return '<table class="taula-lab"><thead><tr><th scope="col">Raresa</th><th scope="col" class="n">Cromos</th><th scope="col" class="n">Freqüència</th>' +
      (ambTeoria ? '<th scope="col" class="n">Anunciat</th>' : "") + "</tr></thead><tbody>" +
      RARESES.map(function (r) {
        return '<tr><td><i class="punt ' + r + '"></i> ' + NOM[r] + '</td><td class="n">' + num(compt[r]) + '</td><td class="n">' + (total ? pct(compt[r] / total) : "–") + "</td>" +
          (ambTeoria ? '<td class="n">' + pct(perCarta[r]) + "</td>" : "") + "</tr>";
      }).join("") + '</tbody><tfoot><tr><td>Total</td><td class="n">' + num(total) + '</td><td class="n">' + (total ? "100%" : "–") + "</td>" + (ambTeoria ? "<td></td>" : "") + "</tr></tfoot></table>";
  }

  function vistaObert() {
    var o = s.obert;
    var diferents = Object.keys(o.vistes).length;
    var h = '<p class="lab-intro">Aquí pots obrir tots els sobres que vulguis. No compten per a la teva col·lecció ni per a la classe: només serveixen per mirar què passa quan l\'atzar es repeteix moltes vegades.</p>' +
      '<div class="accions" style="justify-content:flex-start">' + [1, 10, 100, 1000].map(function (n) {
        return '<button type="button" class="boto' + (n > 1 ? " segon" : "") + '" data-lab="obre" data-n="' + n + '">Obre ' + num(n) + (n === 1 ? " sobre" : " sobres") + "</button>";
      }).join("") + '<button type="button" class="boto-discret" data-lab="reinicia-obert">Posa el comptador a zero</button></div>' +
      '<div class="lab-xifres">' +
      xifra(num(o.sobres), "sobres oberts") + xifra(num(diferents) + "/" + CARTES_JOC.length, "cromos diferents vistos") +
      xifra(o.primera ? num(o.primera) : "–", "sobre de la primera llegenda") + xifra(num(o.maxSense), "sobres seguits sense llegenda, com a màxim") +
      "</div>" + taulaRareses(o.perRaresa, o.cartes, null, false);
    if (o.darrer && o.darrer.length) {
      h += '<p class="lab-nota">Últim sobre: ' + o.darrer.map(function (id) {
        var c = bossaReal.cartes.filter(function (x) { return x.id === id; })[0];
        return esc(c.nom) + " (" + NOM[c.raresa].toLowerCase() + ")";
      }).join(", ") + ".</p>";
    }
    return h;
  }

  function xifra(valor, etiqueta) { return '<div><b>' + valor + "</b><span>" + etiqueta + "</span></div>"; }

  /* ---- Com funciona --------------------------------------------------- */
  function vistaCom() {
    var pr = Motor.probabilitats(bossaReal, C);
    var n = s.sobresN;
    var pL = pr.llegenda.perCarta;
    var pSobre = pr.llegenda.perSobre;
    var pN = 1 - Math.pow(1 - pSobre, n);
    var unaCarta = C.butlletesPerRaresa.llegenda / bossaReal.total;
    var unaN = 1 - Math.pow(1 - unaCarta, n * C.cartesPerSobre);
    return '<div class="lab-text"><h2>Les butlletes</h2>' +
      "<p>Imagina una urna enorme. Cada cromo hi té unes quantes butlletes amb el seu nom, segons la raresa. Per fer cada cromo d'un sobre, el joc treu una butlleta a l'atzar, apunta el nom i la torna a l'urna. Per això cada cromo és independent dels altres i pots repetir cromo dins del mateix sobre.</p>" +
      '<table class="taula-lab"><thead><tr><th scope="col">Raresa</th><th scope="col" class="n">Cromos diferents</th><th scope="col" class="n">Butlletes per cromo</th><th scope="col" class="n">Butlletes en total</th><th scope="col" class="n">P(raresa) per cromo</th><th scope="col" class="n">P(un cromo concret)</th></tr></thead><tbody>' +
      RARESES.map(function (r) {
        var b = C.butlletesPerRaresa[r];
        return '<tr><td><i class="punt ' + r + '"></i> ' + NOM[r] + '</td><td class="n">' + pr[r].cartes + '</td><td class="n">' + b + '</td><td class="n">' + num(pr[r].butlletes) + '</td><td class="n">' + pct(pr[r].perCarta) + '</td><td class="n">' + pct(b / bossaReal.total, 3) + "</td></tr>";
      }).join("") + '</tbody><tfoot><tr><td>Total</td><td class="n">' + CARTES_JOC.length + '</td><td></td><td class="n">' + num(bossaReal.total) + '</td><td class="n">100%</td><td></td></tr></tfoot></table>' +
      '<p class="formula">P(un cromo concret) = butlletes del cromo ÷ butlletes totals = ' + C.butlletesPerRaresa.llegenda + " ÷ " + num(bossaReal.total) + " per a cada llegenda.</p>" +
      "<h2>Un sobre</h2><p>Un sobre té " + C.cartesPerSobre + " cromos. La probabilitat que un sobre porti almenys una llegenda es calcula pel contrari: que cap dels " + C.cartesPerSobre + " cromos ho sigui.</p>" +
      '<p class="formula">P(almenys una llegenda en un sobre) = 1 − (1 − ' + num(pL, 4) + ")<sup>" + C.cartesPerSobre + "</sup> = " + pct(pSobre) + "</p>" +
      "<h2>Molts sobres</h2>" +
      '<div class="camp-petit" style="max-width:340px"><label for="lab-n">Nombre de sobres: <b>' + n + '</b></label><input type="range" id="lab-n" min="1" max="400" value="' + n + '" data-lab-camp="sobresN"></div>' +
      '<p class="formula">P(almenys una llegenda en ' + n + " sobres) = 1 − (1 − " + num(pSobre, 4) + ")<sup>" + n + "</sup> = " + pct(pN, 1) + "</p>" +
      '<p class="formula">P(una llegenda concreta, per exemple l\'Aitana, en ' + n + " sobres) = 1 − (1 − " + num(unaCarta, 5) + ")<sup>" + n * C.cartesPerSobre + "</sup> = " + pct(unaN, 1) + "</p>" +
      "<p>De mitjana, la primera llegenda arriba al sobre 1 ÷ " + num(pSobre, 4) + " ≈ " + num(1 / pSobre, 1) + ". Però la meitat dels jugadors la tenen abans del sobre " + Math.ceil(Math.log(0.5) / Math.log(1 - pSobre)) + ": la mitjana i la mediana no són el mateix.</p>" +
      "<h2>Les regles que no veus</h2><p>Molts jocs reals afegeixen regles que canvien molt els números: una carta garantida cada cert nombre de sobres, o canviar repetides per cartes que falten. Al simulador les pots activar i comparar.</p></div>";
  }

  /* ---- Simulador ------------------------------------------------------ */
  function vistaSim() {
    var m = s.sim;
    var butlletes = { bronze: m.bronze, plata: m.plata, or: m.or, llegenda: m.llegenda };
    var valides = RARESES.every(function (r) { return butlletes[r] >= 1; });
    var h = '<p class="lab-intro">Canvia les regles i simula molts jugadors que obren sobres fins a completar l\'àlbum de ' + CARTES_JOC.length + " cromos.</p>" +
      '<div class="lab-controls">' +
      RARESES.map(function (r) {
        return '<div class="camp-petit"><label for="sim-' + r + '">Butlletes per cromo ' + NOM[r].toLowerCase() + '</label><input type="number" min="1" max="1000" id="sim-' + r + '" value="' + m[r] + '" data-sim="' + r + '"></div>';
      }).join("") +
      '<div class="camp-petit"><label for="sim-mida">Cromos per sobre</label><input type="number" min="1" max="20" id="sim-mida" value="' + m.mida + '" data-sim="mida"></div>' +
      '<div class="camp-petit"><label for="sim-garantia">Llegenda garantida cada… sobres (0 = mai)</label><input type="number" min="0" max="500" id="sim-garantia" value="' + m.garantia + '" data-sim="garantia"></div>' +
      '<div class="camp-petit"><label for="sim-canvi">Repetides per canviar per un cromo que falta (0 = no)</label><input type="number" min="0" max="200" id="sim-canvi" value="' + m.canvi + '" data-sim="canvi"></div>' +
      '<div class="camp-petit"><label for="sim-jugadors">Jugadors simulats</label><select id="sim-jugadors" data-sim="jugadors">' + [100, 500, 1000].map(function (n) {
        return '<option value="' + n + '"' + (m.jugadors === n ? " selected" : "") + ">" + num(n) + "</option>";
      }).join("") + "</select></div>" +
      '<div class="camp-petit"><label for="sim-preu">Preu d\'un sobre en euros</label><input type="number" min="0" max="100" step="0.5" id="sim-preu" value="' + m.preu + '" data-sim="preu"></div>' +
      "</div>" +
      '<div class="accions" style="justify-content:flex-start"><button type="button" class="boto" data-lab="simula"' + (valides && !m.calculant ? "" : " disabled") + ">" + (m.calculant ? "Simulant…" : "Simula") + "</button>" +
      '<button type="button" class="boto-discret" data-lab="sim-real">Torna a les regles del joc</button></div>';
    if (!valides) h += '<p class="error">Cada raresa necessita almenys 1 butlleta per cromo.</p>';
    if (m.resultat) h += resultatSim(m.resultat);
    return h;
  }

  function resultatSim(r) {
    var p = r.prob;
    var euros = function (x) { return x === null ? "–" : num(x * r.preu, 0) + " €"; };
    return '<div class="lab-resultat"><p class="lab-nota">Regles simulades: ' + esc(r.descripcio) + ".</p>" +
      '<p>Probabilitat per cromo: bronze ' + pct(p.bronze.perCarta, 1) + ", plata " + pct(p.plata.perCarta, 1) + ", or " + pct(p.or.perCarta, 1) + ", llegenda " + pct(p.llegenda.perCarta, 2) + ".</p>" +
      '<div class="lab-dos"><section><h3>Primera llegenda</h3><div class="lab-xifres petites">' +
      xifra(num(r.primera.mitjana, 1), "sobres de mitjana") + xifra(num(r.primera.mediana), "sobres de mediana") + xifra(num(r.primera.p90), "sobres per al 10% amb menys sort") +
      "</div>" + histograma(r.valorsPrimera, "sobres fins a la primera llegenda") + "</section>" +
      "<section><h3>Àlbum complet</h3><div class=\"lab-xifres petites\">" +
      xifra(num(r.album.mitjana, 0), "sobres de mitjana") + xifra(num(r.album.mediana), "sobres de mediana") + xifra(euros(r.album.mediana), "cost de la mediana") +
      "</div>" + histograma(r.valorsAlbum, "sobres fins a completar l'àlbum") + "</section></div>" +
      '<p class="lab-nota">' + num(r.jugadors) + " jugadors simulats. El 10% amb més sort completa l'àlbum en " + num(r.album.p10) + " sobres o menys; el 10% amb menys sort en necessita " + num(r.album.p90) + " o més.</p></div>";
  }

  // Histograma d'una sola sèrie, amb la mediana marcada.
  function histograma(valors, etiqueta) {
    if (!valors.length) return "";
    var v = valors.slice().sort(function (a, b) { return a - b; });
    var min = v[0];
    var max = v[Math.floor(v.length * 0.99)];
    var nb = 24;
    var amp = Math.max(1, Math.ceil((max - min + 1) / nb));
    var bins = [];
    for (var i = 0; i < nb; i++) bins.push(0);
    var fora = 0;
    v.forEach(function (x) {
      var k = Math.floor((x - min) / amp);
      if (k >= nb) { fora += 1; k = nb - 1; }
      bins[k] += 1;
    });
    var W = 520, H = 190, ml = 8, mr = 8, mt = 14, mb = 40;
    var bw = (W - ml - mr) / nb;
    var top = Math.max.apply(null, bins);
    var mediana = v[Math.floor(v.length / 2)];
    var xMed = ml + ((mediana - min) / amp) * bw;
    var barres = bins.map(function (n, k) {
      var h = top ? (n / top) * (H - mt - mb) : 0;
      var x = ml + k * bw + 1;
      var y = H - mb - h;
      var desde = min + k * amp;
      var fins = desde + amp - 1;
      var text = (k === nb - 1 && fora ? "de " + num(desde) + " o més" : num(desde) + "–" + num(fins)) + " sobres: " + num(n) + " jugadors";
      return '<g class="barra"><rect class="zona" x="' + (ml + k * bw) + '" y="' + mt + '" width="' + bw + '" height="' + (H - mt - mb) + '"></rect>' +
        (h > 0 ? '<path d="' + barraArrodonida(x, y, bw - 2, h) + '"></path>' : "") + "<title>" + text + "</title></g>";
    }).join("");
    return '<figure class="histo"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Histograma de ' + esc(etiqueta) + ". Mediana " + num(mediana) + '">' +
      '<line class="eix" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + (H - mb) + '" y2="' + (H - mb) + '"></line>' + barres +
      '<line class="mediana" x1="' + xMed + '" x2="' + xMed + '" y1="' + (mt - 4) + '" y2="' + (H - mb) + '"></line>' +
      '<text class="et-med" x="' + Math.min(Math.max(xMed, 60), W - 60) + '" y="' + (mt - 4) + '" text-anchor="middle">mediana ' + num(mediana) + "</text>" +
      '<text x="' + ml + '" y="' + (H - mb + 18) + '">' + num(min) + "</text>" +
      '<text x="' + (W - mr) + '" y="' + (H - mb + 18) + '" text-anchor="end">' + num(min + nb * amp - 1) + (fora ? "+" : "") + "</text>" +
      '<text x="' + W / 2 + '" y="' + (H - 6) + '" text-anchor="middle">' + esc(etiqueta) + "</text></svg>" +
      "<figcaption>Cada barra compta quants jugadors han necessitat aquell nombre de sobres. Passa el cursor per sobre d'una barra per veure'n el valor.</figcaption></figure>";
  }

  function barraArrodonida(x, y, w, h) {
    var r = Math.min(4, w / 2, h);
    return "M" + x + "," + (y + h) + "V" + (y + r) + "Q" + x + "," + y + " " + (x + r) + "," + y + "H" + (x + w - r) + "Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) + "V" + (y + h) + "Z";
  }

  function simula() {
    var m = s.sim;
    m.calculant = true;
    repinta();
    setTimeout(function () {
      var butlletes = { bronze: m.bronze, plata: m.plata, or: m.or, llegenda: m.llegenda };
      var cfg = configAmb(butlletes);
      cfg.cartesPerSobre = m.mida;
      cfg.garantia = m.garantia > 0 ? { raresa: "llegenda", cadaSobres: m.garantia } : null;
      cfg.repetidesPerCanvi = m.canvi;
      var bossa = Motor.creaBossa(CARTES_JOC, cfg);
      var r = Motor.simula(bossa, cfg, { jugadors: m.jugadors, raresaObjectiu: "llegenda", topall: 20000 });
      var parts = ["butlletes " + [m.bronze, m.plata, m.or, m.llegenda].join(" / "), m.mida + " cromos per sobre"];
      parts.push(m.garantia > 0 ? "llegenda garantida cada " + m.garantia + " sobres" : "sense garantia");
      parts.push(m.canvi > 0 ? m.canvi + " repetides per un cromo que falta" : "sense canvi de repetides");
      r.descripcio = parts.join(", ");
      r.prob = Motor.probabilitats(bossa, cfg);
      r.preu = m.preu;
      m.resultat = r;
      m.calculant = false;
      repinta();
    }, 30);
  }

  /* ---- Auditoria ------------------------------------------------------ */
  function vistaAuditoria() {
    var lletra = s.misteri;
    var a = s.auditoria[lletra] || { sobres: 0, perRaresa: { bronze: 0, plata: 0, or: 0, llegenda: 0 } };
    var anunciat = Motor.probabilitats(bossaReal, C);
    var perCarta = {};
    RARESES.forEach(function (r) { perCarta[r] = anunciat[r].perCarta; });
    var cartes = a.sobres * C.cartesPerSobre;
    var queden = LIMIT_AUDITORIA - a.sobres;
    return '<p class="lab-intro">Hi ha sis jocs misteriosos, de l\'A a l\'F. Tots diuen que tenen les mateixes probabilitats que UWCL Stars, però algun menteix. Pots obrir fins a ' + LIMIT_AUDITORIA + " sobres de cada joc. Decideix amb les dades si és honest o trucat, i quina raresa ha tocat.</p>" +
      '<div class="formacions" role="group" aria-label="Joc misteriós">' + Object.keys(MISTERIS).map(function (l) {
        var fet = s.auditoria[l] ? s.auditoria[l].sobres : 0;
        return '<button type="button" class="xip-formacio" data-misteri="' + l + '" aria-pressed="' + (l === lletra) + '">Joc ' + l + (fet ? " (" + fet + ")" : "") + "</button>";
      }).join("") + "</div>" +
      '<div class="accions" style="justify-content:flex-start">' + [1, 10, 50].map(function (n) {
        return '<button type="button" class="boto' + (n > 1 ? " segon" : "") + '" data-lab="audita" data-n="' + n + '"' + (queden < 1 ? " disabled" : "") + ">Obre " + Math.min(n, Math.max(queden, 1)) + (n === 1 ? " sobre" : " sobres") + "</button>";
      }).join("") + "</div>" +
      '<p class="lab-nota">Joc ' + lletra + ": " + a.sobres + " de " + LIMIT_AUDITORIA + " sobres oberts, " + num(cartes) + " cromos.</p>" +
      taulaRareses(a.perRaresa, cartes, perCarta, true) +
      '<p class="lab-nota">Compara la freqüència amb el que anuncia el joc. Una diferència petita pot ser mala sort; una de molt gran, no tant. Quina diferència et faria sospitar?</p>';
  }

  function audita(n) {
    var l = s.misteri;
    var a = s.auditoria[l] || (s.auditoria[l] = { sobres: 0, perRaresa: { bronze: 0, plata: 0, or: 0, llegenda: 0 } });
    var cfg = configAmb(MISTERIS[l]);
    var bossa = Motor.creaBossa(CARTES_JOC, cfg);
    var quants = Math.min(n, LIMIT_AUDITORIA - a.sobres);
    for (var k = 0; k < quants; k++) {
      a.sobres += 1;
      for (var j = 0; j < C.cartesPerSobre; j++) a.perRaresa[bossa.cartes[Motor.sorteja(bossa, atzar)].raresa] += 1;
    }
    desa();
  }

  /* ---- Interfície pública -------------------------------------------- */
  return {
    inicia: function (nouCodi, fnRepinta) { codi = nouCodi; repinta = fnRepinta; carrega(); },

    vista: function () {
      var subs = [["obert", "Sobres il·limitats"], ["com", "Com funciona"], ["sim", "Simulador"], ["auditoria", "Auditoria"]];
      var cos = { obert: vistaObert, com: vistaCom, sim: vistaSim, auditoria: vistaAuditoria }[s.sub]();
      return '<main class="pagina lab"><h1 class="titol-seccio">Laboratori</h1>' +
        '<nav class="formacions" aria-label="Eines del laboratori">' + subs.map(function (x) {
          return '<button type="button" class="xip-formacio" data-lab-sub="' + x[0] + '" aria-pressed="' + (s.sub === x[0]) + '">' + x[1] + "</button>";
        }).join("") + "</nav>" + cos + "</main>";
    },

    // Retorna true si el clic era del laboratori.
    clic: function (b) {
      var d = b.dataset;
      if (d.labSub) { s.sub = d.labSub; repinta(); return true; }
      if (d.misteri) { s.misteri = d.misteri; repinta(); return true; }
      if (!d.lab) return false;
      if (d.lab === "obre") { obreLliure(parseInt(d.n, 10)); repinta(); }
      else if (d.lab === "reinicia-obert") { s.obert = nouComptador(); desa(); repinta(); }
      else if (d.lab === "simula") simula();
      else if (d.lab === "sim-real") {
        RARESES.forEach(function (r) { s.sim[r] = C.butlletesPerRaresa[r]; });
        s.sim.mida = C.cartesPerSobre; s.sim.garantia = 0; s.sim.canvi = 0; s.sim.resultat = null; repinta();
      }
      else if (d.lab === "audita") { audita(parseInt(d.n, 10)); repinta(); }
      return true;
    },

    // Retorna true si el canvi era del laboratori.
    canvi: function (el, enViu) {
      if (el.dataset.labCamp === "sobresN") {
        s.sobresN = parseInt(el.value, 10) || 1;
        if (!enViu) repinta();
        return true;
      }
      if (el.dataset.sim) {
        var k = el.dataset.sim;
        var v = parseFloat(el.value);
        s.sim[k] = isFinite(v) ? (k === "preu" ? Math.max(0, v) : Math.max(0, Math.round(v))) : 0;
        if (!enViu) repinta();
        return true;
      }
      return false;
    },
  };
})();
