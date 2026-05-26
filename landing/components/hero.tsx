"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { Bars } from "@/components/bars";
import { EmailGate } from "@/components/email-gate";
import { useLang } from "@/lib/lang-provider";

export function Hero() {
  const { t, lang } = useLang();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const words = root.current?.querySelectorAll<HTMLElement>("[data-anim='word']");
      if (!words || words.length === 0) return;

      gsap.set(words, { yPercent: 110, opacity: 0 });
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.95,
        ease: "expo.out",
        stagger: 0.07,
        delay: 0.05,
      });

      const fades = root.current?.querySelectorAll<HTMLElement>("[data-anim='fade']");
      if (fades && fades.length) {
        gsap.fromTo(
          fades,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.1,
            delay: 0.55,
          },
        );
      }
    },
    { scope: root, dependencies: [lang] },
  );

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden bg-brand text-ink"
    >
      <div className="absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="container-page relative grid gap-16 pt-12 pb-20 md:grid-cols-[1.35fr_1fr] md:pt-20 md:pb-32">
        <div className="flex flex-col gap-8">
          <span
            data-anim="fade"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em]"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink" />
            {t.hero.kicker}
            <span className="ml-1 rounded-sm bg-ink px-1.5 py-0.5 text-[9px] text-brand">
              {t.hero.kickerStatus}
            </span>
          </span>

          <h1 className="overflow-hidden font-display font-bold leading-[0.92] tracking-[-0.04em] [font-size:clamp(3rem,9vw,7.75rem)]">
            <Line>
              <Word>{t.hero.title1}</Word>
            </Line>
            <Line>
              <Word>{t.hero.title2}</Word>
            </Line>
            <Line>
              <Word>{t.hero.title3}</Word>{" "}
              <Word className="italic underline decoration-[0.08em] underline-offset-[0.12em] decoration-ink">
                {t.hero.title4}
              </Word>
            </Line>
          </h1>

          <p
            data-anim="fade"
            className="max-w-md text-pretty text-lg leading-relaxed text-ink/85 md:text-xl"
          >
            {t.hero.sub}{" "}
            <code className="rounded bg-ink/10 px-1.5 py-0.5 font-mono text-[0.9em] text-ink">
              {t.hero.subFormat}
            </code>
            {t.hero.subEnd}
          </p>

          <div data-anim="fade" className="flex flex-col gap-4 pt-2">
            <EmailGate variant="hero" />
            <a
              href="#how"
              className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink px-6 py-3 text-base font-semibold transition hover:bg-ink hover:text-paper"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>

        <div
          data-anim="fade"
          className="relative flex items-center justify-center md:justify-end"
        >
          <div className="relative w-full max-w-lg">
            <div
              aria-hidden
              className="absolute -inset-x-6 -inset-y-4 -z-10 rounded-[2rem] bg-ink/10"
            />
            <figure className="overflow-hidden rounded-[1.5rem] bg-ink ring-1 ring-ink/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] rotate-[-2deg]">
              <div className="flex items-center gap-1.5 bg-ink px-3 py-2">
                <span className="size-2.5 rounded-full bg-paper/30" />
                <span className="size-2.5 rounded-full bg-paper/30" />
                <span className="size-2.5 rounded-full bg-paper/30" />
                <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/60">
                  open.spotify.com
                </span>
              </div>
              <Image
                src="/screenshots/2_spotify_copied.png"
                alt="Dirty Tracklist Grabber on a Spotify playlist"
                width={1280}
                height={800}
                priority
                sizes="(min-width: 768px) 40vw, 90vw"
                className="block h-auto w-full"
              />
            </figure>
            <div
              aria-hidden
              className="absolute -right-5 -top-5 size-20 rotate-[6deg] rounded-2xl bg-ink p-4 text-brand ring-4 ring-paper shadow-xl"
            >
              <Bars />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Line({ children }: { children: React.ReactNode }) {
  return <span className="block overflow-hidden pb-[0.05em]">{children}</span>;
}

function Word({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      data-anim="word"
      className={["inline-block will-change-transform", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
