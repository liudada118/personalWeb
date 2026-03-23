import type {
  AboutPageData,
  CaseStudy,
  ContactPageData,
  DashboardStats,
  HomePageData,
  MediaArticle,
  MediaPageData,
  PodcastEpisode,
  PodcastPageData,
  SiteSettings,
} from "@/lib/types";

export const demoSiteSettings: SiteSettings = {
  siteTitle: "虎诉 Tiger Legal",
  shortTitle: "Tiger Legal",
  siteTagline: "律师内容品牌、媒体矩阵与播客栏目的一体化个人官网。",
  logoText: "TL",
  navItems: [
    { label: "首页", href: "/" },
    { label: "个人介绍", href: "/about" },
    { label: "媒体", href: "/media" },
    { label: "播客", href: "/podcast" },
    { label: "联系", href: "/contact" },
  ],
  socialLinks: [
    { platform: "微信公众号", label: "订阅公众号", href: "https://example.com/wechat" },
    { platform: "视频号", label: "打开视频号", href: "https://example.com/video" },
    { platform: "小红书", label: "查看小红书", href: "https://example.com/rednote" },
    { platform: "Bilibili", label: "进入 B 站", href: "https://example.com/bilibili" },
  ],
  contactEmail: "hello@tigerlegal.example",
  contactPhone: "+86 138 0000 0000",
  address: "上海 / 北京 / 线上协作",
  footerNote: "演示数据已预置。接入 Payload Admin 后，可直接在自托管后台中维护页面内容、文章、轮播、播客与案例。",
};

export const demoCaseStudies: CaseStudy[] = [
  {
    _id: "case-1",
    title: "并购争议中的信息披露与舆论响应",
    slug: "m-and-a-dispute-public-communication",
    category: "公司争议",
    year: "2026",
    summary: "把案件信息、媒体口径与企业对外回应统一成一条清晰叙事线，降低高压阶段的表达失真。",
    highlights: ["统一法律与公关口径", "压缩高层决策时间", "形成可复用发声模板"],
    detail: [
      "案例页用于承接首页轮转内容，让首页保持克制，同时给真正关心方法论与案例深度的访问者一个第二阅读层。",
      "内容结构既适合展示案件摘要，也适合补充阶段成果、媒体回应以及团队协同方式。",
    ],
  },
  {
    _id: "case-2",
    title: "跨境调查中的董事会汇报与媒体策略",
    slug: "cross-border-investigation-board-media-strategy",
    category: "合规调查",
    year: "2025",
    summary: "围绕跨境调查构建董事会沟通框架，同时控制对外公开信息的节奏与颗粒度。",
    highlights: ["梳理跨法域事实线", "控制沟通节奏", "避免信息过载"],
    detail: [
      "官网中的案例不是流水账，而是带有编辑感的代表作摘要。视觉上更接近高端个人品牌站，而不是传统律所项目列表。",
      "在 CMS 中可以自由调整案例顺序、摘要与亮点条目，实现首页案例轮转管理。",
    ],
  },
  {
    _id: "case-3",
    title: "创始人品牌危机中的应急内容中枢",
    slug: "founder-brand-crisis-response-hub",
    category: "品牌危机",
    year: "2024",
    summary: "为创始人和团队搭建可快速复用的应急内容中枢，把复杂事实翻译成公众能理解的表达。",
    highlights: ["搭建内容中枢", "降低舆情误读", "连接法律与品牌修复"],
    detail: [
      "这个模块对应你提到的律所案例轮转需求。首页只展示关键线索，详情页负责承接深度内容与案例叙事。",
      "如果后续需要增加案例封面图、视频或附件，也可以继续扩展这个 schema。",
    ],
  },
];

