/* ===========================================================================
   CONNEXIÓ AMB EL FULL DE GOOGLE
   Si CONFIG_JOC.urlServidor és buida, tot funciona en mode local.
   =========================================================================== */
var Servidor = (function () {
  "use strict";
  var url = CONFIG_JOC.urlServidor;

  function llegeix(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function escriu(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sense desar */ } }
  function esborra(k) { try { localStorage.removeItem(k); } catch (e) { /* res */ } }

  function demana(params) {
    var q = Object.keys(params).map(function (k) { return k + "=" + encodeURIComponent(params[k]); }).join("&");
    return fetch(url + "?" + q, { redirect: "follow" }).then(resposta);
  }

  function envia(cos) {
    // text/plain evita la comprovació prèvia de CORS que Apps Script no accepta.
    return fetch(url, { method: "POST", redirect: "follow", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(cos) }).then(resposta);
  }

  function resposta(r) {
    if (!r.ok) throw new Error("El servidor ha respost amb l'error " + r.status + ".");
    return r.json().then(function (d) {
      if (!d.ok) { var e = new Error(d.error || "Error desconegut del servidor."); e.delServidor = true; e.dades = d; throw e; }
      return d;
    });
  }

  return {
    actiu: !!url,

    // Retorna { atorgades, partida } o llança un error.
    entra: function (codi) {
      if (!url) return Promise.resolve({ atorgades: CONFIG_JOC.gemmesInicials, partida: null, local: true });
      return demana({ accio: "entra", codi: codi });
    },

    // Desa la partida i els sobres pendents d'enviar.
    desa: function (codi, partida, resum) {
      var clau = "uwcl-stars:pendents:" + codi;
      var pendents = [];
      try { pendents = JSON.parse(llegeix(clau)) || []; } catch (e) { pendents = []; }
      if (!url) return Promise.resolve({ local: true });
      return envia({ accio: "desa", codi: codi, partida: partida, resum: resum, sobresNous: pendents }).then(function (d) {
        esborra(clau);
        return d;
      });
    },

    // Guarda un sobre obert a la cua local fins que s'enviï.
    afegeixPendent: function (codi, sobre) {
      if (!url) return;
      var clau = "uwcl-stars:pendents:" + codi;
      var pendents = [];
      try { pendents = JSON.parse(llegeix(clau)) || []; } catch (e) { pendents = []; }
      pendents.push(sobre);
      escriu(clau, JSON.stringify(pendents));
    },

    hiHaPendents: function (codi) {
      try { return (JSON.parse(llegeix("uwcl-stars:pendents:" + codi)) || []).length > 0; } catch (e) { return false; }
    },

    classe: function () {
      if (!url) return Promise.resolve({ files: [], local: true });
      return demana({ accio: "classe" });
    },
  };
})();
