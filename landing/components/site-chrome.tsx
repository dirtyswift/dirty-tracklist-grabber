"use client";

import Link from "next/link";
import { Bars } from "@/components/bars";
import { LangToggle } from "@/components/lang-toggle";
import { useLang } from "@/lib/lang-provider";

const GITHUB_URL = "https://github.com/dirtyswift/dirty-tracklist-grabber";

function LogoMark({ size = "size-8" }: { size?: string }) {
  return (
    <span
      aria-hidden
      className={`flex ${size} items-center justify-center rounded-md bg-brand text-ink ring-1 ring-ink/10`}
    >
      <span className="block size-1/2">
        <Bars />
      </span>
    </span>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.628-5.373-12.001-12-12.001S0 5.416 0 12.044c0 5.628 3.874 10.35 9.101 11.647z" />
    </svg>
  );
}

export function SiteHeader() {
  const { t } = useLang();
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="container-page flex items-center justify-between py-3.5">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark />
          <span className="font-display text-base font-bold tracking-tight">
            Dirty Tracklist Grabber
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium sm:flex">
          <a href="#how" className="text-ink/70 hover:text-ink">
            {t.nav.how}
          </a>
          <a href="#features" className="text-ink/70 hover:text-ink">
            {t.nav.features}
          </a>
          <Link href="/privacy" className="text-ink/70 hover:text-ink">
            {t.nav.privacy}
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink/70 hover:text-ink"
          >
            {t.nav.github}
          </a>
        </nav>
        <div className="flex items-center gap-3 text-ink">
          <LangToggle />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="border-t border-ink/10 py-12">
      <div className="container-page flex flex-col items-start justify-between gap-6 text-sm text-ink/60 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark size="size-7" />
            <span className="font-display text-base font-bold text-ink">
              Dirty Tracklist Grabber
            </span>
          </div>
          <p className="mt-3 max-w-sm">
            {t.footer.byPre}{" "}
            <a
              href="https://dirtyswift.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink hover:opacity-70"
            >
              Dirty Swift
            </a>{" "}
            {t.footer.byMid}{" "}
            <a
              href="https://dirtylab.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink hover:opacity-70"
            >
              DirtyLab.fr
            </a>
            {t.footer.byEnd}{" "}
            <span className="font-medium text-ink">VYBZ</span>.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://www.instagram.com/dirtyswift"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Dirty Swift"
              className="text-ink/50 transition-colors hover:text-ink"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.facebook.com/dirtyswift/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Dirty Swift"
              className="text-ink/50 transition-colors hover:text-ink"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-ink">
            {t.footer.privacy}
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            {t.footer.github}
          </a>
        </div>
      </div>
    </footer>
  );
}
