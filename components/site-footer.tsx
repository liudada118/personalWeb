import Link from "next/link";

import type { SiteSettings } from "@/lib/types";

type SiteFooterProps = {
  settings: SiteSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="container footer-lead">
        <div>
          <p className="eyebrow">Tiger Legal</p>
          <h2 className="footer-title" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
            把官网、内容、案例与联系动线组织成一套克制、沉稳、可长期维护的表达系统。
          </h2>
          <p className="footer-description">{settings.footerNote}</p>
        </div>
        <div className="footer-cta-group">
          <Link className="footer-cta" href="/contact">
            发起联系
          </Link>
        </div>
      </div>
      <div className="container footer-grid">
        <div className="footer-column">
          <span className="footer-label">联系</span>
          <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
          <a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a>
          <p>{settings.address}</p>
        </div>
        <div className="footer-column">
          <span className="footer-label">导航</span>
          {settings.navItems.map((item) => (
            <Link href={item.href} key={`${item.label}-${item.href}`}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="footer-column">
          <span className="footer-label">订阅</span>
          {settings.socialLinks.map((item) => (
            <a href={item.href} key={item.platform} rel="noreferrer" target="_blank">
              {item.label}
            </a>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">
        <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          &copy; {new Date().getFullYear()} Tiger Legal. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
