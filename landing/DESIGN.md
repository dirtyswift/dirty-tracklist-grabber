# Dirty Tracklist Grabber — Design

## Color strategy: **committed**
The brand orange carries 30–60% of the surface. The hero is drenched. Inner sections rest on warm paper. Ink is the dominant text color and the secondary surface.

| Role | Token | OKLCH (approx) | Hex |
|---|---|---|---|
| Brand | `--color-brand` | `oklch(0.65 0.21 35)` | `#FC4501` |
| Brand-deep | `--color-brand-deep` | `oklch(0.50 0.20 32)` | `#C93701` |
| Ink | `--color-ink` | `oklch(0.16 0.01 40)` | `#161310` |
| Ink-soft | `--color-ink-soft` | `oklch(0.34 0.01 40)` | — used at 70% |
| Paper | `--color-paper` | `oklch(0.985 0.006 80)` | `#FCF9F4` |
| Paper-warm | `--color-paper-warm` | `oklch(0.96 0.01 70)` | `#F5EDE0` |
| Spotify | `--color-spotify` | `oklch(0.79 0.20 145)` | `#1ED760` (used at brand mention only) |
| Deezer | `--color-deezer` | `oklch(0.66 0.27 305)` | `#A238FF` (used at brand mention only) |

No pure `#fff`, no pure `#000`. Every neutral has a faint orange tint (chroma ~0.005–0.01).

## Theme
**Light, warm.** The mental scene: a DJ in their studio at 2pm, vinyl on the wall, golden light coming through the blinds, a cup of coffee, a playlist queued up. Nobody fatigued, nobody at 2am. The site is awake and confident.

## Typography
Strong pairing. Display = bold, expressive, large; body = clean, readable, set tight.

- Display: **Bricolage Grotesque** (variable, expressive, wide weight range, free via Google Fonts) — for headlines.
- Mono: **JetBrains Mono** (free via Google Fonts) — for clipboard format quotes and code-flavored bits.
- Body: same as display (Bricolage Grotesque) at lighter weight, or system stack as fallback.

Scale (fluid via `clamp`):
- Display XXL: `clamp(3rem, 8vw, 7.5rem)` — used once per page, on the hero.
- Display L: `clamp(2.25rem, 4.5vw, 4.5rem)` — section heads.
- Display M: `clamp(1.5rem, 2.5vw, 2.25rem)`.
- Body: `clamp(1rem, 1.05vw, 1.18rem)`, line-height 1.55, max 65ch.
- Tag: `0.75rem`, uppercase, tracking-wider.

Hierarchy ratio ≥ 1.5 between Display steps.

## Layout
- **No container-everything.** Hero is full-bleed, drenched. Inner sections use a max width of 1280px with asymmetric inner grids (12-col or 7/5 splits, not 6/6).
- **Spacing rhythm.** Sections alternate generous (140px) and tight (80px) vertical padding.
- **The bars motif.** The 4 black bars from the logo recur:
  - As an oversized div block in the hero corner (decorative).
  - As section dividers (3 thin bars, varying widths).
  - As a loading-state visual for the language toggle.
- **No cards for steps.** The "how it works" flow is a horizontal scroll-snap on desktop, vertical stack on mobile. Each step is a number + headline + screenshot, with the screenshot bleeding off the side.

## Motion (GSAP)
- **Hero reveal.** On load: stagger the display headline by word, mask-up reveal. ~700ms total, ease-out-expo.
- **Scroll-triggered fade-up.** Every section header and screenshot animates on entry. 600ms, ease-out-quart, 16px translate.
- **Horizontal marquee.** Below the hero, a tickertape of real `Artist - Title` lines scrolls right-to-left at constant velocity (CSS animation, hardware-accelerated, paused on hover).
- **Step counter morph.** The big step numbers (1 / 2 / 3 / 4) animate from blank to value when scrolled into view, using a count-up tween (200ms each, staggered).
- **Lang toggle.** Soft crossfade + blur reveal, never a jarring reload.
- **No layout-animated properties.** Only `transform`, `opacity`, `filter`. No animating `width`, `height`, `margin`.
- **No bounce.** ease-out-expo / quart / quint only.

## Components
- **LangToggle.** FR ⇄ EN segmented control top-right, persisted in `localStorage`, restored on mount.
- **HeroBars.** A decorative SVG/HTML block reproducing the logo's 4 bars at large scale.
- **TracklistMarquee.** Horizontal scrolling row of real artist-title pairs, no break.
- **StepRow.** Numbered step with screenshot, scroll-snap on desktop.
- **PrivacyProof.** Dark inverse section, brand orange punctuation, code-style enumeration of "what we don't do".
- **InstallCTA.** Big pill button, orange background, ink text, a subtle arrow that slides on hover (GSAP).
