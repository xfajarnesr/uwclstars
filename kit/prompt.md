# Prompt per transformar UWCL Stars en el vostre joc

Copieu aquest text en una IA (Claude, ChatGPT, Gemini…), ompliu els espais entre claudàtors i adjunteu-hi el fitxer `plantilla-joc.html`. Si la IA no accepta fitxers, enganxeu-ne el contingut al final del missatge.

---

Et passo un joc web que és un sol fitxer HTML, `plantilla-joc.html`. És un joc de sobres de cromos: el jugador gasta gemmes per obrir sobres, cada cromo surt a l'atzar segons les seves butlletes, els guarda en un àlbum i munta un equip amb els millors. Vull que el transformis en el nostre joc, que t'explico a continuació.

**Normes que has de complir**
1. No modifiquis el bloc «MOTOR: NO ES TOCA». La probabilitat de cada ítem ha de continuar sent les seves butlletes dividides per les butlletes totals.
2. Al bloc «BASE DE DADES», substitueix TAULA_GRUPS i TAULA_CARTES per les nostres taules (te les enganxo al final). Mantén el format: columnes separades per tabuladors i la primera fila amb les capçaleres.
3. Al bloc «CONFIGURACIÓ», posa les nostres categories, la composició de l'equip i les regles.
4. Cada ítem ha de continuar mostrant quantes còpies en té el jugador.
5. Res de diners reals: només gemmes del joc.
6. Torna'm un sol fitxer HTML complet, que funcioni obrint-lo amb el navegador, i explica'm en una llista curta què has canviat.

**El nostre joc**
- Títol: [ ]
- Objectiu del joc, en una o dues frases: [ ]
- Què col·lecciona el jugador (els ítems): [per exemple: personatges, vehicles, plantes…]
- Com es diu un ítem i com es diu l'àlbum: [per exemple: «carta» i «grimori»]
- Grups en què s'organitzen els ítems (a UWCL eren els clubs): [ ]
- Categories dels ítems (a UWCL eren les posicions): [codi i nom de cada categoria, en singular i en plural]
- Com es forma l'equip (a UWCL, un onze): [quantes places de cada categoria; si hi ha més d'una formació, totes han de sumar el mateix]
- Com es diu l'equip: [per exemple: «la meva expedició»]
- Puntuació dels ítems: [entre quins valors va i què vol dir]
- Noms de les quatre rareses (bronze, plata, or i llegenda): [ ]
- Gemmes inicials: [ ]   Preu d'un sobre: [ ]   Ítems per sobre: [ ]
- Ítems secundaris o equipaments, si n'hi ha: [com funcionen; si no n'hi ha, escriviu «cap»]
- Fites o reptes per al jugador: [opcional]
- Estil visual: [colors, ambientació, tipus de lletra, referències]
- Textos de les pantalles: adapta tots els textos al nostre tema.

**Les nostres taules**

TAULA_GRUPS:
[enganxeu aquí la taula de la pestanya «Els nostres grups», amb la fila de capçaleres]

TAULA_CARTES:
[enganxeu aquí la taula de la pestanya «El nostre joc», columnes A a H, amb la fila de capçaleres]
