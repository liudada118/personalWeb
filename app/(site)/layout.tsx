import type { Metadata } from "next";

import "../globals.css";

import { AnalyticsTracker } from "@/components/analytics-tracker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/payload/api";
import { isPreviewRequestEnabled } from "@/lib/payload/preview";

export const metadata: Metadata = {
  title: {
    default: "虎诉 Tiger Legal",
    template: "%s | 虎诉 Tiger Legal",
  },
  description: "Next.js + Payload CMS 构建的个人官网与内容运营后台。",
};

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const isPreview = await isPreviewRequestEnabled();

  return (
    <html lang="zh-CN">
      <body>
        <div className="site-frame">
          <AnalyticsTracker />
          {isPreview ? <div className="site-preview-badge">草稿预览中</div> : null}
          <SiteHeader settings={settings} />
          <main className="main-content">{children}</main>
          <SiteFooter settings={settings} />
        </div>
      </body>
    </html>
  );
}
