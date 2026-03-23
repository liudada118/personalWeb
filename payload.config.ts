import path from "node:path";

import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import { buildConfig, type Field, type Payload } from "payload";
import { zh } from "payload/i18n/zh";

import {
  demoAboutPageData,
  demoContactPageData,
  demoHomePageData,
  demoMediaArticles,
  demoMediaPageData,
  demoPodcastEpisodes,
  demoPodcastPageData,
  demoCaseStudies,
  demoSiteSettings,
} from "./lib/demo-data";

const primitiveItemsField = (name: string, label: string): Field => ({
  name,
  label,
  type: "array",
  fields: [
    {
      name: "value",
      label: "内容",
      type: "text",
      required: true,
    },
  ],
});

const linkArrayField = (name: string, label: string, includePlatform = false): Field => ({
  name,
  label,
  type: "array",
  fields: [
    ...(includePlatform
      ? [
          {
            name: "platform",
            label: "平台",
            type: "text",
            required: true,
          } as Field,
        ]
      : []),
    {
      name: "label",
      label: "文案",
      type: "text",
      required: true,
    },
    {
      name: "href",
      label: "链接",
      type: "text",
      required: true,
    },
  ],
});

const baseVersions = {
  drafts: {
    autosave: true,
  },
  maxPerDoc: 50,
} as const;

const globalVersions = {
  drafts: {
    autosave: true,
  },
  max: 50,
} as const;

async function seedCollectionIfEmpty(
  payload: Payload,
  collection: "caseStudies" | "mediaArticles" | "podcastEpisodes",
  docs: Record<string, unknown>[],
) {
  const existing = await payload.find({
    collection,
    depth: 0,
    limit: 1,
    overrideAccess: true,
  });

  if (existing.totalDocs > 0) {
    return existing.docs;
  }

  const createdDocs: Record<string, unknown>[] = [];

  for (const data of docs) {
    const created = await payload.create({
      collection,
      data,
      overrideAccess: true,
    });

    createdDocs.push(created as Record<string, unknown>);
  }

  return createdDocs;
}

async function ensureGlobalHasData(payload: Payload, slug: string, key: string, data: Record<string, unknown>) {
  try {
    const existing = (await payload.findGlobal({
      slug,
      depth: 0,
      overrideAccess: true,
    })) as Record<string, unknown>;

    if (existing?.[key]) {
      return;
    }
  } catch {
    // continue to update global
  }

  await payload.updateGlobal({
    slug,
    data,
    overrideAccess: true,
  });
}

async function seedDemoContent(payload: Payload) {
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
    "mediaArticles",
    demoMediaArticles.map((item) => ({
      title: item.title,
      slug: item.slug,
      publication: item.publication,
      publishedAt: item.publishedAt,
      excerpt: item.excerpt,
      category: item.category,
      url: item.url,
      featured: item.featured,
    })),
  );

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

