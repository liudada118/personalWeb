import {
  demoAboutPageData,
  demoCaseStudies,
  demoContactPageData,
  demoHomePageData,
  demoMediaPageData,
  demoPodcastPageData,
  demoSiteSettings,
} from "@/lib/demo-data";
import { getPayloadClient } from "@/lib/payload/client";
import { isPreviewRequestEnabled } from "@/lib/payload/preview";
import { withBasePath } from "@/lib/site-paths";
import type {
  AboutPageData,
  Award,
  CaseStudy,
  ContactPageData,
  HomePageData,
  LinkItem,
  MediaArticle,
  MediaPageData,
  PodcastEpisode,
  PodcastPageData,
  ResumeBlock,
  SiteSettings,
  SocialLink,
} from "@/lib/types";

type PayloadDoc = Record<string, unknown>;

async function isDraftPreviewEnabled() {
  return isPreviewRequestEnabled();
}

function asRecord(value: unknown): PayloadDoc | null {
  return value && typeof value === "object" ? (value as PayloadDoc) : null;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asBoolean(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

function mapSimpleItems(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .map((item) => asString(asRecord(item)?.value))
    .filter((item): item is string => Boolean(item));
}

function mapLinks(value: unknown): LinkItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const doc = asRecord(item);

      if (!doc) {
        return null;
      }

      const label = asString(doc.label);
      const href = asString(doc.href);

      if (!label || !href) {
        return null;
      }

      return { label, href };
    })
    .filter((item): item is LinkItem => Boolean(item));
}

function mapSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const doc = asRecord(item);

      if (!doc) {
        return null;
      }

      const platform = asString(doc.platform);
      const label = asString(doc.label);
      const href = asString(doc.href);

      if (!platform || !label || !href) {
        return null;
      }

      return { platform, label, href };
    })
    .filter((item): item is SocialLink => Boolean(item));
}

function mapUploadURL(value: unknown) {
  const doc = asRecord(value);
  const url = doc ? asString(doc.url) : "";
  return url ? withBasePath(url) : undefined;
}

function isNonNullable<T>(value: T | null | undefined): value is T {
  return value != null;
}

function mapResumeBlocks(value: unknown): ResumeBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const doc = asRecord(item);
      const title = asString(doc?.title);
      const items = mapSimpleItems(doc?.items);

      if (!title || items.length === 0) {
        return null;
      }

      return { title, items };
    })
    .filter((item): item is ResumeBlock => Boolean(item));
}

function mapAwards(value: unknown): Award[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const doc = asRecord(item);
      const year = asString(doc?.year);
      const title = asString(doc?.title);
      const issuer = asString(doc?.issuer);

      if (!year || !title || !issuer) {
        return null;
      }

      return { year, title, issuer };
    })
    .filter((item): item is Award => Boolean(item));
}

function mapCaseStudy(doc: unknown): CaseStudy | null {
  const value = asRecord(doc);

  if (!value) {
    return null;
  }

  const title = asString(value.title);
  const slug = asString(value.slug);
  const category = asString(value.category);
  const year = asString(value.year);
  const summary = asString(value.summary);

  if (!title || !slug || !category || !year || !summary) {
    return null;
  }

  return {
    _id: String(value.id ?? slug),
    title,
    slug,
    category,
    year,
    summary,
    highlights: mapSimpleItems(value.highlights),
    detail: mapSimpleItems(value.detail),
    imageUrl: mapUploadURL(value.image),
  };
}

function mapMediaArticle(doc: unknown): MediaArticle | null {
  const value = asRecord(doc);

  if (!value) {
    return null;
  }

  const title = asString(value.title);
  const slug = asString(value.slug);
  const publication = asString(value.publication);
  const publishedAt = asString(value.publishedAt);
  const excerpt = asString(value.excerpt);
  const category = asString(value.category);
  const url = asString(value.url);

  if (!title || !slug || !publication || !publishedAt || !excerpt || !category || !url) {
    return null;
  }

  return {
    _id: String(value.id ?? slug),
    title,
    slug,
    publication,
    publishedAt,
    excerpt,
    category,
    url,
    featured: asBoolean(value.featured),
    imageUrl: mapUploadURL(value.cover),
  };
}

function mapPodcastEpisode(doc: unknown): PodcastEpisode | null {
  const value = asRecord(doc);

  if (!value) {
    return null;
  }

  const title = asString(value.title);
  const slug = asString(value.slug);
  const episodeCode = asString(value.episodeCode);
  const releasedAt = asString(value.releasedAt);
  const duration = asString(value.duration);
  const summary = asString(value.summary);

  if (!title || !slug || !episodeCode || !releasedAt || !duration || !summary) {
    return null;
  }

  return {
    _id: String(value.id ?? slug),
    title,
    slug,
    episodeCode,
    releasedAt,
    duration,
    guest: asString(value.guest) || undefined,
    summary,
    featured: asBoolean(value.featured),
    platformLinks: mapLinks(value.platformLinks),
    imageUrl: mapUploadURL(value.cover),
  };
}

