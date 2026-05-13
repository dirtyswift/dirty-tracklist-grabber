"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { useLang } from "@/lib/lang-provider";

gsap.registerPlugin(ScrollTrigger);

export function PrivacyProof() {
  const { t, lang } = useLang();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = root.current?.querySelectorAll<HTMLElement>("[data-line]");
      lines?.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
            delay: i * 0.06,
            scrollTrigger: {
              trigger: root.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      });
    },
    { scope: root, dependencies: [lang] },
  );

  return (
    <section ref={root} className="bg-ink py-24 text-paper md:py-32">
      <div className="container-page grid gap-12 md:grid-cols-12 md:items-center md:gap-20">
        <div className="md:col-span-7">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-paper/55">
            ◦ {t.privacy.tag}
          </span>
          <h2 className="mt-5 font-display font-bold leading-[0.95] tracking-[-0.03em] [font-size:clamp(2.5rem,6vw,5.5rem)]">
            <span data-line className="block">
              {t.privacy.title1}
            </span>
            <span data-line className="block">
              {t.privacy.title2}
            </span>
            <span data-line className="block text-brand">
              {t.privacy.title3}
            </span>
          </h2>
        </div>
        <div className="md:col-span-5 space-y-6 text-lg leading-relaxed text-paper/75">
          <p data-line>{t.privacy.p1}</p>
          <p data-line>{t.privacy.p2}</p>
          <div data-line>
            <Link
              href="/privacy"
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-ink transition hover:bg-paper"
            >
              {t.privacy.cta}
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
