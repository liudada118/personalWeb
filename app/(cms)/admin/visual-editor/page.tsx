import { VisualEditorShell } from "./_components/visual-editor-shell";

import { getEditablePageById } from "@/lib/page-content/registry";
import { requirePayloadAdminUser } from "@/lib/payload/admin-session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Visual Editor",
};

type VisualEditorPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function VisualEditorPage({ searchParams }: VisualEditorPageProps) {
  await requirePayloadAdminUser();

  const { page } = await searchParams;
  const initialPage = getEditablePageById(page);

  return <VisualEditorShell initialPageId={initialPage.id} />;
}
