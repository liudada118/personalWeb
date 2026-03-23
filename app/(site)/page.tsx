import Link from "next/link";

import { CaseCarousel } from "@/components/case-carousel";
import { HeroSlideDeck } from "@/components/hero-slide-deck";
import { RevealSection } from "@/components/reveal-section";
import { ScheduleCarousel } from "@/components/schedule-carousel";
import { SectionTitle } from "@/components/section-title";
import { ValueManifestoSection } from "@/components/value-manifesto-section";
import { getHomePageData } from "@/lib/payload/api";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatCount(value: number) {
  return String(value).padStart(2, "0");
}

const capabilityItems = [
  {
    title: "复杂议题翻译",
    body: "把法律、商业、品牌和舆论语境整理成一条能被公众理解的表达路径，让复杂问题可以被准确讨论。",
  },
  {
    title: "内容矩阵运营",
    body: "围绕官网、媒体矩阵和播客栏目组织持续输出，不依赖高频营销动作，而依赖稳定、可信的内容系统。",
  },
  {
    title: "高压场景表达",
    body: "在公开沟通、代表发声、事件回应和重要节点中，提供更稳、更克制、更具判断力的表达支持。",
  },
];

const valuePrinciples = [
  {
    title: "先判断，再表达。",
    body: "先建立问题框架和事实秩序，再决定对外怎么说，让官网体现判断力，而不是即时反应。",
  },
  {
    title: "先内容，再传播。",
    body: "把官网、媒体与播客当成一套长期内容系统，不靠密集营销堆量，而是持续建立可阅读的资产。",
  },
  {
    title: "先沉淀，再扩散。",
    body: "先把立场、案例与方法论沉淀成稳定文本，再交给平台和媒体做传播，降低表达噪音。",
  },
];

const resourcePrinciples = [
  "官网负责统一叙事与归档。",
  "播客负责持续而完整的思想输出。",
  "媒体与平台负责外部触达与公共存在。",
];

