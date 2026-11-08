// Fitxa de l'alumnat per fases. node fitxa.js
const fs = require("fs");
const E = require("./estil.js");
const { d, COL, AMPLE, p, seccio, subtitol, taula, formula, caixa, punt, titolDosTons, preguntaQ, quadre } = E;
const { Document, Packer, Paragraph, PageBreak, TextRun } = d;

const URL = "https://xfajarnesr.github.io/uwclstars/";
const salt = () => new Paragraph({ children: [new PageBreak()] });
const cos = [];
const add = (...x) => x.forEach((e) => (Array.isArray(e) ? cos.push(...e) : cos.push(e)));
const dues = (a) => [Math.round(AMPLE * a), AMPLE - Math.round(AMPLE * a)];

/* ---- Portada ---- */
add(
  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Matemàtica aplicada", font: E.FONT, bold: true, size: 40, color: COL.terracota })] }),
  titolDosTons("Què hi ha dins d'un sobre?", 56),
  p("Els sobres de cromos i les caixes botí dels videojocs funcionen igual: pagues per una sorpresa que no tries. Primer jugaràs a **UWCL Stars**, un joc de sobres amb les jugadores de la Champions femenina. Després n'obriràs el motor per entendre per què algunes cartes costen tant d'aconseguir. Al final, crearàs el teu propi joc.", { after: 160 }),
  ...caixa("Per entrar al joc", [
    "Web: " + URL,
    "El teu codi: ______________",
    "Amb el codi recuperes la partida des de qualsevol ordinador. Les gemmes les dona el professor.",
  ]),
  ...taula(["Fase", "Què farem"], [
    ["1 · Comencem", "Pensar en els sobres i les caixes botí, i jugar."],
    ["2 · Comparem", "Ajuntar les dades de tota la classe."],
    ["3 · Obrim el laboratori", "Veure com funciona el joc, canviar-ne les regles i descobrir jocs trucats."],
    ["4 · Creem el nostre joc", "Dissenyar un joc de sobres propi, amb la seva base de dades i les seves probabilitats."],
  ], dues(0.3)),
);

/* ---- Fase 1 ---- */
add(salt(), ...seccio("Fase 1 · Comencem"));
add(p("Abans de jugar, pensa en els sobres i les caixes botí que coneixes: cromos de futbol, sobres de cartes, cofres i caixes dels videojocs (FC, Fortnite, Brawl Stars, Genshin…)."));
add(...preguntaQ("1", "Escriu un exemple de sobre o caixa botí que coneguis. Què paga el jugador i què pot obtenir a canvi?", 3));
add(...preguntaQ("2", "Per què creus que els cromos o personatges millors són difícils d'aconseguir? A qui li interessa que sigui així?", 3));
add(subtitol("Juga"));
add(punt("Entra a la web amb el teu codi."), punt("Obre sobres d'un en un o de cinc en cinc. Cada sobre costa 1 gemma."), punt("Mira l'àlbum i munta el teu onze a «El meu onze»."));
add(subtitol("Apunta els teus resultats"));
add(...taula(["Dada", "Valor"], [["Sobres oberts", ""], ["Cromos de bronze", ""], ["Cromos de plata", ""], ["Cromos d'or", ""], ["Llegendes", ""], ["Cromos diferents", ""], ["Valor del teu onze", ""]], dues(0.7), { alt: 400 }));
add(...preguntaQ("3", "Quin percentatge dels teus cromos són d'or? Escriu el càlcul.", 2));
add(...preguntaQ("4", "Mentre jugaves, has tingut ganes d'obrir més sobres? Què te'n donava ganes: l'animació, un cromo que et faltava, l'onze, les fites…?", 3));

/* ---- Fase 2 ---- */
add(salt(), ...seccio("Fase 2 · Comparem"));
add(p("El professor us ensenyarà el full on queden registrats tots els sobres de la classe. Apunta els totals i calcula el percentatge de cada raresa."));
add(...taula(["Raresa", "Cromos de tota la classe", "Percentatge"], [["Bronze", "", ""], ["Plata", "", ""], ["Or", "", ""], ["Llegenda", "", ""], ["**Total**", "", "100%"]], [Math.round(AMPLE * 0.4), Math.round(AMPLE * 0.3), AMPLE - Math.round(AMPLE * 0.7)], { alt: 420 }));
add(...preguntaQ("5", "Compara el percentatge d'or de la classe amb el teu (pregunta 3). Quin dels dos s'acosta més a la probabilitat real que un cromo sigui d'or? Per què?", 4));

