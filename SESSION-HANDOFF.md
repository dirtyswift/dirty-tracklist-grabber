# SESSION HANDOFF — dirty-tracklist-grabber / landing

**Date :** 2026-07-21
**Périmètre :** landing Next.js 16 (`grabber.dirtyswift.com`), déployée en Docker sur le VPS (`/root/dirty-tracklist-grabber`, container `grabber-landing`, reverse proxy Traefik).

> **Checkpoint 2026-07-21 (rafraîchi) :** aucun changement de code depuis `c6acd16` (working tree propre). Le code REQ DODGER + reqdj.com + socials footer est déjà commité en local. **Reste à faire : push + déploiement prod** (voir « Prochaine action exacte »).

---

## ✅ Fait

### Bandeau cross-promo « Dirty Lab » (barre du bas) — DÉPLOYÉ
- `landing/components/lab-promo.tsx` — barre fixe ancrée en bas, montée globalement dans `landing/app/layout.tsx` (dans `LangProvider`), i18n FR/EN dans `landing/lib/i18n.ts` (`labPromo.header` / `labPromo.close`).
- Comportement : affiche les 3 AUTRES outils du Lab (VYBZ en 1er, Grabber exclu), apparition ~2 s, fermeture **en mémoire seulement** (revient au reload), `prefers-reduced-motion` respecté, `max-height: calc(100vh - 2.5rem)` + scroll.
- Commit **`0374c36`** — poussé sur `origin/main` **et déployé en prod** (version initiale du bandeau).

### MàJ liens / renommage — COMMITÉ LOCAL, PAS ENCORE DÉPLOYÉ
- REQ : `req.vybzdj.com` → **`reqdj.com`**
- Flappy REQ → **REQ DODGER** : `flappyreq.vybzdj.com` → **`dodger.reqdj.com`**
- Logos locaux (`landing/public/lab-promo/`) : `req.svg` (= reqdj.com/icon.svg), `dodger.svg` (= dodger.reqdj.com/img/favicon.svg), `vybz.svg`, `dirtylab.svg` inchangés. `flappyreq.svg` supprimé.

### Réseaux sociaux Dirty Swift (footer) — COMMITÉ LOCAL, PAS ENCORE DÉPLOYÉ
- `landing/components/site-chrome.tsx` — icônes inline **Instagram + Facebook** dans le footer, rattachées au bloc Dirty Swift.
  - IG : https://www.instagram.com/dirtyswift
  - FB : https://www.facebook.com/dirtyswift/
  - Pas de LinkedIn (page indisponible côté Dirty Swift).

### Vérifs locales
- `pnpm exec tsc --noEmit` : OK (0 erreur).
- SSR (dev) : bandeau contient `REQ DODGER`, `reqdj.com`, `dodger.reqdj.com` ; plus aucune trace de `flappyreq` / `req.vybzdj.com` ; footer contient les socials ; 4 logos servis `200 image/svg+xml` ; aucune erreur runtime.

---

## ⚠️ État prod (IMPORTANT)
La prod tourne **encore la version `0374c36`** (ancien bandeau « Flappy REQ » + `req.vybzdj.com`, sans socials).
Les changements **REQ DODGER + reqdj.com + socials footer** sont commités en local mais **PAS déployés**.

---

## ▶️ Prochaine action EXACTE pour reprendre

1. **Push :**
   ```bash
   git push origin main
   ```
2. **Déploiement VPS :**
   ```bash
   ssh root@213.210.20.4 'cd /root/dirty-tracklist-grabber && git pull --ff-only origin main && cd landing && docker compose up -d --build'
   ```
3. **Vérif prod :**
   ```bash
   curl -s https://grabber.dirtyswift.com/ | grep -oE 'REQ DODGER|dodger.reqdj.com|reqdj.com|instagram.com/dirtyswift|flappyreq|req.vybzdj.com' | sort -u
   ```
   Attendu : `REQ DODGER`, `dodger.reqdj.com`, `reqdj.com`, `instagram.com/dirtyswift`.
   NE doit PLUS apparaître : `flappyreq`, `req.vybzdj.com`.

---

## Notes
- `design/store-promo/` : 2 PNG (promo Chrome Web Store), inclus dans le checkpoint.
- Réseaux **VYBZ / REQ** fournis mais **non utilisés sur ce site** (décision : footer = Dirty Swift uniquement). À réutiliser sur les bandeaux des sites VYBZ / REQ respectifs :
  - VYBZ : IG `instagram.com/vybzdj.app` · FB `facebook.com/vybzdj` · LinkedIn `linkedin.com/company/vybzdj`
  - REQ : IG `instagram.com/req.dj` · FB `facebook.com/reqdj` · LinkedIn `linkedin.com/company/reqdj`
  - Media kit REQ : `/Users/dirty/Dev/req-app/media-kit/kit-reseaux-sociaux.html`
