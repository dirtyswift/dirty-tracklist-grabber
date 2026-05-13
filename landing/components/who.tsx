"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { useLang } from "@/lib/lang-provider";

gsap.registerPlugin(ScrollTrigger);

export function Who() {
  const { t, lang } = useLang();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = root.current?.querySelectorAll<HTMLElement>("[data-fade]");
      items?.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
            delay: i * 0.07,
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
    <section ref={root} className="bg-paper-warm py-24 md:py-32">
      <div className="container-page grid gap-14 md:grid-cols-12 md:items-start md:gap-20">
        <div data-fade className="md:col-span-5">
          <figure className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[1.5rem] bg-ink ring-1 ring-ink/15 shadow-[0_30px_80px_-25px_rgba(0,0,0,0.45)] rotate-[-1.5deg]">
            <Image
              src="/dirty-swift.jpg"
              alt="Dirty Swift derrière les platines"
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-5 pt-16">
              <span className="font-display text-lg font-bold leading-tight text-paper">
                Dirty Swift
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/65">
                dirtyswift.com
              </span>
            </figcaption>
          </figure>
        </div>
        <div className="md:col-span-7">
          <span
            data-fade
            className="font-mono text-xs uppercase tracking-[0.3em] text-ink/55"
          >
            ◦ {t.who.tag}
          </span>
          <h2
            data-fade
            className="mt-5 font-display font-bold leading-[0.95] tracking-[-0.03em] [font-size:clamp(2.25rem,5.5vw,4.5rem)]"
          >
            {t.who.title}
          </h2>
          <div className="mt-8 space-y-5 max-w-prose text-lg leading-relaxed text-ink/80 md:text-xl">
            <p data-fade>{t.who.p1}</p>
            <p data-fade>{t.who.p2}</p>
          </div>
          <div data-fade className="mt-9">
            <a
              href="https://dirtyswift.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-ink px-5 py-3 text-sm font-semibold transition hover:bg-ink hover:text-paper"
            >
              {t.who.cta}
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5"
              >
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
