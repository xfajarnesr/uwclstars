"""Informe de classe de UWCL Stars, compartible amb l'alumnat.

Ús:
  python3 eines/informe.py UWCL_Stars.xlsx informe.html            (amb codis)
  python3 eines/informe.py UWCL_Stars.xlsx informe.html --noms     (amb noms)

Llegeix el full de Google descarregat com a .xlsx (pestanyes Alumnes, Partides, Sobres)
i compara el que ha sortit a classe amb el que la teoria diu que hauria de sortir.
"""
import sys, os, re, json, math, collections, html
import openpyxl

RUTA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "js", "cartes.js")
BUTLLETES = {"bronze": 20, "plata": 17, "or": 11, "llegenda": 4}
NOM_RARESA = {"bronze": "Bronze", "plata": "Plata", "or": "Or", "llegenda": "Llegenda"}
COLOR = {"bronze": "#c27a3e", "plata": "#aab4c8", "or": "#f2c230", "llegenda": "#d946ef"}
FITES = {"primer": "Primer sobre", "or": "Brillantor", "llegenda": "Llegenda", "c50": "Mig centenar",
         "c100": "Centenar", "c200": "Gran col·lecció", "gira": "Gira europea", "club": "Plantilla completa",
         "onze": "Onze titular", "onze80": "Nivell Champions", "muralla": "Línia d'or", "unclub": "Fidelitat",
         "rep5": "Quina mania", "obrir100": "100 cromos oberts"}
CARTES_PER_SOBRE = 5


def carrega_cartes():
    s = open(RUTA, encoding="utf-8").read()
    bloc = s[s.index("var FILES_CARTES"):]
    return {m.group(1): m.group(2) for m in re.finditer(r'\["([A-Z]+-\d+)", "[A-Z]+", "[A-Z]+", \d+, ".*?", \d+, "(\w+)"\]', bloc)}


def llegeix(ruta):
    wb = openpyxl.load_workbook(ruta, data_only=True)
    noms = {}
    if "Alumnes" in wb.sheetnames:
        for r in wb["Alumnes"].iter_rows(min_row=2, values_only=True):
            if r[0]: noms[str(r[0]).strip()] = (r[1] or "").strip() if isinstance(r[1], str) else ""
    sobres = []
    for r in wb["Sobres"].iter_rows(min_row=2, values_only=True):
        if r[1] and r[3]:
            sobres.append({"codi": str(r[1]).strip(), "cartes": [x for x in r[3:3 + CARTES_PER_SOBRE] if x],
                           "raresa": [x for x in r[3 + CARTES_PER_SOBRE:3 + 2 * CARTES_PER_SOBRE] if x]})
    partides = {}
    for r in wb["Partides"].iter_rows(min_row=2, values_only=True):
        if r[0]:
            try: p = json.loads(r[6]) if r[6] else {}
            except Exception: p = {}
            partides[str(r[0]).strip()] = {"onze": r[4], "json": p}
    return noms, sobres, partides


def esc(x): return html.escape(str(x))


