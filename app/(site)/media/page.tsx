import { SectionTitle } from "@/components/section-title";
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
      <section className="section page-masthead">
        <VisualEditRegion adminHref="/cms/admin/globals/mediaPage" label="媒体页首屏" previewHref="/media">
          <div className="container">
            <p className="eyebrow">媒体</p>
            <h1 className="page-title">{mediaPage.heroTitle}</h1>
            <p className="page-intro">{mediaPage.intro}</p>
          </div>
        </VisualEditRegion>
      </section>

      <section className="section">
        <div className="container">
          <VisualEditRegion adminHref="/cms/admin/globals/mediaPage" label="媒体页说明区" previewHref="/media">
            <SectionTitle
              eyebrow="代表作品"
              title="各大媒体的代表作统一沉淀到这一页，后台可以随时发布、编辑、删除和调整露出顺序。"
            />
          </VisualEditRegion>

          <VisualEditRegion adminHref="/cms/admin/collections/mediaArticles" label="媒体文章列表" previewHref="/media">
            <div className="media-grid">
              {articles.map((article) => (
                <article className="article-card" key={article._id}>
                  <div className="article-meta">
                    <span>{article.category}</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="article-footer">
                    <span>{article.publication}</span>
                    <a href={article.url} rel="noreferrer" target="_blank">
                      打开原文
                    </a>
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
