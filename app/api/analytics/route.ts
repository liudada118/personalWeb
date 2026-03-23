import { NextResponse } from "next/server";

import { recordPageView } from "@/lib/server/admin";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { path?: string } | null;
  const path = body?.path?.trim();

  if (!path) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await recordPageView(path);

  return NextResponse.json({ ok: true });
}
