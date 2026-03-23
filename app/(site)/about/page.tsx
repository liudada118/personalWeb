import Link from "next/link";

import { SectionTitle } from "@/components/section-title";
import { getAboutPageData } from "@/lib/payload/api";

export const metadata = {
  title: "个人介绍",
};

export default async function AboutPage() {
  const { aboutPage, caseStudies } = await getAboutPageData();

  return (
    <>
      <section className="section page-masthead">
        <div className="container">
          <p className="eyebrow">个人介绍</p>
          <h1 className="page-title">{aboutPage.heroTitle}</h1>
          <p className="page-intro">{aboutPage.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container resume-grid">
          {aboutPage.resumeBlocks.map((block) => (
            <article className="content-panel" key={block.title}>
              <h2>{block.title}</h2>
              <ul className="simple-list">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container split-layout">
          <div className="body-copy">
            <SectionTitle eyebrow="虎诉介绍" title="官网与内容矩阵之间，需要一个中心叙事。" />
            {aboutPage.husuIntro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="body-copy">
            <SectionTitle eyebrow="新媒体简介" title="媒体平台是入口，官网负责沉淀和组织。" />
            {aboutPage.mediaIntro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-layout">
          <div>
            <SectionTitle eyebrow="获奖介绍" title="奖项信息以时间轴式卡片呈现，清晰但不过度炫示。" />
            <div className="timeline-panel">
              {aboutPage.awards.map((award) => (
                <article className="timeline-item timeline-wide" key={`${award.year}-${award.title}`}>
                  <span>{award.year}</span>
                  <div>
                    <strong>{award.title}</strong>
                    <p>{award.issuer}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div>
            <SectionTitle eyebrow="代表案例" title="个人介绍页顺带承接部分代表案例，帮助履历与项目形成连接。" />
            <div className="stack-grid">
              {caseStudies.slice(0, 3).map((item) => (
                <article className="list-card" key={item._id}>
                  <div className="list-card-meta">
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
        </div>
      </section>
    </>
  );
}
