"""Genera kit/base-de-dades.xlsx: la base de dades de UWCL Stars i una plantilla buida per al joc de cada grup.
python3 eines/fes_full.py
"""
import json, os, re
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule

ARREL = os.path.join(os.path.dirname(__file__), "..")
txt = open(os.path.join(ARREL, "js/cartes.js"), encoding="utf-8").read()
clubs = json.loads(re.search(r"var CLUBS_JOC = (\{.*?\});", txt, re.S).group(1))
files = json.loads(re.search(r"var FILES_CARTES = (\[.*?\]);", txt, re.S).group(1))
BUTLLETES = {"bronze": 20, "plata": 17, "or": 11, "llegenda": 4}
RARESES = ["bronze", "plata", "or", "llegenda"]
MAX = 600  # files preparades a la plantilla

F = "Arial"
cap_font = Font(name=F, bold=True, color="FFFFFF")
cap_fill = PatternFill("solid", fgColor="D25033")
editable = PatternFill("solid", fgColor="FFF4C2")
exemple = Font(name=F, italic=True, color="6E7076")
normal = Font(name=F)
titol = Font(name=F, bold=True, size=14, color="B23F26")
fi = Side(style="thin", color="E9B2A3")

wb = Workbook()

def capcalera(ws, noms, amples, fila=1):
    for i, (n, a) in enumerate(zip(noms, amples), start=1):
        c = ws.cell(row=fila, column=i, value=n)
        c.font, c.fill = cap_font, cap_fill
        c.alignment = Alignment(vertical="center", wrap_text=True)
        ws.column_dimensions[c.column_letter].width = a
    ws.freeze_panes = ws.cell(row=fila + 1, column=1)

COLS = ["id", "grup", "categoria", "número", "nom", "valor", "raresa", "butlletes", "probabilitat d'aquest ítem"]
AMPLES = [12, 9, 11, 9, 30, 8, 11, 11, 16]

# ---- Com funciona ----
ws = wb.active
ws.title = "Com funciona"
ws.column_dimensions["A"].width = 110
linies = [
    ("Base de dades del joc de sobres", titol),
    ("", normal),
    ("Aquest full té dues parts. Les pestanyes «UWCL ...» són la base de dades del joc UWCL Stars: mireu-les per entendre com funciona.", normal),
    ("Les pestanyes «El nostre ...» són per al vostre joc. Les cel·les grogues són les que heu d'omplir; les blanques es calculen soles.", normal),
    ("", normal),
    ("Les columnes de les cartes", Font(name=F, bold=True)),
    ("id: un codi únic per a cada ítem, sense espais (per exemple FOC-01).", normal),
    ("grup: el codi del grup a què pertany (a UWCL, el club). Ha de ser a la pestanya de grups.", normal),
    ("categoria: el codi de la categoria (a UWCL, la posició: POR, DEF, MIG, DAV). Decideix on pot jugar dins de l'equip.", normal),
    ("número: un número per a l'ítem (a UWCL, el dorsal).", normal),
    ("nom: el nom que es veurà al cromo.", normal),
    ("valor: la puntuació de l'ítem. El valor de l'equip és la mitjana dels valors.", normal),
    ("raresa: bronze, plata, or o llegenda. Decideix el color del marc. Podeu canviar-ne el nom al joc, però aquí s'escriuen així.", normal),
    ("butlletes: quantes butlletes té aquest ítem a l'urna. Com més butlletes, més sovint surt.", normal),
    ("probabilitat: es calcula sola, butlletes de l'ítem ÷ butlletes totals.", normal),
    ("", normal),
    ("Com passar-ho al joc", Font(name=F, bold=True)),
    ("1. Seleccioneu la taula de cartes des de la cel·la A1 fins a l'última fila de la columna H (sense la columna de probabilitat) i copieu-la.", normal),
    ("2. A la plantilla HTML, al bloc BASE DE DADES, enganxeu-la entre les cometes inverses de TAULA_CARTES, substituint les cartes de UWCL.", normal),
    ("3. Feu el mateix amb la taula de grups (columnes A a F) a TAULA_GRUPS.", normal),
    ("4. Si el joc no arrenca, la pantalla diu a quina fila hi ha l'error.", normal),
]
for i, (t, f) in enumerate(linies, start=1):
    c = ws.cell(row=i, column=1, value=t)
    c.font = f
    c.alignment = Alignment(wrap_text=True)

# ---- UWCL Cartes ----
ws = wb.create_sheet("UWCL cartes")
capcalera(ws, COLS, AMPLES)
n = len(files)
for r, f in enumerate(files, start=2):
    vals = [f[0], f[1], f[2], f[3], f[4], f[5], f[6], BUTLLETES[f[6]]]
    for j, v in enumerate(vals, start=1):
        ws.cell(row=r, column=j, value=v).font = normal
    c = ws.cell(row=r, column=9, value=f"=H{r}/SUM($H$2:$H${n + 1})")
    c.number_format = "0.000%"
    c.font = normal

# ---- UWCL Grups ----
GCOLS = ["codi", "nom", "nom curt", "color 1", "color 2", "color text"]
GAMPLES = [9, 24, 14, 11, 11, 11]
ws = wb.create_sheet("UWCL grups")
capcalera(ws, GCOLS, GAMPLES)
for r, (k, v) in enumerate(clubs.items(), start=2):
    for j, x in enumerate([k, v["nom"], v["curt"], v["color1"], v["color2"], v["text"]], start=1):
        ws.cell(row=r, column=j, value=x).font = normal