export default buildConfig({
  admin: {
    user: "users",
  },
  i18n: {
    fallbackLanguage: "zh",
    supportedLanguages: {
      zh,
    },
    translations: {
      zh: {
        general: {
          collections: "内容集合",
          columns: "列设置",
          createNew: "新建",
          createNewLabel: "新建{{label}}",
          createdAt: "创建时间",
          dashboard: "控制台",
          edit: "编辑",
          email: "邮箱",
          filters: "筛选",
          globals: "页面配置",
          name: "名称",
          perPage: "每页：{{limit}}",
          searchBy: "搜索{{label}}",
          updatedAt: "更新时间",
        },
        fields: {
          collapseAll: "全部收起",
          showAll: "全部展开",
        },
        version: {
          currentDraft: "当前草稿",
          draft: "草稿",
          preview: "预览",
          publishChanges: "发布变更",
          saveDraft: "保存草稿",
          status: "状态",
          versions: "版本",
        },
      },
    },
  },
  collections: [
    {
      slug: "users",
      labels: {
        plural: "后台账号",
        singular: "后台账号",
      },
      admin: {
        description: "管理可以登录 Payload 后台的管理员账号。",
        group: "系统与权限",
        useAsTitle: "email",
      },
      auth: true,
      fields: [
        {
          name: "displayName",
          label: "显示名称",
          type: "text",
        },
      ],
    },
    {
      slug: "mediaAssets",
      labels: {
        plural: "媒体素材库",
        singular: "媒体素材",
      },
      admin: {
        description: "上传和管理图片、视频、PDF 等素材，供页面、文章和播客调用。",
        group: "素材与内容",
        useAsTitle: "alt",
        defaultColumns: ["filename", "mimeType", "updatedAt"],
      },
      upload: {
        staticDir: path.resolve(process.cwd(), "public", "media"),
        mimeTypes: ["image/*", "video/*", "application/pdf"],
      },
      fields: [
        {
          name: "alt",
          label: "替代文本",
          type: "text",
        },
        {
          name: "caption",
          label: "说明",
          type: "textarea",
        },
      ],
    },
    {
      slug: "caseStudies",
      labels: {
        plural: "案例库",
        singular: "案例",
      },
      admin: {
        description: "管理律所案例内容，用于首页案例轮播和案例详情页。",
        group: "素材与内容",
        useAsTitle: "title",
        defaultColumns: ["title", "category", "year", "updatedAt"],
      },
      access: {
        read: () => true,
      },
      versions: baseVersions,
      fields: [
        { name: "title", label: "标题", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true, unique: true },
        { name: "category", label: "分类", type: "text", required: true },
        { name: "year", label: "年份", type: "text", required: true },
        { name: "summary", label: "摘要", type: "textarea", required: true },
        primitiveItemsField("highlights", "亮点条目"),
        primitiveItemsField("detail", "详情段落"),
        {
          name: "image",
          label: "封面",
          type: "upload",
          relationTo: "mediaAssets",
        },
      ],
    },
    {
      slug: "mediaArticles",
      labels: {
        plural: "媒体文章",
        singular: "媒体文章",
      },
      admin: {
        description: "管理各大媒体平台的代表作、访谈和公开内容资产。",
        group: "素材与内容",
        useAsTitle: "title",
        defaultColumns: ["title", "publication", "publishedAt", "featured"],
      },
      access: {
        read: () => true,
      },
      versions: baseVersions,
      fields: [
        { name: "title", label: "标题", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true, unique: true },
        { name: "publication", label: "媒体名称", type: "text", required: true },
        { name: "publishedAt", label: "发布时间", type: "date", required: true },
        { name: "excerpt", label: "摘要", type: "textarea", required: true },
        { name: "category", label: "分类", type: "text", required: true },
        { name: "url", label: "原文链接", type: "text", required: true },
        { name: "featured", label: "首页精选", type: "checkbox", defaultValue: false },
        {
          name: "cover",
          label: "封面",
          type: "upload",
          relationTo: "mediaAssets",
        },
        {
          name: "content",
          label: "正文",
          type: "richText",
        },
      ],
    },
    {
      slug: "podcastEpisodes",
      labels: {
        plural: "播客单集",
        singular: "播客单集",
      },
      admin: {
        description: "管理 Tiger Legal Talks 每一期播客的标题、摘要、平台链接和节目笔记。",
        group: "素材与内容",
        useAsTitle: "title",
        defaultColumns: ["title", "episodeCode", "releasedAt", "featured"],
      },
      access: {
        read: () => true,
      },
      versions: baseVersions,
      fields: [
        { name: "title", label: "标题", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true, unique: true },
        { name: "episodeCode", label: "集数编号", type: "text", required: true },
        { name: "releasedAt", label: "发布日期", type: "date", required: true },
        { name: "duration", label: "时长", type: "text", required: true },
        { name: "guest", label: "嘉宾", type: "text" },
        { name: "summary", label: "摘要", type: "textarea", required: true },
        { name: "featured", label: "首页精选", type: "checkbox", defaultValue: false },
        linkArrayField("platformLinks", "平台链接"),
        {
          name: "cover",
          label: "封面",
          type: "upload",
          relationTo: "mediaAssets",
        },
        {
          name: "showNotes",
          label: "节目笔记",
          type: "richText",
        },
      ],
    },
    {
      slug: "contactSubmissions",
      labels: {
        plural: "联系线索",
        singular: "联系线索",
      },
      admin: {
        description: "查看访客提交的咨询、合作和联系表单记录。",
        group: "线索与咨询",
        useAsTitle: "name",
        defaultColumns: ["name", "email", "reason", "createdAt"],
      },
      fields: [
        { name: "name", label: "姓名", type: "text", required: true },
        { name: "organization", label: "机构", type: "text" },
        { name: "email", label: "邮箱", type: "email", required: true },
        { name: "phone", label: "电话", type: "text" },
        { name: "reason", label: "来意", type: "text", required: true },
        { name: "message", label: "留言", type: "textarea", required: true },
        { name: "createdAt", label: "提交时间", type: "date", required: true },
      ],
    },
  ],
  globals: [
    {
      slug: "siteSettings",
      admin: {
        description: "维护网站名称、Logo 文案、导航、联系方式和媒体平台外链。",
        group: "站点配置",
      },
      label: "站点信息",
      versions: globalVersions,
      access: { read: () => true },
      fields: [
        { name: "siteTitle", label: "站点名称", type: "text", required: true },
        { name: "shortTitle", label: "短标题", type: "text", required: true },
        { name: "siteTagline", label: "站点副标题", type: "textarea", required: true },
        { name: "logoText", label: "Logo 文本", type: "text", required: true },
        linkArrayField("navItems", "导航链接"),
        linkArrayField("socialLinks", "媒体与平台", true),
        { name: "contactEmail", label: "联系邮箱", type: "email", required: true },
        { name: "contactPhone", label: "联系电话", type: "text", required: true },
        { name: "address", label: "地址", type: "text", required: true },
        { name: "footerNote", label: "页脚说明", type: "textarea", required: true },
      ],
    },
    {
      slug: "homePage",
      admin: {
        description: "维护首页首屏、平台跳转、日程轮播、案例展示和尾部 CTA。",
        group: "页面内容",
      },
      label: "首页",
      versions: globalVersions,
      access: { read: () => true },
      fields: [
        { name: "heroEyebrow", label: "Hero Eyebrow", type: "text", required: true },
        { name: "heroTitle", label: "Hero 标题", type: "textarea", required: true },
        { name: "heroIntro", label: "Hero 简介", type: "textarea", required: true },
        { name: "heroQuote", label: "Hero 引语", type: "textarea", required: true },
        { name: "heroSource", label: "引语来源", type: "text", required: true },
        {
          name: "heroSlides",
          label: "首页轮播",
          type: "array",
          fields: [
            { name: "eyebrow", label: "Eyebrow", type: "text", required: true },
            { name: "title", label: "标题", type: "text", required: true },
            { name: "description", label: "说明", type: "textarea", required: true },
            { name: "href", label: "链接", type: "text", required: true },
            {
              name: "image",
              label: "图片",
              type: "upload",
              relationTo: "mediaAssets",
            },
          ],
        },
        {
          name: "tigerLegalLink",
          label: "虎诉官网链接",
          type: "group",
          fields: [
            { name: "label", label: "文案", type: "text", required: true },
            { name: "href", label: "链接", type: "text", required: true },
          ],
        },
        linkArrayField("platformLinks", "首页平台链接"),
        {
          name: "scheduleItems",
          label: "近期日程",
          type: "array",
          fields: [
            { name: "date", label: "日期", type: "date", required: true },
            { name: "title", label: "标题", type: "text", required: true },
            { name: "venue", label: "地点", type: "text", required: true },
            { name: "description", label: "说明", type: "textarea", required: true },
            { name: "href", label: "链接", type: "text", required: true },
          ],
        },
        { name: "bioBlurb", label: "简介补充", type: "textarea", required: true },
        {
          name: "featuredCases",
          label: "首页精选案例",
          type: "relationship",
          hasMany: true,
          relationTo: "caseStudies",
        },
        { name: "footerBannerTitle", label: "尾部标题", type: "textarea", required: true },
        { name: "footerBannerText", label: "尾部说明", type: "textarea", required: true },
        linkArrayField("footerBannerLinks", "尾部链接"),
      ],
    },
    {
      slug: "aboutPage",
      admin: {
        description: "维护律师简历、虎诉介绍、新媒体介绍和获奖信息。",
        group: "页面内容",
      },
      label: "个人介绍页",
      versions: globalVersions,
      access: { read: () => true },
      fields: [
        { name: "heroTitle", label: "标题", type: "textarea", required: true },
        { name: "intro", label: "简介", type: "textarea", required: true },
        {
          name: "resumeBlocks",
          label: "履历模块",
          type: "array",
          fields: [
            { name: "title", label: "标题", type: "text", required: true },
            primitiveItemsField("items", "条目"),
          ],
        },
        primitiveItemsField("husuIntro", "虎诉介绍"),
        primitiveItemsField("mediaIntro", "新媒体简介"),
        {
          name: "awards",
          label: "获奖",
          type: "array",
          fields: [
            { name: "year", label: "年份", type: "text", required: true },
            { name: "title", label: "奖项", type: "text", required: true },
            { name: "issuer", label: "颁发方", type: "text", required: true },
          ],
        },
      ],
    },
    {
      slug: "mediaPage",
      admin: {
        description: "维护媒体页头部文案，以及媒体代表作的展示入口。",
        group: "页面内容",
      },
      label: "媒体页",
      versions: globalVersions,
      access: { read: () => true },
      fields: [
        { name: "heroTitle", label: "标题", type: "textarea", required: true },
        { name: "intro", label: "简介", type: "textarea", required: true },
      ],
    },
    {
      slug: "podcastPage",
      admin: {
        description: "维护 Tiger Legal Talks 页面介绍、亮点和订阅入口。",
        group: "页面内容",
      },
      label: "播客页",
      versions: globalVersions,
      access: { read: () => true },
      fields: [
        { name: "heroTitle", label: "标题", type: "textarea", required: true },
        { name: "intro", label: "简介", type: "textarea", required: true },
        primitiveItemsField("showDescription", "节目介绍"),
        linkArrayField("platformLinks", "订阅平台"),
        primitiveItemsField("highlightBullets", "亮点条目"),
      ],
    },
    {
      slug: "contactPage",
      admin: {
        description: "维护联系页文案、来意选项和订阅入口。",
        group: "页面内容",
      },
      label: "联系页",
      versions: globalVersions,
      access: { read: () => true },
      fields: [
        { name: "heroTitle", label: "标题", type: "textarea", required: true },
        { name: "intro", label: "简介", type: "textarea", required: true },
        { name: "formNote", label: "表单说明", type: "textarea", required: true },
        primitiveItemsField("reasons", "来意选项"),
        linkArrayField("subscriptionLinks", "订阅链接"),
      ],
    },
  ],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || "file:./data/payload.db",
    },
  }),
  editor: lexicalEditor(),
  onInit: async (payload) => {
    try {
      await seedDemoContent(payload);
    } catch {
      // SQLite tables may not exist on the very first boot during build.
      // Public pages still fall back to local demo data until admin content is saved.
    }
  },
  routes: {
    admin: "/cms/admin",
    api: "/api/payload",
    graphQL: "/api/payload/graphql",
  },
  secret: process.env.PAYLOAD_SECRET || "tiger-legal-dev-secret",
  sharp,
  telemetry: false,
  typescript: {
    autoGenerate: false,
  },
});
