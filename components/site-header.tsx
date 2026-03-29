"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { sidneySite } from "@/lib/sidney-site";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sidney-header${isHome ? " is-home" : ""}${scrolled ? " is-scrolled" : ""}`}>
      <div className="container sidney-header-shell">
        <Link aria-label="Sidney Dekker home" className="sidney-brand" href="/">
          <img alt="Sidney Dekker" className="sidney-brand-logo" src={sidneySite.brand.logo} />
        </Link>
        <nav aria-label="Primary navigation" className="sidney-nav">
          {sidneySite.nav.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={active ? "is-active" : undefined}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link className="sidney-header-cta" href="/contact">
          Contact
        </Link>
      </div>
    </header>
  );
}
