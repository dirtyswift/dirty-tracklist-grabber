# dirty-tracklist-grabber — Plan d'implémentation V1

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extension Chrome MV3 qui, sur Spotify et Deezer, accumule les tracks vues pendant le scroll et les copie dans le presse-papier au format `Artiste - Titre` en 1 clic.

**Architecture:** Deux content scripts isolés (`content-spotify.js`, `content-deezer.js`) partageant `styles.css`. Aucune dépendance externe. Un `Set` par content script accumule les tracks via MutationObserver ; un bouton flottant affiche le compteur et déclenche la copie. Duplication assumée entre les deux services — pas de module partagé en V1.

**Tech Stack:** Manifest V3, JavaScript vanilla (ES2020+), CSS natif, Chrome en mode développeur local. Pas de build step, pas de framework, pas de test runner (tests manuels observables dans la page).

**Timebox:** 3h. Points de pivot à 1h30 (bookmarklet si DOM résiste) et 3h (STOP + post-mortem).

**Ordre strict:** Spotify d'abord (Tasks 1 à 8), puis Deezer (Tasks 9-10). On ne commence pas Deezer tant que Spotify n'est pas validé E2E.

**Note sur les tests:** ce projet n'a pas de test runner (DOM scraping de sites live, impossible à mocker utilement dans la timebox). Chaque task se termine par un **bloc "Vérification manuelle"** avec des actions concrètes et un résultat observable (compteur, console, clipboard, visuel). Cette discipline remplace l'automate.

---

## File Structure

```
dirty-tracklist-grabber/
├── src/
│   ├── manifest.json         # Déclaration MV3, 2 content_scripts
│   ├── content-spotify.js    # Logique Spotify complète
│   ├── content-deezer.js     # Logique Deezer (copie adaptée)
│   └── styles.css            # Bouton flottant (partagé)
├── docs/
│   └── superpowers/
│       ├── specs/2026-04-20-tracklist-grabber-spotify-v1-design.md  (existant)
│       └── plans/2026-04-20-tracklist-grabber-spotify-deezer.md     (ce fichier)
├── BRIEF.md                  (existant, pas touché)
├── CLAUDE.md                 (existant, touché seulement en cas de post-mortem)
└── README.md                 (existant, mis à jour en Task 10)
```

