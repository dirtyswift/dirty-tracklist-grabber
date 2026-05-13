import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { SmoothAnchors } from "@/components/smooth-anchors";
import { LangProvider } from "@/lib/lang-provider";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  axes: ["opsz"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

const noFlash = `
try {
  var l = localStorage.getItem('dirty-tracklist-lang');
  if (l === 'en') document.documentElement.lang = 'en';
} catch (e) {}
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://grabber.dirtyswift.com"),
  title: "Dirty Tracklist Grabber, du digging à l'achat en 1 clic",
  description:
    "Extension Chrome qui copie la tracklist visible de Spotify ou Deezer dans le presse-papier, au format 'Artiste - Titre'.",
  openGraph: {
    title: "Dirty Tracklist Grabber",
    description:
      "Copie n'importe quelle tracklist Spotify ou Deezer dans ton presse-papier, en 1 clic.",
    url: "https://grabber.dirtyswift.com",
    siteName: "Dirty Tracklist Grabber",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dirty Tracklist Grabber",
    description:
      "Copie n'importe quelle tracklist Spotify ou Deezer dans ton presse-papier, en 1 clic.",
  },
  icons: { icon: "/logo-128.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${bricolage.variable} ${jetbrains.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <LangProvider>
          <SmoothAnchors />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
