import { RevealSection } from "@/components/reveal-section";
import { SidneyInvitationBand, SidneyLogoBand, SidneyPageHero } from "@/components/sidney-site-sections";
import { sidneySite } from "@/lib/sidney-site";

export const metadata = {
  title: "Motivational Speaking",
};

export default function MotivationalSpeakingPage() {
  return (
    <>
      <SidneyPageHero
        actions={[{ label: "Book an enquiry", href: "/contact" }]}
        description={sidneySite.motivationalSpeaking.summary}
        eyebrow="Motivational speaking"
        title={sidneySite.motivationalSpeaking.title}
      />

      <section className="sidney-stats-section">
        <div className="container">
          <RevealSection className="sidney-stats-grid sidney-stats-grid-three">
            {sidneySite.motivationalSpeaking.stats.map((stat, index) => (
              <article className={`sidney-stat-card reveal-item delay-${index + 1}`} key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </RevealSection>
        </div>
      </section>

      <SidneyLogoBand />

      <section className="sidney-copy-section">
        <div className="container">
          <RevealSection className="sidney-two-column">
            <div className="section-heading reveal-item delay-1">
              <p className="eyebrow">Popular focus areas</p>
              <h2>Keynotes built for leaders who need sharper language around performance, failure and care.</h2>
            </div>
            <aside className="sidney-side-panel reveal-item delay-3">
              <ul className="simple-list">
                {sidneySite.motivationalSpeaking.focusAreas.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </RevealSection>
        </div>
      </section>

      <section className="sidney-quote-section">
        <div className="container">
          <RevealSection className="sidney-quote-card">
            <blockquote className="reveal-item delay-1">{sidneySite.motivationalSpeaking.quote.quote}</blockquote>
            <p className="reveal-item delay-2">{sidneySite.motivationalSpeaking.quote.author}</p>
          </RevealSection>
        </div>
      </section>

      <SidneyInvitationBand />
    </>
  );
}
