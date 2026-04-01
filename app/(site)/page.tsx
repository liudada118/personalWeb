import Link from "next/link";
import type { Metadata } from "next";

import styles from "./liu-home.module.css";
import heroReference from "../../img/图片1.png";
import profileReference from "../../img/图片5.png";

import { VisualEditRegion } from "@/components/visual-edit-region";
import { getHomePageData } from "@/lib/payload/api";
import type { PodcastEpisode } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dennis Yuxuan Liu",
  description: "Dennis Yuxuan Liu personal website homepage on the liu branch.",
};

const manifestoQuote = `THE ADOLESCENT\n\"CHUUNIBYOU\" SPIRIT TAUGHT\nME TO FACE LIFE'S CHALLENGES\nWITHOUT FEAR.`;
const heroTitle = "DENNIS\nYUXUAN LIU";
const heroKicker = "Narrative & Law";
const heroSub = "Legal Narrative / Public Discourse";
const podcastCarouselCards = [
  {
    title: "案例一",
    summary: "短说明文案占位。\n洲洲发布，策略或社交表达。",
  },
  {
    title: "案例二",
    summary: "说明",
  },
  {
    title: "案例三",
    summary: "说明",
  },
];
const featuredEpisodeRows = [
  {
    code: "法治一",
    title: "案例标题",
  },
  {
    code: "律师二",
    title: "案例标题",
  },
  {
    code: "EP03",
    title: "Winner's Hunger, Desire & Dark Force: A Striver's Way Out",
  },
];

const fallbackEpisodes: PodcastEpisode[] = [
  {
    _id: "liu-episode-01",
    title: "Can Law Survive the Attention Economy?",
    slug: "can-law-survive-the-attention-economy",
    episodeCode: "EP01",
    releasedAt: "2026-03-01",
    duration: "45 min",
    summary: "How legal analysis changes once it has to compete with algorithms, speed, and spectacle.",
    featured: true,
    platformLinks: [],
  },
  {
    _id: "liu-episode-02",
    title: "From Case File to Public Narrative",
    slug: "from-case-file-to-public-narrative",
    episodeCode: "EP02",
    releasedAt: "2026-02-16",
    duration: "42 min",
    summary: "Translating dense disputes into responsible commentary without flattening the legal stakes.",
    featured: true,
    platformLinks: [],
  },
  {
    _id: "liu-episode-03",
    title: "Who Owns the Public Square?",
    slug: "who-owns-the-public-square",
    episodeCode: "EP03",
    releasedAt: "2026-01-30",
    duration: "39 min",
    summary: "Platform governance, speech norms, and the lawyer's role in contested online discourse.",
    featured: false,
    platformLinks: [],
  },
];

const heroSocialFallbacks = [
  { platform: "???", label: "???", href: "https://example.com/rednote" },
  { platform: "Bilibili", label: "????", href: "https://example.com/bilibili" },
  { platform: "LinkedIn", label: "LinkedIn", href: "https://example.com/linkedin" },
];

const featuredWorks = [
  {
    kind: "BOOK",
    title: "法的叙事",
    subtitle: "法律叙事与公共表达",
    size: "large",
  },
  {
    kind: "ESSAY",
    title: "注意力经济中的法律叙事",
    subtitle: "《南方周末》2025",
    size: "small",
  },
  {
    kind: "TALK",
    title: "法律叙事与内容传播",
    subtitle: "单向街书店 2025",
    size: "small",
  },
];

function formatEpisodeDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function getHeroSocialLabel(platform: string, label: string) {
  const source = `${platform} ${label}`.toLowerCase();

  if (source.includes("linkedin")) {
    return "in";
  }

  if (source.includes("bilibili") || source.includes("??") || source.includes("b?")) {
    return "B";
  }

  if (source.includes("???") || source.includes("rednote") || source.includes("xiaohongshu")) {
    return "?";
  }

  return (platform || label).slice(0, 2);
}

