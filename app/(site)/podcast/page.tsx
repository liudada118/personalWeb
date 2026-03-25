import { EditorialPageHero } from "@/components/editorial-page-hero";
import { VisualEditRegion } from "@/components/visual-edit-region";
import { getPodcastPageData } from "@/lib/payload/api";

export const metadata = {
  title: "播客",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default async function PodcastPage() {
  const { podcastPage, episodes } = await getPodcastPageData();

  return (
    <>
      <VisualEditRegion adminHref="/cms/admin/globals/podcastPage" label="播客页首屏" previewHref="/podcast">
        <EditorialPageHero
          eyebrow="Podcast"
          title={podcastPage.heroTitle}
          intro={podcastPage.intro}
          aside={
            <div className="editorial-page-hero-note">
              <span>Tiger Legal Talks</span>
              <div className="editorial-link-column">
                {podcastPage.platformLinks.map((item) => (
                  <a href={item.href} key={item.label} rel="noreferrer" target="_blank">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          }
        />
      </VisualEditRegion>

      <section className="editorial-section editorial-section-contrast">
        <VisualEditRegion adminHref="/cms/admin/globals/podcastPage" label="播客介绍区" previewHref="/podcast">
          <div className="container editorial-split-copy-grid">
            <div className="editorial-section-copy">
              <p className="editorial-eyebrow">Program note</p>
              <h2>播客承担更长、更完整、也更连续的表达。</h2>
              {podcastPage.showDescription.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="editorial-stack-panel contrast compact-panel">
              <p className="editorial-eyebrow">Highlights</p>
              <ul className="editorial-simple-list">
                {podcastPage.highlightBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </VisualEditRegion>
      </section>

      <section className="editorial-section">
        <VisualEditRegion adminHref="/cms/admin/collections/podcastEpisodes" label="播客单集列表" previewHref="/podcast">
          <div className="container editorial-list-stack">
            {episodes.map((episode) => (
              <article className="editorial-list-card" key={episode._id}>
                <div className="editorial-work-meta">
                  <span>{episode.episodeCode}</span>
                  <span>{formatDate(episode.releasedAt)}</span>
                  <span>{episode.duration}</span>
                </div>
                <h3>{episode.title}</h3>
                <p>{episode.summary}</p>
                <div className="editorial-inline-links">
                  {episode.platformLinks.map((item) => (
                    <a href={item.href} key={item.label} rel="noreferrer" target="_blank">
                      {item.label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </VisualEditRegion>
      </section>
    </>
  );
}