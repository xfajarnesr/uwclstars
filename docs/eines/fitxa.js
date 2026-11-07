// Fitxa de l'alumnat. node fitxa.js
const fs = require("fs");
const E = require("./estil.js");
const { d, COL, AMPLE, p, seccio, subtitol, taula, pregunta, formula, caixa, punt, titolDosTons } = E;
const { Document, Packer, Paragraph, PageBreak, ImageRun, TextRun } = d;

const URL = "https://xfajarnesr.github.io/uwclstars/";
const A3 = [Math.round(AMPLE * 0.5), Math.round(AMPLE * 0.25), AMPLE - Math.round(AMPLE * 0.5) - Math.round(AMPLE * 0.25)];
const salt = () => new Paragraph({ children: [new PageBreak()] });

const cos = [];
const add = (...x) => x.forEach((e) => (Array.isArray(e) ? cos.push(...e) : cos.push(e)));

/* ---- Portada breu ---- */
add(
  new Paragraph({ spacing: { after: 200 }, children: [new ImageRun({ type: "png", data: E.img("segell-curs-26-27.png"), transformation: { width: 70, height: 70 } })] }),
  titolDosTons("Què hi ha dins d'un sobre?", 56),
  p("Matemàtica aplicada · 1r de Batxillerat · UWCL Stars", { color: COL.grisSuau, size: 22, after: 240 }),
  p("Els sobres de cromos i les caixes botí dels videojocs funcionen igual: pagues per una sorpresa que no tries. En aquestes sessions jugaràs a **UWCL Stars**, un joc de sobres amb les jugadores de la Champions femenina, i després n'obriràs el motor per entendre per què algunes cartes costen tant d'aconseguir, qui decideix les regles i com es pot comprovar si un joc diu la veritat."),
  p("Respon sempre amb **les teves dades**: cada alumne obté uns sobres diferents, així que les respostes no poden ser iguals. Quan facis un càlcul, escriu-lo sencer, no només el resultat."),
  ...caixa("Abans de començar", [
    "Web del joc: " + URL,
    "El teu codi: ______________  (no el comparteixis amb ningú)",
    "Amb el codi recuperes la partida des de qualsevol ordinador. Les gemmes te les dona el professor a cada sessió.",
  ]),
  ...taula(["Sessió", "Què farem", "On"], [
    ["1", "A cegues: jugar sense saber les regles", "Sobres, Àlbum, El meu onze"],
    ["2", "Les dades de la classe", "Full de la classe"],
    ["3", "Com funciona: butlletes i probabilitats", "Laboratori"],
    ["4", "Les regles que no veus", "Laboratori > Simulador"],
    ["5", "Auditoria de jocs misteriosos", "Laboratori > Auditoria"],
    ["6", "Dissenyeu el vostre joc i reflexió final", "Simulador i la vostra versió"],
  ], [1100, 5000, AMPLE - 6100]),
);

/* ---- Sessió 1 ---- */
add(salt(), ...seccio("Sessió 1 · A cegues"));
add(subtitol("Abans d'obrir cap sobre"), p("Respon aquestes dues preguntes ara, abans de jugar. No hi ha respostes dolentes: després les compararem amb el que passa de veritat."));
add(...pregunta("1", "Quants sobres de 5 cromos creus que cal obrir per tenir almenys una llegenda? I per completar l'àlbum de 437 cromos?", 2));
add(...pregunta("2", "De cada 100 cromos, quants creus que seran de cada raresa?", 0));
add(...taula(["Raresa", "La meva predicció (de cada 100)", "El que m'ha sortit (sessió 1)"], [["Bronze", "", ""], ["Plata", "", ""], ["Or", "", ""], ["Llegenda", "", ""]], A3, { alt: 420 }));
add(subtitol("Juga"));
add(punt("Entra a la web amb el teu codi. Tens les gemmes que t'hagi donat el professor; cada sobre en costa 1."), punt("Obre els sobres quan vulguis, d'un en un o de cinc en cinc. Mira l'àlbum i munta el teu onze."), punt("No cal gastar-ho tot de cop. Decideix tu com jugues."));
add(subtitol("Apunta"));
add(...taula(["Dada", "Valor"], [
  ["Sobres oberts", ""], ["Cromos de bronze", ""], ["Cromos de plata", ""], ["Cromos d'or", ""], ["Llegendes", ""],
  ["Cromos diferents", ""], ["Còpies repetides", ""], ["Sobre en què va sortir la primera llegenda (si n'hi ha)", ""], ["Valor del teu onze", ""],
], [Math.round(AMPLE * 0.7), AMPLE - Math.round(AMPLE * 0.7)], { alt: 400 }));
add(subtitol("Pensa"));
add(...pregunta("3", "Compara la teva predicció de la pregunta 2 amb el que t'ha sortit. On t'has equivocat més?", 3));
add(...pregunta("4", "Amb els teus cromos, estima la probabilitat que un cromo sigui d'or. Escriu el càlcul. Quina confiança tens en aquest número? Per què?", 4));
add(...pregunta("5", "Hi ha hagut algun moment en què has tingut ganes de seguir obrint sobres? Què ho provocava: l'animació, un cromo que et faltava, l'onze, les fites…?", 4));

