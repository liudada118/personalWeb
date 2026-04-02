import Link from "next/link";
import type { Metadata } from "next";

import styles from "./liu-home.module.css";
import heroReference from "../../img/图片1.png";
import profileReference from "../../img/图片5.png";

import { VisualEditRegion } from "@/components/visual-edit-region";
import { EpisodeFeatureCard } from "./_components/EpisodeFeatureCard";
import { PodcastCarousel } from "../(site)_components/PodcastCarousel";
import { getHomePageData } from "@/lib/payload/api";
import type { PodcastEpisode } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dennis Yuxuan Liu",
  description: "Dennis Yuxuan Liu personal website homepage on the liu branch.",
};

const manifestoQuote = `THE ADOLESCENT\n\"CHUUNIBYOU\" SPIRIT TAUGHT\nME TO FACE LIFE'S CHALLENGES\nWITHOUT FEAR.`;
const heroTitle = "THE ADOLESCENT \u201CCHUUNIBYOU\u201D SPIRIT TAUGHT ME TO FACE LIFE\u2019S CHALLENGES WITHOUT FEAR";
const heroEyebrow = "DENNIS YUXUAN LIU";
const podcastCarouselCards = [
  {
    episodeCode: "EP01",
    title: "Can Law Survive the Attention Economy?",
    summary: "How legal analysis changes once it has to compete with algorithms, speed, and spectacle.",
    duration: "45 min",
  },
  {
    episodeCode: "EP02",
    title: "From Case File to Public Narrative",
    summary: "Translating dense disputes into responsible commentary without flattening the legal stakes.",
    duration: "42 min",
  },
  {
    episodeCode: "EP03",
    title: "Who Owns the Public Square?",
    summary: "Platform governance, speech norms, and the lawyer's role in contested online discourse.",
    duration: "39 min",
  },
  {
    episodeCode: "EP04",
    title: "Narrative as Legal Strategy",
    summary: "Why storytelling has become the most powerful tool in modern legal practice.",
    duration: "51 min",
  },
  {
    episodeCode: "EP05",
    title: "The Influencer and the Law",
    summary: "When creators become test cases for regulation — who decides what counts as speech?",
    duration: "44 min",
  },
  {
    episodeCode: "EP06",
    title: "Disrupting the Court of Public Opinion",
    summary: "Litigation PR and the fine line between fair representation and media manipulation.",
    duration: "48 min",
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
  { platform: "Xiaohongshu", label: "小红书", href: "https://example.com/rednote" },
  { platform: "Bilibili", label: "bilibili", href: "https://example.com/bilibili" },
  { platform: "LinkedIn", label: "in", href: "https://example.com/linkedin" },
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

  if (source.includes("bilibili")) {
    return "bilibili";
  }

  if (source.includes("rednote") || source.includes("xiaohongshu") || source.includes("小红书")) {
    return "小红书";
  }

  return label || platform;
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
            <div className={styles.heroUtilityRow}>
              <div className={styles.heroSocialLinks}>
                {heroSocialLinks.map((item) => (
                  <a
                    className={styles.heroSocialLink}
                    aria-label={`${item.platform} ${item.label}`}
                    href={item.href}
                    key={`hero-social-${item.platform}-${item.href}`}
                    rel="noreferrer"
                    target="_blank"
                    title={item.label || item.platform}
                  >
                    <span>{getHeroSocialLabel(item.platform, item.label)}</span>
                  </a>
                ))}
              </div>
              <a className={styles.heroUtilityBadge} href="/about">
                TIGERPARTNERS.CN
              </a>
            </div>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <div className={styles.heroTitleBlock}>
                  <p className={styles.heroEyebrow}>{heroEyebrow}</p>
                  <h1 className={styles.heroTitle}>{heroTitle}</h1>
                </div>
              </div>
              <div className={styles.heroVisual}>
                <div className={styles.heroPortraitScene}>
                  <div
                    aria-hidden="true"
                    className={styles.heroPortraitReference}
                    style={{ backgroundImage: `url(${heroReference.src})` }}
                  />
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
                <p>{manifestoQuote}</p>
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
                <span className={styles.videoCaption}>Watch Safety Differently, the movie →</span>
              </div>
            </div>
          </div>
        </VisualEditRegion>
      </section>

      <section className={styles.podcastRailSection}>
        <VisualEditRegion adminHref="/cms/admin/collections/podcastEpisodes" label="Liu homepage podcast rail" previewHref="/podcast">
          <div className={styles.shell}>
            <div className={`${styles.sectionHeaderCenter} ${styles.podcastRailHeader}`}>
              <p className={styles.podcastRailEyebrow}>Featured Audio Column</p>
              <h2 className={styles.podcastRailTitle}>LAW, DISRUPTED PODCAST</h2>
            </div>
            <div className={styles.podcastRailWrap}>
              <PodcastCarousel cards={podcastCarouselCards} />
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
            <EpisodeFeatureCard />
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
                  <div className={styles.workCardBody}>
                    <span className={styles.workCardKind}>{work.kind}</span>
                    <strong>{work.title}</strong>
                    <p>{work.subtitle}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className={styles.exploreLinkWrap}>
              <Link className={styles.exploreLink} href="/media">
                Explore all books
              </Link>
            </div>
          </div>
        </VisualEditRegion>
      </section>

      <footer className={styles.homeFooter}>
        <div className={styles.homeFooterInner}>
          <div className={styles.homeFooterLeft}>
            <p className={styles.homeFooterBrand}>DENNIS YUXUAN LIU</p>
            <div className={styles.homeFooterMeta}>
              <p>Email address: dennis@liu-yuxuan.com</p>
              <p>Contact information: +86 138-0000-1234</p>
            </div>
          </div>
          <div className={styles.homeFooterAction}>
            <a aria-label="Tiger Partners domain" href="https://tigerpartners.cn" rel="noreferrer" target="_blank">
              TIGERPARTNERS.CN
            </a>
          </div>
        </div>
        <div className={styles.homeFooterNote}>
          COPYRIGHT © 2026 DENNIS YUXUAN LIU. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
}
