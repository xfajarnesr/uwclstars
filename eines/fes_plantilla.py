"""Genera kit/plantilla-joc.html: UWCL Stars en un sol fitxer, sense laboratori ni servidor,
amb la base de dades en format de full de càlcul (columnes separades per tabuladors).
python3 eines/fes_plantilla.py
"""
import json, os, re

ARREL = os.path.join(os.path.dirname(__file__), "..")
llegeix = lambda f: open(os.path.join(ARREL, f), encoding="utf-8").read()

# Dades actuals
dades_js = llegeix("js/cartes.js")
clubs = json.loads(re.search(r"var CLUBS_JOC = (\{.*?\});", dades_js, re.S).group(1))
files = json.loads(re.search(r"var FILES_CARTES = (\[.*?\]);", dades_js, re.S).group(1))
butlletes = {"bronze": 20, "plata": 17, "or": 11, "llegenda": 4}

taula_grups = "codi\tnom\tnom curt\tcolor 1\tcolor 2\tcolor text\n" + "\n".join(
    "\t".join([k, v["nom"], v["curt"], v["color1"], v["color2"], v["text"]]) for k, v in clubs.items())
taula_cartes = "id\tgrup\tcategoria\tnúmero\tnom\tvalor\traresa\tbutlletes\n" + "\n".join(
    "\t".join([f[0], f[1], f[2], str(f[3]), f[4], str(f[5]), f[6], str(butlletes[f[6]])]) for f in files)

configuracio = r'''
var CONFIG_JOC = {
  nom: "UWCL Stars",
  temporada: "2026/27",
  descripcio: "{cromos} cromos de les {grups} plantilles de la Champions femenina 2026/27. Obre sobres, omple l'àlbum i munta el teu onze.",
  urlServidor: "",          // sense servidor: la partida es desa al navegador
  gemmesInicials: 20,       // gemmes per començar
  preuSobre: 1,             // gemmes que costa un sobre
  cartesPerSobre: 5,        // cromos de cada sobre
  // Butlletes per raresa: només s'usen si una carta no en té a la base de dades.
  butlletesPerRaresa: { bronze: 20, plata: 17, or: 11, llegenda: 4 },
  garantia: null,           // exemple: { raresa: "llegenda", cadaSobres: 40 }
  repetidesPerCanvi: 0,
  laboratoriLocal: false,
  permetReiniciar: true,
};

// Categories (al futbol, les posicions). Els codis han de coincidir amb la columna «categoria».
var POSICIONS_JOC = { POR: "Portera", DEF: "Defensa", MIG: "Migcampista", DAV: "Davantera" };
var POSICIONS_PLURAL_JOC = { POR: "Porteres", DEF: "Defenses", MIG: "Migcampistes", DAV: "Davanteres" };

// Com es forma l'equip: places de cada categoria. Totes les formacions han de sumar el mateix.
var FORMACIONS_JOC = {
  "4-3-3": { POR: 1, DEF: 4, MIG: 3, DAV: 3 },
  "4-4-2": { POR: 1, DEF: 4, MIG: 4, DAV: 2 },
  "3-5-2": { POR: 1, DEF: 3, MIG: 5, DAV: 2 },
};

// Noms de les quatre rareses (els codis bronze/plata/or/llegenda no es canvien).
var RARESES_JOC = { bronze: "Bronze", plata: "Plata", or: "Or", llegenda: "Llegenda" };

/* ---- Lectura de les taules (no cal tocar-ho) ---- */
function llegeixTaula(text, nomTaula, columnes) {
  var linies = text.trim().split(/\r?\n/);
  return linies.slice(1).filter(function (l) { return l.trim(); }).map(function (l, i) {
    var c = l.split(/\t|;/).map(function (x) { return x.trim(); });
    if (c.length < columnes) throw new Error("A la taula " + nomTaula + ", la fila " + (i + 2) + " té " + c.length + " columnes i n'hauria de tenir " + columnes + ": «" + l + "»");
    return c;
  });
}
var CLUBS_JOC = {};
llegeixTaula(TAULA_GRUPS, "GRUPS", 6).forEach(function (c) {
  CLUBS_JOC[c[0]] = { nom: c[1], curt: c[2], color1: c[3], color2: c[4], text: c[5] };
});
var RARESES_VALIDES = Object.keys(RARESES_JOC);
var FILES_CARTES = llegeixTaula(TAULA_CARTES, "CARTES", 7).map(function (c, i) {
  var fila = i + 2;
  if (!CLUBS_JOC[c[1]]) throw new Error("Fila " + fila + " de CARTES: el grup «" + c[1] + "» no és a la taula GRUPS.");
  if (!POSICIONS_JOC[c[2]]) throw new Error("Fila " + fila + " de CARTES: la categoria «" + c[2] + "» no és a POSICIONS_JOC.");
  if (RARESES_VALIDES.indexOf(c[6]) < 0) throw new Error("Fila " + fila + " de CARTES: la raresa ha de ser bronze, plata, or o llegenda.");
  var b = c[7] === undefined || c[7] === "" ? undefined : parseInt(c[7], 10);
  return [c[0], c[1], c[2], c[3], c[4], parseFloat(String(c[5]).replace(",", ".")) || 0, c[6], b];
});
var CARTES_JOC = FILES_CARTES.map(function (f, i) {
  return { id: f[0], num: i + 1, club: f[1], pos: f[2], dorsal: f[3], nom: f[4], valor: f[5], raresa: f[6], butlletes: f[7] };
});
'''

