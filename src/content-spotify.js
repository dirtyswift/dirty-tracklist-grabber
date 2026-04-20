// Content script Spotify — dirty-tracklist-grabber
(() => {
  const TAG = "[dirty-tracklist-grabber]";

  // État
  const tracks = new Set();

  // Sélecteurs Spotify
  const SEL_ROW = '[data-testid="tracklist-row"]';
  const SEL_TITRE = '[data-testid="internal-track-link"]';
  const SEL_ARTISTE = 'a[href*="/artist/"]';

  // Extraction d'une row en {artistes, titre}. Null si ligne incomplète.
  function extraireTrack(row) {
    const titreEl = row.querySelector(SEL_TITRE);
    const artisteEls = row.querySelectorAll(SEL_ARTISTE);
    if (!titreEl || artisteEls.length === 0) return null;

    const titre = titreEl.textContent.trim();
    const artistes = [...artisteEls]
      .map((a) => a.textContent.trim())
      .filter(Boolean);

    if (!titre || artistes.length === 0) return null;
    return { artistes, titre };
  }

  // Exposition debug — utile pour tester manuellement en console
  window.__dtg = { extraireTrack, tracks };

  // Ajoute une track au Set si valide et nouvelle. Met à jour le bouton.
  function ingesterRow(row) {
    const t = extraireTrack(row);
    if (!t) return;
    const cle = `${t.artistes.join(", ")}|${t.titre}`;
    const tailleAvant = tracks.size;
    tracks.add(cle);
    if (tracks.size !== tailleAvant) majCompteur();
  }

  // Parcourt toutes les rows actuellement dans le DOM
  function scanRowsExistantes() {
    document.querySelectorAll(SEL_ROW).forEach(ingesterRow);
  }

  // MutationObserver — déclenché à chaque ajout DOM
  function demarrerObservateur() {
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches?.(SEL_ROW)) {
            ingesterRow(node);
          } else {
            node.querySelectorAll?.(SEL_ROW).forEach(ingesterRow);
          }
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    return obs;
  }

  // Met à jour le texte du bouton avec la taille actuelle
  function majCompteur() {
    const btn = document.getElementById("dtg-copy");
    if (btn) btn.textContent = `Copier tracklist (${tracks.size})`;
  }

  // Extrait l'ID de ressource de l'URL (playlist ou artiste). Null ailleurs.
  function idRessource(pathname) {
    const m = pathname.match(/\/(playlist|artist)\/([^/?#]+)/);
    return m ? `${m[1]}:${m[2]}` : null;
  }

  // Patch de history pour émettre un événement à chaque pushState/replaceState
  function installerHookNavigation() {
    const evt = "dtg:navchange";
    ["pushState", "replaceState"].forEach((fn) => {
      const orig = history[fn];
      history[fn] = function (...args) {
        const ret = orig.apply(this, args);
        window.dispatchEvent(new Event(evt));
        return ret;
      };
    });
    window.addEventListener("popstate", () => window.dispatchEvent(new Event(evt)));

    let ressourceCourante = idRessource(location.pathname);
    window.addEventListener(evt, () => {
      const nouvelle = idRessource(location.pathname);
      if (nouvelle !== ressourceCourante && nouvelle !== null) {
        ressourceCourante = nouvelle;
        tracks.clear();
        majCompteur();
        console.log(`${TAG} changement de page → reset (${nouvelle})`);
        // Après un changement de page, scan initial pour rattraper
        setTimeout(scanRowsExistantes, 500);
      }
    });
  }

  // Construction du bouton flottant
  function creerBouton() {
    if (document.getElementById("dtg-root")) return; // idempotent

    const root = document.createElement("div");
    root.id = "dtg-root";

    const reset = document.createElement("button");
    reset.id = "dtg-reset";
    reset.type = "button";
    reset.textContent = "×";
    reset.title = "Réinitialiser la liste";
    reset.addEventListener("click", gererReset);

    const copy = document.createElement("button");
    copy.id = "dtg-copy";
    copy.type = "button";
    copy.textContent = `Copier tracklist (${tracks.size})`;
    copy.addEventListener("click", gererCopie);

    root.append(reset, copy);
    document.body.appendChild(root);
  }

  async function gererCopie() {
    const btn = document.getElementById("dtg-copy");
    if (!btn) return;
    if (tracks.size === 0) {
      flashBouton("Rien à copier");
      return;
    }
    const lignes = [...tracks].map((cle) => cle.replace("|", " - "));
    try {
      await navigator.clipboard.writeText(lignes.join("\n"));
      flashBouton("Copié ✓");
    } catch (err) {
      console.error(`${TAG} échec clipboard`, err);
      flashBouton("Erreur copie");
    }
  }

  function gererReset() {
    tracks.clear();
    majCompteur();
    console.log(`${TAG} liste vidée`);
  }

  function flashBouton(texte) {
    const btn = document.getElementById("dtg-copy");
    if (!btn) return;
    btn.textContent = texte;
    btn.classList.add("dtg-flash");
    setTimeout(() => {
      btn.classList.remove("dtg-flash");
      majCompteur();
    }, 1500);
  }

  // Init
  creerBouton();
  scanRowsExistantes();
  demarrerObservateur();
  installerHookNavigation();
  // Polling — Spotify réutilise les mêmes nœuds DOM au scroll (virtual scroll par transform),
  // le MutationObserver ne voit pas les changements. Un re-scan périodique rattrape.
  setInterval(scanRowsExistantes, 500);
  console.log(`${TAG} Spotify prêt`);
})();