export default async function HomePage() {
  const { settings, homePage, mediaHighlights, podcastHighlights } = await getHomePageData();

  const trustMetrics = [
    {
      label: "精选媒体",
      value: formatCount(mediaHighlights.length),
    },
    {
      label: "代表案例",
      value: formatCount(homePage.featuredCases.length),
    },
    {
      label: "公开平台",
      value: formatCount(settings.socialLinks.length + 1),
    },
  ];

  const featuredPublications = mediaHighlights.slice(0, 3);
  const featuredEpisodes = podcastHighlights.slice(0, 2);
  const heroVisual =
    homePage.heroSlides.find((item) => item.imageUrl)?.imageUrl ??
    homePage.featuredCases.find((item) => item.imageUrl)?.imageUrl ??
    featuredPublications.find((item) => item.imageUrl)?.imageUrl ??
    featuredEpisodes.find((item) => item.imageUrl)?.imageUrl;

  return (
    <div className="home-page">
      <section className="hero-section hero-cinematic">
        <div className="hero-media-shell">
          <div
            className={`hero-media${heroVisual ? " has-image" : ""}`}
            style={heroVisual ? { backgroundImage: `url(${heroVisual})` } : undefined}
          />
          <div className="hero-media-scrim" />
          <div className="container hero-stage">
            <div className="hero-story hero-enter">
              <p className="eyebrow hero-eyebrow-light">{homePage.heroEyebrow}</p>
              <h1 className="display-title hero-display">{homePage.heroTitle}</h1>
              <p className="hero-standfirst">{homePage.heroIntro}</p>
              <div className="hero-primary-actions">
                <a className="button-primary button-hero" href={homePage.tigerLegalLink.href} rel="noreferrer" target="_blank">
                  {homePage.tigerLegalLink.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section value-section">
        <ValueManifestoSection
          eyebrow="理念解释"
          footnotes={[
            "官网不是营销页面，也不该是一堆信息的堆叠。它更像一个稳定的思想界面，用来组织立场、作品、方法与可信度。",
            "视觉目标不是“抓眼球”，而是让访问者快速理解你是谁、你做什么、你如何判断问题，以及为什么值得信任。",
          ]}
          principles={valuePrinciples}
          title="官网不是一页名片。它是一套公开判断。"
        />
      </section>

      <section className="section services-section">
        <RevealSection className="container services-stage">
          <div className="services-heading-row">
            <SectionTitle
              eyebrow="服务能力"
              title="把法律判断、内容组织与公开表达，收束成一条持续工作的能力线。"
              description="这里不再堆砌功能项，而是让访问者先理解真正能被交付的核心能力，再进入具体内容与案例。"
            />

            <div className="section-cta-inline reveal-item delay-1">
              <p>如果你已经有明确议题，沟通入口不必等到页面结尾才出现。</p>
              <Link className="button-secondary" href="/contact">
                发起沟通
              </Link>
            </div>
          </div>

          <div className="services-layout">
            <div className="capability-grid">
              {capabilityItems.map((item, index) => (
                <article className={`capability-card reveal-item delay-${index + 1}`} key={item.title}>
                  <span className="capability-index">{formatCount(index + 1)}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>

            <div className="services-spotlight reveal-item delay-2">
              <HeroSlideDeck slides={homePage.heroSlides} />
            </div>
          </div>
        </RevealSection>
      </section>

      <section className="section credibility-section">
        <RevealSection className="container credibility-editorial">
          <div className="credibility-heading-row">
            <div className="credibility-copy">
              <p className="eyebrow">权威背书</p>
              <h2>公开表达、代表作品与案例，不靠头衔堆砌，而靠长期可验证的输出。</h2>
              <p className="section-description">
                媒体文章、公开日程与案例共同构成可信度。它们不是并列装饰，而是对官网主张的现实证明。
              </p>
            </div>

            <div className="credibility-ledger" aria-label="权威背书概览">
              {trustMetrics.map((item, index) => (
                <div className={`credibility-metric reveal-item delay-${index + 1}`} key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="credibility-proof-grid">
            <div className="authority-list-grid">
              {featuredPublications.map((article, index) => (
                <article className={`list-card reveal-item delay-${index + 1}`} key={article._id}>
                  <div className="list-card-meta">
                    <span>{article.publication}</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <a href={article.url} rel="noreferrer" target="_blank">
                    打开文章
                  </a>
                </article>
              ))}
            </div>

            <div className="credibility-side-stack">
              <div className="reveal-item delay-2">
                <ScheduleCarousel items={homePage.scheduleItems} />
              </div>

              <div className="section-cta-inline reveal-item delay-3">
                <p>如果你想先看完整的公开内容，可以从媒体页面继续往下读。</p>
                <Link className="button-secondary" href="/media">
                  查看媒体页
                </Link>
              </div>
            </div>
          </div>

          <div className="credibility-case-block">
            <div className="section-heading">
              <p className="eyebrow">案例证明</p>
              <h2>案例不是展示数量，而是展示判断方法如何真正落地。</h2>
            </div>
            <div className="reveal-item delay-2">
              <CaseCarousel items={homePage.featuredCases} />
            </div>
          </div>
        </RevealSection>
      </section>

      <section className="section resources-section">
        <RevealSection className="container resources-editorial">
          <div className="resources-lead">
            <div className="resources-copy">
              <p className="eyebrow">内容资产</p>
              <h2>官网、媒体与播客不是分散入口，而是一套持续工作的内容资产。</h2>
              <p className="section-description">
                内容资产的价值不在数量，而在它们是否形成清晰分工、稳定节奏和持续输出的界面。
              </p>
              <ul className="simple-list resource-list">
                {resourcePrinciples.map((item, index) => (
                  <li className={`reveal-item delay-${index + 1}`} key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="resources-support">
              <div className="platform-ribbon reveal-item delay-2">
                <span className="platform-label">媒体与平台</span>
                <div className="platform-ribbon-track">
                  {settings.socialLinks.map((item) => (
                    <a className="platform-pill" href={item.href} key={item.platform} rel="noreferrer" target="_blank">
                      {item.label}
                    </a>
                  ))}
                  <a className="platform-pill" href={homePage.tigerLegalLink.href} rel="noreferrer" target="_blank">
                    {homePage.tigerLegalLink.label}
                  </a>
                </div>
              </div>

              <div className="resources-callout reveal-item delay-3">
                <p className="eyebrow">继续阅读</p>
                <h3>Tiger Legal Talks 承接更完整、更连续的思想输出。</h3>
                <Link className="button-secondary" href="/podcast">
                  查看播客栏目
                </Link>
              </div>
            </div>
          </div>

          <div className="stack-grid resources-podcast-list">
            {featuredEpisodes.map((episode, index) => (
              <article className={`list-card reveal-item delay-${index + 1}`} key={episode._id}>
                <div className="list-card-meta">
                  <span>{episode.episodeCode}</span>
                  <span>{formatDate(episode.releasedAt)}</span>
                </div>
                <h3>{episode.title}</h3>
                <p>{episode.summary}</p>
                <Link href="/podcast">查看播客栏目</Link>
              </article>
            ))}
          </div>
        </RevealSection>
      </section>

      <section className="section contact-section">
        <RevealSection className="container tail-banner contact-surface">
          <SectionTitle eyebrow="联系转化" title={homePage.footerBannerTitle} description={homePage.footerBannerText} />
          <div className="tail-actions">
            <Link className="button-primary" href="/contact">
              发起联系
            </Link>
            <div className="tail-meta-links">
              {homePage.footerBannerLinks.map((item) => (
                <a href={item.href} key={item.label} rel="noreferrer" target="_blank">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>
    </div>
  );
}