Chaque content script contient (dans l'ordre de lecture) : extraction d'une row, initialisation du Set, MutationObserver, détection SPA, injection du bouton flottant, handlers de clic.

---

## Task 1: Bootstrap repo + shell d'extension

**Objectif:** Avoir une extension qui se charge dans Chrome sans erreur, qui injecte un `console.log` identifiable sur Spotify et sur Deezer.

**Files:**
- Create: `src/manifest.json`
- Create: `src/content-spotify.js`
- Create: `src/content-deezer.js`
- Create: `src/styles.css`
- Init: git repo à la racine

- [ ] **Step 1.1: Initialiser git**

Run depuis `/Users/dirty/Dropbox/Dev/dirty-tracklist-grabber`:

```bash
git init
git add BRIEF.md CLAUDE.md README.md .gitignore docs/
git commit -m "chore: init repo avec brief, règles et spec V1"
```

Expected: un commit initial, working tree clean sauf pour `prompts/` (existant, on le laisse).

- [ ] **Step 1.2: Créer `src/manifest.json`**

```json
{
  "manifest_version": 3,
  "name": "Dirty Tracklist Grabber",
  "version": "0.1.0",
  "description": "Copie la tracklist visible de Spotify ou Deezer dans le presse-papier au format 'Artiste - Titre'.",
  "content_scripts": [
    {
      "matches": ["*://open.spotify.com/*"],
      "js": ["content-spotify.js"],
      "css": ["styles.css"],
      "run_at": "document_idle"
    },
    {
      "matches": ["*://www.deezer.com/*"],
      "js": ["content-deezer.js"],
      "css": ["styles.css"],
      "run_at": "document_idle"
    }
  ]
}
```

Pas de `permissions`, pas d'icônes pour V1 (Chrome utilise une icône par défaut, accepté en dev mode).

- [ ] **Step 1.3: Créer `src/content-spotify.js` (shell)**

```javascript
// Content script Spotify — dirty-tracklist-grabber
(() => {
  console.log("[dirty-tracklist-grabber] Spotify content script chargé");
})();
```

- [ ] **Step 1.4: Créer `src/content-deezer.js` (shell)**

```javascript
// Content script Deezer — dirty-tracklist-grabber
(() => {
  console.log("[dirty-tracklist-grabber] Deezer content script chargé");
})();
```

- [ ] **Step 1.5: Créer `src/styles.css` (vide pour l'instant)**

```css
/* Styles du bouton flottant — rempli en Task 2 */
```

- [ ] **Step 1.6: Vérification manuelle — charger l'extension dans Chrome**

1. Ouvrir Chrome → `chrome://extensions/`
2. Activer "Mode développeur" (toggle en haut à droite)
3. Cliquer "Charger l'extension non empaquetée"
4. Sélectionner le dossier `src/` du projet
5. L'extension doit apparaître, sans erreur rouge
6. Ouvrir `https://open.spotify.com` → F12 → Console → doit afficher `[dirty-tracklist-grabber] Spotify content script chargé`
7. Ouvrir `https://www.deezer.com` → F12 → Console → doit afficher le log Deezer équivalent

**Expected:** deux logs présents, aucune erreur. Si erreur de parsing du manifest → corriger avant d'avancer.

- [ ] **Step 1.7: Commit**

```bash
git add src/
git commit -m "feat: shell extension MV3 avec content scripts Spotify et Deezer"
```

---

## Task 2: Bouton flottant + styles

**Objectif:** Un bouton noir fixé en bas à droite apparaît sur Spotify avec le texte `Copier tracklist (0)` et un petit `×` à sa gauche. Non fonctionnel pour l'instant — juste affiché.

**Files:**
- Modify: `src/content-spotify.js`
- Modify: `src/styles.css`

- [ ] **Step 2.1: Ajouter les styles dans `src/styles.css`**

```css
/* Conteneur du bouton flottant injecté par l'extension */
#dtg-root {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 2147483647;
  display: flex;
  gap: 8px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

#dtg-reset,
#dtg-copy {
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  color: #fff;
  background: #111;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
  transition: background 0.15s ease, transform 0.1s ease;
}

#dtg-reset {
  padding: 10px 12px;
  background: #333;
}

#dtg-copy:hover { background: #1db954; }
#dtg-reset:hover { background: #555; }

#dtg-copy:active, #dtg-reset:active { transform: scale(0.97); }

#dtg-copy.dtg-flash {
  background: #1db954;
  color: #fff;
}
```

- [ ] **Step 2.2: Remplacer le contenu de `src/content-spotify.js`**

```javascript
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
```

- [ ] **Step 2.3: Vérification manuelle**

1. Dans `chrome://extensions/` → cliquer le bouton "Recharger" de l'extension
2. Recharger `https://open.spotify.com`
3. Le bouton noir `Copier tracklist (0)` doit apparaître en bas à droite
4. Un petit bouton `×` doit être à sa gauche
5. Console : `[dirty-tracklist-grabber] bouton injecté sur Spotify`
6. Hover sur le bouton principal → doit virer vert Spotify

**Expected:** bouton visible et stylé, pas de superposition avec l'UI Spotify.

- [ ] **Step 2.4: Commit**

```bash
git add src/content-spotify.js src/styles.css
git commit -m "feat(spotify): bouton flottant avec styles"
```

---

## Task 3: Extraction d'une row Spotify

**Objectif:** Une fonction `extraireTrack(row)` qui prend un élément DOM de track et retourne `{ artistes: string[], titre: string } | null`. Validée sur une row **réelle** via la console.

**Files:**
- Modify: `src/content-spotify.js`

- [ ] **Step 3.1: Ajouter la fonction d'extraction dans `content-spotify.js`**

Insérer juste après la ligne `const tracks = new Set();` :

```javascript
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
```

- [ ] **Step 3.2: Vérification manuelle sur une vraie playlist**

1. Recharger l'extension, recharger Spotify
2. Ouvrir une playlist publique réelle (ex: `https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M`)
3. F12 → Console, taper :
   ```javascript
   const rows = document.querySelectorAll('[data-testid="tracklist-row"]');
   console.log("rows trouvées:", rows.length);
   rows.forEach((r, i) => console.log(i, __dtg.extraireTrack(r)));
   ```
4. **Attendu:** au moins 5-10 rows trouvées, chacune avec `{artistes: [...], titre: "..."}` non null.

**Si 0 row trouvée** → le `data-testid="tracklist-row"` a changé. Inspecter une ligne de piste (clic droit → Inspecter), trouver l'attribut stable (role="row" + aria-rowindex, ou data-testid différent), ajuster `SEL_ROW`. **Si après 2 tentatives ça ne passe toujours pas et qu'on est à 1h30 → PIVOT BOOKMARKLET, prévenir l'utilisateur.**

**Si rows OK mais `extraireTrack` retourne null** → inspecter le sélecteur titre ou artiste qui manque. Ajuster les fallbacks documentés dans le spec.

- [ ] **Step 3.3: Commit**

```bash
git add src/content-spotify.js
git commit -m "feat(spotify): extraction des tracks depuis le DOM"
```

---

## Task 4: MutationObserver + Set + compteur live

**Objectif:** Quand l'user scrolle une playlist, le compteur du bouton se met à jour en temps réel avec le nombre de tracks uniques vues.

**Files:**
- Modify: `src/content-spotify.js`

- [ ] **Step 4.1: Ajouter la logique d'accumulation dans `content-spotify.js`**

Juste après `window.__dtg = { extraireTrack, tracks };`, et avant `function creerBouton()`, insérer :

```javascript
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
```

- [ ] **Step 4.2: Brancher au boot**

Remplacer la section `// Init` en bas du fichier par :

```javascript
  // Init
  creerBouton();
  scanRowsExistantes();
  demarrerObservateur();
  console.log(`${TAG} Spotify prêt`);
```

- [ ] **Step 4.3: Vérification manuelle**

1. Recharger extension + Spotify
2. Ouvrir une playlist d'au moins 30 tracks
3. Observer le compteur : au chargement, il doit afficher ~20-25 (rows initialement visibles)
4. Scroller lentement vers le bas jusqu'au bout de la playlist
5. Le compteur doit monter progressivement et atteindre le total de la playlist (à ±2 près selon virtualisation)
6. Scroller vers le haut : le compteur ne doit **pas** baisser (Set dédup)

**Si le compteur reste à 0** → le MutationObserver ne capture pas les nouvelles rows. Vérifier via console `document.querySelectorAll('[data-testid="tracklist-row"]').length` avant et après scroll : si le count augmente mais le compteur du bouton non, problème dans `ingesterRow`. Si le count DOM n'augmente pas au scroll, Spotify insère peut-être les rows dans un sous-arbre différent → l'observer sur `document.body` avec `subtree: true` devrait quand même capturer, sinon chercher le container scrollable et observer directement.

- [ ] **Step 4.4: Commit**

```bash
git add src/content-spotify.js
git commit -m "feat(spotify): MutationObserver accumule les tracks au scroll"
```

---

## Task 5: Copie presse-papier + flash

**Objectif:** Un clic sur le bouton principal copie la liste accumulée dans le presse-papier et affiche "Copié ✓" pendant 1.5s.

**Files:**
- Modify: `src/content-spotify.js`

- [ ] **Step 5.1: Ajouter les handlers dans `creerBouton`**

Remplacer `creerBouton` par :

```javascript
  function creerBouton() {
    if (document.getElementById("dtg-root")) return;

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
```

- [ ] **Step 5.2: Vérification manuelle**

1. Recharger extension + Spotify + ouvrir une playlist
2. Scroller jusqu'en bas (le compteur affiche ~N tracks)
3. Cliquer le bouton principal
4. Le texte devient `Copié ✓` vert pendant 1.5s puis revient à `Copier tracklist (N)`
5. Ouvrir un éditeur texte → coller (Cmd+V)
6. **Attendu:** N lignes, format `Artiste - Titre`, zéro doublon, par exemple :
   ```
   Burial, Four Tet - Moth (feat. Thom Yorke)
   Caribou - Odessa
   ...
   ```
7. Cliquer `×` : compteur repasse à 0, puis recliquer "Copier" → flash "Rien à copier"

**Si `navigator.clipboard.writeText` throw** (ex: `NotAllowedError`) → ajouter `"permissions": ["clipboardWrite"]` dans `manifest.json`, recharger, retester.

- [ ] **Step 5.3: Commit**

```bash
git add src/content-spotify.js
git commit -m "feat(spotify): copie presse-papier et flash visuel"
```

---

## Task 6: Détection SPA + reset auto sur changement de page

**Objectif:** Quand l'user navigue vers une autre playlist ou une autre page artiste, le Set est vidé automatiquement.

**Files:**
- Modify: `src/content-spotify.js`

- [ ] **Step 6.1: Ajouter la détection de navigation SPA**

Après `function demarrerObservateur()`, ajouter :

```javascript
  // Extrait l'ID de ressource de l'URL (playlist ou artiste). Null ailleurs.
  function idRessource(pathname) {
    const m = pathname.match(/^\/(playlist|artist)\/([^/?#]+)/);
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
        // Après un changement de page, les nouvelles rows n'apparaissent pas toujours via MutationObserver
        // si React remplace un sous-arbre existant. Scan initial pour rattraper.
        setTimeout(scanRowsExistantes, 500);
      }
    });
  }
```

- [ ] **Step 6.2: Brancher au boot**

Remplacer la section `// Init` par :

```javascript
  // Init
  creerBouton();
  scanRowsExistantes();
  demarrerObservateur();
  installerHookNavigation();
  console.log(`${TAG} Spotify prêt`);
```

- [ ] **Step 6.3: Vérification manuelle**

1. Recharger extension + Spotify
2. Ouvrir une playlist A → scroller → compteur monte (ex: 40)
3. Depuis Spotify, naviguer vers une autre playlist B (via la sidebar, sans rechargement)
4. **Attendu:** compteur retombe à 0, puis remonte au fur et à mesure qu'on scrolle B
5. Console doit afficher `changement de page → reset (playlist:...)`
6. Naviguer de la playlist B vers la page artiste d'un des artistes → reset, console log confirme
7. Rester sur la même page artiste, changer d'onglet (Populaires → Discographie) : **le compteur NE doit PAS se reset** (même ID artiste).

- [ ] **Step 6.4: Commit**

```bash
git add src/content-spotify.js
git commit -m "feat(spotify): reset auto au changement de playlist ou artiste"
```

---

## Task 7: Checkpoint E2E Spotify

**Objectif:** Valider le signal de succès avant de toucher à Deezer.

**Files:** aucun — c'est une session de test.

- [ ] **Step 7.1: Checklist E2E Spotify**

Tester dans l'ordre, cocher mentalement chaque point :

1. **Playlist moyenne (~30 tracks)** :
   - [ ] Ouvrir `https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M` (ou équivalent)
   - [ ] Scroller jusqu'en bas
   - [ ] Compteur atteint ~30 (à ±2 près)
   - [ ] Clic → coller dans un éditeur texte
   - [ ] Format correct : `Artistes - Titre` par ligne, pas de doublon, pas de ligne vide

2. **Page artiste** :
   - [ ] Ouvrir une page `/artist/<id>` (ex: Burial)
   - [ ] Scroller les Populaires
   - [ ] Compteur monte, clic → presse-papier OK

3. **Changement de playlist** :
   - [ ] Naviguer A → B sans reload → compteur reset à 0 puis remonte

4. **Apple Music** :
   - [ ] Aller sur `https://music.apple.com`
   - [ ] Coller une ligne dans le champ search
   - [ ] Le morceau correct apparaît dans les résultats

- [ ] **Step 7.2: Décision go / no-go Deezer**

- Si les 4 points passent → **GO Deezer** (Task 8).
- Si échec sur 1 point et on est avant 1h30 → corriger le bug précis, re-tester.
- Si échec et on est après 1h30 → envisager pivot bookmarklet ou livrer Spotify seul.

- [ ] **Step 7.3: Commit tag**

```bash
git tag -a v0.1.0-spotify -m "Spotify E2E validé"
```

---

## Task 8: Content script Deezer

**Objectif:** Dupliquer la logique Spotify pour Deezer avec sélecteurs et patterns d'URL adaptés. Le résultat : même comportement (bouton flottant, compteur, copie) sur Deezer.

**Files:**
- Modify: `src/content-deezer.js`

- [ ] **Step 8.1: Copier la structure Spotify vers Deezer**

Remplacer intégralement le contenu de `src/content-deezer.js` par :

```javascript
// Content script Deezer — dirty-tracklist-grabber
(() => {
  const TAG = "[dirty-tracklist-grabber]";
  const tracks = new Set();

  // Sélecteurs Deezer (à valider/ajuster au 1er test live)
  const SEL_ROW = '[data-testid="track"], [role="row"][aria-rowindex]';
  const SEL_TITRE = 'a[href*="/track/"], .track-title';
  const SEL_ARTISTE = 'a[href*="/artist/"]';

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

  window.__dtg = { extraireTrack, tracks };

  function ingesterRow(row) {
    const t = extraireTrack(row);
    if (!t) return;
    const cle = `${t.artistes.join(", ")}|${t.titre}`;
    const tailleAvant = tracks.size;
    tracks.add(cle);
    if (tracks.size !== tailleAvant) majCompteur();
  }

  function scanRowsExistantes() {
    document.querySelectorAll(SEL_ROW).forEach(ingesterRow);
  }

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

  function majCompteur() {
    const btn = document.getElementById("dtg-copy");
    if (btn) btn.textContent = `Copier tracklist (${tracks.size})`;
  }

  // Pattern URL Deezer : /<lang>/playlist/<id> ou /<lang>/artist/<id>
  // Le préfixe de langue est optionnel selon les sessions.
  function idRessource(pathname) {
    const m = pathname.match(/\/(playlist|artist)\/([^/?#]+)/);
    return m ? `${m[1]}:${m[2]}` : null;
  }

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
        setTimeout(scanRowsExistantes, 500);
      }
    });
  }

  function creerBouton() {
    if (document.getElementById("dtg-root")) return;

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

  creerBouton();
  scanRowsExistantes();
  demarrerObservateur();
  installerHookNavigation();
  console.log(`${TAG} Deezer prêt`);
})();
```

- [ ] **Step 8.2: Vérification manuelle — sélecteurs Deezer**

1. Recharger extension
2. Ouvrir une playlist Deezer publique (ex: une playlist Top Hits)
3. Console : `document.querySelectorAll('[data-testid="track"], [role="row"][aria-rowindex]').length` → doit être > 0
4. Console : `__dtg.extraireTrack(document.querySelector('[data-testid="track"], [role="row"][aria-rowindex]'))` → doit retourner `{artistes, titre}`

**Si sélecteurs vides** → inspecter une ligne de piste Deezer, identifier l'élément stable. Ajuster `SEL_ROW`, `SEL_TITRE`, `SEL_ARTISTE`. Tester en console avant de recharger.

- [ ] **Step 8.3: Vérification manuelle E2E Deezer**

1. Ouvrir une playlist Deezer d'au moins 30 tracks
2. Le bouton flottant `Copier tracklist (N)` doit apparaître
3. Scroller jusqu'en bas → compteur monte
4. Clic → coller dans éditeur texte
5. Format attendu : `Artiste - Titre` une ligne par track. Si Deezer inclut des caractères parasites (ex: `•`, `–`), ajuster l'extraction (strip dans `extraireTrack`)
6. Page artiste Deezer → tops tracks → même protocole
7. Changement de playlist A → B → reset observable

- [ ] **Step 8.4: Commit**

```bash
git add src/content-deezer.js
git commit -m "feat(deezer): content script adapté de Spotify"
```

---

## Task 9: Checkpoint E2E final + README

**Objectif:** Valider Spotify + Deezer ensemble. Écrire un README minimal qui explique comment charger et utiliser l'extension.

**Files:**
- Modify: `README.md`

- [ ] **Step 9.1: Re-test Spotify après ajout Deezer**

1. Charger une playlist Spotify, vérifier que le bouton fonctionne comme avant (non-régression)
2. Clic → collage Apple Music OK

- [ ] **Step 9.2: Re-test Deezer**

1. Playlist Deezer + page artiste Deezer → bouton, compteur, copie OK

- [ ] **Step 9.3: Réécrire `README.md`**

Remplacer le contenu par :

```markdown
# dirty-tracklist-grabber

Extension Chrome locale qui copie la tracklist visible d'une page Spotify ou Deezer dans le presse-papier, au format `Artiste - Titre` (une ligne par morceau). Conçue pour passer en 1 clic du digging à l'achat sur Apple Music.

## Installation (mode développeur)

1. Ouvrir Chrome → `chrome://extensions/`
2. Activer "Mode développeur" en haut à droite
3. Cliquer "Charger l'extension non empaquetée"
4. Sélectionner le dossier `src/` de ce projet

## Utilisation

1. Ouvrir une playlist ou une page artiste sur `open.spotify.com` ou `www.deezer.com`
2. Scroller jusqu'en bas — le compteur du bouton noir en bas à droite monte en temps réel
3. Cliquer `Copier tracklist (N)` → le presse-papier contient les N tracks
4. Coller dans Apple Music (ou n'importe quel champ de recherche)

Le bouton `×` vide la liste manuellement. La liste se vide aussi automatiquement quand on change de playlist ou d'artiste.

## Pages supportées

- Spotify : `/playlist/<id>` et `/artist/<id>`
- Deezer : `/playlist/<id>` et `/artist/<id>` (avec ou sans préfixe de langue)

## Limites connues

- Il faut scroller manuellement pour voir toutes les tracks (virtual scrolling Spotify). Le plugin ne scrolle pas tout seul.
- Les classes CSS des sites ciblés changent régulièrement. Si le plugin casse, c'est attendu et c'est OK pour un usage perso.
- Manifest V3, Chrome en mode dev uniquement. Pas de Safari, pas de Store.

## Documentation

- `BRIEF.md` : problème, scope, signaux de succès/échec
- `CLAUDE.md` : règles projet et stratégie de DOM scraping
- `docs/superpowers/specs/` : spec de design V1
- `docs/superpowers/plans/` : plan d'implémentation V1
```

- [ ] **Step 9.4: Commit final**

```bash
git add README.md
git commit -m "docs: README usage extension"
git tag -a v0.1.0 -m "V1 — Spotify + Deezer fonctionnels"
```

---

## Pivot bookmarklet (plan de secours, seulement si déclenché à 1h30)

**Quand déclencher:** Task 3 (ou n'importe quelle task amont) bloque parce que le DOM Spotify résiste aux sélecteurs, et le chrono a dépassé 1h30.

**Action:**
1. Prévenir l'utilisateur : "Pivot bookmarklet, on abandonne l'extension"
2. Créer `src/bookmarklet-spotify.js` avec un snippet IIFE qui, au clic du bookmarklet :
   - `document.querySelectorAll('[data-testid="tracklist-row"]')` (ou fallback)
   - Pour chaque row, extrait artistes + titre
   - `navigator.clipboard.writeText(lignes.join('\n'))`
   - `alert("Copié N tracks")`
3. Minifier avec `javascript:void%20function()%7B...%7D()` (URL-encoded)
4. Idem pour Deezer
5. Documenter dans README comment installer (drag vers barre de favoris)

**Livrable pivot:** 2 bookmarklets fonctionnels, l'utilisateur scrolle puis clique, ça copie ce qui est visible à l'instant T.

---

## Post-mortem (si 3h sans MVP — plan STOP)

**Quand déclencher:** 3h écoulées, pas de succès E2E sur au moins Spotify.

**Action:**
1. Dans `CLAUDE.md`, ajouter section `## Post-mortem 2026-04-20`
2. Documenter :
   - Quel(s) task(s) ont bloqué, temps réel passé dessus
   - Pourquoi les sélecteurs DOM n'ont pas tenu (ex: Spotify utilise maintenant des Shadow DOM, testid absents, etc.)
   - Ce qu'on a appris et recommandation go/no-go V2
3. Commit : `chore: post-mortem V1, STOP timebox dépassé`
4. Ne PAS nettoyer le code en cours — garder les traces pour référence future

---

## Récapitulatif des commits prévus

| # | Task | Message |
|---|---|---|
| 1 | init | `chore: init repo avec brief, règles et spec V1` |
| 2 | shell | `feat: shell extension MV3 avec content scripts Spotify et Deezer` |
| 3 | bouton | `feat(spotify): bouton flottant avec styles` |
| 4 | extraction | `feat(spotify): extraction des tracks depuis le DOM` |
| 5 | observer | `feat(spotify): MutationObserver accumule les tracks au scroll` |
| 6 | clipboard | `feat(spotify): copie presse-papier et flash visuel` |
| 7 | SPA | `feat(spotify): reset auto au changement de playlist ou artiste` |
| 8 | Deezer | `feat(deezer): content script adapté de Spotify` |
| 9 | README | `docs: README usage extension` |
