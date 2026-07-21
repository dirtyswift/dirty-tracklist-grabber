# SESSION HANDOFF — dirty-tracklist-grabber / landing

**Date :** 2026-07-21
**Périmètre :** landing Next.js 16 (`grabber.dirtyswift.com`), déployée en Docker sur le VPS (`/root/dirty-tracklist-grabber`, container `grabber-landing`, reverse proxy Traefik).

> **État au 2026-07-21 : tout est EN PROD** (commit `1673032` déployé sur le VPS et vérifié). Rien en attente de déploiement.

---

## ✅ Fait & déployé en prod

### Bandeau cross-promo « Dirty Lab » (barre du bas)
- `landing/components/lab-promo.tsx` — barre fixe ancrée en bas, montée globalement dans `landing/app/layout.tsx` (dans `LangProvider`), i18n FR/EN (`landing/lib/i18n.ts`).
- Affiche les 3 AUTRES outils du Lab (VYBZ en 1er), apparition ~2 s, fermeture **en mémoire seulement** (revient au reload), `prefers-reduced-motion` respecté.
- **Réserve sa hauteur** (`padding-bottom` sur `body`, recalculé au resize, retiré à la fermeture) → ne recouvre plus le footer.
- Catalogue affiché : **VYBZ** (`vybzdj.com`) · **REQ** (`reqdj.com`) · **REQ DODGER** (`dodger.reqdj.com`, ex-« Flappy REQ »).
- Logos locaux : `landing/public/lab-promo/{vybz,req,dodger,dirtylab}.svg`.

### Réseaux sociaux Dirty Swift (footer)
- `landing/components/site-chrome.tsx` — icônes inline **Instagram + Facebook** dans le footer.
  - IG : https://www.instagram.com/dirtyswift · FB : https://www.facebook.com/dirtyswift/
  - Pas de LinkedIn (page indisponible côté Dirty Swift).

### Inscription email → newsletters DirtyLab
- `landing/lib/airtable.ts` — l'écriture Airtable (table `Dirty Newsletter`, base `apphGHvCGhABYAJkb`) tague désormais :
  - `Newsletters = ["dirtyswift", "req", "vybz"]` (options existantes du champ, aucune modif de config)
  - `Confirmed = true` + `Confirmed at` (convention DirtyLab : signup = consentement)
- **Flux email** : `/api/subscribe` stocke l'email dans Airtable puis renvoie l'URL du Chrome Web Store. Le mail « voici ton lien » est envoyé par une **automatisation dirtylab (n8n/Airtable)** qui watch la table — PAS par ce repo. La landing détient le PAT Airtable (`AIRTABLE_API_KEY` dans `.env.production` sur le VPS).

---

## ⚠️ Notes / RGPD
- **Auto-abonnement cross-marque** (Grabber → dirtyswift+req+vybz, `Confirmed=true`) : c'est le point que la directive DirtyLab signale comme sensible RGPD. Assumé (demande explicite).
- **Déviation d'archi** : la directive DirtyLab recommande que le SaaS NE détienne PAS le PAT et POST vers `dirtylab.fr/api/newsletter/subscribe`. Ce projet écrit en direct dans Airtable (hérité). Migration possible plus tard si besoin.
- Réseaux **VYBZ / REQ** fournis mais non utilisés ici (footer = Dirty Swift only). À réutiliser sur leurs bandeaux respectifs :
  - VYBZ : IG `instagram.com/vybzdj.app` · FB `facebook.com/vybzdj` · in `linkedin.com/company/vybzdj`
  - REQ : IG `instagram.com/req.dj` · FB `facebook.com/reqdj` · in `linkedin.com/company/reqdj`
  - Media kit REQ : `/Users/dirty/Dev/req-app/media-kit/kit-reseaux-sociaux.html`

---

## Déploiement (rappel)
```bash
git push origin main
ssh root@213.210.20.4 'cd /root/dirty-tracklist-grabber && git pull --ff-only origin main && cd landing && docker compose up -d --build'
# vérif : curl -s https://grabber.dirtyswift.com/ | grep -oE 'REQ DODGER|reqdj.com|instagram.com/dirtyswift'
```

## Prochaine action possible (optionnel, non demandé)
- Tester une vraie inscription en prod et confirmer dans Airtable que `Newsletters` = dirtyswift/req/vybz + `Confirmed` cochée (ça crée un record réel → à nettoyer si test).
- Corriger le potentiel doublon si un même email s'inscrit 2× (comportement actuel : crée un nouveau record).
