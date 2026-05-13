export type Lang = "fr" | "en";

export const DEFAULT_LANG: Lang = "fr";

export type Step = { n: string; title: string; body: string };
export type FeatureItem = { k: string; v: string };
export type PrivacySection = { h: string; body: string };

export type Dict = {
  nav: { how: string; features: string; privacy: string; github: string };
  hero: {
    kicker: string;
    kickerStatus: string;
    title1: string;
    title2: string;
    title3: string;
    title4: string;
    sub: string;
    subFormat: string;
    subEnd: string;
    ctaSoon: string;
    ctaLive: string;
    ctaSecondary: string;
  };
  marquee: { tag: string };
  how: {
    tag: string;
    title1: string;
    title2: string;
    lead: string;
    steps: Step[];
  };
  features: { tag: string; title: string; items: FeatureItem[] };
  privacy: {
    tag: string;
    title1: string;
    title2: string;
    title3: string;
    p1: string;
    p2: string;
    cta: string;
  };
  cta: { title: string; sub: string; ctaSoon: string; ctaLive: string };
  who: {
    tag: string;
    title: string;
    p1: string;
    p2: string;
    cta: string;
  };
  footer: {
    byPre: string;
    byMid: string;
    byEnd: string;
    privacy: string;
    github: string;
  };
  privacyPage: {
    back: string;
    lastUpdated: string;
    title: string;
    intro: string;
    sections: PrivacySection[];
  };
};

