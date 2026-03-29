export type SiteLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type SiteStat = {
  value: string;
  label: string;
};

export type SiteQuote = {
  quote: string;
  author: string;
  role?: string;
};

export type HomeFeature = {
  eyebrow: string;
  title: string;
  summary: string;
  href: string;
  image: string;
};

export type ServiceFeature = {
  eyebrow: string;
  title: string;
  summary: string;
  image: string;
};

export type BookEntry = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  detail: string[];
  coverImage: string;
  buyLinks: SiteLink[];
};

export type FilmEntry = {
  title: string;
  summary: string;
  image: string;
  href: string;
};

export type PaperEntry = {
  title: string;
  citation: string;
  summary: string;
  href: string;
};

export const sidneySite = {
  brand: {
    title: "Sidney Dekker",
    logo: "https://sidneydekker.com/wp-content/uploads/2024/10/SidneyDekker.svg",
    tagline: "Safety, resilience, just culture and the human side of organizational performance.",
  },
  nav: [
    { label: "About", href: "/about" },
    { label: "Books", href: "/books" },
    { label: "Films", href: "/films" },
    { label: "Papers", href: "/papers" },
    { label: "Contact", href: "/contact" },
  ] satisfies SiteLink[],
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sidneydekker/", external: true },
    { label: "Youtube", href: "https://www.youtube.com/results?search_query=Sidney+Dekker", external: true },
    { label: "Google Scholar", href: "https://scholar.google.com/citations?user=y6mGO6IAAAAJ&hl=en", external: true },
  ] satisfies SiteLink[],
  footerLinks: [
    { label: "Work with Sidney", href: "/work-with-sidney" },
    { label: "Motivational Speaking", href: "/motivational-speaking" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ] satisfies SiteLink[],
  logos: [
    "Boeing",
    "Shell",
    "Chevron",
    "NASA",
    "Toyota",
    "IKEA",
    "Qantas",
    "Suncor",
    "Santos",
    "Rio Tinto",
    "Queensland Health",
    "Transport for NSW",
  ],
  contactOptions: [
    "Speaking enquiry",
    "Workshop or facilitation",
    "Executive advisory",
    "Academic collaboration",
    "General enquiry",
  ],
  contactLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sidneydekker/", external: true },
    { label: "Google Scholar", href: "https://scholar.google.com/citations?user=y6mGO6IAAAAJ&hl=en", external: true },
  ] satisfies SiteLink[],
  home: {
    heroTitle: "Leading a global movement for a new view on human factors, safety and resilience.",
    heroSummary:
      "Books, films, keynotes, advisory work and graduate programs focused on building organizations where learning, accountability and care can coexist.",
    heroImage:
      "https://sidneydekker.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-15-at-15.59.01-3.jpeg",
    heroCta: { label: "Work with Sidney", href: "/work-with-sidney" } satisfies SiteLink,
    stats: [
      { value: "20+", label: "Books published" },
      { value: "20,000+", label: "Scholarly citations" },
      { value: "500+", label: "Keynotes and workshops" },
      { value: "Top 1%", label: "Global scholars in safety science" },
    ] satisfies SiteStat[],
    textReveal: {
      title: "Where compassion leads, safety follows.",
      paragraphs: [
        "Sidney Dekker’s work argues that safety improves when organizations stop reducing failure to broken rules and broken people.",
        "His writing, speaking and advisory practice help leaders move beyond blame and toward systems that learn, repair and adapt under pressure.",
        "Across aviation, healthcare, energy, transport and government, the emphasis stays the same: build humane accountability, resilient operations and better questions.",
      ],
    },
    featuredAreas: [
      {
        eyebrow: "Approach",
        title: "Safety Differently",
        summary: "A practical alternative to compliance-heavy safety thinking, grounded in trust, capacity and local expertise.",
        href: "/safety-differently",
        image:
          "https://sidneydekker.com/wp-content/uploads/2024/10/Safety-Differently-1024x768.jpg",
      },
      {
        eyebrow: "Culture",
        title: "Just Culture",
        summary: "Accountability that distinguishes ordinary human error from neglect, recklessness and systemic design trouble.",
        href: "/just-culture",
        image:
          "https://sidneydekker.com/wp-content/uploads/2024/11/Sidney_Dekker_Just_Culture_Hope_Book_9780367564698.jpg",
      },
      {
        eyebrow: "Resilience",
        title: "Organizational Resilience",
        summary: "Building operational strength through learning, recovery and practical sensitivity to how work is actually done.",
        href: "/work-with-sidney",
        image:
          "https://sidneydekker.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-15-at-15.59.06-5.jpeg",
      },
      {
        eyebrow: "Education",
        title: "Graduate Education",
        summary: "Executive and academic programs that connect safety science with leadership, management and public value.",
        href: "/about",
        image:
          "https://sidneydekker.com/wp-content/uploads/2024/10/graduate_education.jpg",
      },
    ] satisfies HomeFeature[],
    aboutTitle: "Internationally recognized scholar, author and speaker on safety, accountability and organizational learning.",
    aboutSummary:
      "Sidney Dekker’s body of work spans commercial aviation, healthcare, heavy industry and public sector leadership. His teaching and consulting focus on helping organizations respond well to complexity instead of punishing the people closest to failure.",
    featuredBookSlugs: [
      "ten-virtues-of-a-positive-safety-culture",
      "stop-blaming",
      "safety-differently",
      "foundations-of-safety-science",
    ],
    quotes: [
      {
        quote: "Sidney Dekker is the hardest-working man in safety.",
        author: "Todd Conklin",
        role: "Pre-Accident Investigations Podcast",
      },
      {
        quote: "One of the top thinkers in the world on safety and human error.",
        author: "Long Business Forum",
      },
      {
        quote: "His work changes the conversation from blame to learning without losing accountability.",
        author: "Leadership program participant",
      },
    ] satisfies SiteQuote[],
  },
  work: {
    title: "Work with Sidney",
    summary:
      "Engage Sidney for keynotes, executive conversations, facilitation and longer-form strategic work focused on safety, resilience, leadership and culture.",
    services: [
      {
        eyebrow: "Keynotes",
        title: "High-impact conference and executive speaking",
        summary:
          "A keynote built around safety differently, just culture, resilience, human factors or leadership in complex systems.",
        image:
          "https://sidneydekker.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-15-at-15.59.01-1.jpeg",
      },
      {
        eyebrow: "Workshops",
        title: "Interactive sessions for leaders and operational teams",
        summary:
          "Hands-on working sessions that turn the ideas into language, decisions and experiments that people can use immediately.",
        image:
          "https://sidneydekker.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-15-at-15.59.03-1.jpeg",
      },
      {
        eyebrow: "Facilitation",
        title: "Leadership dialogue in high-consequence settings",
        summary:
          "Structured conversations for boards, executives and safety leaders when the topic is politically difficult, urgent or stuck.",
        image:
          "https://sidneydekker.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-15-at-15.59.05-1.jpeg",
      },
      {
        eyebrow: "Advisory",
        title: "Just culture and accountability design",
        summary:
          "Support for response models, investigations, governance language and systems that need a more humane and more rigorous foundation.",
        image:
          "https://sidneydekker.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-15-at-15.59.04-1.jpeg",
      },
      {
        eyebrow: "Education",
        title: "Custom learning journeys for capability building",
        summary:
          "Longer programs for senior leaders and practitioners who need more than a one-off event and want durable capability.",
        image:
          "https://sidneydekker.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-15-at-15.59.06-5.jpeg",
      },
      {
        eyebrow: "Writing",
        title: "Books, films and ideas that support implementation",
        summary:
          "The engagement can extend into reading groups, film sessions, reference material and tailored follow-up resources.",
        image:
          "https://sidneydekker.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-15-at-15.59.06-6.jpeg",
      },
    ] satisfies ServiceFeature[],
    principles: [
      "The work is designed for complexity, not for simplified behavior-control programs.",
      "It is useful when you need a practical shift in how accountability, learning and leadership are framed.",
      "Formats range from a single keynote to advisory support that unfolds over months.",
    ],
  },
  motivationalSpeaking: {
    title: "Motivational Speaking",
    summary:
      "A keynote format aimed at provoking a real shift in how leaders think about human error, accountability and organizational performance.",
    stats: [
      { value: "500+", label: "Talks delivered" },
      { value: "25+", label: "Countries reached" },
      { value: "20+", label: "Books informing the work" },
    ] satisfies SiteStat[],
    focusAreas: [
      "Human factors and the limits of blame",
      "Just culture in practice",
      "Leadership for resilient performance",
      "Learning from success as well as failure",
    ],
    quote: {
      quote: "Compelling, warm and intellectually sharp. People leave with a different mental model.",
      author: "Conference organizer",
    } satisfies SiteQuote,
  },
  about: {
    title: "About Sidney",
    summary:
      "Scholar, professor, author and public thinker whose work has helped define contemporary conversations around safety, human error, accountability and resilience.",
    stats: [
      { value: "20+", label: "Books" },
      { value: "20,000+", label: "Citations" },
      { value: "500+", label: "Speaking engagements" },
      { value: "Top 1%", label: "Safety science scholar" },
    ] satisfies SiteStat[],
    biography: [
      "Sidney Dekker has spent decades studying how organizations respond to complexity, surprise and failure. His work is known for refusing the easy habit of blaming frontline people for outcomes shaped by system design, operational tradeoffs and leadership context.",
      "He has held academic and leadership roles in Australia, Europe and the United States, and his ideas are used across aviation, healthcare, mining, energy, transport and government.",
      "Through books, films, teaching and advisory work, he argues for cultures that preserve accountability while making room for restoration, learning and practical wisdom.",
    ],
    recognitions: [
      "Author of more than twenty books translated and used internationally.",
      "Among the most cited scholars globally in the safety science field.",
      "Frequent keynote speaker and advisor for industry, healthcare and government leaders.",
    ],
  },
  books: [
    {
      slug: "ten-virtues-of-a-positive-safety-culture",
      title: "Ten Virtues of a Positive Safety Culture",
      tagline: "Hope, dignity and practical leadership for better culture.",
      summary:
        "A concise guide to the habits and leadership choices that create a safety culture worth sustaining.",
      detail: [
        "This book distills a positive view of culture into a set of virtues that leaders can recognize, reinforce and practice.",
        "Rather than defining safety culture through rule-following alone, it emphasizes dignity, trust, practical wisdom and the social conditions that help people speak up and recover well.",
      ],
      coverImage:
        "https://sidneydekker.com/wp-content/uploads/2025/02/Ten-Virtues.jpg",
      buyLinks: [
        { label: "View on site", href: "https://sidneydekker.com/ten-virtues-of-a-positive-safety-culture", external: true },
      ],
    },
    {
      slug: "stop-blaming",
      title: "Stop Blaming",
      tagline: "Just culture and accountability in healthcare.",
      summary:
        "A healthcare-focused case for replacing reflexive blame with a more constructive model of response and accountability.",
      detail: [
        "Written for clinicians, managers and regulators, the book shows how blame weakens learning and deepens harm after adverse events.",
        "It proposes practical ways to build accountability systems that remain serious about standards while avoiding scapegoating and second injury.",
      ],
      coverImage:
        "https://sidneydekker.com/wp-content/uploads/2024/11/Sidney_Dekker_Cover.jpg",
      buyLinks: [
        { label: "View on site", href: "https://sidneydekker.com/stop-blaming", external: true },
      ],
    },
    {
      slug: "safety-the-basics",
      title: "Safety: The Basics",
      tagline: "An accessible entry point into contemporary safety thinking.",
      summary:
        "A short introduction for readers who want the foundations of safety science, human error and systems thinking without the jargon.",
      detail: [
        "The book frames safety as an organizational capability rather than a simple count of incidents or policy compliance.",
        "It offers a clean introduction to human factors, resilience, investigations and the difference between paperwork and practice.",
      ],
      coverImage:
        "https://sidneydekker.com/wp-content/uploads/2025/02/Safety-The-Basics.jpg",
      buyLinks: [
        { label: "View on site", href: "https://sidneydekker.com/books", external: true },
      ],
    },
    {
      slug: "safety-crimes",
      title: "Safety Crimes",
      tagline: "The problem with criminalizing error after accidents.",
      summary:
        "A critique of how legal and political systems can turn accidents into prosecutions without improving safety.",
      detail: [
        "Dekker examines what happens when tragedy produces a demand for someone to blame rather than a demand to understand how the system failed.",
        "The result is a sharp argument about justice, deterrence and why punishing practitioners often leaves the deeper contributors untouched.",
      ],
      coverImage:
        "https://sidneydekker.com/wp-content/uploads/2025/02/Safety-Crimes.jpg",
      buyLinks: [
        { label: "View on site", href: "https://sidneydekker.com/books", external: true },
      ],
    },
    {
      slug: "safety-differently",
      title: "Safety Differently",
      tagline: "Humanizing work and rethinking safety management.",
      summary:
        "One of Dekker’s best-known books, arguing for safety built on trust, expertise and local problem solving.",
      detail: [
        "Safety Differently challenges the assumption that more rules, more counting and more control automatically create better outcomes.",
        "It sketches a practical shift toward enabling the people who do the work, learning from what goes right and treating safety as capacity.",
      ],
      coverImage:
        "https://sidneydekker.com/wp-content/uploads/2024/11/Safety-Differently-1024x768.jpg",
      buyLinks: [
        { label: "View on site", href: "https://sidneydekker.com/safety-differently", external: true },
      ],
    },
    {
      slug: "foundations-of-safety-science",
      title: "Foundations of Safety Science",
      tagline: "A century of understanding accidents and disasters.",
      summary:
        "A survey of the major theories that shaped the modern safety science field.",
      detail: [
        "This volume traces how ideas about accidents evolved, from early technical explanations to contemporary systems thinking and resilience.",
        "It is useful both as a reference and as a map of why so many organizations still rely on outdated models of failure.",
      ],
      coverImage:
        "https://sidneydekker.com/wp-content/uploads/2024/11/Foundations-of-Safety-Science.png",
      buyLinks: [
        { label: "View on site", href: "https://sidneydekker.com/foundations-of-safety-science", external: true },
      ],
    },
    {
      slug: "the-end-of-heaven",
      title: "The End of Heaven",
      tagline: "Disaster and suffering in a scientific age.",
      summary:
        "A philosophical examination of catastrophe, meaning and how modern societies understand suffering.",
      detail: [
        "The End of Heaven moves beyond management technique and asks what disaster means in cultures that expect control, explanation and prevention.",
        "It connects safety, ethics and the human search for meaning after loss in ways that still shape Dekker’s later work.",
      ],
      coverImage:
        "https://sidneydekker.com/wp-content/uploads/2025/02/The-End-Of-Heaven.jpg",
      buyLinks: [
        { label: "View on site", href: "https://sidneydekker.com/books", external: true },
      ],
    },
    {
      slug: "the-field-guide-to-understanding-human-error",
      title: "The Field Guide to Understanding Human Error",
      tagline: "A practical frame for understanding why work fails.",
      summary:
        "A widely used introduction to human error that helps investigators and leaders ask better questions.",
      detail: [
        "The book explains why people’s actions made sense to them at the time and why hindsight distorts the analysis of incidents.",
        "It remains a core text for readers who want a practical alternative to simplistic cause-and-effect blame models.",
      ],
      coverImage:
        "https://sidneydekker.com/wp-content/uploads/2024/11/The-Field-Guide-To-Understanding-Human-Error.jpg",
      buyLinks: [
        { label: "View on site", href: "https://sidneydekker.com/the-field-guide-to-understanding-human-error", external: true },
      ],
    },
    {
      slug: "just-culture",
      title: "Just Culture",
      tagline: "Restoring trust and accountability after failure.",
      summary:
        "A practical and moral case for accountability systems that repair rather than merely punish.",
      detail: [
        "Just Culture explores how organizations can respond to failure in ways that are fair, credible and supportive of learning.",
        "It argues that trust is not the opposite of accountability; it is one of the conditions that makes accountability effective.",
      ],
      coverImage:
        "https://sidneydekker.com/wp-content/uploads/2024/11/Sidney_Dekker_Just_Culture_Hope_Book_9780367564698.jpg",
      buyLinks: [
        { label: "View on site", href: "https://sidneydekker.com/just-culture", external: true },
      ],
    },
    {
      slug: "second-victim",
      title: "Second Victim",
      tagline: "Error, trauma and recovery in healthcare.",
      summary:
        "A book about the emotional aftermath of failure for the practitioners involved and the systems around them.",
      detail: [
        "Second Victim focuses on the injury that caregivers, operators and professionals can carry after harmful events.",
        "It highlights why organizations need responses that support recovery, accountability and learning instead of isolation and shame.",
      ],
      coverImage:
        "https://sidneydekker.com/wp-content/uploads/2024/11/Sidney-Dekker-Cover-2.jpg",
      buyLinks: [
        { label: "View on site", href: "https://sidneydekker.com/books", external: true },
      ],
    },
    {
      slug: "drift-into-failure",
      title: "Drift Into Failure",
      tagline: "How success can slowly move systems toward breakdown.",
      summary:
        "An influential explanation of how organizations normalize risky tradeoffs while still believing they are in control.",
      detail: [
        "Drift Into Failure shows how small practical adjustments can accumulate into vulnerability without any single decision looking outrageous at the time.",
        "It remains a foundational text for leaders who need to understand systemic erosion rather than isolated noncompliance.",
      ],
      coverImage:
        "https://sidneydekker.com/wp-content/uploads/2024/11/Drift-into-failure-Cover-Sidney-Dekker.jpg",
      buyLinks: [
        { label: "View on site", href: "https://sidneydekker.com/books", external: true },
      ],
    },
  ] satisfies BookEntry[],
  films: [
    {
      title: "Doing Safety Differently",
      summary:
        "A film introduction to the ideas behind safety differently and the leadership mindset needed to make it practical.",
      image:
        "https://sidneydekker.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-15-at-15.59.04-1.jpeg",
      href: "/work-with-sidney",
    },
    {
      title: "Just Culture",
      summary:
        "A film companion to the work on accountability, trust, restoration and the limits of blame.",
      image:
        "https://sidneydekker.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-15-at-15.59.06-6.jpeg",
      href: "/just-culture",
    },
    {
      title: "The Complexity of Failure",
      summary:
        "A screen-based exploration of how organizations slide toward failure while trying to succeed.",
      image:
        "https://sidneydekker.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-15-at-15.59.06-5.jpeg",
      href: "/drift-into-failure",
    },
    {
      title: "Resilience and Recovery",
      summary:
        "Stories and ideas about learning, adaptation and the work of recovery after setbacks.",
      image:
        "https://sidneydekker.com/wp-content/uploads/2024/10/graduate_education.jpg",
      href: "/about",
    },
  ] satisfies FilmEntry[],
  papers: [
    {
      title: "The Ironies of Human Factors",
      citation: "Dekker, S. W. A. (2025)",
      summary:
        "A recent paper on the tensions, expectations and contradictions that shape how human factors gets used in practice.",
      href: "https://sidneydekker.com/wp-content/uploads/2025/02/The-ironies-of-human-factors-.pdf",
    },
    {
      title: "In the Heart of Error",
      citation: "Dekker, S. W. A. (2024)",
      summary:
        "A paper focused on understanding failure from inside the unfolding work, rather than from a hindsight distance.",
      href: "https://sidneydekker.com/papers",
    },
    {
      title: "Restorative Just Culture",
      citation: "Dekker, S. W. A. (2023)",
      summary:
        "A contribution to the literature on accountability models that seek repair, restoration and fairness after harm.",
      href: "https://sidneydekker.com/papers",
    },
    {
      title: "Reconstructing Human Error",
      citation: "Dekker, S. W. A.",
      summary:
        "A systems-oriented framing of human error that continues to inform investigations and safety leadership practice.",
      href: "https://sidneydekker.com/papers",
    },
    {
      title: "Safety Differently in Practice",
      citation: "Dekker, S. W. A.",
      summary:
        "A practical look at what it takes to translate the principles of safety differently into organizational action.",
      href: "https://sidneydekker.com/papers",
    },
    {
      title: "Just Culture and Criminalization",
      citation: "Dekker, S. W. A.",
      summary:
        "Scholarship on why punitive and legalistic responses after failure can undermine learning and justice alike.",
      href: "https://sidneydekker.com/papers",
    },
    {
      title: "Complexity, Drift and Organizational Failure",
      citation: "Dekker, S. W. A.",
      summary:
        "Work connecting everyday tradeoffs and adaptations to longer-term systemic vulnerability.",
      href: "https://sidneydekker.com/papers",
    },
    {
      title: "Learning from What Goes Right",
      citation: "Dekker, S. W. A.",
      summary:
        "An argument for complementing incident analysis with careful attention to everyday successful performance.",
      href: "https://sidneydekker.com/papers",
    },
  ] satisfies PaperEntry[],
  privacy: {
    title: "Privacy Policy",
    updated: "March 29, 2026",
    sections: [
      {
        title: "Information collected",
        body:
          "This project stores the information you submit through the contact form so enquiries can be reviewed and answered. That can include your name, email address, phone number, the kind of enquiry and the message itself.",
      },
      {
        title: "How information is used",
        body:
          "Submitted information is used to respond to your enquiry, track legitimate inbound requests and maintain a basic contact history inside the site’s admin storage.",
      },
      {
        title: "Third-party links",
        body:
          "The site links out to external destinations such as LinkedIn, Google Scholar and external book or paper resources. Those destinations operate under their own privacy policies.",
      },
      {
        title: "Questions",
        body:
          "If you have a question about how your data is handled, use the contact form and choose the general enquiry option.",
      },
    ],
  },
};

export function getBookBySlug(slug: string) {
  return sidneySite.books.find((book) => book.slug === slug) ?? null;
}

export function getFeaturedBooks() {
  return sidneySite.home.featuredBookSlugs
    .map((slug) => getBookBySlug(slug))
    .filter((book): book is NonNullable<ReturnType<typeof getBookBySlug>> => book !== null);
}
