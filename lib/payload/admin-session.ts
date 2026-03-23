import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getPayloadClient } from "@/lib/payload/client";

export async function requirePayloadAdminUser() {
  const payload = await getPayloadClient();
  const requestHeaders = new Headers(await headers());
  const auth = await payload.auth({
    headers: requestHeaders,
  });

  if (!auth.user) {
    redirect("/cms/admin");
  }

  return auth.user;
}
