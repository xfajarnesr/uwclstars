/**
 * UWCL Stars: servidor amb Google Sheets.
 * Copia aquest fitxer a Extensions > Apps Script del full i segueix INSTRUCCIONS.md.
 *
 * Pestanyes que crea «Prepara el full»:
 *   Alumnes   codi | nom (només per a tu) | gemmes extra
 *   Sessions  sessió | gemmes | activa
 *   Partides  codi | sobres | diferents | llegendes | valor onze | actualitzat | partida (JSON)
 *   Sobres    data | codi | sobre | carta 1..5 | raresa 1..5
 *   Resum     taula i recomptes de tota la classe
 *   Configuració  interruptors per a tota la classe (laboratori)
 */

var PREU_SOBRE = 1;
var CARTES_PER_SOBRE = 5;

function onOpen() {
  SpreadsheetApp.getUi().createMenu("UWCL Stars")
    .addItem("Prepara el full", "prepara")
    .addItem("Crea 20 codis d'alumne", "creaCodis")
    .addToUi();
}

function prepara() {
  var ss = SpreadsheetApp.getActive();
  full_(ss, "Alumnes", ["codi", "nom (surt al joc de l'alumne)", "gemmes extra"]);
  var ses = full_(ss, "Sessions", ["sessió", "gemmes", "activa"]);
  if (ses.getLastRow() < 2) {
    ses.getRange(2, 1, 6, 2).setValues([[1, 20], [2, 10], [3, 10], [4, 10], [5, 10], [6, 10]]);
    ses.getRange(2, 3, 6, 1).insertCheckboxes();
    ses.getRange(2, 3).check();
  }
  full_(ss, "Partides", ["codi", "sobres", "diferents", "llegendes", "valor onze", "actualitzat", "partida"]);
  var capSobres = ["data", "codi", "sobre"];
  for (var i = 1; i <= CARTES_PER_SOBRE; i++) capSobres.push("carta " + i);
  for (var j = 1; j <= CARTES_PER_SOBRE; j++) capSobres.push("raresa " + j);
  full_(ss, "Sobres", capSobres);

  var conf = full_(ss, "Configuració", ["opció", "activa", "què fa"]);
  if (conf.getLastRow() < 2) {
    conf.getRange(2, 1, 1, 3).setValues([["laboratori", false, "Mostra la pestanya Laboratori: sobres il·limitats, com funciona, simulador i auditoria."]]);
    conf.getRange(2, 2).insertCheckboxes();
  }

  var res = full_(ss, "Resum", ["", "valor"]);
  var primera = "D"; var ultima = String.fromCharCode("D".charCodeAt(0) + CARTES_PER_SOBRE - 1);
  var rang = "Sobres!" + String.fromCharCode(ultima.charCodeAt(0) + 1) + "2:" + String.fromCharCode(ultima.charCodeAt(0) + CARTES_PER_SOBRE) + "";
  res.getRange(2, 1, 9, 2).setValues([
    ["Sobres oberts a la classe", "=COUNTA(Sobres!C2:C)"],
    ["Cromos oberts", "=B2*" + CARTES_PER_SOBRE],
    ["Bronze", '=COUNTIF(' + rang + ',"bronze")'],
    ["Plata", '=COUNTIF(' + rang + ',"plata")'],
    ["Or", '=COUNTIF(' + rang + ',"or")'],
    ["Llegenda", '=COUNTIF(' + rang + ',"llegenda")'],
    ["% llegenda per cromo", '=IFERROR(B7/B3,0)'],
    ["Gemmes de les sessions actives", '=SUMIF(Sessions!C2:C,TRUE,Sessions!B2:B)'],
    ["Alumnes amb partida", "=COUNTA(Partides!A2:A)"],
  ]);
  res.getRange("B8").setNumberFormat("0.00%");
  SpreadsheetApp.getUi().alert("Full preparat. Afegeix els codis a «Alumnes» i publica l'script com a aplicació web.");
}

function creaCodis() {
  var sh = SpreadsheetApp.getActive().getSheetByName("Alumnes");
  if (!sh) { prepara(); sh = SpreadsheetApp.getActive().getSheetByName("Alumnes"); }
  var lletres = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  var existents = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues().map(function (r) { return r[0]; });
  var nous = [];
  while (nous.length < 20) {
    var c = "S" + lletres[Math.floor(Math.random() * lletres.length)] + Math.floor(10 + Math.random() * 90);
    if (existents.indexOf(c) < 0 && nous.indexOf(c) < 0) nous.push(c);
  }
  sh.getRange(sh.getLastRow() + 1, 1, 20, 1).setValues(nous.map(function (c) { return [c]; }));
}

/* ---- Web ---------------------------------------------------------------- */

