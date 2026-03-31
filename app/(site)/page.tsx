import Link from "next/link";
import type { Metadata } from "next";

import styles from "./liu-home.module.css";

import { VisualEditRegion } from "@/components/visual-edit-region";
import { getHomePageData } from "@/lib/payload/api";
import type { PodcastEpisode } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dennis Yuxuan Liu",
  description: "Dennis Yuxuan Liu personal website homepage on the liu branch.",
};

const manifestoQuote = `THE ADOLESCENT\n\"CHUUNIBYOU\" SPIRIT TAUGHT\nME TO FACE LIFE'S CHALLENGES\nWITHOUT FEAR.`;

const statementIntro =
  "I build a personal platform around law, narrative, and public-facing expression, turning sharp ideas into work people can enter through story, conversation, and point of view.";

const statementVideoTitle = "A statement on law, media, and the work behind the voice.";

const statementVideoSummary =
  "A restrained entry point into the broader body of interviews, podcast clips, and perspective-led content.";

const fallbackEpisodes: PodcastEpisode[] = [
  {
    _id: "liu-episode-01",
    title: "Episode One",
    slug: "episode-one",
    episodeCode: "EP01",
    releasedAt: "2026-03-01",
    duration: "45 min",
    summary: "Short summary text.",
    featured: true,
    platformLinks: [],
  },
  {
    _id: "liu-episode-02",
    title: "Episode Two",
    slug: "episode-two",
    episodeCode: "EP02",
    releasedAt: "2026-02-16",
    duration: "42 min",
    summary: "Short summary text.",
    featured: true,
    platformLinks: [],
  },
  {
    _id: "liu-episode-03",
    title: "Episode Three",
    slug: "episode-three",
    episodeCode: "EP03",
    releasedAt: "2026-01-30",
    duration: "39 min",
    summary: "Short summary text.",
    featured: false,
    platformLinks: [],
  },
];

const featuredWorks = [
  {
    kind: "BOOK",
    title: "BOOK TITLE",
    subtitle: "BOOK SUBLINE",
    size: "large",
  },
  {
    kind: "KIND",
    title: "BOOK TITLE",
    subtitle: "BOOK SUBLINE",
    size: "small",
  },
  {
    kind: "KIND",
    title: "BOOK TITLE",
    subtitle: "BOOK SUBLINE",
    size: "small",
  },
];

const heroUtilityTags = [
  { label: "Red", ariaLabel: "Xiaohongshu" },
  { label: "Zh", ariaLabel: "Zhihu" },
  { label: "in", ariaLabel: "LinkedIn" },
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

export default async function HomePage() {
  const { homePage, podcastHighlights } = await getHomePageData();
  const episodes = (podcastHighlights.length ? podcastHighlights : fallbackEpisodes).slice(0, 3);
  const leadEpisode = episodes[0] ?? fallbackEpisodes[0];
  const heroDisplayTitle = homePage.heroTitle?.trim() ? `“${homePage.heroTitle}”` : "“MAIN TITLE COPY”";

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <VisualEditRegion adminHref="/admin/visual-editor?page=home" label="Liu homepage hero" previewHref="/">
          <div className={styles.heroShell}>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <h1 className={styles.heroTitle}>{heroDisplayTitle}</h1>
              </div>
              <div aria-hidden="true" className={styles.heroVisual}>
                <div className={styles.heroUtilityRow}>
                  <div className={styles.heroUtilityTags}>
                    {heroUtilityTags.map((item) => (
                      <span aria-label={item.ariaLabel} className={styles.heroUtilityTag} key={item.ariaLabel} role="img">
                        {item.label}
                      </span>
                    ))}
                  </div>
                  <span className={styles.heroDomainLink}>TIGERPARTNERS.CN</span>
                </div>
                <div className={styles.heroPortraitScene}>
                  <div className={styles.heroPortraitGlow} />
                  <div className={styles.heroFigure} aria-hidden="true">
                    <div className={styles.heroFigureHead} />
                    <div className={styles.heroFigureHair} />
                    <div className={styles.heroFigureEar} />
                    <div className={styles.heroFigureNeck} />
                    <div className={styles.heroFigureJacket}>
                      <div className={styles.heroFigureShirt} />
                      <div className={styles.heroFigureTie} />
                      <div className={styles.heroFigureLapels} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </VisualEditRegion>
      </section>

      <section className={styles.statementSection}>
        <VisualEditRegion adminHref="/admin/visual-editor?page=home" label="Liu homepage intro" previewHref="/">
          <div className={styles.shell}>
            <div className={styles.statementFrame}>
              <div className={styles.statementTop}>
                <div className={styles.quoteBlock}>
                  <span className={styles.quoteMark}>“</span>
                  <p>{manifestoQuote}</p>
                </div>
                <div className={styles.statementCopy}>
                  <p className={styles.statementEyebrow}>Brand Narrative</p>
                  <p>{statementIntro}</p>
                  <Link className={`${styles.inlineLink} ${styles.statementLink}`} href="/about">
                    More
                  </Link>
                </div>
              </div>
              <div className={styles.videoStage}>
                <div className={styles.videoPanel}>
                  <div className={styles.videoPanelInner}>
                    <div className={styles.videoAction}>
                      <div className={styles.videoIcon}>▶</div>
                      <span className={styles.videoActionLabel}>Statement Film</span>
                    </div>
                    <div className={styles.videoText}>
                      <p className={styles.videoEyebrow}>Selected Entry</p>
                      <h2 className={styles.videoTitle}>{statementVideoTitle}</h2>
                      <p className={styles.videoSummary}>{statementVideoSummary}</p>
                    </div>
                  </div>
                </div>
              </div>
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
                {episodes.map((episode) => (
                  <article className={styles.episodeCard} key={episode._id}>
                    <div className={styles.episodeThumb} />
                    <strong>{episode.title}</strong>
                    <span>{episode.summary}</span>
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
                <p>Representative Program Activity</p>
              </div>
              <Link className={styles.inlineLinkDark} href="/podcast">
                More
              </Link>
            </div>
            <div className={styles.episodeFeatureCard}>
              <div className={styles.episodeMetaRows}>
                <div>
                  <span>{leadEpisode.episodeCode}</span>
                  <strong>{leadEpisode.title}</strong>
                </div>
                <span>{leadEpisode.duration}</span>
              </div>
              <div className={styles.episodeHeroThumb}>
                <div className={styles.episodeHeroBadge}>▶</div>
                <div className={styles.episodeHeroStats}>
                  <span>203k</span>
                  <span>2932</span>
                  <span>01:45:06</span>
                </div>
              </div>
              <div className={styles.episodeFeatureFooter}>
                <strong>{leadEpisode.title}</strong>
                <span>{formatEpisodeDate(leadEpisode.releasedAt)}</span>
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
                  <span>Dennis</span>
                </div>
              </div>
              <div className={styles.profileCopy}>
                <h2>Self introduction</h2>
                <p>
                  Short professional summary text appears here. Keep the block compact, direct,
                  and aligned with the editorial tone from the reference layout.
                </p>
                <Link className={styles.inlineLink} href="/about">
                  More
                </Link>
              </div>
            </div>
          </div>
        </VisualEditRegion>
      </section>

      <section className={styles.worksSection}>
        <VisualEditRegion adminHref="/cms/admin/collections/mediaPosts" label="Liu homepage featured works" previewHref="/media">
          <div className={styles.shell}>
            <div className={styles.worksHeader}>
              <h2>
                FEATURED <span>WORKS</span>
              </h2>
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
