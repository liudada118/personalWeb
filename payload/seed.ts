import type { Payload } from "payload";

import {
  demoAboutPageData,
  demoCaseStudies,
  demoContactPageData,
  demoHomePageData,
  demoMediaArticles,
  demoMediaPageData,
  demoPodcastEpisodes,
  demoPodcastPageData,
  demoSiteSettings,
} from "@/lib/demo-data";
import { buildPageContentDocKey } from "./shared";

type SeedableCollection =
  | "articles"
  | "caseStudies"
  | "mediaPosts"
  | "pageContent"
  | "podcastEpisodes";

type SeedDoc = Record<string, unknown>;

const demoArticles: SeedDoc[] = demoMediaArticles.map((item) => ({
  title: item.title,
  slug: `insight-${item.slug}`,
  publishedAt: item.publishedAt,
  excerpt: item.excerpt,
  category: item.category,
  authorName: item.publication,
  readTime: "6 min",
  featured: item.featured,
  body: {
    root: {
      children: [
        {
          type: "paragraph",
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: item.excerpt,
              type: "text",
              version: 1,
            },
          ],
          direction: null,
          format: "",
          indent: 0,
          textFormat: 0,
          textStyle: "",
          version: 1,
        },
      ],
      direction: null,
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  },
}));

function richTextValue(text: string) {
  return {
    root: {
      children: [
        {
          type: "paragraph",
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text,
              type: "text",
              version: 1,
            },
          ],
          direction: null,
          format: "",
          indent: 0,
          textFormat: 0,
          textStyle: "",
          version: 1,
        },
      ],
      direction: null,
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
}

function buildPageContentSeedDocs() {
  const docs = [
    {
      page: "home",
      fieldKey: "home.hero.title",
      type: "textarea",
      value: demoHomePageData.homePage.heroTitle,
    },
    {
      page: "home",
      fieldKey: "home.hero.intro",
      type: "textarea",
      value: demoHomePageData.homePage.heroIntro,
    },
    {
      page: "home",
      fieldKey: "home.hero.primaryLink",
      type: "link",
      value: demoHomePageData.homePage.tigerLegalLink,
    },
    {
      page: "home",
      fieldKey: "home.footerBanner.title",
      type: "textarea",
      value: demoHomePageData.homePage.footerBannerTitle,
    },
    {
      page: "home",
      fieldKey: "home.footerBanner.text",
      type: "textarea",
      value: demoHomePageData.homePage.footerBannerText,
    },
    {
      page: "about",
      fieldKey: "about.hero.title",
      type: "textarea",
      value: demoAboutPageData.aboutPage.heroTitle,
    },
    {
      page: "about",
      fieldKey: "about.intro.body",
      type: "richtext",
      value: richTextValue(demoAboutPageData.aboutPage.intro),
    },
    {
      page: "mediaPage",
      fieldKey: "mediaPage.header.title",
      type: "textarea",
      value: demoMediaPageData.mediaPage.heroTitle,
    },
    {
      page: "mediaPage",
      fieldKey: "mediaPage.header.intro",
      type: "richtext",
      value: richTextValue(demoMediaPageData.mediaPage.intro),
    },
    {
      page: "podcastPage",
      fieldKey: "podcastPage.header.title",
      type: "text",
      value: demoPodcastPageData.podcastPage.heroTitle,
    },
    {
      page: "podcastPage",
      fieldKey: "podcastPage.header.intro",
      type: "richtext",
      value: richTextValue(demoPodcastPageData.podcastPage.intro),
    },
    {
      page: "contactPage",
      fieldKey: "contactPage.header.title",
      type: "textarea",
      value: demoContactPageData.contactPage.heroTitle,
    },
    {
      page: "contactPage",
      fieldKey: "contactPage.header.intro",
      type: "richtext",
      value: richTextValue(demoContactPageData.contactPage.intro),
    },
    {
      page: "contactPage",
      fieldKey: "contactPage.form.note",
      type: "textarea",
      value: demoContactPageData.contactPage.formNote,
    },
  ] as const;

  return docs.map((doc) => ({
    ...doc,
    locale: "zh",
    docKey: buildPageContentDocKey(doc.fieldKey, "zh"),
  }));
}

