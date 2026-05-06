# Prompt d'init Claude Code — dirty-tracklist-grabber

Copier-coller ce prompt au lancement de Claude Code dans le dossier du projet.

---

Je lance un nouveau projet : dirty-tracklist-grabber.

Contexte en 3 lignes :
- Catégorie : CODE-APP (extension Chrome locale, dev mode uniquement)
- Objectif V1 : Plugin Chrome qui scrape la tracklist visible sur Spotify ou Deezer et la copie dans le presse-papier au format "Artiste - Titre" (une ligne par morceau)
- Deadline : 2026-04-26, timebox 3h

Lis d'abord les 2 fichiers de contexte :
- @BRIEF.md (problème, scope, signaux de succès/échec)
- @CLAUDE.md (stack, conventions, architecture cible, points de pivot)

Puis :
1. Liste les étapes concrètes pour livrer le bullet 1 de SCOPE V1 (plugin Chrome fonctionnel sur Spotify — page artiste + playlist)
2. Valide avec moi avant de commencer à coder
3. Respecte la timebox — si tu sens qu'on dérive à 1h30 sur le DOM Spotify, alerte-moi immédiatement (pivot bookmarklet)

Go.
