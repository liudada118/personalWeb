import { RevealSection } from "@/components/reveal-section";
import { SidneyInvitationBand, SidneyPageHero } from "@/components/sidney-site-sections";
import { sidneySite } from "@/lib/sidney-site";

export const metadata = {
  title: "Films",
};

export default function FilmsPage() {
  return (
    <>
      <SidneyPageHero
        description="A compact set of film-led entry points into Sidney Dekker’s work on safety, accountability and resilience."
        eyebrow="Films"
        title="Films"
      />

      <section className="sidney-service-section">
        <div className="container">
          <RevealSection className="sidney-film-grid">
            {sidneySite.films.map((film, index) => (
              <article className={`sidney-service-card reveal-item delay-${(index % 4) + 1}`} key={film.title}>
                <img alt={film.title} src={film.image} />
                <div className="sidney-service-copy">
                  <h3>{film.title}</h3>
                  <p>{film.summary}</p>
                  <a href={film.href}>Explore related work</a>
                </div>
              </article>
            ))}
          </RevealSection>
        </div>
      </section>

      <SidneyInvitationBand />
    </>
  );
}
