import Link from "next/link";
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
      <section className="editorial-page-hero">
        <div className="container editorial-page-hero-inner">
          <div className="editorial-page-hero-copy">
            <p className="editorial-eyebrow">{caseStudy.category}</p>
            <h1 className="editorial-page-title">{caseStudy.title}</h1>
            <p className="editorial-page-intro">{caseStudy.summary}</p>
          </div>
          <aside className="editorial-page-hero-aside">
            <div className="editorial-page-hero-note">
              <span>{caseStudy.year}</span>
              <ul className="editorial-simple-list compact">
                {caseStudy.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="editorial-section">
        <div className="container editorial-case-layout">
          <div className="editorial-case-copy">
            {caseStudy.detail.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="editorial-case-actions">
            <Link className="editorial-button editorial-button-secondary" href="/about">
              返回个人介绍
            </Link>
            <Link className="editorial-button editorial-button-primary" href="/contact">
              发起联系
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}