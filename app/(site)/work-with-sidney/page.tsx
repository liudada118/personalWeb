import { RevealSection } from "@/components/reveal-section";
import { SidneyInvitationBand, SidneyPageHero } from "@/components/sidney-site-sections";
import { sidneySite } from "@/lib/sidney-site";

export const metadata = {
  title: "Work with Sidney",
};

export default function WorkWithSidneyPage() {
  return (
    <>
      <SidneyPageHero
        actions={[{ label: "Contact", href: "/contact" }]}
        description={sidneySite.work.summary}
        eyebrow="Work with Sidney"
        title={sidneySite.work.title}
      />

      <section className="sidney-service-section">
        <div className="container">
          <RevealSection className="sidney-service-grid">
            {sidneySite.work.services.map((service, index) => (
              <article className={`sidney-service-card reveal-item delay-${(index % 4) + 1}`} key={service.title}>
                <img alt={service.title} src={service.image} />
                <div className="sidney-service-copy">
                  <span>{service.eyebrow}</span>
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                </div>
              </article>
            ))}
          </RevealSection>
        </div>
      </section>

      <section className="sidney-copy-section">
        <div className="container">
          <RevealSection className="sidney-two-column">
            <div className="section-heading reveal-item delay-1">
              <p className="eyebrow">How the work lands</p>
              <h2>Designed for organizations that want meaningful change in how safety and accountability are understood.</h2>
            </div>
            <aside className="sidney-side-panel reveal-item delay-3">
              <ul className="simple-list">
                {sidneySite.work.principles.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </RevealSection>
        </div>
      </section>

      <SidneyInvitationBand />
    </>
  );
}
