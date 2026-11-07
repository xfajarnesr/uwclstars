// Peces comunes dels documents (nivell 4 juvenil i nivell 3 corporatiu de l'INS Manolo Hugué).
const fs = require("fs");
const d = require("docx");
const { Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, AlignmentType,
  Header, Footer, PageNumber, TabStopType, VerticalAlign, LevelFormat, HeightRule } = d;

const COL = { terracota: "D25033", terracotaFosc: "B23F26", taronja: "F4A65A", grisFosc: "34363A", grisSuau: "6E7076", corall: "E9B2A3", crema: "F6E7E1", grisClar: "D9D9DC" };
const FONT = "Poppins";
const AMPLE = 11906 - 2 * 1134; // A4 amb marges de 20 mm
const mm = (x) => Math.round(x * 56.7);
const img = (f) => fs.readFileSync(__dirname + "/" + f);

function run(t, o = {}) { return new TextRun({ text: t, font: FONT, size: o.size || 20, bold: o.bold, italics: o.italics, color: o.color || COL.grisFosc, superScript: o.sup, characterSpacing: o.spacing }); }

// Text amb **negreta** i ^superíndex^ senzills.
function rich(text, o = {}) {
  const parts = [];
  const re = /(\*\*[^*]+\*\*|\^[^^]+\^)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(run(text.slice(last, m.index), o));
    const s = m[0];
    if (s.startsWith("**")) parts.push(run(s.slice(2, -2), { ...o, bold: true }));
    else parts.push(run(s.slice(1, -1), { ...o, sup: true }));
    last = m.index + s.length;
  }
  if (last < text.length) parts.push(run(text.slice(last), o));
  return parts;
}

function p(text, o = {}) {
  return new Paragraph({ children: rich(text, o), spacing: { after: o.after ?? 120, line: o.line || 300, before: o.before || 0 }, alignment: o.align, keepNext: o.keepNext, indent: o.indent });
}


function ratlleta(curta) {
  const f = curta ? "ratlleta-punts-curta.png" : "ratlleta-punts.png";
  const ratio = curta ? 3550 / 400 : 8040 / 400;
  const h = curta ? 9 : 7;
  return new Paragraph({ spacing: { before: 120, after: 160 }, children: [new ImageRun({ type: "png", data: img(f), transformation: { width: Math.round(h * ratio), height: h } })] });
}

// Títol en dos tons: l'última paraula en terracota.
function titolDosTons(text, size = 52) {
  const i = text.lastIndexOf(" ");
  return new Paragraph({ spacing: { before: 0, after: 120, line: Math.round(size * 11) }, keepNext: true, children: [
    new TextRun({ text: text.slice(0, i + 1), font: FONT, bold: true, size, color: COL.grisFosc }),
    new TextRun({ text: text.slice(i + 1), font: FONT, bold: true, size, color: COL.terracota }),
  ] });
}

function seccio(text) {
  return [ratlleta(true), titolDosTons(text, 36)];
}

function subtitol(text) {
  return new Paragraph({ spacing: { before: 200, after: 80 }, keepNext: true, children: [new TextRun({ text, font: FONT, bold: true, size: 24, color: COL.terracotaFosc })] });
}

function cellBorders(c) {
  const b = { style: BorderStyle.SINGLE, size: 4, color: c || COL.corall };
  return { top: b, bottom: b, left: b, right: b };
}

