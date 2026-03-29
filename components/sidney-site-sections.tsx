import Link from "next/link";

import { RevealSection } from "@/components/reveal-section";
import { SectionTitle } from "@/components/section-title";
import { sidneySite, type SiteLink } from "@/lib/sidney-site";

function ActionLink({ item, className }: { item: SiteLink; className?: string }) {
  if (item.external) {
    return (
      <a className={className} href={item.href} rel="noreferrer" target="_blank">
        {item.label}
      </a>
    );
  }

  return (
    <Link className={className} href={item.href}>
      {item.label}
    </Link>
  );
}

export function SidneyPageHero({
  eyebrow,
  title,
  description,
  actions = [],
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: SiteLink[];
}) {
  return (
    <section className="sidney-page-hero">
      <div className="container">
        <RevealSection className="sidney-page-hero-shell">
          <p className="eyebrow reveal-item delay-1">{eyebrow}</p>
          <h1 className="sidney-page-title reveal-item delay-2">{title}</h1>
          <p className="sidney-page-intro reveal-item delay-3">{description}</p>
          {actions.length ? (
            <div className="sidney-inline-actions reveal-item delay-4">
              {actions.map((item) => (
                <ActionLink className="button-primary" item={item} key={`${item.href}-${item.label}`} />
              ))}
            </div>
          ) : null}
        </RevealSection>
      </div>
    </section>
  );
}

export function SidneyLogoBand() {
  return (
    <section className="sidney-logo-band">
      <div className="container">
        <RevealSection className="sidney-logo-shell">
          <p className="eyebrow reveal-item delay-1">Selected organizations</p>
          <div className="sidney-logo-grid reveal-item delay-2">
            {sidneySite.logos.map((logo) => (
              <span className="sidney-logo-pill" key={logo}>
                {logo}
              </span>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

export function SidneyInvitationBand() {
  return (
    <section className="sidney-invitation">
      <div className="container">
        <RevealSection className="sidney-invitation-shell">
          <SectionTitle
            eyebrow="Work with Sidney"
            title="Bring the conversation on safety, learning and accountability into your organization."
            description="Choose the format that fits the moment, from a keynote to a deeper advisory engagement."
          />
          <div className="sidney-inline-actions reveal-item delay-3">
            <Link className="button-primary" href="/contact">
              Get in touch
            </Link>
            <Link className="button-secondary" href="/work-with-sidney">
              Explore the work
            </Link>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

export function SidneyFooterLinks() {
  return (
    <div className="sidney-footer-meta">
      {sidneySite.footerLinks.map((item) => (
        <ActionLink className="sidney-text-link" item={item} key={`${item.href}-${item.label}`} />
      ))}
    </div>
  );
}
