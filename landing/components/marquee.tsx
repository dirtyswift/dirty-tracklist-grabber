"use client";

const TRACKS = [
  "A Tribe Called Quest - Bonita Applebum",
  "Gang Starr - Just To Get A Rep",
  "LL Cool J - Mama Said Knock You Out",
  "Lord Finesse - Funky Technician",
  "The Notorious B.I.G. - Party and Bullshit",
  "Wu-Tang Clan - Protect Ya Neck",
  "Pete Rock & C.L. Smooth - They Reminisce Over You",
  "Mobb Deep - Shook Ones, Pt. II",
  "Nas - N.Y. State of Mind",
  "Big L - Ebonics",
  "Madvillain - Accordion",
  "J Dilla - Don't Cry",
];

export function TracklistMarquee({ label }: { label: string }) {
  const row = [...TRACKS, ...TRACKS];
  return (
    <div className="relative overflow-hidden border-y border-ink/15 bg-paper-warm py-5">
      <div className="absolute left-0 top-0 z-10 flex h-full items-center px-4 sm:px-8">
        <span className="rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-paper">
          {label}
        </span>
      </div>
      <div className="marquee-track flex gap-10 whitespace-nowrap pl-44 will-change-transform">
        {row.map((t, i) => (
          <span
            key={i}
            className="font-mono text-base uppercase tracking-tight text-ink/80"
          >
            {t}
            <span className="ml-10 text-brand">/</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-paper-warm to-transparent" />
    </div>
  );
}
