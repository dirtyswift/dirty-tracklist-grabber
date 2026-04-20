# Brief d'initiative — dirty-tracklist-grabber

**Catégorie** : CODE-APP IA
**Date** : 20 avril 2026 → deadline 26 avril 2026 (dimanche soir)

---

## PROBLÈME

Quand je digging sur Spotify / Deezer, je ne peux pas copier la liste "Artiste - Titre" d'une page artiste ou playlist. Je dois retaper à la main pour aller acheter sur Apple Music. Perte de temps sur chaque session.

---

## OBJECTIF V1 (perso seulement)

Plugin Chrome (dev mode local, pas de store) qui, sur une page Spotify ou Deezer active, extrait la liste des tracks visibles et la dump dans le presse-papier au format "Artiste - Titre" (une ligne par morceau).

---

## SCOPE V1 — 3 LIVRABLES

1. Plugin Chrome fonctionnel sur Spotify (page artiste + playlist)
2. Extension au support Deezer (même logique DOM scraping)
3. Bouton unique "Copier tracklist" → presse-papier → collage direct dans Apple Music search

---

## HORS SCOPE V1 (= V2 / V3, Briefs séparés plus tard)

- Version Safari
- Landing page + capture email
- Support Tidal, YouTube Music, SoundCloud
- Publication Chrome Web Store

---

## STACK

- Claude Code (pair programming)
- Manifest v3 Chrome Extension
- Content script JS (DOM scraping)
- Chrome en mode développeur local

---

## TIMEBOX — NON NÉGOCIABLE

3h max de build effectif. Deadline ferme : dimanche 26 avril 2026, 23h59.
Si à 1h30 le DOM résiste → pivot bookmarklet.
Si à 3h toujours pas de MVP → on arrête, on documente pourquoi, on passe à autre chose.

---

## SIGNAL DE SUCCÈS V1

Je lance un set de digging, je clique 1 bouton, je colle dans Apple Music, j'achète. Si ça tourne une seule fois correctement sur Spotify → V1 validée.

---

## SIGNAL D'ÉCHEC

3h dépassées sans MVP OU plugin cassé après 2 utilisations → kill.

---

## HACK VITRINE BONUS (fortement recommandé)

Enregistrer l'écran pendant les 3h de build → monter un tuto YouTube "Plugin Chrome en 3h avec Claude Code". Coût marginal : 0. Cadre le positionnement IA x dev.

---

## CONDITION AVANT V2 (commu DJ + lead magnet)

Avant même d'écrire une ligne de code pour V2 : DM à 5 DJ potes avec une démo 20 sec de V1, question simple → "tu l'utiliserais ?".
Si 3+ disent oui → V2 validée, je refais un Brief.
Si <3 oui → V2 abandonnée, V1 reste un outil perso + un tuto.

---

## NEXT STEP IMMÉDIAT

Ouvrir Claude Code, créer le dossier dirty-tracklist-grabber, lancer le build. Chrono.