/* ---- Sessió 2 ---- */
add(salt(), ...seccio("Sessió 2 · Les dades de la classe"));
add(p("El professor us ensenyarà el full on queden registrats tots els sobres que ha obert la classe. Apunta els totals."));
add(...taula(["Raresa", "Cromos de tota la classe", "Freqüència relativa (%)"], [["Bronze", "", ""], ["Plata", "", ""], ["Or", "", ""], ["Llegenda", "", ""], ["**Total**", "", "100%"]], A3, { alt: 420 }));
add(...pregunta("6", "Compara la freqüència de l'or de la classe amb la teva estimació de la pregunta 4. Quina de les dues és més fiable per estimar la probabilitat real? Per què?", 4));
add(...pregunta("7", "Quants companys tenen almenys una llegenda? Quina proporció de la classe és?", 2));
add(formula("P(cap llegenda en un sobre) = (1 − p)^5^        P(cap llegenda en 20 sobres) = (1 − p)^100^"));
add(...pregunta("8", "Fes servir la freqüència de llegendes de la classe com a estimació de la probabilitat **p** que un cromo sigui llegenda. Calcula la probabilitat que un sobre de 5 cromos **no** tingui cap llegenda, i la probabilitat que **20 sobres** no en tinguin cap. Compara-ho amb la pregunta 7.", 5));
add(...pregunta("9", "Quin percentatge dels teus cromos són repetits? Si obrissis 20 sobres més, creus que aquest percentatge pujaria o baixaria? Per què?", 4));

/* ---- Sessió 3 ---- */
add(salt(), ...seccio("Sessió 3 · Com funciona"));
add(p("Ara el professor activa el **Laboratori**. Res del que facis allà no compta per a la teva col·lecció. Comença per la pestanya **Com funciona** i llegeix l'apartat de les butlletes."));
add(...pregunta("10", "Comprova amb la calculadora la probabilitat que un cromo sigui de plata: butlletes totals de plata ÷ butlletes totals del joc. Escriu el càlcul. S'assembla a la freqüència de la classe?", 3));
add(...pregunta("11", "Calcula la probabilitat d'un cromo de plata **concret** i d'un cromo de bronze **concret**. Són gairebé iguals. Aleshores, per què el grup de plata és molt més rar que el de bronze?", 4));
add(formula("P(almenys una llegenda en n sobres) = 1 − (1 − q)^n^, on q és la probabilitat que un sobre porti alguna llegenda"));
add(...pregunta("12", "Amb la fórmula de sota, troba quants sobres calen perquè la probabilitat de tenir almenys una llegenda passi del 50%. I del 90%? Explica com ho has trobat (provant valors o amb logaritmes).", 5));
add(...pregunta("13", "La pantalla diu que la primera llegenda arriba de mitjana al sobre 40, però que la meitat dels jugadors la tenen abans del sobre 28. Explica amb paraules què vol dir cada número i per què no coincideixen.", 4));
add(subtitol("Sobres il·limitats"));
add(p("Ves a **Sobres il·limitats** i obre 1.000 sobres. Apunta-ho."));
add(...taula(["Raresa", "Freqüència en 1.000 sobres", "Probabilitat teòrica"], [["Bronze", "", ""], ["Plata", "", ""], ["Or", "", ""], ["Llegenda", "", ""]], A3, { alt: 420 }));
add(...pregunta("14", "Les freqüències de 1.000 sobres s'assemblen més a la teoria que les teves de la sessió 1? Per què passa això?", 3));
add(...pregunta("15", "Quants sobres seguits sense llegenda has tingut com a màxim? Algú et diu: «Porto 60 sobres sense llegenda, el pròxim segur que en porta una». Té raó? Justifica-ho.", 4));
add(...pregunta("16", "Si cada sobre costés 1 €, quant costaria de mitjana aconseguir una llegenda **concreta**, per exemple l'Aitana Bonmatí? Pista: primer calcula la probabilitat que un sobre la porti.", 5));