/* ---- Fase 3 ---- */
add(salt(), ...seccio("Fase 3 · Obrim el laboratori"));
add(p("Ara al joc hi ha una pestanya nova, **Laboratori**. El que hi facis no compta per a la teva col·lecció."));
add(subtitol("Com funciona"));
add(p("Llegeix l'apartat «Les butlletes». Cada cromo té unes quantes butlletes dins d'una urna, i el joc en treu una a l'atzar per a cada cromo del sobre."));
add(...preguntaQ("6", "Hi ha 110 cromos de plata i cadascun té 17 butlletes. En total, el joc té 7.890 butlletes. Quina és la probabilitat que un cromo sigui de plata? Escriu el càlcul.", 2));
add(formula("P(almenys una llegenda en n sobres) = 1 − (1 − 0,0251)^n^       (0,0251 és la probabilitat que un sobre porti una llegenda)"));
add(...preguntaQ("7", "Amb la fórmula, quants sobres cal obrir per tenir almenys un 50% de probabilitat d'aconseguir una llegenda? I un 90%? Explica com ho has trobat.", 4));
add(...preguntaQ("8", "Un amic et diu: «Porto 60 sobres sense llegenda, el pròxim segur que en porta una». Té raó? Explica per què.", 3));
add(subtitol("Simulador"));
add(p("Al **Simulador** pots canviar les regles i simular molts jugadors. Fes aquestes tres simulacions i apunta les medianes."));
add(...taula(["Regles", "Sobres fins a la 1a llegenda (mediana)", "Sobres per completar l'àlbum (mediana)"], [
  ["Les del joc (prem «Torna a les regles del joc»)", "", ""],
  ["Llegenda garantida cada 40 sobres", "", ""],
  ["20 repetides es canvien per un cromo que falta", "", ""],
], [Math.round(AMPLE * 0.46), Math.round(AMPLE * 0.27), AMPLE - Math.round(AMPLE * 0.73)], { alt: 480 }));
add(...preguntaQ("9", "Quina de les dues regles ajuda més a completar l'àlbum? Per què creus que passa?", 4));
add(subtitol("Auditoria"));
add(p("A l'**Auditoria** hi ha sis jocs que diuen que tenen les mateixes probabilitats que UWCL Stars, però algun menteix. El professor et dirà quin joc has d'auditar. Obre'n els 200 sobres (1.000 cromos) i omple la taula."));
add(...taula(["Raresa", "Cromos esperats si el joc és honest", "Marge normal", "Cromos que t'han sortit", "Dins del marge?"], [
  ["Bronze", "702", "673 a 731", "", ""], ["Plata", "237", "210 a 264", "", ""], ["Or", "56", "41 a 70", "", ""], ["Llegenda", "5", "1 a 10", "", ""],
], [1700, 2000, 1800, 2000, AMPLE - 7500], { alt: 420 }));
add(p("El marge normal és l'esperat més o menys dues desviacions típiques. Un joc honest se'n surt molt poques vegades.", { size: 18, color: COL.grisSuau }));
add(...preguntaQ("10", "Joc auditat: _____. És honest o trucat? Si és trucat, quina raresa han tocat? Justifica-ho amb la taula.", 3));

