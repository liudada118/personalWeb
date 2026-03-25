import Link from "next/link";

import type { SiteSettings } from "@/lib/types";

type SiteFooterProps = {
  settings: SiteSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  return (
    <footer className="editorial-footer">
      <div className="container editorial-footer-inner">
        <div className="editorial-footer-lead">
          <p className="editorial-eyebrow">Tiger Legal</p>
          <h2>
            把官网、内容、案例与联系入口，组织成一套稳定、克制、可长期积累的公共表达系统。
          </h2>
          <p>{settings.footerNote}</p>
        </div>

        <div className="editorial-footer-actions">
          <Link className="editorial-button editorial-button-primary" href="/contact">
            与我们讨论项目
          </Link>
        </div>

        <div className="editorial-footer-grid">
          <div>
            <span className="editorial-footer-label">联系</span>
            <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
            <a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a>
            <p>{settings.address}</p>
          </div>

          <div>
            <span className="editorial-footer-label">导航</span>
            {settings.navItems.map((item) => (
              <Link href={item.href} key={`${item.label}-${item.href}`}>
                {item.label}
              </Link>
            ))}
          </div>

          <div>
            <span className="editorial-footer-label">订阅与平台</span>
            {settings.socialLinks.map((item) => (
              <a href={item.href} key={item.platform} rel="noreferrer" target="_blank">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}