def barres_raresa(obs, esp, marge, n):
    """Gràfic de barres: observat (ple) contra esperat (ratlla) amb el marge ±2σ."""
    W, H, ml, mb = 640, 250, 50, 40
    mx = max([obs[k] / n for k in BUTLLETES] + [(esp[k] + marge[k]) / n for k in BUTLLETES]) * 1.1
    out = [f'<svg viewBox="0 0 {W} {H}" role="img" aria-label="Raresa observada contra esperada">']
    for t in range(0, 6):
        v = mx * t / 5
        y = H - mb - (H - mb - 20) * v / mx
        out.append(f'<line x1="{ml}" x2="{W-10}" y1="{y:.1f}" y2="{y:.1f}" stroke="#2b3a6b" stroke-width="1"/>'
                   f'<text x="{ml-6}" y="{y+4:.1f}" text-anchor="end" font-size="11" fill="#9fb0e0">{v*100:.0f}%</text>')
    bw = (W - ml - 20) / 4
    for i, k in enumerate(BUTLLETES):
        x = ml + i * bw + bw * 0.2
        w = bw * 0.6
        def Y(v): return H - mb - (H - mb - 20) * v / mx
        y = Y(obs[k] / n)
        out.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{H-mb-y:.1f}" fill="{COLOR[k]}" rx="3"/>')
        lo, hi = max(esp[k] - marge[k], 0) / n, (esp[k] + marge[k]) / n
        cx = x + w / 2
        out.append(f'<rect x="{x-6:.1f}" y="{Y(hi):.1f}" width="{w+12:.1f}" height="{Y(lo)-Y(hi):.1f}" fill="#ffffff" opacity=".13"/>'
                   f'<line x1="{x-6:.1f}" x2="{x+w+6:.1f}" y1="{Y(esp[k]/n):.1f}" y2="{Y(esp[k]/n):.1f}" stroke="#fff" stroke-width="2" stroke-dasharray="5 3"/>')
        out.append(f'<text x="{cx:.1f}" y="{min(y, Y(hi))-6:.1f}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">{obs[k]/n*100:.1f}%</text>'
                   f'<text x="{cx:.1f}" y="{H-mb+18}" text-anchor="middle" font-size="13" fill="#dfe7ff">{NOM_RARESA[k]}</text>')
    out.append('</svg>')
    return "".join(out)


def tira_sort(punts):
    """Cada alumne com un punt segons el seu z (sort en or + llegenda). Banda ±2."""
    W, H, ml = 640, 170, 30
    rang = 3.2
    def X(z): return ml + (W - 2 * ml) * (max(-rang, min(rang, z)) + rang) / (2 * rang)
    out = [f'<svg viewBox="0 0 {W} {H}" role="img" aria-label="Sort de cada alumne">']
    out.append(f'<rect x="{X(-2):.1f}" y="20" width="{X(2)-X(-2):.1f}" height="100" fill="#ffffff" opacity=".1" rx="6"/>')
    out.append(f'<line x1="{X(0):.1f}" x2="{X(0):.1f}" y1="16" y2="124" stroke="#fff" stroke-dasharray="5 3"/>')
    for z in range(-3, 4):
        out.append(f'<text x="{X(z):.1f}" y="142" text-anchor="middle" font-size="11" fill="#9fb0e0">{z}</text>')
    out.append(f'<text x="{X(-2.9):.1f}" y="162" font-size="11" fill="#9fb0e0">menys sort</text>'
               f'<text x="{X(2.9):.1f}" y="162" text-anchor="end" font-size="11" fill="#9fb0e0">més sort</text>')
    nivells = [0, -20, 20, -40, 40]
    ultim = {}
    for nom, z in sorted(punts, key=lambda p: p[1]):
        xx = X(z)
        for lv in nivells:
            if abs(xx - ultim.get(lv, -999)) > 34:
                break
        else:
            lv = nivells[len(ultim) % 5]
        ultim[lv] = xx
        y = 65 + lv * 0.9
        fora = abs(z) > 2
        out.append(f'<circle cx="{xx:.1f}" cy="{y:.1f}" r="6" fill="{"#ff4fa3" if fora else "#4fc3ff"}"/>'
                   f'<text x="{xx:.1f}" y="{y-9:.1f}" text-anchor="middle" font-size="9" fill="#fff">{esc(nom)}</text>')
    out.append('</svg>')
    return "".join(out)