async function getPayloadSafe() {
  try {
    return await getPayloadClient();
  } catch {
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const payload = await getPayloadSafe();
  const draft = await isDraftPreviewEnabled();

  if (!payload) {
    return demoSiteSettings;
  }

  try {
    const settings = (await payload.findGlobal({
      slug: "siteSettings",
      depth: 1,
      draft,
      overrideAccess: true,
    })) as PayloadDoc;

    const siteTitle = asString(settings.siteTitle);

    if (!siteTitle) {
      return demoSiteSettings;
    }

    return {
      siteTitle,
      shortTitle: asString(settings.shortTitle),
      siteTagline: asString(settings.siteTagline),
      logoText: asString(settings.logoText),
      navItems: mapLinks(settings.navItems),
      socialLinks: mapSocialLinks(settings.socialLinks),
      contactEmail: asString(settings.contactEmail),
      contactPhone: asString(settings.contactPhone),
      address: asString(settings.address),
      footerNote: asString(settings.footerNote),
    };
  } catch {
    return demoSiteSettings;
  }
}

export async function getHomePageData(): Promise<HomePageData> {
  const payload = await getPayloadSafe();
  const draft = await isDraftPreviewEnabled();

  if (!payload) {
    return demoHomePageData;
  }

  try {
    const [settings, homePage, mediaResult, podcastResult] = await Promise.all([
      payload.findGlobal({ slug: "siteSettings", depth: 1, draft, overrideAccess: true }) as Promise<PayloadDoc>,
      payload.findGlobal({ slug: "homePage", depth: 2, draft, overrideAccess: true }) as Promise<PayloadDoc>,
      payload.find({
        collection: "mediaArticles",
        depth: 1,
        draft,
        limit: 3,
        overrideAccess: true,
        sort: "-publishedAt",
        where: {
          featured: {
            equals: true,
          },
        },
      }),
      payload.find({
        collection: "podcastEpisodes",
        depth: 1,
        draft,
        limit: 2,
        overrideAccess: true,
        sort: "-releasedAt",
        where: {
          featured: {
            equals: true,
          },
        },
      }),
    ]);

    if (!asString(settings.siteTitle) || !asString(homePage.heroTitle)) {
      return demoHomePageData;
    }

    const featuredCases = Array.isArray(homePage.featuredCases)
      ? homePage.featuredCases.map(mapCaseStudy).filter((item): item is CaseStudy => Boolean(item))
      : [];

    return {
      settings: {
        siteTitle: asString(settings.siteTitle),
        shortTitle: asString(settings.shortTitle),
        siteTagline: asString(settings.siteTagline),
        logoText: asString(settings.logoText),
        navItems: mapLinks(settings.navItems),
        socialLinks: mapSocialLinks(settings.socialLinks),
        contactEmail: asString(settings.contactEmail),
        contactPhone: asString(settings.contactPhone),
        address: asString(settings.address),
        footerNote: asString(settings.footerNote),
      },
      homePage: {
        heroEyebrow: asString(homePage.heroEyebrow),
        heroTitle: asString(homePage.heroTitle),
        heroIntro: asString(homePage.heroIntro),
        heroQuote: asString(homePage.heroQuote),
        heroSource: asString(homePage.heroSource),
        heroSlides: Array.isArray(homePage.heroSlides)
          ? homePage.heroSlides
              .map((item): HomePageData["homePage"]["heroSlides"][number] | null => {
                const doc = asRecord(item);
                const title = asString(doc?.title);
                const href = asString(doc?.href);

                if (!title || !href) {
                  return null;
                }

                return {
                  eyebrow: asString(doc?.eyebrow),
                  title,
                  description: asString(doc?.description),
                  href,
                  imageUrl: mapUploadURL(doc?.image),
                };
              })
              .filter(isNonNullable)
          : [],
        tigerLegalLink: {
          label: asString(asRecord(homePage.tigerLegalLink)?.label),
          href: asString(asRecord(homePage.tigerLegalLink)?.href),
        },
        platformLinks: mapLinks(homePage.platformLinks),
        scheduleItems: Array.isArray(homePage.scheduleItems)
          ? homePage.scheduleItems
              .map((item) => {
                const doc = asRecord(item);
                const date = asString(doc?.date);
                const title = asString(doc?.title);
                const venue = asString(doc?.venue);
                const description = asString(doc?.description);
                const href = asString(doc?.href);

                if (!date || !title || !venue || !description || !href) {
                  return null;
                }

                return { date, title, venue, description, href };
              })
              .filter((item): item is HomePageData["homePage"]["scheduleItems"][number] => Boolean(item))
          : [],
        bioBlurb: asString(homePage.bioBlurb),
        featuredCases,
        footerBannerTitle: asString(homePage.footerBannerTitle),
        footerBannerText: asString(homePage.footerBannerText),
        footerBannerLinks: mapLinks(homePage.footerBannerLinks),
      },
      mediaHighlights: mediaResult.docs.map(mapMediaArticle).filter((item): item is MediaArticle => Boolean(item)),
      podcastHighlights: podcastResult.docs.map(mapPodcastEpisode).filter((item): item is PodcastEpisode => Boolean(item)),
    };
  } catch {
    return demoHomePageData;
  }
}

export async function getAboutPageData(): Promise<AboutPageData> {
  const payload = await getPayloadSafe();
  const draft = await isDraftPreviewEnabled();

  if (!payload) {
    return demoAboutPageData;
  }

  try {
    const [settings, aboutPage, caseStudiesResult] = await Promise.all([
      getSiteSettings(),
      payload.findGlobal({ slug: "aboutPage", depth: 1, draft, overrideAccess: true }) as Promise<PayloadDoc>,
      payload.find({
        collection: "caseStudies",
        depth: 1,
        draft,
        limit: 20,
        overrideAccess: true,
        sort: "-year",
      }),
    ]);

    if (!asString(aboutPage.heroTitle)) {
      return demoAboutPageData;
    }

    return {
      settings,
      aboutPage: {
        heroTitle: asString(aboutPage.heroTitle),
        intro: asString(aboutPage.intro),
        resumeBlocks: mapResumeBlocks(aboutPage.resumeBlocks),
        husuIntro: mapSimpleItems(aboutPage.husuIntro),
        mediaIntro: mapSimpleItems(aboutPage.mediaIntro),
        awards: mapAwards(aboutPage.awards),
      },
      caseStudies: caseStudiesResult.docs.map(mapCaseStudy).filter((item): item is CaseStudy => Boolean(item)),
    };
  } catch {
    return demoAboutPageData;
  }
}

export async function getMediaPageData(): Promise<MediaPageData> {
  const payload = await getPayloadSafe();
  const draft = await isDraftPreviewEnabled();

  if (!payload) {
    return demoMediaPageData;
  }

  try {
    const [settings, mediaPage, articlesResult] = await Promise.all([
      getSiteSettings(),
      payload.findGlobal({ slug: "mediaPage", depth: 1, draft, overrideAccess: true }) as Promise<PayloadDoc>,
      payload.find({
        collection: "mediaArticles",
        depth: 1,
        draft,
        limit: 50,
        overrideAccess: true,
        sort: "-publishedAt",
      }),
    ]);

    if (!asString(mediaPage.heroTitle)) {
      return demoMediaPageData;
    }

    return {
      settings,
      mediaPage: {
        heroTitle: asString(mediaPage.heroTitle),
        intro: asString(mediaPage.intro),
      },
      articles: articlesResult.docs.map(mapMediaArticle).filter((item): item is MediaArticle => Boolean(item)),
    };
  } catch {
    return demoMediaPageData;
  }
}

export async function getPodcastPageData(): Promise<PodcastPageData> {
  const payload = await getPayloadSafe();
  const draft = await isDraftPreviewEnabled();

  if (!payload) {
    return demoPodcastPageData;
  }

  try {
    const [settings, podcastPage, episodesResult] = await Promise.all([
      getSiteSettings(),
      payload.findGlobal({ slug: "podcastPage", depth: 1, draft, overrideAccess: true }) as Promise<PayloadDoc>,
      payload.find({
        collection: "podcastEpisodes",
        depth: 1,
        draft,
        limit: 50,
        overrideAccess: true,
        sort: "-releasedAt",
      }),
    ]);

    if (!asString(podcastPage.heroTitle)) {
      return demoPodcastPageData;
    }

    return {
      settings,
      podcastPage: {
        heroTitle: asString(podcastPage.heroTitle),
        intro: asString(podcastPage.intro),
        showDescription: mapSimpleItems(podcastPage.showDescription),
        platformLinks: mapLinks(podcastPage.platformLinks),
        highlightBullets: mapSimpleItems(podcastPage.highlightBullets),
      },
      episodes: episodesResult.docs.map(mapPodcastEpisode).filter((item): item is PodcastEpisode => Boolean(item)),
    };
  } catch {
    return demoPodcastPageData;
  }
}

export async function getContactPageData(): Promise<ContactPageData> {
  const payload = await getPayloadSafe();
  const draft = await isDraftPreviewEnabled();

  if (!payload) {
    return demoContactPageData;
  }

  try {
    const [settings, contactPage] = await Promise.all([
      getSiteSettings(),
      payload.findGlobal({ slug: "contactPage", depth: 1, draft, overrideAccess: true }) as Promise<PayloadDoc>,
    ]);

    if (!asString(contactPage.heroTitle)) {
      return demoContactPageData;
    }

    return {
      settings,
      contactPage: {
        heroTitle: asString(contactPage.heroTitle),
        intro: asString(contactPage.intro),
        formNote: asString(contactPage.formNote),
        reasons: mapSimpleItems(contactPage.reasons),
        subscriptionLinks: mapLinks(contactPage.subscriptionLinks),
      },
    };
  } catch {
    return demoContactPageData;
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const fallback = demoCaseStudies.find((item) => item.slug === slug) ?? null;
  const payload = await getPayloadSafe();
  const draft = await isDraftPreviewEnabled();

  if (!payload) {
    return fallback;
  }

  try {
    const result = await payload.find({
      collection: "caseStudies",
      depth: 1,
      draft,
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    const doc = result.docs[0];
    return mapCaseStudy(doc) ?? fallback;
  } catch {
    return fallback;
  }
}
