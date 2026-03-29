"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { sidneySite } from "@/lib/sidney-site";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${pathname === "/" ? " is-home" : ""}${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header-inner">
        <Link aria-label="Sidney Dekker home" className="brand-lockup" href="/">
          <div className="brand-mark">SD</div>
          <div className="brand-copy">
            <strong>{sidneySite.brand.title}</strong>
            <small>{sidneySite.brand.tagline}</small>
          </div>
        </Link>
        <nav aria-label="Primary navigation" className="site-nav">
          {sidneySite.nav.map((item) => {
            const active = pathname === item.href;

            return (
              <Link className={active ? "is-active" : undefined} href={item.href} key={item.href}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link className="header-cta" href="/contact">
          Contact
        </Link>
      </div>
    </header>
  );
}
