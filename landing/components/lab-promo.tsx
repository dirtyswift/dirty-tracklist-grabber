"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/lang-provider";

type LabItem = {
  name: string;
  href: string;
  logo: string;
  taglineFr: string;
  taglineEn: string;
};

// Sur CE site (Grabber), on affiche les 3 AUTRES outils du Lab, VYBZ en premier.
// Grabber ne s'affiche jamais lui-même.
const ITEMS: LabItem[] = [
  {
    name: "VYBZ",
    href: "https://vybzdj.com",
    logo: "/lab-promo/vybz.svg",
    taglineFr: "Booking DJ, sans démarchage",
    taglineEn: "DJ booking, no cold outreach",
  },
  {
    name: "REQ",
    href: "https://req.vybzdj.com",
    logo: "/lab-promo/req.svg",
    taglineFr: "Tips & requests en booth",
    taglineEn: "Tips & requests in the booth",
  },
  {
    name: "Flappy REQ",
    href: "https://flappyreq.vybzdj.com",
    logo: "/lab-promo/flappyreq.svg",
    taglineFr: "Esquive les pires requests",
    taglineEn: "Dodge the worst requests",
  },
];

export function LabPromo() {
  const { lang, t } = useLang();
  // Fermeture EN MÉMOIRE seulement : pas de localStorage, la barre revient à chaque load.
  const [closed, setClosed] = useState(false);
  // Apparition ~2 s après le chargement (slide-up + fade, sauf reduced-motion).
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShown(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  if (closed) return null;

  return (
    <>
      <style>{styles}</style>
      <aside
        className={`lab-promo${shown ? " lab-promo--shown" : ""}`}
        aria-label="Dirty Lab"
      >
        <div className="lab-promo__inner">
          <a
            className="lab-promo__header"
            href="https://dirtylab.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="lab-promo__header-logo"
              src="/lab-promo/dirtylab.svg"
              alt="Dirty Lab"
              width={22}
              height={22}
            />
            <span className="lab-promo__header-text">
              {t.labPromo.header} <span className="lab-promo__arrow">→</span>
            </span>
          </a>

          <div className="lab-promo__items">
            {ITEMS.map((item) => (
              <a
                key={item.name}
                className="lab-promo__item"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="lab-promo__logo"
                  src={item.logo}
                  alt=""
                  width={26}
                  height={26}
                />
                <span className="lab-promo__name">{item.name}</span>
                <span className="lab-promo__tag">
                  {lang === "fr" ? item.taglineFr : item.taglineEn}
                </span>
              </a>
            ))}
          </div>

          <button
            type="button"
            className="lab-promo__close"
            onClick={() => setClosed(true)}
            aria-label={t.labPromo.close}
          >
            ×
          </button>
        </div>
      </aside>
    </>
  );
}

// Palette « quiet luxury » sombre, isolée du thème clair du site (paper/ink).
const styles = `
.lab-promo {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 60;
  max-height: calc(100vh - 2.5rem);
  overflow-y: auto;
  padding: 0.6rem 1rem;
  background: #100C08;
  border-top: 1px solid rgba(168, 124, 90, 0.30);
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.35);
  transform: translateY(110%);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease;
}
.lab-promo--shown {
  transform: translateY(0);
  opacity: 1;
}
.lab-promo__inner {
  max-width: 1100px;
  margin-inline: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.lab-promo__header {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex: 0 0 auto;
  text-decoration: none;
}
.lab-promo__header-logo {
  display: block;
  border-radius: 6px;
}
.lab-promo__header-text {
  display: none;
  color: #F2EDE4;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}
.lab-promo__arrow {
  color: #A87C5A;
  font-weight: 700;
  transition: transform 0.2s ease;
  display: inline-block;
}
.lab-promo__header:hover .lab-promo__arrow {
  transform: translateX(2px);
}
.lab-promo__items {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;
}
.lab-promo__items::-webkit-scrollbar {
  display: none;
}
.lab-promo__item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex: 0 0 auto;
  padding: 0.32rem 0.62rem;
  border: 1px solid rgba(242, 237, 228, 0.12);
  border-radius: 9px;
  text-decoration: none;
  white-space: nowrap;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}
.lab-promo__item:hover {
  border-color: #A87C5A;
  background: rgba(242, 237, 228, 0.04);
}
.lab-promo__logo {
  display: block;
  border-radius: 6px;
}
.lab-promo__name {
  color: #F2EDE4;
  font-weight: 700;
  font-size: 0.82rem;
}
.lab-promo__tag {
  display: none;
  color: #8B8178;
  font-size: 0.72rem;
}
.lab-promo__close {
  flex: 0 0 auto;
  margin-inline-start: 0.25rem;
  background: transparent;
  border: 0;
  color: #8B8178;
  font-size: 1.3rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.2rem 0.42rem;
  border-radius: 6px;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.lab-promo__close:hover {
  color: #F2EDE4;
  background: rgba(242, 237, 228, 0.06);
}
@media (min-width: 640px) {
  .lab-promo__header-text { display: inline; }
}
@media (min-width: 768px) {
  .lab-promo__items { justify-content: center; }
  .lab-promo__tag { display: inline; }
}
@media (prefers-reduced-motion: reduce) {
  .lab-promo {
    transition: none;
  }
  .lab-promo__arrow {
    transition: none;
  }
}
`;
