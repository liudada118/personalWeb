import { notFound } from "next/navigation";

import { VisualEditRegion } from "@/components/visual-edit-region";
import { VisualEditableText } from "@/components/visual-editable-text";
import { getCaseStudyBySlug } from "@/lib/payload/api";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  return {
    title: caseStudy?.title ?? "案例",
  };
}

export default async function CasePage({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <>
      <section className="section page-masthead">
        <VisualEditRegion adminHref="/cms/admin/collections/caseStudies" label="案例详情首屏" previewHref={`/cases/${slug}`}>
          <div className="container detail-hero">
            <div>
              <p className="eyebrow">
                <VisualEditableText
                  adminHref="/cms/admin/collections/caseStudies"
                  collectionSlug="caseStudies"
                  documentId={caseStudy._id}
                  fieldPath="category"
                  label="Case category"
                  previewHref={`/cases/${slug}`}
                  value={caseStudy.category}
                />
              </p>
              <h1 className="page-title">
                <VisualEditableText
                  adminHref="/cms/admin/collections/caseStudies"
                  collectionSlug="caseStudies"
                  documentId={caseStudy._id}
                  fieldPath="title"
                  label="Case title"
                  previewHref={`/cases/${slug}`}
                  value={caseStudy.title}
                />
              </h1>
              <p className="page-intro">
                <VisualEditableText
                  adminHref="/cms/admin/collections/caseStudies"
                  collectionSlug="caseStudies"
                  documentId={caseStudy._id}
                  fieldPath="summary"
                  label="Case summary"
                  multiline
                  previewHref={`/cases/${slug}`}
                  value={caseStudy.summary}
                />
              </p>
            </div>
            <div className="detail-panel">
              <span>
                <VisualEditableText
                  adminHref="/cms/admin/collections/caseStudies"
                  collectionSlug="caseStudies"
                  documentId={caseStudy._id}
                  fieldPath="year"
                  label="Case year"
                  previewHref={`/cases/${slug}`}
                  value={caseStudy.year}
                />
              </span>
              <ul className="simple-list compact-list">
                {caseStudy.highlights.map((item, index) => (
                  <li key={`${index}-${item.slice(0, 12)}`}>
                    <VisualEditableText
                      adminHref="/cms/admin/collections/caseStudies"
                      collectionSlug="caseStudies"
                      documentId={caseStudy._id}
                      fieldPath={`highlights.${index}.value`}
                      label={`Case highlight ${index + 1}`}
                      previewHref={`/cases/${slug}`}
                      value={item}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </VisualEditRegion>
      </section>

      <section className="section">
        <div className="container detail-layout">
          <VisualEditRegion adminHref="/cms/admin/collections/caseStudies" label="案例详情正文" previewHref={`/cases/${slug}`}>
            <div className="detail-copy">
              {caseStudy.detail.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 12)}`}>
                  <VisualEditableText
                    adminHref="/cms/admin/collections/caseStudies"
                    collectionSlug="caseStudies"
                    documentId={caseStudy._id}
                    fieldPath={`detail.${index}.value`}
                    label={`Case detail paragraph ${index + 1}`}
                    multiline
                    previewHref={`/cases/${slug}`}
                    value={paragraph}
                  />
                </p>
              ))}
            </div>
          </VisualEditRegion>
        </div>
      </section>
    </>
  );
}
