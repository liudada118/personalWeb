import { NextResponse } from "next/server";

import { createContactSubmissionInPayload, storeContactSubmission } from "@/lib/server/admin";
import type { ContactSubmission } from "@/lib/types";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as Partial<ContactSubmission> | null;

  if (!payload?.name || !payload.email || !payload.reason || !payload.message) {
    return NextResponse.json(
      { ok: false, message: "请填写姓名、邮箱、来意和详细说明。" },
      { status: 400 },
    );
  }

  const submission: ContactSubmission = {
    name: payload.name.trim(),
    organization: payload.organization?.trim() || "",
    email: payload.email.trim(),
    phone: payload.phone?.trim() || "",
    reason: payload.reason.trim(),
    message: payload.message.trim(),
    createdAt: new Date().toISOString(),
  };

  const wroteToPayload = await createContactSubmissionInPayload(submission);

  if (!wroteToPayload) {
    await storeContactSubmission(submission);
  }

  return NextResponse.json({
    ok: true,
    message: "提交成功，我们会尽快与你联系。",
  });
}
