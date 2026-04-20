// Content script Spotify — dirty-tracklist-grabber
(() => {
  const TAG = "[dirty-tracklist-grabber]";

  // État
  const tracks = new Set();

  // Sélecteurs Spotify
  const SEL_ROW = '[data-testid="tracklist-row"]';
  const SEL_TITRE = '[data-testid="internal-track-link"]';
  const SEL_ARTISTE = 'a[href^="/artist/"]';

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

    const copy = document.createElement("button");
    copy.id = "dtg-copy";
    copy.type = "button";
    copy.textContent = `Copier tracklist (${tracks.size})`;

    root.append(reset, copy);
    document.body.appendChild(root);
  }

  // Init
  creerBouton();
  console.log(`${TAG} bouton injecté sur Spotify`);
})();
