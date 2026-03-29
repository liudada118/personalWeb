import { RevealSection } from "@/components/reveal-section";
import { SidneyInvitationBand, SidneyLogoBand, SidneyPageHero } from "@/components/sidney-site-sections";
import { sidneySite } from "@/lib/sidney-site";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <SidneyPageHero
        actions={[{ label: "Work with Sidney", href: "/work-with-sidney" }]}
        description={sidneySite.about.summary}
        eyebrow="About"
        title={sidneySite.about.title}
      />

      <section className="sidney-stats-section">
        <div className="container">
          <RevealSection className="sidney-stats-grid">
            {sidneySite.about.stats.map((stat, index) => (
              <article className={`sidney-stat-card reveal-item delay-${Math.min(index + 1, 4)}`} key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </RevealSection>
        </div>
      </section>

      <section className="sidney-copy-section">
        <div className="container">
          <RevealSection className="sidney-two-column">
            <div className="sidney-prose reveal-item delay-1">
              {sidneySite.about.biography.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <aside className="sidney-side-panel reveal-item delay-3">
              <p className="eyebrow">Highlights</p>
              <ul className="simple-list">
                {sidneySite.about.recognitions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </RevealSection>
        </div>
      </section>

      <SidneyLogoBand />
      <SidneyInvitationBand />
    </>
  );
}
