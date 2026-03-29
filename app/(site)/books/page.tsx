import Link from "next/link";

import { RevealSection } from "@/components/reveal-section";
import { SidneyInvitationBand, SidneyPageHero } from "@/components/sidney-site-sections";
import { sidneySite } from "@/lib/sidney-site";

export const metadata = {
  title: "Books",
};

export default function BooksPage() {
  return (
    <>
      <SidneyPageHero
        description="A selection of Sidney Dekker titles on safety, just culture, human error, resilience and organizational failure."
        eyebrow="Books"
        title="Books"
      />

      <section className="sidney-books-preview">
        <div className="container">
          <RevealSection className="sidney-books-preview-shell">
            <div className="sidney-book-grid sidney-book-grid-full">
              {sidneySite.books.map((book, index) => (
                <article className={`sidney-book-card reveal-item delay-${(index % 4) + 1}`} key={book.slug}>
                  <img alt={book.title} src={book.coverImage} />
                  <div className="sidney-book-copy">
                    <span>{book.tagline}</span>
                    <h3>{book.title}</h3>
                    <p>{book.summary}</p>
                    <Link href={`/${book.slug}`}>Read more</Link>
                  </div>
                </article>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <SidneyInvitationBand />
    </>
  );
}