def resum(ws, full, files_max, ambSobre=True):
    rang = lambda col: f"'{full}'!${col}$2:${col}${files_max}"
    ws.column_dimensions["A"].width = 32
    for col in "BCDE":
        ws.column_dimensions[col].width = 18
    ws["A1"] = "Ítems per sobre"
    ws["A1"].font = Font(name=F, bold=True)
    ws["B1"] = 5
    ws["B1"].fill = editable
    ws["C1"] = "Canvieu-ho si el vostre sobre té un altre nombre d'ítems."
    ws["C1"].font = exemple
    for j, h in enumerate(["raresa", "ítems", "butlletes", "P(raresa) per ítem", "P(almenys 1) per sobre"], start=1):
        c = ws.cell(row=3, column=j, value=h)
        c.font, c.fill = cap_font, cap_fill
    for i, r in enumerate(RARESES, start=4):
        ws.cell(row=i, column=1, value=r).font = normal
        ws.cell(row=i, column=2, value=f'=COUNTIF({rang("G")},A{i})').font = normal
        ws.cell(row=i, column=3, value=f'=SUMIF({rang("G")},A{i},{rang("H")})').font = normal
        c = ws.cell(row=i, column=4, value=f"=IFERROR(C{i}/$C$8,0)")
        c.number_format = "0.00%"
        c = ws.cell(row=i, column=5, value=f"=1-(1-D{i})^$B$1")
        c.number_format = "0.00%"
    ws.cell(row=8, column=1, value="Total").font = Font(name=F, bold=True)
    ws.cell(row=8, column=2, value="=SUM(B4:B7)").font = Font(name=F, bold=True)
    ws.cell(row=8, column=3, value="=SUM(C4:C7)").font = Font(name=F, bold=True)
    c = ws.cell(row=8, column=4, value="=SUM(D4:D7)")
    c.number_format, c.font = "0.00%", Font(name=F, bold=True)
    ws["A10"] = "Sobres de mitjana fins a la primera llegenda"
    ws["B10"] = "=IFERROR(1/E7,0)"
    ws["B10"].number_format = "0.0"
    ws["A11"] = "Ítems amb una raresa no vàlida (ha de ser 0)"
    ws["B11"] = f'=SUMPRODUCT(({rang("A")}<>"")*(ISNA(MATCH({rang("G")},A4:A7,0))))'
    for a in ("A10", "A11", "B10", "B11"):
        ws[a].font = normal

ws = wb.create_sheet("UWCL resum")
resum(ws, "UWCL cartes", n + 1)

# ---- El nostre joc ----
ws = wb.create_sheet("El nostre joc")
capcalera(ws, COLS, AMPLES)
ex = ["FOC-01", "FOC", "MAG", 1, "Bruixa Piruixa (exemple: esborreu-la)", 72, "plata", 15]
for j, v in enumerate(ex, start=1):
    c = ws.cell(row=2, column=j, value=v)
    c.font = exemple
for r in range(2, MAX + 2):
    for j in range(1, 9):
        ws.cell(row=r, column=j).fill = editable
        if r > 2:
            ws.cell(row=r, column=j).font = normal
    c = ws.cell(row=r, column=9, value=f'=IF(H{r}="","",H{r}/SUM($H$2:$H${MAX + 1}))')
    c.number_format = "0.000%"
    c.font = normal
dv = DataValidation(type="list", formula1='"bronze,plata,or,llegenda"', allow_blank=True)
dv.error = "La raresa ha de ser bronze, plata, or o llegenda."
ws.add_data_validation(dv)
dv.add(f"G2:G{MAX + 1}")
dvb = DataValidation(type="whole", operator="greaterThanOrEqual", formula1="1", allow_blank=True)
dvb.error = "Les butlletes han de ser un nombre enter d'1 o més."
ws.add_data_validation(dvb)
dvb.add(f"H2:H{MAX + 1}")
ws.conditional_formatting.add(f"A2:A{MAX + 1}", FormulaRule(formula=[f'AND(A2<>"",COUNTIF($A$2:$A${MAX + 1},A2)>1)'], fill=PatternFill("solid", fgColor="F4B6B6")))

ws = wb.create_sheet("Els nostres grups")
capcalera(ws, GCOLS, GAMPLES)
for j, v in enumerate(["FOC", "Reialme del foc", "Foc", "#c0392b", "#f39c12", "#ffffff"], start=1):
    ws.cell(row=2, column=j, value=v).font = exemple
for r in range(2, 32):
    for j in range(1, 7):
        ws.cell(row=r, column=j).fill = editable
ws["H1"] = "Els colors s'escriuen en format #rrggbb. Podeu triar-los a htmlcolorcodes.com."
ws["H1"].font = exemple

ws = wb.create_sheet("El nostre resum")
resum(ws, "El nostre joc", MAX + 1)

for s in wb.worksheets:
    s.sheet_view.showGridLines = s.title not in ("Com funciona",)
os.makedirs(os.path.join(ARREL, "kit"), exist_ok=True)
out = os.path.join(ARREL, "kit", "base-de-dades.xlsx")
wb.save(out)
print(out)