/* ---- Sessió 4 ---- */
add(salt(), ...seccio("Sessió 4 · Les regles que no veus"));
add(p("Molts jocs afegeixen regles que no surten a la publicitat. Al **Simulador** pots canviar-les i simular 1.000 jugadors. Fes les simulacions de la taula i apunta els resultats."));
const A6 = [3000, 1300, 1300, 1300, 1300, AMPLE - 8200];
add(...taula(["Regles", "1a llegenda: mediana", "1a llegenda: 10% menys sort", "Àlbum: mediana", "Àlbum: 10% més sort", "Àlbum: 10% menys sort"], [
  ["Les del joc (sense ajudes)", "", "", "", "", ""],
  ["Llegenda garantida cada 40 sobres", "", "", "", "", ""],
  ["20 repetides per un cromo que falta", "", "", "", "", ""],
  ["Les dues regles alhora", "", "", "", "", ""],
  ["Totes les butlletes a 1", "", "", "", "", ""],
], A6, { alt: 500 }));
add(...pregunta("17", "La garantia cada 40 sobres canvia molt la primera llegenda, però poc l'àlbum complet. Per què? Fixa't en la forma dels dos histogrames.", 4));
add(...pregunta("18", "El canvi de repetides gairebé no canvia quan surt la primera llegenda dels sobres, però redueix moltíssim l'àlbum. Per què?", 4));
add(...pregunta("19", "Amb totes les butlletes a 1, tots els cromos són igual de probables. Aleshores, per completar una col·lecció de n cromos cal obrir de mitjana n·(1 + 1/2 + 1/3 + … + 1/n) cromos. Calcula-ho amb un full de càlcul per a n = 437, passa-ho a sobres i compara-ho amb el simulador.", 5));
add(...pregunta("20", "Ets l'empresa que ven els sobres: quines regles triaries per guanyar diners sense que la gent abandoni el joc? I si fossis qui juga, quines regles et semblarien justes? Fes servir números del simulador.", 6));

/* ---- Sessió 5 ---- */
add(salt(), ...seccio("Sessió 5 · Auditoria"));
add(p("Treballeu en parella. A **Laboratori > Auditoria** hi ha sis jocs misteriosos. Tots diuen que tenen les mateixes probabilitats que UWCL Stars, però algun menteix. El professor us assignarà dos jocs. De cada joc podeu obrir 200 sobres, és a dir, 1.000 cromos."));
add(formula("Esperat = n · p        Desviació típica = √(n · p · (1 − p))        z = (observat − esperat) ÷ desviació típica"));
add(p("Un valor de |z| més gran que 2 passa poques vegades per pura casualitat (al voltant d'1 de cada 20). És un senyal per sospitar, no una prova."));
for (const joc of ["Joc ___", "Joc ___"]) {
  add(subtitol(joc));
  add(...taula(["Raresa", "Probabilitat anunciada", "Observat", "Esperat", "Desviació típica", "z"], [["Bronze", "70,22%", "", "", "", ""], ["Plata", "23,70%", "", "", "", ""], ["Or", "5,58%", "", "", "", ""], ["Llegenda", "0,51%", "", "", "", ""]], [1800, 1800, 1500, 1500, 1700, AMPLE - 8300], { alt: 420 }));
}
add(...pregunta("21", "Per a cada joc, quines rareses tenen |z| > 2? Què vol dir?", 3));
add(...pregunta("22", "Veredicte de cada joc: honest o trucat? Si és trucat, quina raresa han tocat i amb quina seguretat ho podeu dir?", 4));
add(...pregunta("23", "Les llegendes són les més difícils d'auditar. Per què? Quants cromos caldria obrir per detectar que un joc dona un 0,3% de llegendes en lloc del 0,51%? Pista: busqueu n perquè la diferència entre els dos valors esperats sigui el doble de la desviació típica.", 6));

