"use client";

import { Features } from "@/components/features";
import { FinalCta } from "@/components/final-cta";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { TracklistMarquee } from "@/components/marquee";
import { PrivacyProof } from "@/components/privacy-proof";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Who } from "@/components/who";
import { useLang } from "@/lib/lang-provider";

export default function Home() {
  const { t } = useLang();
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TracklistMarquee label={t.marquee.tag} />
        <HowItWorks />
        <Features />
        <PrivacyProof />
        <Who />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
