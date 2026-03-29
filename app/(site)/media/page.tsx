import { SectionTitle } from "@/components/section-title";
import { VisualEditRegion } from "@/components/visual-edit-region";
import { VisualEditableText } from "@/components/visual-editable-text";
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
            <h1 className="page-title">
              <VisualEditableText
                adminHref="/cms/admin/globals/mediaPage"
                fieldPath="heroTitle"
                globalSlug="mediaPage"
                label="Media hero title"
                multiline
                previewHref="/media"
                value={mediaPage.heroTitle}
              />
            </h1>
            <p className="page-intro">
              <VisualEditableText
                adminHref="/cms/admin/globals/mediaPage"
                fieldPath="intro"
                globalSlug="mediaPage"
                label="Media intro"
                multiline
                previewHref="/media"
                value={mediaPage.intro}
              />
            </p>
          </div>
        </VisualEditRegion>
      </section>

      <section className="section">
        <div className="container">
          <VisualEditRegion adminHref="/cms/admin/globals/mediaPage" label="媒体页说明区" previewHref="/media">
            <SectionTitle
              eyebrow="代表作品"
              title="各个平台的媒体露出都集中在这里，支持直接在预览中改标题和摘要。"
            />
          </VisualEditRegion>

          <VisualEditRegion adminHref="/cms/admin/collections/mediaArticles" label="媒体文章列表" previewHref="/media">
            <div className="media-grid">
              {articles.map((article) => (
                <article className="article-card" key={article._id}>
                  <div className="article-meta">
                    <span>
                      <VisualEditableText
                        adminHref="/cms/admin/collections/mediaArticles"
                        collectionSlug="mediaArticles"
                        documentId={article._id}
                        fieldPath="category"
                        label="Media article category"
                        previewHref="/media"
                        value={article.category}
                      />
                    </span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <h3>
                    <VisualEditableText
                      adminHref="/cms/admin/collections/mediaArticles"
                      collectionSlug="mediaArticles"
                      documentId={article._id}
                      fieldPath="title"
                      label="Media article title"
                      previewHref="/media"
                      value={article.title}
                    />
                  </h3>
                  <p>
                    <VisualEditableText
                      adminHref="/cms/admin/collections/mediaArticles"
                      collectionSlug="mediaArticles"
                      documentId={article._id}
                      fieldPath="excerpt"
                      label="Media article excerpt"
                      multiline
                      previewHref="/media"
                      value={article.excerpt}
                    />
                  </p>
                  <div className="article-footer">
                    <span>
                      <VisualEditableText
                        adminHref="/cms/admin/collections/mediaArticles"
                        collectionSlug="mediaArticles"
                        documentId={article._id}
                        fieldPath="publication"
                        label="Media article publication"
                        previewHref="/media"
                        value={article.publication}
                      />
                    </span>
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
