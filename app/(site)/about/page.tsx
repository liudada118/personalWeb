import Link from "next/link";

import { EditorialPageHero } from "@/components/editorial-page-hero";
import { VisualEditRegion } from "@/components/visual-edit-region";
import { getAboutPageData } from "@/lib/payload/api";

export const metadata = {
  title: "个人介绍",
};

export default async function AboutPage() {
  const { aboutPage, caseStudies } = await getAboutPageData();

  return (
    <>
      <VisualEditRegion adminHref="/cms/admin/globals/aboutPage" label="个人介绍页首屏" previewHref="/about">
        <EditorialPageHero
          eyebrow="About"
          title={aboutPage.heroTitle}
          intro={aboutPage.intro}
          aside={
            <div className="editorial-page-hero-note">
              <span>Profile summary</span>
              <p>把履历、方法论、虎诉介绍与获奖信息组织为一条更像作者页而不是简历页的叙事线。</p>
            </div>
          }
        />
      </VisualEditRegion>

      <section className="editorial-section">
        <VisualEditRegion adminHref="/cms/admin/globals/aboutPage" label="个人介绍履历区" previewHref="/about">
          <div className="container editorial-card-grid editorial-card-grid-three">
            {aboutPage.resumeBlocks.map((block) => (
              <article className="editorial-work-card" key={block.title}>
                <div className="editorial-work-meta">
                  <span>Resume</span>
                </div>
                <h3>{block.title}</h3>
                <ul className="editorial-simple-list">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </VisualEditRegion>
      </section>

      <section className="editorial-section editorial-section-contrast">
        <VisualEditRegion adminHref="/cms/admin/globals/aboutPage" label="个人介绍叙事区" previewHref="/about">
          <div className="container editorial-split-copy-grid">
            <div className="editorial-section-copy">
              <p className="editorial-eyebrow">Tiger Legal</p>
              <h2>官网不是附属页面，而是内容矩阵的母体。</h2>
              {aboutPage.husuIntro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="editorial-section-copy">
              <p className="editorial-eyebrow">Media presence</p>
              <h2>新媒体平台承担触达，官网承担沉淀与组织。</h2>
              {aboutPage.mediaIntro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </VisualEditRegion>
      </section>

      <section className="editorial-section">
        <div className="container editorial-split-grid">
          <VisualEditRegion adminHref="/cms/admin/globals/aboutPage" label="个人介绍获奖区" previewHref="/about">
            <div className="editorial-stack-panel">
              <div className="editorial-section-copy compact">
                <p className="editorial-eyebrow">Recognition</p>
                <h2>奖项信息不堆砌，只作为判断力与持续输出的旁证。</h2>
              </div>
              <div className="editorial-timeline-list">
                {aboutPage.awards.map((item) => (
                  <article className="editorial-timeline-item" key={`${item.year}-${item.title}`}>
                    <span>{item.year}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.issuer}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </VisualEditRegion>

          <VisualEditRegion adminHref="/cms/admin/collections/caseStudies" label="个人介绍案例区" previewHref="/about">
            <div className="editorial-stack-panel contrast">
              <div className="editorial-section-copy compact">
                <p className="editorial-eyebrow">Representative cases</p>
                <h2>用少量案例把履历和真实工作连接起来。</h2>
              </div>
              <div className="editorial-list-stack">
                {caseStudies.slice(0, 3).map((item) => (
                  <article className="editorial-list-card" key={item._id}>
                    <div className="editorial-work-meta">
                      <span>{item.category}</span>
                      <span>{item.year}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <Link href={`/cases/${item.slug}`}>查看案例</Link>
                  </article>
                ))}
              </div>
            </div>
          </VisualEditRegion>
        </div>
      </section>
    </>
  );
}