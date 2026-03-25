"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { SiteSettings } from "@/lib/types";

type SiteHeaderProps = {
  settings: SiteSettings;
};

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ settings }: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`editorial-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container editorial-header-inner">
        <Link className="editorial-brand" href="/">
          <span className="editorial-brand-mark">{settings.logoText}</span>
          <span className="editorial-brand-copy">
            <strong>{settings.siteTitle}</strong>
            <small>{settings.siteTagline}</small>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="editorial-nav">
          {settings.navItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                className={`editorial-nav-link${active ? " is-active" : ""}`}
                href={item.href}
                key={`${item.label}-${item.href}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="editorial-header-cta-wrap">
          <Link className="editorial-button editorial-button-primary" href="/contact">
            发起联系
          </Link>
        </div>
      </div>
    </header>
  );
}