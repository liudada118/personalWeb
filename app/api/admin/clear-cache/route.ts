import { NextResponse } from "next/server";

import { clearManagedCaches } from "@/lib/server/admin";

export async function POST() {
  const result = await clearManagedCaches();
  return NextResponse.json({ ok: true, ...result });
}
