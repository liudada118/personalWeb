import type { Metadata } from "next";

import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "虎诉 Tiger Legal",
    template: "%s | 虎诉 Tiger Legal",
  },
  description: "Next.js + Payload CMS 构建的个人官网与内容运营后台。",
};

export default function CmsRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
