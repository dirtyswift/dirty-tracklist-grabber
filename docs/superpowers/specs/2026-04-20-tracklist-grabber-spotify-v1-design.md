# Design — dirty-tracklist-grabber V1 (Spotify)

**Date** : 2026-04-20
**Deadline** : 2026-04-26
**Timebox** : 3h
**Scope** : Bullets 1 + 2 du BRIEF — plugin Chrome fonctionnel sur **Spotify** (prioritaire) puis **Deezer** (page artiste + playlist pour les deux)

## Problème

Quand l'utilisateur digge sur Spotify, il ne peut pas copier la liste "Artiste - Titre" d'une page artiste ou playlist. Il doit retaper à la main pour aller acheter sur Apple Music. Perte de temps récurrente.

## Signal de succès V1

1 clic → presse-papier rempli → collage direct dans Apple Music search → achat.

## Décisions validées

| Sujet | Décision | Raison |
|---|---|---|
| Gestion de la virtualisation Spotify | Scrape "ce qui passe sous les yeux" via MutationObserver pendant que l'user scrolle | Prévisible, robuste, code court |
| UI du bouton | Bouton flottant injecté dans la page (fixed bottom-right) | 1 seul clic, pas de messaging Chrome, compteur live visible |
| Format multi-artistes | Tous les artistes joints par `, ` | Apple Music search gère bien, info préservée |
| Format features | Gardés tels quels dans le titre | Idem, éviter le strip agressif |

## Architecture

Extension Chrome **Manifest V3** minimaliste. Deux content scripts isolés (un par service) partageant une feuille de style. Pas de popup, pas de service worker, pas de background, pas de messaging. Toute la logique vit dans les content scripts.

**Duplication assumée entre Spotify et Deezer** — pas de module partagé `tracklist-core.js` en V1. On factorisera en V2 seulement si le code vit. YAGNI.

### Structure de fichiers

```
src/
├── manifest.json         # MV3
├── content-spotify.js    # Logique Spotify (prioritaire)
├── content-deezer.js     # Logique Deezer (copie adaptée de Spotify)
├── styles.css            # Style du bouton flottant (partagé)
└── icons/                # 16 / 48 / 128 — placeholders V1
```

### Manifest — content_scripts

Deux entrées distinctes :

- `matches: ["*://open.spotify.com/*"]` → `js: ["content-spotify.js"]`, `css: ["styles.css"]`
- `matches: ["*://www.deezer.com/*"]` → `js: ["content-deezer.js"]`, `css: ["styles.css"]`

### Permissions

Aucune permission spéciale à priori. `navigator.clipboard.writeText` fonctionne dans le contexte d'un clic utilisateur en MV3. Si Chrome bloque au test, ajouter `clipboardWrite`.

## Data flow

1. Page chargée → content script s'exécute
2. Le script injecte le bouton flottant + démarre un MutationObserver sur `document.body` (subtree)
3. Pour chaque row de track détectée (ajout ou déjà présente) :
   - Extrait `artistes` (array de strings) + `titre` (string)
   - Construit la clé `${artistes.join(', ')}|${titre}`
   - `tracks.add(key)` — déduplique automatiquement
4. Le bouton affiche `Copier tracklist (N)` où N = `tracks.size`
5. Clic sur le bouton :
   - `navigator.clipboard.writeText([...tracks].map(k => k.replace('|', ' - ')).join('\n'))`
   - Flash visuel "Copié ✓" pendant 1.5s
6. Clic sur le bouton "×" → `tracks.clear()` + remet le compteur à 0

## Sélecteurs DOM

Priorité absolue aux `data-testid` et attributs sémantiques (ARIA). Les classes hashées (Spotify `.encore-text-*`, Deezer `.css-*`) sont **interdites** — elles changent à chaque déploiement.

### Spotify — sélecteurs cibles (à valider au 1er test live)

- **Row de track** : `[data-testid="tracklist-row"]`
- **Titre** : `[data-testid="internal-track-link"]`
- **Artistes** : tous les `a[href^="/artist/"]` à l'intérieur de la row

**Fallback Spotify** si `data-testid` casse :
- Row : `[role="row"][aria-rowindex]` avec `aria-rowindex >= 2` (rowindex=1 = header)
- Titre : premier `a[href^="/album/"]` ou `a[href*="/track/"]` dans la row
- Artistes : inchangé (`a[href^="/artist/"]`)

### Deezer — sélecteurs cibles (à valider au 1er test live)

- **Row de track** : `[data-testid="track"]` ou à défaut `tr.track` / `[role="row"]` selon ce que le DOM expose
- **Titre** : lien vers `/track/<id>` dans la row, ou `.track-title`
- **Artistes** : tous les `a[href*="/artist/"]` dans la row

