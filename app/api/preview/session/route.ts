import { NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload/client";
import { createPreviewToken } from "@/lib/payload/preview";

export const dynamic = "force-dynamic";

async function getAdminSession(request: Request) {
  const payload = await getPayloadClient();

  return payload.auth({
    headers: request.headers,
  });
}

export async function POST(request: Request) {
  const auth = await getAdminSession(request);

  if (!auth.user) {
    return NextResponse.json(
      {
        message: "请先登录 /cms/admin，再开启草稿预览。",
      },
      { status: 401 },
    );
  }

  const userRecord = auth.user as Record<string, unknown>;
  const subject = String(userRecord.id ?? userRecord.email ?? "payload-admin");
  const previewSession = createPreviewToken(subject);

  return NextResponse.json({
    enabled: true,
    expiresAt: previewSession.expiresAt,
    previewToken: previewSession.token,
  });
}

export async function DELETE() {
  return NextResponse.json({
    enabled: false,
  });
}