function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    if (p.accio === "entra") return json_(entra_(p.codi));
    if (p.accio === "classe") return json_(classe_());
    return json_({ ok: true, missatge: "Servidor UWCL Stars actiu." });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.accio === "desa") return json_(desa_(d));
    return json_({ ok: false, error: "Acció desconeguda." });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function entra_(codiBrut) {
  var codi = netejaCodi_(codiBrut);
  var alumne = alumne_(codi);
  if (!alumne) return { ok: false, error: "El codi " + codi + " no existeix. Revisa'l o demana'l al professor." };
  var fila = filaPartida_(codi);
  var partida = null;
  if (fila) {
    var text = fila.valors[6];
    if (text) partida = JSON.parse(text);
  }
  return { ok: true, codi: codi, nom: alumne.nom, atorgades: gemmesAtorgades_(alumne), partida: partida, laboratori: opcio_("laboratori") };
}

function desa_(d) {
  var codi = netejaCodi_(d.codi);
  var alumne = alumne_(codi);
  if (!alumne) return { ok: false, error: "El codi " + codi + " no existeix." };
  var partida = d.partida;
  var atorgades = gemmesAtorgades_(alumne);
  var sobres = partida && partida.estat && partida.estat.sobres || 0;
  if (sobres * PREU_SOBRE > atorgades) return { ok: false, error: "Hi ha més sobres oberts que gemmes concedides.", atorgades: atorgades };

  var sh = SpreadsheetApp.getActive().getSheetByName("Partides");
  var fila = filaPartida_(codi);
  var jaDesats = fila ? Number(fila.valors[1]) || 0 : 0;
  if (sobres < jaDesats) return { ok: false, error: "Aquesta partida és més antiga que la desada.", atorgades: atorgades };

  // Registra només els sobres nous.
  var nous = (d.sobresNous || []).filter(function (s) { return s.num > jaDesats; });
  if (nous.length) {
    var ara = new Date();
    var rows = nous.map(function (s) {
      var r = [ara, codi, s.num];
      for (var i = 0; i < CARTES_PER_SOBRE; i++) r.push(s.cartes[i] || "");
      for (var j = 0; j < CARTES_PER_SOBRE; j++) r.push(s.rareses[j] || "");
      return r;
    });
    var so = SpreadsheetApp.getActive().getSheetByName("Sobres");
    so.getRange(so.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  }

  var resum = d.resum || {};
  var valors = [codi, sobres, resum.diferents || 0, resum.llegendes || 0, resum.valorOnze || 0, new Date(), JSON.stringify(partida)];
  if (fila) sh.getRange(fila.fila, 1, 1, valors.length).setValues([valors]);
  else sh.appendRow(valors);
  return { ok: true, atorgades: atorgades, desats: sobres };
}

function classe_() {
  var sh = SpreadsheetApp.getActive().getSheetByName("Partides");
  var n = sh.getLastRow() - 1;
  if (n < 1) return { ok: true, files: [] };
  var files = sh.getRange(2, 1, n, 5).getValues().map(function (r) {
    return { codi: r[0], sobres: r[1], diferents: r[2], llegendes: r[3], valorOnze: r[4] };
  });
  return { ok: true, files: files };
}

/* ---- Ajudes ------------------------------------------------------------- */

function netejaCodi_(c) { return String(c || "").trim().toUpperCase(); }

function alumne_(codi) {
  var sh = SpreadsheetApp.getActive().getSheetByName("Alumnes");
  var n = sh.getLastRow() - 1;
  if (n < 1 || !codi) return null;
  var v = sh.getRange(2, 1, n, 3).getValues();
  for (var i = 0; i < v.length; i++) {
    if (netejaCodi_(v[i][0]) === codi) return { codi: codi, nom: String(v[i][1] || "").trim(), extra: Number(v[i][2]) || 0 };
  }
  return null;
}

function gemmesAtorgades_(alumne) {
  var sh = SpreadsheetApp.getActive().getSheetByName("Sessions");
  var n = sh.getLastRow() - 1;
  var total = alumne.extra;
  if (n < 1) return total;
  sh.getRange(2, 1, n, 3).getValues().forEach(function (r) {
    if (r[2] === true) total += Number(r[1]) || 0;
  });
  return total;
}

function opcio_(nom) {
  var sh = SpreadsheetApp.getActive().getSheetByName("Configuració");
  if (!sh || sh.getLastRow() < 2) return false;
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues();
  for (var i = 0; i < v.length; i++) if (String(v[i][0]).trim().toLowerCase() === nom) return v[i][1] === true;
  return false;
}

function filaPartida_(codi) {
  var sh = SpreadsheetApp.getActive().getSheetByName("Partides");
  var n = sh.getLastRow() - 1;
  if (n < 1) return null;
  var v = sh.getRange(2, 1, n, 7).getValues();
  for (var i = 0; i < v.length; i++) if (netejaCodi_(v[i][0]) === codi) return { fila: i + 2, valors: v[i] };
  return null;
}

function full_(ss, nom, capcalera) {
  var sh = ss.getSheetByName(nom) || ss.insertSheet(nom);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, capcalera.length).setValues([capcalera]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
