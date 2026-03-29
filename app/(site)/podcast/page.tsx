import { SectionTitle } from "@/components/section-title";
import { VisualEditRegion } from "@/components/visual-edit-region";
import { VisualEditableText } from "@/components/visual-editable-text";
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
        <VisualEditRegion adminHref="/cms/admin/globals/podcastPage" label="播客页首屏" previewHref="/podcast">
          <div className="container">
            <p className="eyebrow">播客</p>
            <h1 className="page-title">
              <VisualEditableText
                adminHref="/cms/admin/globals/podcastPage"
                fieldPath="heroTitle"
                globalSlug="podcastPage"
                label="Podcast hero title"
                multiline
                previewHref="/podcast"
                value={podcastPage.heroTitle}
              />
            </h1>
            <p className="page-intro">
              <VisualEditableText
                adminHref="/cms/admin/globals/podcastPage"
                fieldPath="intro"
                globalSlug="podcastPage"
                label="Podcast intro"
                multiline
                previewHref="/podcast"
                value={podcastPage.intro}
              />
            </p>
          </div>
        </VisualEditRegion>
      </section>

      <section className="section">
        <div className="container split-layout">
          <VisualEditRegion adminHref="/cms/admin/globals/podcastPage" label="播客介绍模块" previewHref="/podcast">
            <div className="body-copy">
              <SectionTitle eyebrow="节目介绍" title="Tiger Legal Talks 的介绍文案支持直接在预览中改写。" />
              {podcastPage.showDescription.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 12)}`}>
                  <VisualEditableText
                    adminHref="/cms/admin/globals/podcastPage"
                    fieldPath={`showDescription.${index}.value`}
                    globalSlug="podcastPage"
                    label={`Podcast description ${index + 1}`}
                    multiline
                    previewHref="/podcast"
                    value={paragraph}
                  />
                </p>
              ))}
            </div>
          </VisualEditRegion>

          <VisualEditRegion adminHref="/cms/admin/globals/podcastPage" label="播客订阅与亮点模块" previewHref="/podcast">
            <aside className="content-panel">
              <h2>订阅平台</h2>
              <div className="link-cluster vertical">
                {podcastPage.platformLinks.map((item, index) => (
                  <a href={item.href} key={`${item.label}-${index}`} rel="noreferrer" target="_blank">
                    <VisualEditableText
                      adminHref="/cms/admin/globals/podcastPage"
                      fieldPath={`platformLinks.${index}.label`}
                      globalSlug="podcastPage"
                      label={`Podcast platform label ${index + 1}`}
                      previewHref="/podcast"
                      value={item.label}
                    />
                  </a>
                ))}
              </div>
              <ul className="simple-list">
                {podcastPage.highlightBullets.map((item, index) => (
                  <li key={`${index}-${item.slice(0, 12)}`}>
                    <VisualEditableText
                      adminHref="/cms/admin/globals/podcastPage"
                      fieldPath={`highlightBullets.${index}.value`}
                      globalSlug="podcastPage"
                      label={`Podcast highlight ${index + 1}`}
                      previewHref="/podcast"
                      value={item}
                    />
                  </li>
                ))}
              </ul>
            </aside>
          </VisualEditRegion>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <VisualEditRegion adminHref="/cms/admin/globals/podcastPage" label="播客页说明区" previewHref="/podcast">
            <SectionTitle eyebrow="最新单集" title="单集标题、摘要和时长都可以在预览里直接编辑。" />
          </VisualEditRegion>

          <VisualEditRegion adminHref="/cms/admin/collections/podcastEpisodes" label="播客单集列表" previewHref="/podcast">
            <div className="podcast-grid">
              {episodes.map((episode) => (
                <article className="podcast-card" key={episode._id}>
                  <div className="article-meta">
                    <span>{episode.episodeCode}</span>
                    <span>{formatDate(episode.releasedAt)}</span>
                  </div>
                  <h3>
                    <VisualEditableText
                      adminHref="/cms/admin/collections/podcastEpisodes"
                      collectionSlug="podcastEpisodes"
                      documentId={episode._id}
                      fieldPath="title"
                      label="Podcast episode title"
                      previewHref="/podcast"
                      value={episode.title}
                    />
                  </h3>
                  <p>
                    <VisualEditableText
                      adminHref="/cms/admin/collections/podcastEpisodes"
                      collectionSlug="podcastEpisodes"
                      documentId={episode._id}
                      fieldPath="summary"
                      label="Podcast episode summary"
                      multiline
                      previewHref="/podcast"
                      value={episode.summary}
                    />
                  </p>
                  <div className="podcast-meta">
                    <span>
                      <VisualEditableText
                        adminHref="/cms/admin/collections/podcastEpisodes"
                        collectionSlug="podcastEpisodes"
                        documentId={episode._id}
                        fieldPath="duration"
                        label="Podcast episode duration"
                        previewHref="/podcast"
                        value={episode.duration}
                      />
                    </span>
                    {episode.guest ? (
                      <span>
                        <VisualEditableText
                          adminHref="/cms/admin/collections/podcastEpisodes"
                          collectionSlug="podcastEpisodes"
                          documentId={episode._id}
                          fieldPath="guest"
                          label="Podcast episode guest"
                          previewHref="/podcast"
                          value={episode.guest}
                        />
                      </span>
                    ) : null}
                  </div>
                  <div className="link-cluster">
                    {episode.platformLinks.map((item, index) => (
                      <a href={item.href} key={`${item.label}-${index}`} rel="noreferrer" target="_blank">
                        <VisualEditableText
                          adminHref="/cms/admin/collections/podcastEpisodes"
                          collectionSlug="podcastEpisodes"
                          documentId={episode._id}
                          fieldPath={`platformLinks.${index}.label`}
                          label={`Podcast link label ${index + 1}`}
                          previewHref="/podcast"
                          value={item.label}
                        />
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </VisualEditRegion>
        </div>
      </section>
    </>
  );
}