/* ---- Sessió 6 ---- */
add(salt(), ...seccio("Sessió 6 · El vostre joc"));
add(p("En grups de 2 o 3, dissenyeu la vostra versió d'un joc de sobres de futbol femení. El professor us donarà un **encàrrec**: unes condicions numèriques que el joc ha de complir. Busqueu amb el Simulador unes regles que les compleixin."));
add(...taula(["Encàrrec", "Condicions"], [
  ["E1 · Per a tothom", "El 90% dels jugadors té una llegenda abans del sobre 30 i la mediana de l'àlbum està entre 600 i 900 sobres."],
  ["E2 · Generós", "Sense garantia. La mediana de l'àlbum és de menys de 300 sobres."],
  ["E3 · Car", "La mediana de la primera llegenda és de 50 sobres o més, però el 10% amb més sort la té abans del sobre 12."],
  ["E4 · Sobres petits", "Sobres de 3 cromos. La mediana de la primera llegenda està entre 15 i 20 sobres."],
  ["E5 · Sobres grans", "Sobres de 10 cromos amb la mateixa probabilitat de llegenda per sobre que ara (2,5%)."],
  ["E6 · Sense ratxes", "Ningú no passa de 50 sobres sense llegenda i el 90% completa l'àlbum en menys de 500 sobres."],
], [2400, AMPLE - 2400]));
add(subtitol("El vostre joc"));
add(punt("Trieu un tema dins del futbol femení: una lliga, una selecció, la història, les promeses…"), punt("Opcional: baixeu el codi de UWCL Stars (GitHub > Code > Download ZIP) i demaneu a una IA que en canviï el nom, els colors i els textos. **No pot tocar el fitxer js/motor.js.** Poseu-hi les vostres butlletes a js/dades.js."), punt("Prepareu 3 minuts per explicar les regles, demostrar amb el simulador que compleixen l'encàrrec i dir si el vostre joc us sembla just."));
add(...taula(["Regla", "El nostre valor"], [["Butlletes bronze / plata / or / llegenda", ""], ["Cromos per sobre", ""], ["Garantia de llegenda cada… sobres", ""], ["Repetides per un cromo que falta", ""], ["Resultat que demostra l'encàrrec", ""]], [Math.round(AMPLE * 0.55), AMPLE - Math.round(AMPLE * 0.55)], { alt: 460 }));
add(subtitol("Reflexió final (individual)"));
add(...pregunta("24", "Quines parts de l'app estan pensades perquè obris més sobres? Les has notat mentre jugaves?", 4));
add(...pregunta("25", "Els sobres de cromos i les caixes botí dels videojocs, funcionen igual? Què canvia quan es paga amb diners reals o amb una moneda virtual del joc?", 4));
add(...pregunta("26", "Saber les probabilitats, és suficient per protegir qui juga? Què més faria falta? Busca en quin punt es troba la llei espanyola sobre els «mecanismes aleatoris de recompensa» per a menors i resumeix-la en tres frases.", 6));

const doc = new Document({
  creator: "INS Manolo Hugué",
  title: "UWCL Stars: fitxa de l'alumnat",
  numbering: E.numeracio,
  styles: { default: { document: { run: { font: E.FONT, size: 20, color: COL.grisFosc } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: E.mm(28), bottom: E.mm(18), left: E.mm(20), right: E.mm(20), header: E.mm(10), footer: E.mm(8) } } },
    headers: { default: E.capJuvenil("Institut Manolo Hugué · UWCL Stars · Curs 2026–2027") },
    footers: { default: E.peuNumero("Nom: ______________________   Codi: ________") },
    children: cos,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync("UWCL_Stars_fitxa_alumnat.docx", b); console.log("ok"); });