async function seedCollectionIfEmpty(payload: Payload, collection: SeedableCollection, docs: SeedDoc[]) {
  const existing = await payload.find({
    collection,
    depth: 0,
    limit: 1,
    overrideAccess: true,
  });

  if (existing.totalDocs > 0) {
    return existing.docs as SeedDoc[];
  }

  const createdDocs: SeedDoc[] = [];

  for (const data of docs) {
    const created = await payload.create({
      collection,
      data,
      overrideAccess: true,
    });

    createdDocs.push(created as SeedDoc);
  }

  return createdDocs;
}

async function ensureGlobalHasData(payload: Payload, slug: string, key: string, data: SeedDoc) {
  try {
    const existing = (await payload.findGlobal({
      slug,
      depth: 0,
      overrideAccess: true,
    })) as SeedDoc;

    if (existing?.[key]) {
      return;
    }
  } catch {
    // Ignore empty or missing globals during first seed.
  }

  await payload.updateGlobal({
    slug,
    data,
    overrideAccess: true,
  });
}

export async function seedDemoContent(payload: Payload) {
  const caseDocs = await seedCollectionIfEmpty(
    payload,
    "caseStudies",
    demoCaseStudies.map((item) => ({
      title: item.title,
      slug: item.slug,
      category: item.category,
      year: item.year,
      summary: item.summary,
      highlights: item.highlights.map((value) => ({ value })),
      detail: item.detail.map((value) => ({ value })),
    })),
  );

  await seedCollectionIfEmpty(
    payload,
    "mediaPosts",
    demoMediaArticles.map((item) => ({
      title: item.title,
      slug: item.slug,
      publication: item.publication,
      publishedAt: item.publishedAt,
      excerpt: item.excerpt,
      category: item.category,
      url: item.url,
      featured: item.featured,
      content: richTextValue(item.excerpt),
    })),
  );

  await seedCollectionIfEmpty(payload, "articles", demoArticles);

  await seedCollectionIfEmpty(
    payload,
    "podcastEpisodes",
    demoPodcastEpisodes.map((item) => ({
      title: item.title,
      slug: item.slug,
      episodeCode: item.episodeCode,
      releasedAt: item.releasedAt,
      duration: item.duration,
      guest: item.guest,
      summary: item.summary,
      featured: item.featured,
      platformLinks: item.platformLinks,
    })),
  );

  await seedCollectionIfEmpty(payload, "pageContent", buildPageContentSeedDocs());

  await ensureGlobalHasData(payload, "siteSettings", "siteTitle", {
    ...demoSiteSettings,
  });

  await ensureGlobalHasData(payload, "homePage", "heroTitle", {
    ...demoHomePageData.homePage,
    heroSlides: demoHomePageData.homePage.heroSlides,
    platformLinks: demoHomePageData.homePage.platformLinks,
    scheduleItems: demoHomePageData.homePage.scheduleItems,
    featuredCases: caseDocs
      .map((doc) => doc.id)
      .filter((id): id is number | string => typeof id === "number" || typeof id === "string"),
    footerBannerLinks: demoHomePageData.homePage.footerBannerLinks,
  });

  await ensureGlobalHasData(payload, "aboutPage", "heroTitle", {
    ...demoAboutPageData.aboutPage,
    resumeBlocks: demoAboutPageData.aboutPage.resumeBlocks.map((block) => ({
      title: block.title,
      items: block.items.map((value) => ({ value })),
    })),
    husuIntro: demoAboutPageData.aboutPage.husuIntro.map((value) => ({ value })),
    mediaIntro: demoAboutPageData.aboutPage.mediaIntro.map((value) => ({ value })),
    awards: demoAboutPageData.aboutPage.awards,
  });

  await ensureGlobalHasData(payload, "mediaPage", "heroTitle", {
    ...demoMediaPageData.mediaPage,
  });

  await ensureGlobalHasData(payload, "podcastPage", "heroTitle", {
    ...demoPodcastPageData.podcastPage,
    showDescription: demoPodcastPageData.podcastPage.showDescription.map((value) => ({ value })),
    platformLinks: demoPodcastPageData.podcastPage.platformLinks,
    highlightBullets: demoPodcastPageData.podcastPage.highlightBullets.map((value) => ({ value })),
  });

  await ensureGlobalHasData(payload, "contactPage", "heroTitle", {
    ...demoContactPageData.contactPage,
    reasons: demoContactPageData.contactPage.reasons.map((value) => ({ value })),
    subscriptionLinks: demoContactPageData.contactPage.subscriptionLinks,
  });
}

