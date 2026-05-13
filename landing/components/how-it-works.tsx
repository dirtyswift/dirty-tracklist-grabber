"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { useLang } from "@/lib/lang-provider";

gsap.registerPlugin(ScrollTrigger);

const SCREENSHOTS = [
  "/screenshots/1_spotify.png",
  "/screenshots/4_deezer_copied.png",
  "/screenshots/5_notes.png",
  "/screenshots/6_apple_music.png",
];

export function HowItWorks() {
  const { t, lang } = useLang();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tiles = root.current?.querySelectorAll<HTMLElement>("[data-step]");
      tiles?.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      const headline = root.current?.querySelector<HTMLElement>("[data-headline]");
      if (headline) {
        gsap.fromTo(
          headline,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: headline,
              start: "top 90%",
              once: true,
            },
          },
        );
      }
    },
    { scope: root, dependencies: [lang] },
  );

  return (
    <section id="how" ref={root} className="bg-paper py-24 md:py-36">
      <div className="container-page">
        <div data-headline className="max-w-3xl">
          <span className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-ink/55">
            ◦ {t.how.tag}
          </span>
          <h2 className="mt-5 font-display font-bold leading-[0.95] tracking-[-0.03em] [font-size:clamp(2.25rem,5.5vw,4.75rem)]">
            {t.how.title1}
            <br />
            <span className="text-ink/35">{t.how.title2}</span>
          </h2>
          <p className="mt-6 max-w-xl text-pretty text-lg text-ink/70">
            {t.how.lead}
          </p>
        </div>

        <ol className="mt-20 flex flex-col gap-24 md:gap-32">
          {t.how.steps.map((step, i) => {
            const flip = i % 2 === 1;
            return (
              <li
                key={step.n}
                data-step
                className={[
                  "grid items-center gap-10 md:gap-16",
                  "md:grid-cols-12",
                ].join(" ")}
              >
                <div
                  className={[
                    "md:col-span-5",
                    flip ? "md:order-2 md:col-start-8" : "",
                  ].join(" ")}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-display font-bold tabular-nums text-brand [font-size:clamp(3rem,6vw,5rem)] leading-none">
                      {step.n}
                    </span>
                    <span className="h-px flex-1 bg-ink/15" />
                  </div>
                  <h3 className="mt-6 font-display font-bold leading-[1.05] tracking-[-0.02em] [font-size:clamp(1.65rem,3vw,2.5rem)]">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-md text-pretty text-base text-ink/70 md:text-lg">
                    {step.body}
                  </p>
                </div>

                <div
                  className={[
                    "md:col-span-7",
                    flip ? "md:order-1 md:col-start-1" : "md:col-start-6",
                  ].join(" ")}
                >
                  <figure className="relative overflow-hidden rounded-2xl bg-paper-warm ring-1 ring-ink/10">
                    <Image
                      src={SCREENSHOTS[i]}
                      alt={step.title}
                      width={1280}
                      height={800}
                      sizes="(min-width: 768px) 60vw, 100vw"
                      className="block w-full h-auto"
                    />
                  </figure>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
