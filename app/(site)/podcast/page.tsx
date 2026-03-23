import { SectionTitle } from "@/components/section-title";
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
      <section className="section page-masthead">
        <div className="container">
          <p className="eyebrow">播客</p>
          <h1 className="page-title">{podcastPage.heroTitle}</h1>
          <p className="page-intro">{podcastPage.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container split-layout">
          <div className="body-copy">
            <SectionTitle eyebrow="节目介绍" title="Tiger Legal Talks 需要一个独立的栏目页，而不是附属于别的栏目。" />
            {podcastPage.showDescription.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <aside className="content-panel">
            <h2>订阅平台</h2>
            <div className="link-cluster vertical">
              {podcastPage.platformLinks.map((item) => (
                <a href={item.href} key={item.label} rel="noreferrer" target="_blank">
                  {item.label}
                </a>
              ))}
            </div>
            <ul className="simple-list">
              {podcastPage.highlightBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="最新单集"
            title="单集支持独立管理，摘要、平台链接、时长和节目笔记都能在后台维护。"
          />
          <div className="podcast-grid">
            {episodes.map((episode) => (
              <article className="podcast-card" key={episode._id}>
                <div className="article-meta">
                  <span>{episode.episodeCode}</span>
                  <span>{formatDate(episode.releasedAt)}</span>
                </div>
                <h3>{episode.title}</h3>
                <p>{episode.summary}</p>
                <div className="podcast-meta">
                  <span>{episode.duration}</span>
                  {episode.guest ? <span>{episode.guest}</span> : null}
                </div>
                <div className="link-cluster">
                  {episode.platformLinks.map((item) => (
                    <a href={item.href} key={item.label} rel="noreferrer" target="_blank">
                      {item.label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
