# Politique de confidentialité — Dirty Tracklist Grabber

Dernière mise à jour : 2026-05-12

L'extension **Dirty Tracklist Grabber** ne collecte, ne stocke et ne transmet **aucune donnée personnelle**.

## Données collectées
Aucune.

## Stockage local
Aucun. L'extension n'utilise ni `localStorage`, ni `sessionStorage`, ni `IndexedDB`, ni l'API `chrome.storage`.

## Données envoyées sur le réseau
Aucune. L'extension n'effectue aucune requête réseau (ni analytics, ni télémétrie, ni mise à jour distante).

## Permissions
L'extension utilise uniquement des **content scripts** injectés sur `open.spotify.com` et `www.deezer.com`. Ces scripts lisent le DOM de la page courante et copient le résultat dans le presse-papier via l'API standard `navigator.clipboard`.

## Tracking
Aucun.

## Contact
Pour toute question : [github.com/dirtyswift/dirty-tracklist-grabber/issues](https://github.com/dirtyswift/dirty-tracklist-grabber/issues)