**Fallback Deezer** : si aucun `data-testid` n'est présent, partir du `role="row"` + première cellule texte pour le titre et chercher les liens artiste dans les cellules suivantes.

Deezer semble moins virtualisé que Spotify (pagination plus "classique"), mais on garde le MutationObserver — zéro surcoût côté code.

## Détection de changement de page (SPA)

Spotify et Deezer sont des SPA. On ne peut pas compter sur un rechargement. On détecte les changements d'URL côté client :

1. Au démarrage, mémoriser `location.pathname`
2. Patcher `history.pushState` et `history.replaceState` pour émettre un événement custom
3. Écouter `popstate` + l'événement custom
4. À chaque changement : si le nouveau `pathname` correspond à une **autre** playlist/artiste (ID différent dans l'URL), `tracks.clear()` et reset du compteur
5. Si on reste sur la même page ou qu'on navigue entre onglets de la même page artiste (Populaires / Discographie / Apparitions sur Spotify ; équivalents Deezer) → on continue d'accumuler

Implémentation identique dans les deux content scripts, adaptée aux patterns d'URL de chaque service :
- Spotify : `/playlist/<id>` et `/artist/<id>`
- Deezer : `/<lang>/playlist/<id>` et `/<lang>/artist/<id>` (la langue préfixe le path)

## Bouton flottant — détails UI

- Position : `position: fixed; bottom: 20px; right: 20px; z-index: 2147483647`
- Style : fond sombre, texte clair, coins arrondis, cohérent avec Spotify visuellement mais pas mimétique
- États :
  - Initial / en accumulation : `Copier tracklist (N)`
  - Après clic : `Copié ✓` pendant 1.5s, puis retour au compteur
  - Si N=0 au clic : ne rien faire (ou flash "Rien à copier")
- Petit bouton secondaire `×` à gauche du principal pour reset manuel

## Tests manuels (avant de dire "livré")

### Spotify (bloquant pour passer à Deezer)

1. **Playlist moyenne (~30 tracks)** :
   - Ouvrir une playlist Spotify publique
   - Scroller lentement jusqu'en bas
   - Vérifier que le compteur monte jusqu'à ~30
   - Cliquer → coller dans un éditeur texte
   - Format attendu : `Artiste1, Artiste2 - Titre` une ligne par track, zéro doublon
2. **Page artiste** : ouvrir `/artist/<id>`, scroller la section "Populaires", vérifier compteur + format
3. **Changement de playlist** : ouvrir playlist A → scroll → voir compteur → naviguer vers playlist B → le compteur repart à 0
4. **Coller dans Apple Music** : ouvrir music.apple.com, coller une ligne dans le search, vérifier qu'on retrouve le bon morceau

### Deezer (seulement si Spotify validé)

1. **Playlist Deezer** (~30 tracks) : même protocole que Spotify (1)
2. **Page artiste Deezer** : vérifier tops tracks
3. **Format identique** entre Spotify et Deezer — si Deezer ajoute un `•` ou un truc bizarre, on strip

## Ordre de travail & timebox

**Spotify d'abord, jusqu'au bout.** Deezer ensuite, en copiant `content-spotify.js` et en adaptant les sélecteurs + patterns d'URL.

- **0h → 1h30** : Spotify end-to-end testé OK
- **1h30 → 2h30** : Deezer, par copie adaptée
- **2h30 → 3h** : marge (bugs, polish icône, README bref)

### Points de pivot

- **1h30, Spotify pas fonctionnel** : si les sélecteurs DOM ne tiennent pas après 2 essais (testid absent, structure trop changeante, MutationObserver qui spam) → pivot **bookmarklet** (un par service). Plus simple : code synchrone qui scrape au clic ce qui est dans le DOM à l'instant T. L'user scrolle puis clique le bookmarklet. On signale le pivot à l'utilisateur avant de changer d'approche.
- **2h30, Spotify OK mais Deezer résiste** : on livre Spotify seul, on documente pourquoi Deezer a été reporté.
- **3h, pas de MVP** : STOP. Post-mortem dans `CLAUDE.md` : qu'est-ce qui a bloqué, ce qu'on a appris, go/no-go V2.

## Hors scope V1 (rappel)

- Version Safari
- Support Tidal, YouTube Music, SoundCloud
- Landing page + capture email
- Publication Chrome Web Store
- Module partagé `tracklist-core.js` factorisé entre services (V2 si le code vit)

## Livrable fin de V1

Je charge l'extension en mode développeur dans Chrome. J'ouvre une playlist Spotify, je scrolle jusqu'en bas, je clique le bouton flottant, je colle dans Apple Music search → le bon morceau apparaît. Idem sur une page artiste Spotify, sur une playlist Deezer et sur une page artiste Deezer.
