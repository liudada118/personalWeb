import { notFound } from "next/navigation";

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
        <div className="container detail-hero">
          <div>
            <p className="eyebrow">{caseStudy.category}</p>
            <h1 className="page-title">{caseStudy.title}</h1>
            <p className="page-intro">{caseStudy.summary}</p>
          </div>
          <div className="detail-panel">
            <span>{caseStudy.year}</span>
            <ul className="simple-list compact-list">
              {caseStudy.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container detail-layout">
          <div className="detail-copy">
            {caseStudy.detail.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