// Taula juvenil: capçalera terracota amb text blanc i files alternes crema.
function taula(cap, files, amples, o = {}) {
  const total = amples.reduce((a, b) => a + b, 0);
  const fila = (cells, i, esCap) => new TableRow({ tableHeader: esCap, cantSplit: true, height: o.alt && !esCap ? { value: o.alt, rule: HeightRule.ATLEAST } : undefined, children: cells.map((t, j) => new TableCell({
    width: { size: amples[j], type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    borders: cellBorders(esCap ? COL.terracota : COL.corall),
    shading: esCap ? { type: ShadingType.CLEAR, fill: COL.terracota, color: "auto" } : (i % 2 ? { type: ShadingType.CLEAR, fill: COL.crema, color: "auto" } : undefined),
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    children: [new Paragraph({ alignment: j > 0 && o.dreta ? AlignmentType.RIGHT : AlignmentType.LEFT, children: rich(String(t), { size: 18, bold: esCap, color: esCap ? "FFFFFF" : COL.grisFosc }) })],
  })) });
  return [new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: amples, rows: [fila(cap, 0, true), ...files.map((f, i) => fila(f, i + 1, false))] }), new Paragraph({ spacing: { after: 120 }, children: [] })];
}

// Pregunta numerada amb línies per respondre.
function pregunta(num, text, linies = 4) {
  const out = [new Paragraph({ spacing: { before: 160, after: 80, line: 300 }, keepNext: true, children: [
    new TextRun({ text: num + "  ", font: FONT, bold: true, size: 22, color: COL.terracota }),
    ...rich(text, { size: 20 }),
  ] })];
  if (linies > 0) {
    const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
    const dot = { style: BorderStyle.DOTTED, size: 6, color: COL.corall };
    out.push(new Table({ width: { size: AMPLE, type: WidthType.DXA }, columnWidths: [AMPLE], rows: Array.from({ length: linies }, () => new TableRow({
      cantSplit: true, height: { value: 440, rule: HeightRule.EXACT },
      children: [new TableCell({ width: { size: AMPLE, type: WidthType.DXA }, borders: { top: none, left: none, right: none, bottom: dot }, children: [new Paragraph({ children: [] })] })],
    })) }));
  }
  return out;
}

function formula(text) {
  return new Paragraph({ spacing: { before: 80, after: 140 }, indent: { left: 280 }, border: { left: { style: BorderStyle.SINGLE, size: 18, color: COL.terracota, space: 8 } }, shading: { type: ShadingType.CLEAR, fill: COL.crema, color: "auto" }, children: rich(text, { size: 20 }) });
}

function caixa(titol, linies) {
  return [new Table({ width: { size: AMPLE, type: WidthType.DXA }, columnWidths: [AMPLE], rows: [new TableRow({ children: [new TableCell({
    width: { size: AMPLE, type: WidthType.DXA }, borders: cellBorders(COL.corall), shading: { type: ShadingType.CLEAR, fill: COL.crema, color: "auto" },
    margins: { top: 140, bottom: 140, left: 200, right: 200 },
    children: [new Paragraph({ spacing: { after: 80 }, children: [run(titol, { bold: true, color: COL.terracotaFosc, size: 20 })] }), ...linies.map((l) => p(l, { size: 19, after: 60 }))],
  })] })] }), new Paragraph({ spacing: { after: 120 }, children: [] })];
}

const numeracio = { config: [{ reference: "punts", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } }, run: { color: COL.taronja } } }] }] };
function punt(text) { return new Paragraph({ numbering: { reference: "punts", level: 0 }, spacing: { after: 60, line: 300 }, children: rich(text) }); }

function capJuvenil(text) {
  return new Header({ children: [
    new Paragraph({ tabStops: [{ type: TabStopType.LEFT, position: mm(16) }], children: [
      new ImageRun({ type: "png", data: img("logo-color.png"), transformation: { width: 46, height: 45 } }),
      new TextRun({ text: "\t" + text.toUpperCase(), font: FONT, bold: true, size: 14, color: COL.grisFosc, characterSpacing: 20 }),
    ] }),
    ratlleta(false),
  ] });
}

function peuNumero(text) {
  return new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
    new TextRun({ text: text + "  ", font: FONT, size: 14, color: COL.grisSuau }),
    new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 14, color: COL.grisSuau }),
  ] })] });
}

module.exports = { d, COL, FONT, AMPLE, mm, img, run, rich, p, ratlleta, titolDosTons, seccio, subtitol, taula, pregunta, formula, caixa, numeracio, punt, capJuvenil, peuNumero, cellBorders };
