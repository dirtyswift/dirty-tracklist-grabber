"use client";

import Image from "next/image";
import Link from "next/link";
import { LangToggle } from "@/components/lang-toggle";
import { useLang } from "@/lib/lang-provider";

const GITHUB_URL = "https://github.com/dirtyswift/dirty-tracklist-grabber";

export function SiteHeader() {
  const { t } = useLang();
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="container-page flex items-center justify-between py-3.5">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-128.png"
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-md ring-1 ring-ink/10"
          />
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
            <Image
              src="/logo-128.png"
              alt=""
              width={28}
              height={28}
              className="size-7 rounded-md ring-1 ring-ink/10"
            />
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
