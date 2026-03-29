import type { Metadata } from "next";

import "../globals.css";
import "./site.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "Sidney Dekker",
    template: "%s | Sidney Dekker",
  },
  description:
    "Scholar, author and speaker focused on safety, just culture, resilience and human factors.",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="sidney-site-body">
        <div className="sidney-site-shell">
          <SiteHeader />
          <main className="sidney-main">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
