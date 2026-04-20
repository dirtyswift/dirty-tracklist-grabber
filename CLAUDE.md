# Règles projet — dirty-tracklist-grabber

## Stack

- Manifest v3 Chrome Extension
- Content script JS vanilla (DOM scraping) — pas de framework, garder léger
- Chrome en mode développeur local (pas de build step nécessaire)
- Claude Code pour le pair programming

## Conventions

- Kebab-case pour les fichiers et dossiers
- Commentaires en français
- Commits atomiques, messages en français, format: "type: description"
- Tests manuels avant chaque commit
- Pas de dépendances externes sauf si absolument nécessaire
- Manifest V3 uniquement — pas de MV2

## Architecture Extension Chrome

Structure minimale attendue dans `src/` :

```
src/
├── manifest.json        # Déclaration de l'extension
├── content-spotify.js   # Content script pour Spotify
├── content-deezer.js    # Content script pour Deezer
├── popup.html           # UI du bouton "Copier tracklist"
├── popup.js             # Logique du popup
└── icons/               # Icônes (16, 48, 128px)
```

## Timebox

3h max. Deadline : 2026-04-26.

**Points de pivot :**
- 1h30 : si le DOM résiste → pivot vers bookmarklet
- 3h : si pas de MVP → STOP, documenter dans ce fichier section "Post-mortem"

## Règles Dirty

- Va droit au but, style direct
- Refuse l'over-engineering : V1 simple d'abord
- Le format de sortie est fixe : "Artiste - Titre" une ligne par morceau
- Pas de backend, pas d'API, pas de compte — DOM scraping pur
- Si le DOM change et que ça casse → c'est OK pour V1 perso

## DOM Scraping — Stratégie

### Spotify
- Pages cibles : artiste (`/artist/`) + playlist (`/playlist/`)
- Observer le DOM dynamique (React app) → utiliser MutationObserver si nécessaire
- Sélecteurs à identifier : containers de tracks, éléments artiste/titre

### Deezer
- Pages cibles : artiste + playlist
- Même logique, DOM différent
- Tester après Spotify validé

## Signal de succès

1 clic → presse-papier rempli → collage direct dans Apple Music search → achat.
