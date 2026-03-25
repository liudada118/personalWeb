"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { SiteSettings } from "@/lib/types";

type SiteHeaderProps = {
  settings: SiteSettings;
};

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
  }, []);

  return (
    <header className={`site-header${isHome ? " is-home" : ""}${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header-inner">
        <Link className="brand-lockup" href="/">
          {isHome ? null : <span className="brand-mark">{settings.logoText}</span>}
          <div className="brand-copy">
            <strong style={{ fontFamily: "var(--font-display)", fontStyle: "normal", letterSpacing: "-0.02em" }}>
              {brandTitle}
            </strong>
            {isHome ? null : <small>{settings.siteTagline}</small>}
          </div>
        </Link>
        <nav aria-label="Primary navigation" className="site-nav">
          {settings.navItems.map((item, index) => (
            <Link href={item.href} key={`${item.label}-${item.href}`} style={{ paddingLeft: "18px", paddingRight: "18px" }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="header-cta" href="/contact">
            联系
          </Link>
        </div>
      </div>
    </header>
  );
}
