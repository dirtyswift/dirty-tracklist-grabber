"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang-provider";

type Variant = "hero" | "cta";

type Status = "idle" | "loading" | "success" | "error";

type Props = {
  variant: Variant;
};

const FORM_BTN_HERO =
  "shrink-0 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base";
const FORM_BTN_CTA =
  "shrink-0 rounded-full bg-ink px-6 py-3.5 text-base font-semibold text-paper transition hover:bg-brand hover:text-ink disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg";

const INPUT_HERO =
  "min-w-0 flex-1 rounded-full border border-ink/25 bg-paper/70 px-5 py-3 text-base text-ink placeholder:text-ink/40 focus:border-ink focus:bg-paper focus:outline-none";
const INPUT_CTA =
  "min-w-0 flex-1 rounded-full border border-ink/25 bg-paper px-5 py-3.5 text-base text-ink shadow-sm placeholder:text-ink/40 focus:border-ink focus:outline-none sm:text-lg";

const SUCCESS_BTN_HERO =
  "group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-base font-semibold text-paper transition hover:bg-ink/85";
const SUCCESS_BTN_CTA =
  "group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-lg font-semibold text-paper transition hover:bg-brand hover:text-ink";

export function EmailGate({ variant }: Props) {
  const { t, lang } = useLang();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [url, setUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setStatus("error");
        return;
      }
      setUrl(data.url);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" && url) {
    return (
      <div className="flex flex-col items-start gap-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={variant === "hero" ? SUCCESS_BTN_HERO : SUCCESS_BTN_CTA}
        >
          {t.gate.success}
          <span
            aria-hidden
            className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5"
          >
            →
          </span>
        </a>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
          {t.gate.successHint}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col items-stretch gap-3"
      noValidate
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <label htmlFor={`email-${variant}`} className="sr-only">
          {t.gate.placeholder}
        </label>
        <input
          id={`email-${variant}`}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder={t.gate.placeholder}
          className={variant === "hero" ? INPUT_HERO : INPUT_CTA}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={variant === "hero" ? FORM_BTN_HERO : FORM_BTN_CTA}
        >
          {status === "loading" ? t.gate.loading : t.gate.submit}
        </button>
      </div>
      <p
        className={[
          "font-mono text-[11px] uppercase tracking-[0.22em]",
          status === "error" ? "text-brand-deep" : "text-ink/55",
        ].join(" ")}
        role={status === "error" ? "alert" : undefined}
      >
        {status === "error" ? t.gate.error : t.gate.privacy}
      </p>
    </form>
  );
}
