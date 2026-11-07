"""Genera js/cartes.js a partir de plantilles.py.
python3 eines/genera_dades.py
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from plantilles import CLUBS, PLANTILLES, VALORS

ORDRE_POS = ["POR", "DEF", "MIG", "DAV"]
# Quantes cartes de cada raresa, per rànquing de valor.
QUANTES = {"llegenda": 10, "or": 40, "plata": 110}

cartes = []
falten = []
for club in CLUBS:
    pos = None
    files = []
    for linia in PLANTILLES[club].strip().splitlines():
        linia = linia.strip()
        if linia in ORDRE_POS:
            pos = linia
            continue
        dorsal, nom = linia.split(" ", 1)
        if nom not in VALORS:
            falten.append((club, nom))
            continue
        files.append((ORDRE_POS.index(pos), int(dorsal), pos, nom))
    for _, dorsal, pos, nom in sorted(files):
        cartes.append(dict(id=f"{club}-{dorsal}", club=club, pos=pos, dorsal=dorsal, nom=nom, valor=VALORS[nom]))

if falten:
    sys.exit("Falten valors: " + repr(falten))
extra = set(VALORS) - {c["nom"] for c in cartes}
if extra:
    sys.exit("Valors sense jugadora: " + repr(extra))
ids = [c["id"] for c in cartes]
assert len(ids) == len(set(ids)), "id repetit"
noms = [c["nom"] for c in cartes]
assert len(noms) == len(set(noms)), "nom repetit"

# Raresa per rànquing: en cas d'empat, guanya l'ordre de l'àlbum.
for i, c in enumerate(cartes):
    c["num"] = i + 1
ranquing = sorted(cartes, key=lambda c: (-c["valor"], c["num"]))
cursor = 0
for raresa, n in QUANTES.items():
    for c in ranquing[cursor:cursor + n]:
        c["raresa"] = raresa
    cursor += n
for c in ranquing[cursor:]:
    c["raresa"] = "bronze"

clubs = {k: dict(nom=v["nom"], curt=v["curt"], pais=v["pais"], color1=v["c1"], color2=v["c2"], text=v["t"]) for k, v in CLUBS.items()}
files = [[c["id"], c["club"], c["pos"], c["dorsal"], c["nom"], c["valor"], c["raresa"]] for c in cartes]

sortida = os.path.join(os.path.dirname(__file__), "..", "js", "cartes.js")
with open(sortida, "w", encoding="utf-8") as f:
    f.write("/* GENERAT AUTOMÀTICAMENT per eines/genera_dades.py. No l'editis a mà.\n")
    f.write("   Plantilles: uefa.com, llista A de la UWCL 2026/27 + titulars de la llista B.\n")
    f.write("   Valors: estimació pròpia, no oficial. */\n")
    f.write("var CLUBS_JOC = " + json.dumps(clubs, ensure_ascii=False, indent=1) + ";\n\n")
    f.write("// id, club, posició, dorsal, nom, valor, raresa\n")
    f.write("var FILES_CARTES = [\n" + ",\n".join(json.dumps(r, ensure_ascii=False) for r in files) + "\n];\n")
    f.write('\nif (typeof module === "object" && module.exports) module.exports = { CLUBS_JOC: CLUBS_JOC, FILES_CARTES: FILES_CARTES };\n')

from collections import Counter
print("Cartes:", len(cartes))
print("Per raresa:", Counter(c["raresa"] for c in cartes))
print("Per club:", {k: sum(1 for c in cartes if c["club"] == k) for k in CLUBS})
print("Per posició:", Counter(c["pos"] for c in cartes))
for r in ["llegenda", "or"]:
    sel = [c for c in ranquing if c["raresa"] == r]
    print(r, "valor", min(c["valor"] for c in sel), "-", max(c["valor"] for c in sel), ":", ", ".join(c["nom"] for c in sel[:12]))
print("Llindar plata:", min(c["valor"] for c in cartes if c["raresa"] == "plata"))
