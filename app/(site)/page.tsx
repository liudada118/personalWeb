import Link from "next/link";

import { RevealSection } from "@/components/reveal-section";
import { SidneyInvitationBand, SidneyLogoBand } from "@/components/sidney-site-sections";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { TextRevealSection } from "@/components/text-reveal-section";
import { sidneySite, getFeaturedBooks } from "@/lib/sidney-site";

export default function HomePage() {
  const featuredBooks = getFeaturedBooks();

  return (
    <>
      <section className="sidney-home-hero">
        <div className="sidney-home-hero-media">
          <img alt="Sidney Dekker speaking" src={sidneySite.home.heroImage} />
          <div className="sidney-home-hero-overlay" />
        </div>
        <div className="container sidney-home-hero-shell">
          <RevealSection className="sidney-home-hero-content">
            <p className="eyebrow reveal-item delay-1">Safety, resilience and just culture</p>
            <h1 className="sidney-home-title reveal-item delay-2">{sidneySite.home.heroTitle}</h1>
            <p className="sidney-home-summary reveal-item delay-3">{sidneySite.home.heroSummary}</p>
            <div className="sidney-inline-actions reveal-item delay-4">
              <Link className="button-primary" href={sidneySite.home.heroCta.href}>
                {sidneySite.home.heroCta.label}
              </Link>
              <Link className="button-secondary" href="/books">
                Explore books
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      <section className="sidney-stats-section">
        <div className="container">
          <RevealSection className="sidney-stats-grid">
            {sidneySite.home.stats.map((stat, index) => (
              <article className={`sidney-stat-card reveal-item delay-${Math.min(index + 1, 4)}`} key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </RevealSection>
        </div>
      </section>

      <TextRevealSection
        className="sidney-text-reveal"
        paragraphs={sidneySite.home.textReveal.paragraphs}
        title={sidneySite.home.textReveal.title}
      />

      <section className="sidney-feature-section">
        <div className="container">
          <RevealSection className="sidney-feature-shell">
            <div className="section-heading">
              <p className="eyebrow reveal-item delay-1">Featured work</p>
              <h2 className="reveal-item delay-2">Ideas, teaching and practice for organizations that want better questions than blame.</h2>
              <p className="section-description reveal-item delay-3">
                The public work spans books, films, keynotes and leadership conversations, all built around a more humane and more useful view of safety.
              </p>
            </div>
            <div className="sidney-feature-grid">
              {sidneySite.home.featuredAreas.map((feature, index) => (
                <article className={`sidney-feature-card reveal-item delay-${(index % 4) + 1}`} key={feature.title}>
                  <img alt={feature.title} src={feature.image} />
                  <div className="sidney-feature-copy">
                    <span>{feature.eyebrow}</span>
                    <h3>{feature.title}</h3>
                    <p>{feature.summary}</p>
                    <Link href={feature.href}>Read more</Link>
                  </div>
                </article>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <section className="sidney-about-preview">
        <div className="container">
          <RevealSection className="sidney-about-preview-shell">
            <div className="sidney-about-preview-copy">
              <p className="eyebrow reveal-item delay-1">About Sidney</p>
              <h2 className="reveal-item delay-2">{sidneySite.home.aboutTitle}</h2>
              <p className="section-description reveal-item delay-3">{sidneySite.home.aboutSummary}</p>
              <div className="sidney-inline-actions reveal-item delay-4">
                <Link className="button-secondary" href="/about">
                  Learn more
                </Link>
              </div>
            </div>
            <div className="sidney-about-preview-image reveal-item delay-3">
              <img alt="Sidney Dekker portrait" src={sidneySite.home.heroImage} />
            </div>
          </RevealSection>
        </div>
      </section>

      <SidneyLogoBand />

      <section className="sidney-books-preview">
        <div className="container">
          <RevealSection className="sidney-books-preview-shell">
            <div className="section-heading">
              <p className="eyebrow reveal-item delay-1">Books</p>
              <h2 className="reveal-item delay-2">Selected titles from a body of work that reshaped the conversation on safety and accountability.</h2>
            </div>
            <div className="sidney-book-grid">
              {featuredBooks.map((book, index) => (
                <article className={`sidney-book-card reveal-item delay-${(index % 4) + 1}`} key={book.slug}>
                  <img alt={book.title} src={book.coverImage} />
                  <div className="sidney-book-copy">
                    <h3>{book.title}</h3>
                    <p>{book.summary}</p>
                    <Link href={`/${book.slug}`}>Read more</Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="sidney-inline-actions reveal-item delay-4">
              <Link className="button-secondary" href="/books">
                View all books
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      <TestimonialsCarousel testimonials={sidneySite.home.quotes} />

      <SidneyInvitationBand />
    </>
  );
}
