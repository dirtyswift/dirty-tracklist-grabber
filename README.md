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

Le bouton adopte la couleur de la plateforme au survol (vert Spotify, violet Deezer).

## Pages supportées

- Spotify : `/playlist/<id>` et `/artist/<id>` (y compris avec préfixe de locale type `/intl-fr/`)
- Deezer : `/playlist/<id>` et `/artist/<id>` (y compris avec préfixe de locale type `/fr/`)

## Limites connues

- Il faut scroller manuellement pour voir toutes les tracks (virtual scrolling Spotify). Le plugin ne scrolle pas tout seul.
- Les classes et structures DOM des sites ciblés changent régulièrement. Si le plugin casse, c'est attendu et c'est OK pour un usage perso.
- Manifest V3, Chrome en mode développeur uniquement. Pas de Safari, pas de Store.

## Documentation

- `BRIEF.md` : problème, scope, signaux de succès/échec
- `CLAUDE.md` : règles projet et stratégie de DOM scraping
- `docs/superpowers/specs/` : spec de design V1
- `docs/superpowers/plans/` : plan d'implémentation V1
