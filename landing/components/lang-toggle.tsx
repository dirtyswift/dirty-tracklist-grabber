"use client";

import { useLang } from "@/lib/lang-provider";

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-current/15 p-0.5 text-xs font-semibold tracking-[0.18em] uppercase backdrop-blur-sm"
    >
      {(["fr", "en"] as const).map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            className={[
              "relative px-3 py-1.5 rounded-full transition-colors duration-300",
              active
                ? "bg-current"
                : "hover:opacity-70",
            ].join(" ")}
          >
            <span
              className={
                active
                  ? "mix-blend-difference text-white"
                  : ""
              }
            >
              {l}
            </span>
          </button>
        );
      })}
    </div>
  );
}