export const demoMediaArticles: MediaArticle[] = [
  {
    _id: "media-1",
    title: "当法律内容进入公众传播语境，什么必须被保留",
    slug: "legal-communication-public-context",
    publication: "界面新闻",
    publishedAt: "2026-02-18",
    excerpt: "代表作卡片支持摘要、来源、封面与跳转链接，可作为媒体页主列表，也能作为首页精选露出。",
    category: "专栏",
    url: "https://example.com/article-1",
    featured: true,
  },
  {
    _id: "media-2",
    title: "公司争议时代，律师个人品牌为什么需要独立官网",
    slug: "why-lawyer-brand-needs-personal-site",
    publication: "36Kr",
    publishedAt: "2026-01-09",
    excerpt: "在媒体矩阵之外，官网承担的是沉淀、归档与统一叙事的职责，不能只做一个简单资料页。",
    category: "访谈",
    url: "https://example.com/article-2",
    featured: true,
  },
  {
    _id: "media-3",
    title: "从案件沟通到内容运营，虎诉的方法论",
    slug: "tiger-legal-content-methodology",
    publication: "财新周刊",
    publishedAt: "2025-11-28",
    excerpt: "媒体页除了放作品，也需要交代作品存在的价值，因此卡片保留了更大的摘要空间。",
    category: "深度稿",
    url: "https://example.com/article-3",
    featured: true,
  },
  {
    _id: "media-4",
    title: "如何把复杂法律议题转成公众听得懂的话",
    slug: "translating-complex-legal-issues",
    publication: "第一财经",
    publishedAt: "2025-10-12",
    excerpt: "内容编辑器支持基础排版、图片和视频插入，方便后台独立维护文章与动态。",
    category: "评论",
    url: "https://example.com/article-4",
    featured: false,
  },
];

export const demoPodcastEpisodes: PodcastEpisode[] = [
  {
    _id: "pod-1",
    title: "Tiger Legal Talks 01: 法律内容为什么不能只讲结论",
    slug: "tiger-legal-talks-episode-01",
    episodeCode: "EP01",
    releasedAt: "2026-02-24",
    duration: "36 min",
    guest: "内容策略顾问",
    summary: "播客页的主卡片既展示节目定位，也能承载平台跳转和单集摘要。",
    featured: true,
    platformLinks: [
      { label: "小宇宙", href: "https://example.com/podcast-1" },
      { label: "Apple Podcasts", href: "https://example.com/podcast-1-apple" },
    ],
  },
  {
    _id: "pod-2",
    title: "Tiger Legal Talks 02: 律师个人品牌，内容与官网怎么配合",
    slug: "tiger-legal-talks-episode-02",
    episodeCode: "EP02",
    releasedAt: "2026-01-29",
    duration: "42 min",
    guest: "品牌策划人",
    summary: "用播客页专门介绍 Tiger Legal Talks，形成独立而完整的栏目资产，而不是把播客混在媒体页里。",
    featured: true,
    platformLinks: [
      { label: "小宇宙", href: "https://example.com/podcast-2" },
      { label: "Spotify", href: "https://example.com/podcast-2-spotify" },
    ],
  },
  {
    _id: "pod-3",
    title: "Tiger Legal Talks 03: 案件、舆情与公众理解之间的距离",
    slug: "tiger-legal-talks-episode-03",
    episodeCode: "EP03",
    releasedAt: "2025-12-11",
    duration: "33 min",
    guest: "媒体编辑",
    summary: "播客内容可以在后台单独管理，包括标题、时间、摘要、外链和平台按钮。",
    featured: false,
    platformLinks: [
      { label: "小宇宙", href: "https://example.com/podcast-3" },
      { label: "网易云音乐", href: "https://example.com/podcast-3-music" },
    ],
  },
];

