import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "虎诉 Tiger Legal",
    template: "%s | 虎诉 Tiger Legal",
  },
  description: "Legacy Studio redirect route.",
};

export default function StudioRootLayout({
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
