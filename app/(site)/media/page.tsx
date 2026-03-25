import { EditorialPageHero } from "@/components/editorial-page-hero";
import { VisualEditRegion } from "@/components/visual-edit-region";
import { getMediaPageData } from "@/lib/payload/api";

export const metadata = {
  title: "媒体",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export default async function MediaPage() {
  const { mediaPage, articles } = await getMediaPageData();

  return (
    <>
      <VisualEditRegion adminHref="/cms/admin/globals/mediaPage" label="媒体页首屏" previewHref="/media">
        <EditorialPageHero
          eyebrow="Media"
          title={mediaPage.heroTitle}
          intro={mediaPage.intro}
          aside={
            <div className="editorial-page-hero-note">
              <span>Editorial archive</span>
              <p>把媒体代表作做成清晰、可回看的长期档案，而不是一次性曝光列表。</p>
            </div>
          }
        />
      </VisualEditRegion>

      <section className="editorial-section">
        <VisualEditRegion adminHref="/cms/admin/collections/mediaArticles" label="媒体文章列表" previewHref="/media">
          <div className="container editorial-article-stream">
            {articles.map((article) => (
              <article className="editorial-article-row" key={article._id}>
                <div className="editorial-article-meta">
                  <span>{article.publication}</span>
                  <span>{formatDate(article.publishedAt)}</span>
                  <span>{article.category}</span>
                </div>
                <div className="editorial-article-copy">
                  <h2>{article.title}</h2>
                  <p>{article.excerpt}</p>
                </div>
                <div className="editorial-article-action">
                  <a href={article.url} rel="noreferrer" target="_blank">
                    打开原文
                  </a>
                </div>
              </article>
            ))}
          </div>
        </VisualEditRegion>
      </section>
    </>
  );
}