"use client";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { useLang } from "@/lib/lang-provider";

const LAST_UPDATED = { fr: "12 mai 2026", en: "May 12, 2026" } as const;

export default function PrivacyPage() {
  const { t, lang } = useLang();
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-20 md:py-28">
        <article className="container-page max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink/55">
            {t.privacyPage.lastUpdated} — {LAST_UPDATED[lang]}
          </p>
          <h1 className="mt-4 font-display font-bold leading-[0.95] tracking-[-0.03em] [font-size:clamp(2.25rem,5vw,4rem)]">
            {t.privacyPage.title}
          </h1>
          <p className="mt-7 max-w-prose text-lg leading-relaxed text-ink/80 md:text-xl">
            {t.privacyPage.intro}
          </p>

          <dl className="mt-12 divide-y divide-ink/15 border-y border-ink/15">
            {t.privacyPage.sections.map((s, i) => (
              <div
                key={s.h}
                className="grid items-baseline gap-x-8 gap-y-2 py-7 md:grid-cols-12"
              >
                <dt className="md:col-span-4 flex items-baseline gap-4">
                  <span className="font-mono text-xs tabular-nums text-ink/50">
                    /{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                    {s.h}
                  </span>
                </dt>
                <dd className="md:col-span-8 text-base leading-relaxed text-ink/70 md:text-lg">
                  {s.body}
                </dd>
              </div>
            ))}
          </dl>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
