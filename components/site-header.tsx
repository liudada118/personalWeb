"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./site-chrome.module.css";

import type { SiteSettings } from "@/lib/types";

type SiteHeaderProps = {
  settings: SiteSettings;
};

const homeNavItems = [
  { href: "/about", label: "About" },
  { href: "/about#awards", label: "Awards" },
  { href: "/about#events", label: "Event" },
  { href: "/media", label: "Media" },
  { href: "/podcast", label: "Podcast" },
  { href: "/contact", label: "Contact" },
];

const homeUtilityLinks = [
  { href: "https://example.com/rednote", label: "hs", platform: "Xiaohongshu" },
  { href: "https://example.com/zhihu", label: "zh", platform: "Zhihu" },
  { href: "https://www.linkedin.com", label: "in", platform: "LinkedIn" },
];

export function SiteHeader({ settings }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const brandTitle = isHome ? settings.shortTitle || settings.siteTitle : settings.siteTitle;

  useEffect(() => {
    const onScroll = () => {
      const threshold = isHome ? 88 : 24;
      setScrolled(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  if (isHome) {
    const headerClassName = scrolled ? `${styles.homeHeader} ${styles.homeHeaderScrolled}` : styles.homeHeader;

    return (
      <header className={headerClassName}>
        <div className={styles.homeHeaderInner}>
          <Link className={styles.homeBrand} href="/">
            <span className={styles.homeBrandPrimary}>DENNIS</span>
            <span className={styles.homeBrandSlash}>/ yuxuan</span>
            <span className={styles.homeBrandPrimary}>LIU</span>
          </Link>
          <nav aria-label="Primary navigation" className={styles.homeNav}>
            {homeNavItems.map((item) => {
              const isActive = pathname === item.href || pathname === item.href.split("#")[0];
              const linkClassName = isActive ? `${styles.homeNavLink} ${styles.homeNavLinkActive}` : styles.homeNavLink;

              return (
                <Link className={linkClassName} href={item.href} key={`${item.label}-${item.href}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className={styles.homeHeaderActions}>
            <div className={styles.homeSocials}>
              {homeUtilityLinks.map((item, index) => {
                const shapeClassName =
                  index < 2 ? `${styles.homeSocialLink} ${styles.homeSocialLinkDiamond}` : `${styles.homeSocialLink} ${styles.homeSocialLinkRound}`;

                return (
                  <Link
                    aria-label={item.platform}
                    className={shapeClassName}
                    href={item.href}
                    key={`${item.platform}-${item.href}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <Link className={styles.homeHeaderCta} href="https://tigerpartners.cn" rel="noreferrer" target="_blank">
              TIGERPARTNERS.CN
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header-inner">
        <Link className="brand-lockup" href="/">
          <span className="brand-mark">{settings.logoText}</span>
          <div className="brand-copy">
            <strong>{brandTitle}</strong>
            <small>{settings.siteTagline}</small>
          </div>
        </Link>
        <nav aria-label="Primary navigation" className="site-nav">
          {settings.navItems.map((item) => (
            <Link href={item.href} key={`${item.label}-${item.href}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="header-cta" href="/contact">
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
