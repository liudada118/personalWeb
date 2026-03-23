import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";

import { PREVIEW_HEADER_NAME, PREVIEW_TOKEN_TTL_MS } from "@/lib/payload/preview-constants";

type PreviewTokenPayload = {
  exp: number;
  sub: string;
  v: 1;
};

function getPreviewSecret() {
  return process.env.PAYLOAD_SECRET || "tiger-legal-dev-secret";
}

function signValue(value: string) {
  return createHmac("sha256", getPreviewSecret()).update(value).digest("base64url");
}

export function createPreviewToken(subject: string) {
  const payload: PreviewTokenPayload = {
    exp: Date.now() + PREVIEW_TOKEN_TTL_MS,
    sub: subject,
    v: 1,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signValue(encodedPayload);

  return {
    token: `${encodedPayload}.${signature}`,
    expiresAt: new Date(payload.exp).toISOString(),
  };
}

export function verifyPreviewToken(token: string | null | undefined) {
  if (!token) {
    return false;
  }

  const [encodedPayload, providedSignature] = token.split(".");

  if (!encodedPayload || !providedSignature) {
    return false;
  }

  const expectedSignature = signValue(encodedPayload);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as Partial<PreviewTokenPayload>;

    return payload.v === 1 && typeof payload.exp === "number" && payload.exp > Date.now() && typeof payload.sub === "string";
  } catch {
    return false;
  }
}

export async function isPreviewRequestEnabled() {
  const requestHeaders = await headers();
  const previewToken = requestHeaders.get(PREVIEW_HEADER_NAME);
  const enabled = verifyPreviewToken(previewToken);

  if (enabled) {
    noStore();
  }

  return enabled;
}