export default async function HomePage() {
  const { settings, podcastHighlights } = await getHomePageData();
  const episodes = (podcastHighlights.length ? podcastHighlights : fallbackEpisodes).slice(0, 3);
  const leadEpisode = episodes[0] ?? fallbackEpisodes[0];
  const heroSocialLinks = (settings.socialLinks.length ? settings.socialLinks : heroSocialFallbacks).slice(0, 3);

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <VisualEditRegion adminHref="/admin/visual-editor?page=home" label="Liu homepage hero" previewHref="/">
          <div className={styles.heroShell}>
            <div className={styles.heroGrid}>
              <div className={styles.heroUtilityRow}>
                <a className={styles.heroUtilityBadge} href="https://tigerpartners.cn" rel="noreferrer" target="_blank">
                  Tigerpartners.cn
                </a>
              </div>
              <div className={styles.heroCopy}>
                <p className={styles.heroKicker}>{heroKicker}</p>
                <h1 className={styles.heroTitle}>{heroTitle}</h1>
                <p className={styles.heroSub}>{heroSub}</p>
                <div className={styles.heroCopyMeta}>
                  {heroSocialLinks.map((item) => (
                    <a
                      className={styles.heroCopyMetaLink}
                      href={item.href}
                      key={`hero-social-${item.platform}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {item.platform}
                    </a>
                  ))}
                </div>
              </div>
              <div className={styles.heroVisual}>
                <div className={styles.heroPortraitScene}>
                  <div
                    aria-hidden="true"
                    className={styles.heroPortraitReference}
                    style={{ backgroundImage: `url(${heroReference.src})` }}
                  />
                  <div className={styles.heroPortraitGlow} />
                </div>
              </div>
            </div>
          </div>
        </VisualEditRegion>
      </section>

      <section className={styles.statementSection}>
        <VisualEditRegion adminHref="/admin/visual-editor?page=home" label="Liu homepage intro" previewHref="/">
          <div className={styles.shell}>
            <div className={styles.statementGrid}>
              <div className={styles.quoteBlock}>
                <span className={styles.quoteMark}>“</span>
                <p>{manifestoQuote}</p>
                <span className={styles.quoteMarkRight}>”</span>
              </div>
              <div className={styles.statementCopy}>
                <p>Some short self-introductions.</p>
                <Link className={styles.statementButton} href="/about">
                  个人介绍
                </Link>
              </div>
            </div>
            <div className={styles.videoStage}>
              <div className={styles.videoPanel}>
                <div className={styles.videoIcon}>▶</div>
                <p>Video topic</p>
              </div>
              <span className={styles.videoCaption}>Watch Safety Differently, the movie →</span>
            </div>
          </div>
        </VisualEditRegion>
      </section>

      <section className={styles.podcastRailSection}>
        <VisualEditRegion adminHref="/cms/admin/collections/podcastEpisodes" label="Liu homepage podcast rail" previewHref="/podcast">
          <div className={styles.shell}>
            <div className={styles.sectionHeaderCenter}>
              <h2>LAW, DISRUPTED PODCAST</h2>
            </div>
            <div className={styles.podcastRail}>
              <button aria-label="Previous episode" className={styles.railArrow} type="button">
                ‹
              </button>
              <div className={styles.episodeGrid}>
                {podcastCarouselCards.map((card) => (
                  <article className={styles.episodeCard} key={card.title}>
                    <div className={styles.episodeThumb} />
                    <strong className={styles.episodeCardTitle}>{card.title}</strong>
                    <p className={styles.episodeCardSummary}>{card.summary}</p>
                  </article>
                ))}
              </div>
              <button aria-label="Next episode" className={styles.railArrow} type="button">
                ›
              </button>
            </div>
            <div className={styles.carouselDots} aria-hidden="true">
              <span className={styles.dotActive} />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </VisualEditRegion>
      </section>

      <section className={styles.episodeFeatureSection}>
        <VisualEditRegion adminHref="/cms/admin/collections/podcastEpisodes" label="Liu homepage featured episode" previewHref="/podcast">
          <div className={styles.shell}>
            <div className={styles.episodeFeatureIntro}>
              <div>
                <h2>LAW, DISRUPTED PODCAST</h2>
                <p>代表性播客及活动</p>
              </div>
              <span className={styles.episodePlatformTag}>小红书</span>
            </div>
            <div className={styles.episodeFeatureCard}>
              <div className={styles.episodeFeatureIndexStrip}>
                {["播客节目", "媒体活动", "深度内容"].map((label, i) => (
                  <div
                    className={`${styles.episodeFeatureIndexItem} ${i === 0 ? styles.episodeFeatureIndexItemActive : ""}`}
                    key={`index-${label}`}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className={styles.episodeFeatureRows}>
                {featuredEpisodeRows.map((episode, index) => (
                  <div
                    className={`${styles.episodeFeatureRow} ${index === 1 ? styles.episodeFeatureRowActive : ""}`}
                    key={`${episode.code}-feature-row`}
                  >
                    <span className={styles.episodeFeatureRowCode}>{episode.code}</span>
                    <strong className={styles.episodeFeatureRowTitle}>{episode.title}</strong>
                    <span className={styles.episodeFeatureRowArrow}>›</span>
                  </div>
                ))}
              </div>
              <div className={styles.episodeHeroThumb}>
                <div className={styles.episodeHeroBadge}>▶</div>
                <div className={styles.episodeHeroHeadline}>
                  <span>大喧哥</span>
                  <em>饥饿 欲望 黑暗原力</em>
                  <strong>做题家的一种人生解法</strong>
                </div>
                <div className={styles.episodeHeroStats}>
                  <span>20.3万</span>
                  <span>2932</span>
                  <span>01:45:06</span>
                </div>
              </div>
            </div>
          </div>
        </VisualEditRegion>
      </section>

      <section className={styles.profileSection}>
        <VisualEditRegion adminHref="/admin/visual-editor?page=home" label="Liu homepage profile block" previewHref="/about">
          <div className={styles.shell}>
              <div className={styles.profileGrid}>
                <div className={styles.profilePortrait}>
                  <div className={styles.profilePortraitInner}>
                    <div
                      aria-hidden="true"
                      className={styles.profilePortraitReference}
                      style={{ backgroundImage: `url(${profileReference.src})` }}
                    />
                    <span>DENNIS LIU</span>
                  </div>
                </div>
              <div className={styles.profileCopy}>
                <h2>简单介绍</h2>
                <p>
                  以法律叙事为核心，面向内容传播与公众表达建立个人系统化作品，
                  为下一阶段更完整的品牌展示做准备。
                </p>
              </div>
            </div>
          </div>
        </VisualEditRegion>
      </section>

      <section className={styles.worksSection}>
        <VisualEditRegion adminHref="/cms/admin/collections/mediaPosts" label="Liu homepage featured works" previewHref="/media">
          <div className={styles.shell}>
            <div className={styles.worksHeader}>
              <h2>FEATURED WORKS</h2>
            </div>
            <div className={styles.worksGrid}>
              {featuredWorks.map((work, index) => (
                <article
                  className={`${styles.workCard} ${work.size === "large" ? styles.workCardLarge : styles.workCardSmall}`}
                  key={`${work.title}-${index}`}
                >
                  <div className={styles.workThumb} />
                  <span>{work.kind}</span>
                  <strong>{work.title}</strong>
                  <p>{work.subtitle}</p>
                </article>
              ))}
            </div>
            <Link className={styles.exploreLink} href="/media">
              Explore all books
            </Link>
          </div>
        </VisualEditRegion>
      </section>
    </div>
  );
}
