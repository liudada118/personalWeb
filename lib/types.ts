export type LinkItem = {
  label: string;
  href: string;
};

export type SocialLink = LinkItem & {
  platform: string;
};

export type HeroSlide = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  imageUrl?: string;
};

export type ScheduleItem = {
  date: string;
  title: string;
  venue: string;
  description: string;
  href: string;
};

export type ResumeBlock = {
  title: string;
  items: string[];
};

export type Award = {
  year: string;
  title: string;
  issuer: string;
};

export type SiteSettings = {
  siteTitle: string;
  shortTitle: string;
  siteTagline: string;
  logoText: string;
  navItems: LinkItem[];
  socialLinks: SocialLink[];
  contactEmail: string;
  contactPhone: string;
  address: string;
  footerNote: string;
};

export type CaseStudy = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  summary: string;
  highlights: string[];
  detail: string[];
  imageUrl?: string;
};

export type MediaArticle = {
  _id: string;
  title: string;
  slug: string;
  publication: string;
  publishedAt: string;
  excerpt: string;
  category: string;
  url: string;
  featured: boolean;
  imageUrl?: string;
};

export type Article = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  category: string;
  authorName?: string;
  readTime?: string;
  featured: boolean;
  imageUrl?: string;
};

export type PageContentFieldType = "text" | "textarea" | "richtext" | "image" | "link" | "boolean";

export type PageContentLinkValue = LinkItem;

export type PageContentImageValue = {
  mediaId: number | string;
  alt?: string;
};

export type PageContentValue =
  | string
  | boolean
  | Record<string, unknown>
  | unknown[]
  | PageContentLinkValue
  | PageContentImageValue;

export type PageContentEntry = {
  page: string;
  fieldKey: string;
  type: PageContentFieldType;
  value: PageContentValue;
  locale: string;
  updatedAt?: string;
};

export type PodcastEpisode = {
  _id: string;
  title: string;
  slug: string;
  episodeCode: string;
  releasedAt: string;
  duration: string;
  guest?: string;
  summary: string;
  featured: boolean;
  platformLinks: LinkItem[];
  imageUrl?: string;
};

export type HomePage = {
  heroEyebrow: string;
  heroTitle: string;
  heroIntro: string;
  heroQuote: string;
  heroSource: string;
  heroSlides: HeroSlide[];
  tigerLegalLink: LinkItem;
  platformLinks: LinkItem[];
  scheduleItems: ScheduleItem[];
  bioBlurb: string;
  featuredCases: CaseStudy[];
  footerBannerTitle: string;
  footerBannerText: string;
  footerBannerLinks: LinkItem[];
};

export type AboutPage = {
  heroTitle: string;
  intro: string;
  resumeBlocks: ResumeBlock[];
  husuIntro: string[];
  mediaIntro: string[];
  awards: Award[];
};

export type MediaPage = {
  heroTitle: string;
  intro: string;
};

export type PodcastPage = {
  heroTitle: string;
  intro: string;
  showDescription: string[];
  platformLinks: LinkItem[];
  highlightBullets: string[];
};

export type ContactPage = {
  heroTitle: string;
  intro: string;
  formNote: string;
  reasons: string[];
  subscriptionLinks: LinkItem[];
};

export type HomePageData = {
  settings: SiteSettings;
  homePage: HomePage;
  mediaHighlights: MediaArticle[];
  podcastHighlights: PodcastEpisode[];
};

export type AboutPageData = {
  settings: SiteSettings;
  aboutPage: AboutPage;
  caseStudies: CaseStudy[];
};

export type MediaPageData = {
  settings: SiteSettings;
  mediaPage: MediaPage;
  articles: MediaArticle[];
};

export type PodcastPageData = {
  settings: SiteSettings;
  podcastPage: PodcastPage;
  episodes: PodcastEpisode[];
};

export type ContactPageData = {
  settings: SiteSettings;
  contactPage: ContactPage;
};

export type ContactSubmission = {
  name: string;
  organization: string;
  email: string;
  phone?: string;
  reason: string;
  message: string;
  createdAt: string;
};

export type DashboardStats = {
  todayViews: number;
  yesterdayViews: number;
  articleCount: number;
  caseCount: number;
  podcastCount: number;
  updateCount: number;
  contactCount: number;
  assetCount: number;
  cacheSize: string;
  serverStorageUsed: string;
};