/* ---- Fase 4 ---- */
add(salt(), ...seccio("Fase 4 · Creem el nostre joc"));
add(p("En grups de 2 o 3, dissenyareu un joc de sobres sobre el tema que vulgueu. Ha de ser fàcil de començar a jugar però difícil de completar, com passa als jocs reals."));
add(p("Tot joc d'aquest tipus té **ítems** que surten dels sobres, **grups** que els organitzen, **categories** que diuen on pot anar cada ítem dins l'equip i una **raresa** que decideix com de difícil és aconseguir-los. Mireu com es fa a UWCL Stars i com es podria fer en altres jocs:"));
add(...taula(["Joc", "Ítems", "Grups", "Categories i equip"], [
  ["UWCL Stars", "Jugadores", "Clubs", "4 posicions; equip d'11 (1 portera, 4 defenses, 3 migcampistes, 3 davanteres)"],
  ["Civilització medieval", "Personatges", "Regnes", "Mags, guerrers, reialesa; equip de 2 + 3 + 1"],
  ["Accelerant", "Vehicles", "Marques", "Cotxes, motos, camions; flota de 3 + 2 + 1"],
], [2100, 1700, 1500, AMPLE - 5300]));
add(subtitol("El vostre disseny"));
const camps = [
  ["Títol i objectiu", "De què va el joc i què ha d'aconseguir el jugador.", 3],
  ["Ítems", "Què col·lecciona el jugador. Escriviu-ne alguns exemples, també d'exclusius.", 3],
  ["Grups", "Com s'organitzen els ítems (com els clubs a UWCL).", 2],
  ["Categories i equip", "Quines categories hi ha i quantes places de cada una té l'equip.", 3],
  ["Puntuació", "Entre quins valors va la puntuació i quins valors són els més habituals.", 2],
  ["Rareses i probabilitats", "Quants ítems de cada raresa i quantes butlletes té cadascun.", 3],
  ["Economia", "Gemmes inicials, preu del sobre i ítems per sobre.", 2],
];
for (const [t, ajuda, l] of camps) {
  add(new Paragraph({ spacing: { before: 140, after: 40 }, keepNext: true, children: [new TextRun({ text: t, font: E.FONT, bold: true, size: 20, color: COL.grisFosc }), new TextRun({ text: "  " + ajuda, font: E.FONT, size: 18, color: COL.grisSuau })] }));
  add(...quadre(l * 420));
}
add(subtitol("Del disseny al joc"));
add(p("El professor us passarà un kit amb tres fitxers:"));
add(punt("**base-de-dades.xlsx**: la base de dades de UWCL Stars, per veure com es fa, i les pestanyes «El nostre joc» i «Els nostres grups» per omplir la vostra. La pestanya «El nostre resum» calcula les probabilitats."),
  punt("**plantilla-joc.html**: UWCL Stars en un sol fitxer, preparat per canviar-li la base de dades."),
  punt("**prompt.md**: un text per demanar a una IA que transformi la plantilla en el vostre joc. Té un espai per a cada apartat del vostre disseny."));
add(p("Passos: 1) ompliu la base de dades; 2) ompliu el prompt i doneu-lo a la IA amb la plantilla i les vostres taules; 3) obriu el fitxer que us torni i jugueu-hi; 4) comproveu que les probabilitats del joc són les del vostre full."));
add(...preguntaQ("11", "Quina és la probabilitat del vostre ítem més rar? Quants sobres caldria obrir de mitjana per aconseguir-lo? Escriviu el càlcul.", 4));
add(...preguntaQ("12", "Com heu repartit les butlletes perquè el joc sigui fàcil de començar però difícil de completar? Doneu-ne números.", 4));
add(subtitol("Com s'avaluarà"));
add(...taula(["Criteri", "Assoliment satisfactori", "Assoliment notable", "Assoliment excel·lent"], [
  ["Disseny", "Tots els apartats estan omplerts i s'entenen.", "Els apartats estan ben explicats i no admeten dubtes.", "Els apartats estan molt detallats i tenen coherència entre ells."],
  ["Originalitat", "No és un joc de futbol 11.", "No és un joc esportiu.", "No s'assembla a cap dels exemples."],
  ["Base de dades", "Més de 2 categories i 50 ítems.", "Més de 3 categories i 100 ítems.", "Més de 4 categories, 150 ítems i ítems exclusius."],
  ["Probabilitats", "Cada ítem té butlletes i les rareses tenen sentit.", "És fàcil començar i difícil completar, i es nota als números.", "La distribució està molt ben pensada i justificada amb càlculs."],
  ["Funcionament", "El joc fa sortejos, però alguna cosa falla.", "Funciona i l'equip té sentit, amb algun error petit.", "Tot funciona i les probabilitats coincideixen amb el full."],
], [1700, 2650, 2650, AMPLE - 7000]));

/* ---- Reflexió ---- */
add(...seccio("Per acabar"));
add(...preguntaQ("13", "Ara que has fet el teu joc: quines parts de UWCL Stars estaven pensades perquè obrissis més sobres?", 3));
add(...preguntaQ("14", "Saber les probabilitats és suficient per protegir qui juga, sobretot si és menor d'edat? Què més caldria?", 4));

const doc = new Document({
  creator: "INS Manolo Hugué",
  title: "UWCL Stars: fitxa de l'alumnat",
  numbering: E.numeracio,
  styles: { default: { document: { run: { font: E.FONT, size: 20, color: COL.grisFosc } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: E.mm(28), bottom: E.mm(18), left: E.mm(20), right: E.mm(20), header: E.mm(10), footer: E.mm(8) } } },
    headers: { default: E.capJuvenil("Institut Manolo Hugué · Matemàtica aplicada") },
    footers: { default: E.peuNumero("Nom: ______________________") },
    children: cos,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync("UWCL_Stars_fitxa_alumnat.docx", b); console.log("ok"); });