lab_buit = "var Lab = { inicia: function () {}, vista: function () { return ''; }, clic: function () { return false; }, canvi: function () { return false; } };"

avis_errors = r'''
window.addEventListener("error", function (e) {
  var el = document.getElementById("error-joc");
  if (el) return; // es mostra només el primer error, que és el que explica el problema
  if (!el) { el = document.createElement("pre"); el.id = "error-joc"; el.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:99;background:#fff3f3;color:#7a0000;border:2px solid #c00;padding:12px;font:14px/1.4 monospace;white-space:pre-wrap"; document.body.appendChild(el); }
  el.textContent = "El joc no pot arrencar. " + e.message;
});
'''

def bloc(titol, explicacio, codi):
    return "<script>\n/* " + "=" * 72 + "\n   " + titol + "\n   " + explicacio + "\n   " + "=" * 72 + " */\n" + codi.strip() + "\n</script>\n"

index = llegeix("index.html")
css = llegeix("css/estil.css")
html = index
html = html.replace('<title>UWCL Stars</title>', '<title>UWCL Stars (plantilla)</title>')
html = html.replace('<link rel="stylesheet" href="css/estil.css">', "<style>\n/* ===== ESTIL: colors, lletres i aspecte. Es pot canviar tant com vulgueu. ===== */\n" + css + "\n</style>")
scripts = (
    bloc("AVÍS D'ERRORS", "Si la base de dades té un error, el joc ho diu a la pantalla.", avis_errors) +
    bloc("MOTOR: NO ES TOCA", "Aquí es decideix l'atzar: cada carta surt en proporció a les seves butlletes.", llegeix("js/motor.js")) +
    bloc("BASE DE DADES", "Enganxeu aquí les taules del full de càlcul (es copien amb les columnes separades per tabuladors).\n   La primera fila de cada taula són les capçaleres. No esborreu les cometes inverses ` del principi i del final.",
         "var TAULA_GRUPS = `" + taula_grups + "`;\n\nvar TAULA_CARTES = `" + taula_cartes + "`;") +
    bloc("CONFIGURACIÓ", "Regles del joc, categories, formacions i noms de les rareses.", configuracio) +
    bloc("CONNEXIÓ (sense servidor en aquesta plantilla)", "No cal tocar-ho.", llegeix("js/servidor.js") + "\n" + lab_buit) +
    bloc("PANTALLES", "Textos i funcionament de les pantalles. Es poden canviar textos i aspecte.", llegeix("js/joc.js"))
)
html = re.sub(r'<script src="js/motor\.js"></script>.*<script src="js/joc\.js"></script>', lambda m: scripts, html, flags=re.S)
assert 'src="js/' not in html
os.makedirs(os.path.join(ARREL, "kit"), exist_ok=True)
with open(os.path.join(ARREL, "kit", "plantilla-joc.html"), "w", encoding="utf-8") as f:
    f.write(html)
print("kit/plantilla-joc.html", round(len(html.encode()) / 1024), "KB")