export const dict: Record<Lang, Dict> = {
  fr: {
    nav: {
      how: "Comment ça marche",
      features: "Le détail",
      privacy: "Vie privée",
      github: "GitHub",
    },
    hero: {
      kicker: "Extension Chrome",
      kickerStatus: "En review",
      title1: "Du digging",
      title2: "à l'achat,",
      title3: "en",
      title4: "1 clic.",
      sub: "Copie n'importe quelle tracklist Spotify ou Deezer dans ton presse-papier, formatée",
      subFormat: "Artiste - Titre",
      subEnd: ". Colle où tu veux — Apple Music, Beatport, Bandcamp.",
      ctaSoon: "Bientôt sur le Chrome Web Store",
      ctaLive: "Ajouter à Chrome — gratuit",
      ctaSecondary: "Voir le workflow",
    },
    marquee: {
      tag: "Format presse-papiers",
    },
    how: {
      tag: "Le vrai workflow",
      title1: "Aucun raccourci magique.",
      title2: "Juste ton flow, accéléré.",
      lead: "Conçue pour celles et ceux qui découvrent leur musique sur Spotify ou Deezer, mais l'achètent ailleurs : Apple Music, Beatport, Bandcamp, Discogs.",
      steps: [
        {
          n: "01",
          title: "Ouvre une playlist ou un artiste",
          body: "Sur Spotify ou Deezer. Le bouton Tracklist Grabber apparaît en bas à droite avec un compteur en temps réel.",
        },
        {
          n: "02",
          title: "Clique le bouton",
          body: "La tracklist visible part dans le presse-papier, au format Artiste - Titre, une ligne par morceau.",
        },
        {
          n: "03",
          title: "Colle dans Notes",
          body: "Ta liste de courses. Une ligne par titre, prête à être cochée au fur et à mesure.",
        },
        {
          n: "04",
          title: "Achète sur Apple Music",
          body: "Recherche un titre à la fois — Apple Music ne prend qu'une requête. Clique. Achète. Suivant.",
        },
      ],
    },
    features: {
      tag: "Le détail",
      title: "Ce que ça fait vraiment.",
      items: [
        {
          k: "Spotify + Deezer",
          v: "Les deux plateformes. Pages playlist et artiste, préfixes de langue inclus.",
        },
        {
          k: "Couleur par service",
          v: "Vert sur Spotify, violet sur Deezer. Le flash de confirmation aussi.",
        },
        {
          k: "Compteur live",
          v: "Le bouton compte les morceaux à mesure que tu scrolles. Tu sais toujours ce qui va partir.",
        },
        {
          k: "Reset auto",
          v: "Tu changes de playlist ou d'artiste ? La liste se vide toute seule.",
        },
        {
          k: "Reset manuel",
          v: "Un bouton × à côté du compteur vide la liste quand tu veux.",
        },
        {
          k: "Aucun compte, aucune config",
          v: "Tu installes. Pas d'inscription. Pas de réglages. Ça marche sur les deux domaines, point.",
        },
      ],
    },
    privacy: {
      tag: "Vie privée",
      title1: "Zéro donnée.",
      title2: "Zéro tracking.",
      title3: "Zéro requête réseau.",
      p1: "L'extension lit le DOM de la page courante, puis écrit le résultat dans ton presse-papier. C'est toute la boucle.",
      p2: "Pas d'analytics. Pas de télémétrie. Pas de mise à jour distante. Pas de localStorage, pas de chrome.storage, pas de fetch.",
      cta: "Lire la politique complète",
    },
    cta: {
      title: "Prêt à attraper des tracklists ?",
      sub: "Installation en un clic. Marche sur toutes les playlists et pages artiste Spotify et Deezer.",
      ctaSoon: "Bientôt sur le Chrome Web Store",
      ctaLive: "Ajouter à Chrome — gratuit",
    },
    who: {
      tag: "L'auteur",
      title: "Qui est Dirty Swift ?",
      p1: "Plus de trente ans aux platines. Pionnier du Dirty South et de la Trap en France, il a ouvert pour Beyoncé & Jay-Z au Stade de France, puis pour DJ Snake à La Défense Arena. Auteur de Culture DJ chez Larousse, host du DMC World Championship 2024, fondateur de Playin' Paris.",
      p2: "À la radio sur Générations (Dirty Lab, 13h–16h, et Dirty Mix le samedi soir). Ses podcasts #MondayMix et #DirtyMix totalisent plus de 30 millions d'écoutes. Et entre deux sets, il code des outils comme celui-ci, parce que copier des titres à la main, c'est non.",
      cta: "dirtyswift.com",
    },
    footer: {
      byPre: "Construit par",
      byMid: "pour",
      byEnd: ", sponsorisé par",
      privacy: "Vie privée",
      github: "GitHub",
    },
    privacyPage: {
      back: "← Retour à l'accueil",
      lastUpdated: "Dernière mise à jour",
      title: "Politique de confidentialité",
      intro: "L'extension Dirty Tracklist Grabber ne collecte, ne stocke et ne transmet aucune donnée personnelle.",
      sections: [
        { h: "Données collectées", body: "Aucune." },
        {
          h: "Stockage local",
          body: "Aucun. L'extension n'utilise ni localStorage, ni sessionStorage, ni IndexedDB, ni l'API chrome.storage.",
        },
        {
          h: "Requêtes réseau",
          body: "Aucune. L'extension ne fait aucune requête réseau : ni analytics, ni télémétrie, ni mise à jour distante.",
        },
        {
          h: "Permissions",
          body: "L'extension utilise uniquement des content scripts injectés sur open.spotify.com et www.deezer.com. Ces scripts lisent le DOM de la page courante et écrivent le résultat dans le presse-papier via l'API standard navigator.clipboard.",
        },
        { h: "Tracking", body: "Aucun." },
        {
          h: "Contact",
          body: "Ouvre une issue sur GitHub.",
        },
      ],
    },
  },
  en: {
    nav: {
      how: "How it works",
      features: "Features",
      privacy: "Privacy",
      github: "GitHub",
    },
    hero: {
      kicker: "Chrome Extension",
      kickerStatus: "In review",
      title1: "From digging",
      title2: "to buying,",
      title3: "in",
      title4: "1 click.",
      sub: "Copy any Spotify or Deezer tracklist to your clipboard, formatted as",
      subFormat: "Artist - Title",
      subEnd: ". Paste it anywhere, Apple Music, Beatport, Bandcamp.",
      ctaSoon: "Coming soon on Chrome Web Store",
      ctaLive: "Add to Chrome, free",
      ctaSecondary: "See the workflow",
    },
    marquee: {
      tag: "Clipboard format",
    },
    how: {
      tag: "The real workflow",
      title1: "No magic shortcut.",
      title2: "Just your flow, faster.",
      lead: "Built for diggers who discover music on Spotify or Deezer but buy it elsewhere: Apple Music, Beatport, Bandcamp, Discogs.",
      steps: [
        {
          n: "01",
          title: "Open a playlist or artist",
          body: "On Spotify or Deezer. The Tracklist Grabber button shows up bottom-right with a live counter.",
        },
        {
          n: "02",
          title: "Click the button",
          body: "The whole visible tracklist lands in your clipboard, formatted Artist - Title, one track per line.",
        },
        {
          n: "03",
          title: "Paste it in Notes",
          body: "Your shopping list. One line per track, ready to be ticked off as you go.",
        },
        {
          n: "04",
          title: "Buy on Apple Music",
          body: "Search one track at a time, Apple Music only takes one query. Click. Buy. Next.",
        },
      ],
    },
    features: {
      tag: "Features",
      title: "What it actually does.",
      items: [
        {
          k: "Spotify + Deezer",
          v: "Both platforms. Playlist pages, artist pages, locale-prefixed URLs included.",
        },
        {
          k: "Branded per service",
          v: "Green on Spotify, purple on Deezer. The flash confirmation too.",
        },
        {
          k: "Live counter",
          v: "The button counts tracks as you scroll. You always know what's about to be copied.",
        },
        {
          k: "Auto reset",
          v: "Switch to another playlist or artist? The list clears itself.",
        },
        {
          k: "Manual reset",
          v: "An × button next to the counter wipes the list whenever you want.",
        },
        {
          k: "No account, no settings",
          v: "Install once. No sign-up. No options. Works on those two domains, period.",
        },
      ],
    },
    privacy: {
      tag: "Privacy",
      title1: "Zero data.",
      title2: "Zero tracking.",
      title3: "Zero network calls.",
      p1: "The extension reads the DOM of the current page, then writes the result to your clipboard. That's the whole loop.",
      p2: "No analytics. No telemetry. No remote updates. No localStorage, no chrome.storage, no fetch.",
      cta: "Read the full policy",
    },
    cta: {
      title: "Ready to grab tracklists?",
      sub: "One-click install. Works on every Spotify and Deezer playlist or artist page.",
      ctaSoon: "Coming soon on Chrome Web Store",
      ctaLive: "Add to Chrome, free",
    },
    who: {
      tag: "The author",
      title: "Who is Dirty Swift?",
      p1: "Over thirty years behind the decks. A pioneer of Dirty South and Trap in France, he opened for Beyoncé & Jay-Z at the Stade de France, then for DJ Snake at La Défense Arena. Author of Culture DJ (Larousse), host of the 2024 DMC World Championship, founder of Playin' Paris.",
      p2: "On the air on Générations (Dirty Lab, 1pm–4pm, and Dirty Mix on Saturday nights). His #MondayMix and #DirtyMix podcasts have racked up over 30 million plays. Between sets, he builds tools like this one, because copying titles by hand is a hard no.",
      cta: "dirtyswift.com",
    },
    footer: {
      byPre: "Built by",
      byMid: "for",
      byEnd: ", sponsored by",
      privacy: "Privacy",
      github: "GitHub",
    },
    privacyPage: {
      back: "← Back to home",
      lastUpdated: "Last updated",
      title: "Privacy policy",
      intro: "Dirty Tracklist Grabber does not collect, store, or transmit any personal data.",
      sections: [
        { h: "Data collected", body: "None." },
        {
          h: "Local storage",
          body: "None. The extension does not use localStorage, sessionStorage, IndexedDB, or the chrome.storage API.",
        },
        {
          h: "Network requests",
          body: "None. The extension makes no network requests: no analytics, no telemetry, no remote updates.",
        },
        {
          h: "Permissions",
          body: "The extension uses only content scripts injected on open.spotify.com and www.deezer.com. These scripts read the DOM of the current page and write the result to your clipboard via the standard navigator.clipboard API.",
        },
        { h: "Tracking", body: "None." },
        {
          h: "Contact",
          body: "Open an issue on GitHub.",
        },
      ],
    },
  },
};
