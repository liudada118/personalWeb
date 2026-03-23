import { redirect } from "next/navigation";

export default function CmsPreviewRedirectPage() {
  redirect("/cms/admin/workbench");
}
