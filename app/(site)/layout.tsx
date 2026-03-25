import type { Metadata } from "next";

import "../globals.css";

import { AnalyticsTracker } from "@/components/analytics-tracker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VisualEditRegion } from "@/components/visual-edit-region";
import { getSiteSettings } from "@/lib/payload/api";
import { isPreviewRequestEnabled } from "@/lib/payload/preview";

export const metadata: Metadata = {
  title: {
    default: "虎诉 Tiger Legal",
    template: "%s | 虎诉 Tiger Legal",
  },
  description: "以 Next.js 与 Payload CMS 构建的个人官网与内容管理系统。",
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
        <div className="site-frame editorial-site">
          <AnalyticsTracker />
          {isPreview ? <div className="site-preview-badge">草稿预览中</div> : null}
          <VisualEditRegion adminHref="/cms/admin/globals/siteSettings" label="站点导航与品牌信息">
            <SiteHeader settings={settings} />
          </VisualEditRegion>
          <main className="main-content editorial-main">{children}</main>
          <VisualEditRegion adminHref="/cms/admin/globals/siteSettings" label="页脚与站点信息">
            <SiteFooter settings={settings} />
          </VisualEditRegion>
        </div>
      </body>
    </html>
  );
}