export const demoHomePageData: HomePageData = {
  settings: demoSiteSettings,
  homePage: {
    heroEyebrow: "Tiger Legal Personal Site",
    heroTitle: "把复杂法律议题，讲给公众、企业与媒体听明白。",
    heroIntro:
      "官网以克制、沉稳、思想型的个人品牌表达为核心，围绕媒体矩阵、播客栏目、官网入口、日程轮播与案例资产，建立一套长期可维护的内容秩序。",
    heroQuote: "法律内容不是缩写案例，而是把复杂性处理成可以被理解的判断。",
    heroSource: "Tiger Legal",
    heroSlides: [
      {
        eyebrow: "首页轮播",
        title: "媒体矩阵入口",
        description: "把公众号、视频号、小红书、B 站等平台入口做成一组高识别度按钮，方便首页直接跳转。",
        href: "https://example.com/social-hub",
      },
      {
        eyebrow: "官网入口",
        title: "虎诉官网直达",
        description: "首页主视觉中保留独立的虎诉官网跳转位，强化主品牌与个人站之间的关系。",
        href: "https://example.com/husu",
      },
      {
        eyebrow: "内容运营",
        title: "订阅与更新尾标",
        description: "尾部放置大尾标，引导用户订阅公众号、访问虎诉官网或进入核心内容平台。",
        href: "https://example.com/wechat",
      },
    ],
    tigerLegalLink: { label: "进入虎诉官网", href: "https://example.com/husu" },
    platformLinks: [
      { label: "微信公众号", href: "https://example.com/wechat" },
      { label: "视频号", href: "https://example.com/video" },
      { label: "小红书", href: "https://example.com/rednote" },
      { label: "Bilibili", href: "https://example.com/bilibili" },
    ],
    scheduleItems: [
      {
        date: "2026-03-22",
        title: "线下分享：律师内容品牌怎么做",
        venue: "上海静安",
        description: "作为首页日程轮播的演示数据，可在后台直接新增、编辑、排序。",
        href: "https://example.com/schedule-1",
      },
      {
        date: "2026-03-27",
        title: "Tiger Legal Talks 直播连线",
        venue: "线上",
        description: "适合放直播、播客更新、公开课、论坛或采访安排。",
        href: "https://example.com/schedule-2",
      },
      {
        date: "2026-04-03",
        title: "媒体专访：法律议题的公众表达",
        venue: "北京朝阳",
        description: "轮播区域可承载时间、地点、摘要和跳转链接。",
        href: "https://example.com/schedule-3",
      },
    ],
    bioBlurb:
      "首页中的个人介绍保持简洁，不堆满履历。更完整的律师简历、虎诉介绍、新媒体说明与获奖信息统一沉淀在个人介绍页。",
    featuredCases: demoCaseStudies,
    footerBannerTitle: "如果你希望继续沟通，请从一个明确的来意开始。",
    footerBannerText:
      "首页尾部只保留一个主动作，把联系入口放在最明确的位置；订阅与官网跳转保留为辅助路径。",
    footerBannerLinks: [
      { label: "订阅公众号", href: "https://example.com/wechat" },
      { label: "访问虎诉官网", href: "https://example.com/husu" },
    ],
  },
  mediaHighlights: demoMediaArticles.filter((item) => item.featured).slice(0, 3),
  podcastHighlights: demoPodcastEpisodes.filter((item) => item.featured).slice(0, 2),
};

