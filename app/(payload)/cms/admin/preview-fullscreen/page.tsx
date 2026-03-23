import { FullscreenPreview } from "@/components/studio/fullscreen-preview";
import { requirePayloadAdminUser } from "@/lib/payload/admin-session";
import { previewRoutes } from "@/lib/payload/preview-routes";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "全屏预览",
};

type PayloadAdminFullscreenPreviewPageProps = {
  searchParams: Promise<{
    target?: string;
  }>;
};

function resolvePreviewRoute(target?: string) {
  const allowedRoutes = new Set(previewRoutes.map((route) => route.href));
  return target && allowedRoutes.has(target) ? target : "/";
}

export default async function PayloadAdminFullscreenPreviewPage({
  searchParams,
}: PayloadAdminFullscreenPreviewPageProps) {
  await requirePayloadAdminUser();

  const { target } = await searchParams;

  return <FullscreenPreview initialRoute={resolvePreviewRoute(target)} />;
}
