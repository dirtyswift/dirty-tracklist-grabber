// Content script Deezer — dirty-tracklist-grabber
(() => {
  const TAG = "[dirty-tracklist-grabber]";

  // État
  const tracks = new Set();

  // Sélecteurs Deezer (à ajuster si nécessaire au 1er test live)
  // La liste couvre plusieurs patterns possibles selon les sections (playlist, album, artiste).
  const SEL_ROW = '[role="row"][aria-rowindex]';
  const SEL_TITRE = '[data-testid="title"]';
  const SEL_ARTISTE = '[data-testid="artist"]';

  // Nom de l'artiste de la page courante (si on est sur /artist/xxx).
  function artisteDeLaPage() {
    if (!/\/artist\//.test(location.pathname)) return null;
    // Deezer expose le nom de l'artiste dans un h1 de la page.
    const el = document.querySelector('h1[data-testid="artist-page-title"]')
      || document.querySelector('.artist-title')
      || document.querySelector('main h1');
    return el?.textContent.trim() || null;
  }

  // Extraction d'une row en {artistes, titre}. Null si ligne incomplète.
  function extraireTrack(row) {
    const titreEl = row.querySelector(SEL_TITRE);
    if (!titreEl) return null;

    const titre = titreEl.textContent.trim();
    if (!titre) return null;

    let artistes = [...row.querySelectorAll(SEL_ARTISTE)]
      .map((a) => a.textContent.trim())
      .filter(Boolean);

    // Fallback page artiste : pas de lien artiste dans la row, on prend le nom de la page.
    if (artistes.length === 0) {
      const pageArtiste = artisteDeLaPage();
      if (pageArtiste) artistes = [pageArtiste];
    }

    if (artistes.length === 0) return null;
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

  // MutationObserver — rattrape les ajouts DOM legit
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
  // Tolère les préfixes de locale (ex: /fr/playlist/xxx).
  function idRessource(pathname) {
    const m = pathname.match(/\/(playlist|artist)\/([^/?#]+)/);
    return m ? `${m[1]}:${m[2]}` : null;
  }

  // Polling de l'URL — les content scripts MV3 (isolated world) ne peuvent pas
  // intercepter les history.pushState du main world. On surveille location.pathname.
  function installerHookNavigation() {
    let ressourceCourante = idRessource(location.pathname);
    setInterval(() => {
      const nouvelle = idRessource(location.pathname);
      if (nouvelle !== ressourceCourante && nouvelle !== null) {
        ressourceCourante = nouvelle;
        tracks.clear();
        majCompteur();
        console.log(`${TAG} changement de page → reset (${nouvelle})`);
        setTimeout(scanRowsExistantes, 500);
      }
    }, 500);
  }

  // Construction du bouton flottant
  function creerBouton() {
    if (document.getElementById("dtg-root")) return; // idempotent

    const root = document.createElement("div");
    root.id = "dtg-root";
    root.dataset.service = "deezer";

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
  // Polling — au cas où Deezer utiliserait aussi du virtual scroll.
  setInterval(scanRowsExistantes, 500);
  console.log(`${TAG} Deezer prêt`);
})();
