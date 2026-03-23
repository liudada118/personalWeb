import { LiveWorkbench } from "@/components/studio/live-workbench";
import { requirePayloadAdminUser } from "@/lib/payload/admin-session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "编辑预览台",
};

export default async function PayloadAdminWorkbenchPage() {
  await requirePayloadAdminUser();

  return <LiveWorkbench />;
}
