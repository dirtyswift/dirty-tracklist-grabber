"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Bars } from "@/components/bars";
import { EmailGate } from "@/components/email-gate";
import { useLang } from "@/lib/lang-provider";

gsap.registerPlugin(ScrollTrigger);

export function FinalCta() {
  const { t, lang } = useLang();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const els = root.current?.querySelectorAll<HTMLElement>("[data-cta-anim]");
      els?.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: "expo.out",
            delay: i * 0.08,
            scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
          },
        );
      });
    },
    { scope: root, dependencies: [lang] },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-paper py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -z-0 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl"
      />
      <div className="container-page relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div data-cta-anim className="mb-8 size-16 text-ink/85">
            <Bars />
          </div>
          <h2
            data-cta-anim
            className="font-display font-bold leading-[0.95] tracking-[-0.03em] [font-size:clamp(2.5rem,6.5vw,5.5rem)]"
          >
            {t.cta.title}
          </h2>
          <p
            data-cta-anim
            className="mt-6 max-w-xl text-pretty text-lg text-ink/70 md:text-xl"
          >
            {t.cta.sub}
          </p>
          <div data-cta-anim className="mt-10 flex w-full justify-center">
            <EmailGate variant="cta" />
          </div>
        </div>
      </div>
    </section>
  );
}
