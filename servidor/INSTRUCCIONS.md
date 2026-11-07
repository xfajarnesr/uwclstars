# Com connectar UWCL Stars amb un full de Google

Ho fas una sola vegada. Calen uns 10 minuts.

## 1. Crea el full i enganxa-hi l'script
1. Crea un full de càlcul nou a Google Drive, per exemple «UWCL Stars 1r Batx».
2. Ves a **Extensions > Apps Script**.
3. Esborra el que hi hagi a `Codi.gs` i enganxa-hi tot el contingut del fitxer `Codi.gs` d'aquesta carpeta. Desa.
4. Torna al full i recarrega la pàgina. Apareixerà el menú **UWCL Stars**.
5. Tria **UWCL Stars > Prepara el full**. La primera vegada Google et demanarà permís: accepta'l amb el teu compte.

Es creen cinc pestanyes: Alumnes, Sessions, Partides, Sobres i Resum.

## 2. Posa els codis dels alumnes
- A **Alumnes**, columna A, escriu un codi per alumne (per exemple `SK42`). La columna B és per al nom real i només la veus tu.
- O bé tria **UWCL Stars > Crea 20 codis d'alumne**.
- La columna C, «gemmes extra», serveix per donar gemmes a un alumne concret.

## 3. Publica l'script com a aplicació web
1. A l'editor d'Apps Script: **Implementa > Implementació nova**.
2. Tipus: **Aplicació web**.
3. Executa com a: **Jo**. Qui hi té accés: **Qualsevol persona**.
4. Copia l'adreça que acaba en `/exec`.

## 4. Posa l'adreça al joc
Al fitxer `js/dades.js`, enganxa l'adreça a `urlServidor`:

```js
urlServidor: "https://script.google.com/macros/s/.../exec",
```

Puja el canvi a GitHub. A partir d'aquí:
- només entren els codis de la pestanya Alumnes;
- la partida es desa al full i es recupera des de qualsevol ordinador;
- el botó «Torna a començar» desapareix.

## Durant el curs
- **Sessions**: cada fila és una sessió amb les seves gemmes. Marca «activa» quan vulguis que els alumnes les rebin. Les gemmes de totes les sessions actives se sumen.
- **Sobres**: cada sobre obert, amb les 5 cartes i la seva raresa. És la base de dades real de la classe per a les preguntes.
- **Partides**: un resum per alumne (sobres, cromos diferents, llegendes, valor de l'onze).
- **Resum**: recomptes de tota la classe i el percentatge real de llegendes.

## Si canvies l'script
Després de modificar `Codi.gs` cal fer **Implementa > Gestiona les implementacions > Edita > Versió nova**. L'adreça `/exec` no canvia.

## Problemes habituals
- *«No s'ha pogut connectar amb el servidor»*: revisa que l'accés sigui «Qualsevol persona» i que l'adreça acabi en `/exec`.
- *«El codi no existeix»*: el codi no és a la columna A d'Alumnes (no importen majúscules ni espais).
- La vista prèvia dins de Claude no pot connectar amb Google. Prova-ho des de GitHub Pages.