export const demoAboutPageData: AboutPageData = {
  settings: demoSiteSettings,
  aboutPage: {
    heroTitle: "律师简历、虎诉介绍、新媒体矩阵与获奖信息",
    intro:
      "个人介绍页会采用更像编辑特刊的编排方式：信息密度高，但节奏清晰，不会做成传统简历网页的堆砌感。",
    resumeBlocks: [
      {
        title: "律师简历",
        items: ["聚焦公司争议、品牌危机与公众沟通", "长期参与高压力法律议题的内容转译与表达策略", "熟悉案件叙事、企业沟通与媒体语境之间的协同"],
      },
      {
        title: "虎诉介绍",
        items: ["虎诉定位为法律内容品牌与传播中枢", "既覆盖官网，也覆盖媒体矩阵、活动和播客栏目", "强调专业判断与公众可理解性之间的连接"],
      },
      {
        title: "新媒体简介",
        items: ["可展示公众号、视频号、小红书、B 站等平台定位", "支持放代表栏目、传播数据与平台链接", "与媒体页、播客页形成统一内容系统"],
      },
    ],
    husuIntro: [
      "虎诉官网不只是一个对外资料页，而是整个内容体系的核心落点。个人站与虎诉官网之间保持明确链接关系，既能承接搜索流量，也能统一品牌叙事。",
      "在后台中，相关入口、订阅按钮、尾标内容都可以单独维护，避免每次改动都动前端代码。",
    ],
    mediaIntro: [
      "媒体部分会突出代表作，而不是无差别罗列所有链接。这样既利于用户理解内容方向，也更符合高端个人站的阅读节奏。",
      "如果后续要增加媒体封面、采访视频或专题页面，当前内容模型也能继续扩展。",
    ],
    awards: [
      { year: "2026", title: "年度法律内容品牌案例提名", issuer: "行业媒体评选" },
      { year: "2025", title: "最佳播客法律栏目推荐", issuer: "内容平台榜单" },
      { year: "2024", title: "专业新媒体传播力奖", issuer: "品牌传播论坛" },
    ],
  },
  caseStudies: demoCaseStudies,
};

export const demoMediaPageData: MediaPageData = {
  settings: demoSiteSettings,
  mediaPage: {
    heroTitle: "把各大媒体的代表作集中展示，并给每一篇留出足够的说明空间。",
    intro: "媒体页会以精选代表作为核心，兼顾来源、栏目类型、摘要说明和跳转链接，适合你提到的媒体介绍场景。",
  },
  articles: demoMediaArticles,
};

export const demoPodcastPageData: PodcastPageData = {
  settings: demoSiteSettings,
  podcastPage: {
    heroTitle: "Tiger Legal Talks",
    intro: "播客页专门介绍 Tiger Legal Talks，让节目本身成为一个独立内容栏目。",
    showDescription: [
      "这一页会明确节目定位、平台分发入口、更新节奏和代表集数，不再把播客信息混在别的栏目里。",
      "页面结构适合长期运营，后续增加更多集数时不会破坏整体视觉节奏。",
    ],
    platformLinks: [
      { label: "小宇宙订阅", href: "https://example.com/xiaoyuzhou" },
      { label: "Apple Podcasts", href: "https://example.com/apple-podcasts" },
      { label: "Spotify", href: "https://example.com/spotify" },
    ],
    highlightBullets: ["专门的节目介绍区", "平台跳转按钮", "单集列表与摘要", "可持续更新的栏目页结构"],
  },
  episodes: demoPodcastEpisodes,
};

export const demoContactPageData: ContactPageData = {
  settings: demoSiteSettings,
  contactPage: {
    heroTitle: "想联系我们，请先简单介绍来意。",
    intro: "联系页会放一个简洁但正式的表单，同时保留虎诉官网和各大媒体平台订阅跳转。",
    formNote: "表单可收集姓名、机构、联系方式、咨询方向和来意描述。后台会显示提交数量，后续也可接邮件通知。",
    reasons: ["案件沟通", "媒体合作", "播客邀约", "活动演讲", "其他咨询"],
    subscriptionLinks: [
      { label: "访问虎诉官网", href: "https://example.com/husu" },
      { label: "订阅公众号", href: "https://example.com/wechat" },
      { label: "查看媒体矩阵", href: "https://example.com/social-hub" },
    ],
  },
};

export const demoDashboardStats: DashboardStats = {
  todayViews: 128,
  yesterdayViews: 94,
  articleCount: demoMediaArticles.length,
  caseCount: demoCaseStudies.length,
  podcastCount: demoPodcastEpisodes.length,
  updateCount: demoPodcastEpisodes.length + demoCaseStudies.length,
  contactCount: 7,
  assetCount: 12,
  cacheSize: "0 MB",
  serverStorageUsed: "0.3 MB",
};
