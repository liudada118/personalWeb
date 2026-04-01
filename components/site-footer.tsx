"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./site-chrome.module.css";

import type { SiteSettings } from "@/lib/types";

type SiteFooterProps = {
  settings: SiteSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <footer className={styles.homeFooter}>
        <div className={styles.homeFooterInner}>
          <div className={styles.homeFooterBrandBlock}>
            <Link className={styles.homeFooterBrand} href="/">
              <span>DENNIS</span>
              <span className={styles.homeFooterSlash}>/ yuxuan</span>
              <span>LIU</span>
            </Link>
            <div className={styles.homeFooterMeta}>
              <p>Brand videos.</p>
              <p>Contact information: {settings.contactPhone}</p>
            </div>
          </div>
          <div className={styles.homeFooterAction}>
            <div className={styles.homeFooterCrest}>
              <span className={styles.homeFooterCrestMark}>Tiger x Us</span>
              <span className={styles.homeFooterCrestSub}>TIGER PARTNERS</span>
            </div>
            <Link className={styles.homeFooterCta} href="https://tigerpartners.cn" rel="noreferrer" target="_blank">
              TIGERPARTNERS.CN
            </Link>
          </div>
        </div>
        <p className={styles.homeFooterNote}>COPYRIGHT © 2026 DENNIS YUXUAN LIU. ALL RIGHTS RESERVED.</p>
      </footer>
    );
  }

  return (
    <footer className="site-footer">
      <div className="container footer-lead">
        <div>
          <p className="eyebrow">Tiger Legal</p>
          <h2 className="footer-title">Build the website, content, cases, and contact flow into one steady long-term expression system.</h2>
          <p className="footer-description">{settings.footerNote}</p>
        </div>
        <div className="footer-cta-group">
          <Link className="footer-cta" href="/contact">
            Contact
          </Link>
        </div>
      </div>
      <div className="container footer-grid">
        <div className="footer-column">
          <span className="footer-label">Contact</span>
          <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
          <a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a>
          <p>{settings.address}</p>
        </div>
        <div className="footer-column">
          <span className="footer-label">Navigation</span>
          {settings.navItems.map((item) => (
            <Link href={item.href} key={`${item.label}-${item.href}`}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="footer-column">
          <span className="footer-label">Subscribe</span>
          {settings.socialLinks.map((item) => (
            <a href={item.href} key={item.platform} rel="noreferrer" target="_blank">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
