"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useLang } from "@/lib/lang-provider";

gsap.registerPlugin(ScrollTrigger);

export function Features() {
  const { t, lang } = useLang();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = root.current?.querySelectorAll<HTMLElement>("[data-row]");
      items?.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          },
        );
      });
    },
    { scope: root, dependencies: [lang] },
  );

  return (
    <section
      id="features"
      ref={root}
      className="border-y border-ink/15 bg-paper-warm py-24 md:py-32"
    >
      <div className="container-page">
        <div className="mb-14 max-w-3xl">
          <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-ink/55">
            ◦ {t.features.tag}
          </span>
          <h2
            data-row
            className="mt-5 font-display font-bold leading-[0.95] tracking-[-0.03em] [font-size:clamp(2.25rem,5.5vw,4.75rem)]"
          >
            {t.features.title}
          </h2>
        </div>

        <dl className="divide-y divide-ink/15 border-y border-ink/15">
          {t.features.items.map((it, i) => (
            <div
              key={it.k}
              data-row
              className="grid items-baseline gap-x-8 gap-y-2 py-6 md:grid-cols-12"
            >
              <dt className="md:col-span-5 flex items-baseline gap-4">
                <span className="font-mono text-xs tabular-nums text-ink/50">
                  /{String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                  {it.k}
                </span>
              </dt>
              <dd className="md:col-span-7 text-base text-ink/70 md:text-lg">
                {it.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
