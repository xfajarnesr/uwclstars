# Context del projecte (per continuar en un xat nou)

## Què és
UWCL Stars és una situació d'aprenentatge de 6 sessions per a l'optativa de Matemàtica aplicada de 1r de Batxillerat (INS Manolo Hugué, uns 20 alumnes). L'alumnat juga a un joc de sobres de cromos de la Champions femenina 2026/27, en descobreix les probabilitats, audita jocs trucats i dissenya el seu propi joc. És la versió nova d'un antic treball sobre caixes botí fet amb un full de càlcul de la Liga F.

## Estat (8/11/2026, matí)
- Joc complet: Sobres (1 o 5), Àlbum amb filtres i fitxa, El meu onze (4 formacions i banqueta), Fites, Classe (rànquing per codis) i Laboratori (sobres il·limitats, com funciona, simulador i auditoria de 6 jocs misteriosos).
- 437 cromos: llista A de la UEFA i titulars de la llista B. Valors estimats (eines/plantilles.py).
- Butlletes 20/17/11/4: bronze 70,2%, plata 23,7%, or 5,6%, llegenda 0,51% per cromo.
- Servidor opcional amb Google Sheets (servidor/Codi.gs): codis d'alumne, gemmes per sessions, registre de cada sobre, interruptor del laboratori.
- Fitxa de l'alumnat a docs/, per fases (Comencem, Comparem, Obrim el laboratori, Creem el nostre joc), amb 14 preguntes i quadres de resposta.
- Kit a kit/: plantilla-joc.html (joc en un sol fitxer, sense laboratori, que llegeix les taules enganxades del full), base-de-dades.xlsx i prompt.md.
- El joc apunta a l'aplicació web de Google del professor i mostra el nom de l'alumne (columna B d'Alumnes). La guia docent amb solucions **no** és al repositori (és públic); la té el professor.

## Pendent
- Comprovar que el full de Google respon des del navegador (no s'ha pogut provar des de l'entorn de Claude).
- Revisar els valors de les jugadores i les tres dades dubtoses (Cambiaghi Inter/Juve, Klobučarević/Lukášová a la Roma, Szperkowska/Peda al PSG).
- Sobres especials (per més endavant).
- Possible: una plantilla per als grups que facin la seva versió amb IA.

## Regles de treball
- Respondre en català, amb to directe i prosa.
- js/motor.js no s'ha de tocar en les versions de l'alumnat.
- Els documents per a l'alumnat segueixen el nivell 4 (juvenil) de la identitat del centre; els del professorat, el 3.
- Les activitats han de ser difícils de passar a una IA: preguntes lligades a les dades pròpies de cada alumne.

## Prompt per a un xat nou
> Treballo en UWCL Stars, el joc de sobres de cromos per a Matemàtica aplicada de 1r de Batxillerat. El codi és a https://github.com/xfajarnesr/uwclstars. Llegeix primer CONTEXT.md i DISSENY.md del repositori. Avui vull [el que sigui].