def principal(ruta, sortida, amb_noms):
    raresa_de = carrega_cartes()
    noms, sobres, partides = llegeix(ruta)
    total_but = sum(BUTLLETES[r] for r in raresa_de.values())
    p = {k: sum(BUTLLETES[r] for r in raresa_de.values() if r == k) / total_but for k in BUTLLETES}
    p_carta = {c: BUTLLETES[r] / total_but for c, r in raresa_de.items()}

    per = collections.defaultdict(lambda: {"sobres": 0, "rar": collections.Counter(), "cartes": []})
    for s in sobres:
        a = per[s["codi"]]
        a["sobres"] += 1
        a["cartes"] += s["cartes"]
        a["rar"].update(s["raresa"] or [raresa_de.get(c, "?") for c in s["cartes"]])
    codis = sorted(per)
    etiqueta = lambda c: (noms.get(c) or c) if amb_noms else c

    n = sum(a["sobres"] for a in per.values()) * CARTES_PER_SOBRE
    npacks = n // CARTES_PER_SOBRE
    obs = collections.Counter()
    for a in per.values(): obs.update(a["rar"])
    esp = {k: n * p[k] for k in BUTLLETES}
    marge = {k: 2 * math.sqrt(n * p[k] * (1 - p[k])) for k in BUTLLETES}

    # Sobres amb almenys un or o llegenda
    q = p["or"] + p["llegenda"]
    amb_or = sum(1 for s in sobres if any(r in ("or", "llegenda") for r in s["raresa"]))
    esp_or = npacks * (1 - (1 - q) ** CARTES_PER_SOBRE)
    mar_or = 2 * math.sqrt(npacks * (1 - (1 - q) ** CARTES_PER_SOBRE) * (1 - q) ** CARTES_PER_SOBRE)

    files, punts = [], []
    esp_sense_llegenda = 0
    sense_llegenda = 0
    for c in codis:
        a = per[c]
        nc = a["sobres"] * CARTES_PER_SOBRE
        dif = len(set(a["cartes"]))
        esp_dif = sum(1 - (1 - pc) ** nc for pc in p_carta.values())
        rics = a["rar"]["or"] + a["rar"]["llegenda"]
        esp_rics = nc * q
        z = (rics - esp_rics) / math.sqrt(nc * q * (1 - q)) if nc else 0
        leg = a["rar"]["llegenda"]
        esp_sense_llegenda += (1 - p["llegenda"]) ** nc
        sense_llegenda += 1 if leg == 0 else 0
        pj = partides.get(c, {})
        fites = len(pj.get("json", {}).get("fitesVistes", []) or [])
        formacio = pj.get("json", {}).get("formacio", "—")
        files.append(dict(c=c, sobres=a["sobres"], dif=dif, esp_dif=esp_dif, rep=nc - dif, rics=rics,
                          esp_rics=esp_rics, z=z, leg=leg, onze=pj.get("onze"), fites=fites, formacio=formacio))
        punts.append((etiqueta(c), z))

    fite_cont = collections.Counter()
    for c in codis:
        fite_cont.update(partides.get(c, {}).get("json", {}).get("fitesVistes", []) or [])
    formacions = collections.Counter(f["formacio"] for f in files)

    def fila_raresa(k):
        dins = abs(obs[k] - esp[k]) <= marge[k]
        return (f'<tr><td><span class="pt" style="background:{COLOR[k]}"></span>{NOM_RARESA[k]}</td><td>{obs[k]}</td>'
                f'<td>{p[k]*100:.1f}%</td><td>{esp[k]:.1f}</td><td>{max(esp[k]-marge[k],0):.0f} – {esp[k]+marge[k]:.0f}</td>'
                f'<td class="{"ok" if dins else "fora"}">{"dins" if dins else "fora"}</td></tr>')

    taula_alumnes = "".join(
        f'<tr><td><b>{esc(etiqueta(f["c"]))}</b></td><td>{f["sobres"]}</td><td>{f["dif"]} <small>(esp. {f["esp_dif"]:.0f})</small></td>'
        f'<td>{f["rep"]}</td><td>{f["rics"]} <small>(esp. {f["esp_rics"]:.1f})</small></td><td>{f["leg"]}</td>'
        f'<td>{"" if f["onze"] in (None, "") else f["onze"]}</td><td>{f["fites"]}/14</td><td>{esc(f["formacio"])}</td></tr>' for f in files)
    taula_fites = "".join(
        f'<tr><td>{esc(FITES[k])}</td><td>{fite_cont[k]}</td><td><div class="barra"><i style="width:{100*fite_cont[k]/max(len(files),1):.0f}%"></i></div></td></tr>'
        for k in FITES)
    mes_rics = max(files, key=lambda f: f["rics"]) if files else None
    mes_dif = max(files, key=lambda f: f["dif"]) if files else None
    mes_rep = max(files, key=lambda f: f["rep"]) if files else None

    doc = f"""<!doctype html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>UWCL Stars · Informe de classe</title><style>
:root{{--nit:#0b1030;--card:#141b46;--lin:#2b3a6b;--blau:#4fc3ff;--mag:#ff4fa3;--tx:#e8edff;--ap:#9fb0e0}}
*{{box-sizing:border-box}}body{{margin:0;background:radial-gradient(1200px 600px at 70% -10%,#26307a 0,#0b1030 60%);color:var(--tx);font:16px/1.55 system-ui,Segoe UI,Roboto,sans-serif}}
main{{max-width:880px;margin:0 auto;padding:28px 18px 60px}}h1{{font-size:2rem;margin:.2em 0}}h2{{margin:1.8em 0 .4em;font-size:1.25rem;color:var(--blau)}}
.sub{{color:var(--ap)}}.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:18px 0}}
.k{{background:var(--card);border:1px solid var(--lin);border-radius:14px;padding:14px}}.k b{{display:block;font-size:1.9rem;line-height:1.1}}.k span{{color:var(--ap);font-size:.85rem}}
.box{{background:var(--card);border:1px solid var(--lin);border-radius:14px;padding:14px;margin:12px 0}}
table{{width:100%;border-collapse:collapse;font-size:.92rem}}th,td{{padding:7px 8px;border-bottom:1px solid var(--lin);text-align:left}}th{{color:var(--ap);font-weight:600}}
small{{color:var(--ap)}}.pt{{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:7px}}.ok{{color:#6ee7a0;font-weight:700}}.fora{{color:#ff7aa8;font-weight:700}}
.barra{{background:#0b1030;border-radius:99px;height:10px;min-width:120px}}.barra i{{display:block;height:10px;border-radius:99px;background:linear-gradient(90deg,var(--blau),var(--mag))}}
svg{{width:100%;height:auto;display:block}}@media print{{.box,tr,.k,.tw{{break-inside:avoid}}h2{{break-after:avoid}}}}.nota{{color:var(--ap);font-size:.88rem}}.tw{{overflow-x:auto}}
</style></head><body><main>
<p class="sub">Matemàtica aplicada · INS Manolo Hugué</p><h1>UWCL Stars: què ha passat a classe?</h1>
<p class="sub">Això és el que ha sortit de debò als vostres sobres, comparat amb el que la probabilitat diu que hauria de sortir.</p>
<div class="grid">
<div class="k"><b>{len(codis)}</b><span>jugadors amb sobres oberts</span></div>
<div class="k"><b>{npacks}</b><span>sobres oberts</span></div>
<div class="k"><b>{n}</b><span>cromos repartits</span></div>
<div class="k"><b>{obs['or']+obs['llegenda']}</b><span>cromos d'or o llegenda</span></div>
<div class="k"><b>{obs['llegenda']}</b><span>llegendes</span></div></div>

<h2>1. La sort de la classe, en una imatge</h2>
<div class="box">{barres_raresa(obs, esp, marge, n)}
<p class="nota">La barra de color és el que ha sortit. La ratlla blanca és el que s'esperava segons les butlletes, i la franja clara és el marge de ±2 desviacions típiques: si la barra hi cap, la classe ha tingut una sort normal.</p></div>
<div class="tw"><table><tr><th>Raresa</th><th>Han sortit</th><th>Probabilitat teòrica</th><th>Esperats</th><th>Marge normal</th><th></th></tr>
{"".join(fila_raresa(k) for k in BUTLLETES)}</table></div>

<h2>2. Sobres amb un cromo brillant</h2>
<div class="box"><p>Han tingut almenys un cromo d'or o llegenda <b>{amb_or} sobres de {npacks}</b> ({100*amb_or/max(npacks,1):.0f}%).
La teoria diu que això passa en un {100*(1-(1-q)**CARTES_PER_SOBRE):.1f}% dels sobres, o sigui uns <b>{esp_or:.0f}</b> (marge normal entre {max(esp_or-mar_or,0):.0f} i {esp_or+mar_or:.0f}).</p>
<p class="nota">Compte: un sobre té 5 cromos, i cadascun té un {q*100:.1f}% de ser or o llegenda. La probabilitat que cap dels cinc ho sigui és (1 − {q:.3f})⁵.</p></div>

<h2>3. Llegendes</h2>
<div class="box"><p>Cada cromo té un {p['llegenda']*100:.2f}% de ser llegenda. Amb els cromos que ha obert cada jugador, la teoria preveia que <b>{esp_sense_llegenda:.1f} de {len(codis)}</b> no en tindrien cap. N'hi ha <b>{sense_llegenda}</b>.</p>
<p class="nota">No tenir cap llegenda després de molts sobres no és mala sort estranya: amb una probabilitat tan petita per cromo, és el més habitual.</p></div>

<h2>4. Qui ha tingut més i menys sort?</h2>
<div class="box">{tira_sort(punts)}
<p class="nota">Cada punt és un jugador. Mesurem quants cromos d'or o llegenda ha tret en comparació amb els que tocaven (z = (observats − esperats) / desviació). La zona clara és la sort normal: dins de ±2. Un punt rosa surt de la zona. Amb pocs sobres aquesta aproximació és gruixuda, així que mireu-ho com una orientació.</p></div>

<h2>5. Col·leccions i repetits</h2>
<div class="box"><p>{('Més cromos diferents: <b>' + esc(etiqueta(mes_dif['c'])) + '</b> amb ' + str(mes_dif['dif']) + '. ') if mes_dif else ''}{('Més repetits: <b>' + esc(etiqueta(mes_rep['c'])) + '</b> amb ' + str(mes_rep['rep']) + '. ') if mes_rep else ''}{('Més cromos d\'or o llegenda: <b>' + esc(etiqueta(mes_rics['c'])) + '</b> amb ' + str(mes_rics['rics']) + '.') if mes_rics else ''}</p>
<p class="nota">Entre parèntesis, a la taula de sota, hi ha els cromos diferents que s'esperaven a partir de les probabilitats de totes les cartes. Si us en sortien menys dels esperats és perquè el bronze surt molt i es repeteix.</p></div>

<h2>6. Taula de cada jugador</h2>
<div class="tw"><table><tr><th>Jugador</th><th>Sobres</th><th>Diferents</th><th>Repetits</th><th>Or + llegenda</th><th>Llegendes</th><th>Valor onze</th><th>Fites</th><th>Formació</th></tr>{taula_alumnes}</table></div>

<h2>7. Fites desbloquejades</h2>
<div class="tw"><table><tr><th>Fita</th><th>Jugadors</th><th></th></tr>{taula_fites}</table></div>
<p class="nota">Formacions triades: {", ".join(f"{esc(k)} ({v})" for k, v in formacions.most_common())}.</p>
<p class="nota">Probabilitats calculades amb les butlletes del joc: bronze {BUTLLETES['bronze']}, plata {BUTLLETES['plata']}, or {BUTLLETES['or']}, llegenda {BUTLLETES['llegenda']} per cromo ({total_but} en total).</p>
</main></body></html>"""
    open(sortida, "w", encoding="utf-8").write(doc)
    print("ok", sortida, "jugadors", len(codis), "sobres", npacks, dict(obs))


if __name__ == "__main__":
    a = [x for x in sys.argv[1:] if not x.startswith("--")]
    principal(a[0], a[1] if len(a) > 1 else "informe.html", "--noms" in sys.argv)
