import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Redirect",
  description: "Legacy /studio route now redirects to Payload Admin.",
};

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
