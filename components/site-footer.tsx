import { SidneyFooterLinks } from "@/components/sidney-site-sections";
import { sidneySite } from "@/lib/sidney-site";

export function SiteFooter() {
  return (
    <footer className="sidney-footer">
      <div className="container sidney-footer-shell">
        <div className="sidney-footer-copy">
          <img alt="Sidney Dekker" className="sidney-footer-logo" src={sidneySite.brand.logo} />
          <p>{sidneySite.brand.tagline}</p>
        </div>
        <SidneyFooterLinks />
        <div className="sidney-footer-social">
          {sidneySite.social.map((item) => (
            <a href={item.href} key={item.href} rel="noreferrer" target="_blank">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
