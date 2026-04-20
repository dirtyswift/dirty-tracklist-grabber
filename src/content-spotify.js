// Content script Spotify — dirty-tracklist-grabber
(() => {
  const TAG = "[dirty-tracklist-grabber]";

  // État
  const tracks = new Set();

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
