# UWCL Stars: disseny del joc i del motor

## Fitxers
- `js/motor.js`: tot l'atzar i les regles. No es toca en fer versions amb IA.
- `js/cartes.js`: les 437 cartes. Es genera amb `python3 eines/genera_dades.py` a partir de `eines/plantilles.py`.
- `js/dades.js`: configuració (gemmes, butlletes, adreça del servidor).
- `js/servidor.js`: connexió amb el full de Google.
- `css/estil.css` i `js/joc.js`: aspecte i pantalles. És el que es pot canviar amb IA.
- `servidor/Codi.gs` i `servidor/INSTRUCCIONS.md`: l'script del full de Google.
- `proves/motor.test.js`: comprovacions numèriques del motor (`node proves/motor.test.js`).

## Cartes
- 18 clubs de la fase de lliga 2026/27. Llista A de la UEFA i jugadores de la llista B que ja han estat titulars.
- Valors: estimació pròpia, no oficial.
- Raresa per rànquing de valor: 10 llegendes (90-95), 40 d'or (84-89), 110 de plata (76-84) i 277 de bronze.

## Regla central
P(carta) = butlletes de la carta / total de butlletes. La butlleta torna a la bossa després de cada sorteig.
Butlletes per carta: bronze 20, plata 17, or 11, llegenda 4. En total 7.890.
Per carta extreta: bronze 70,2%, plata 23,7%, or 5,6%, llegenda 0,51%. Sobre amb alguna llegenda: 2,5%.
Fixa't que una plata concreta només és una mica més rara que un bronze concret: la raresa del grup ve sobretot de quantes cartes hi ha a cada grup.

Les còpies són una altra cosa: quantes vegades tens un cromo. Es mostren a cada cromo i a la banqueta.

## Xifres simulades
- Amb 20 sobres, un 59% d'alumnes no aconsegueix cap llegenda i es tenen unes 89 cartes diferents de 437.
- Primera llegenda: mediana de 31 sobres, mitjana de 44.
- Completar l'àlbum: mediana d'uns 1.080 sobres.

## Pantalles
Sobres (1 o 5 alhora, revelació especial per a or i llegenda), Àlbum (filtres per club, raresa i què em falta; fitxa de cada cromo), El meu onze (4 formacions, banqueta per posicions), Fites (14 medalles sense premi) i Classe (rànquing per codis, només amb servidor).

## Pendent
- Sobres especials: per pensar més endavant.
- Laboratori i auditoria amb jocs trucats.
