import type { ReactNode } from "react";

type EditorialPageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  aside?: ReactNode;
};

export function EditorialPageHero({ eyebrow, title, intro, aside }: EditorialPageHeroProps) {
  return (
    <section className="editorial-page-hero">
      <div className="container editorial-page-hero-inner">
        <div className="editorial-page-hero-copy">
          <p className="editorial-eyebrow">{eyebrow}</p>
          <h1 className="editorial-page-title">{title}</h1>
          <p className="editorial-page-intro">{intro}</p>
        </div>
        {aside ? <aside className="editorial-page-hero-aside">{aside}</aside> : null}
      </div>
    </section>
  );
}