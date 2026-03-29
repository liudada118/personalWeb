import { NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload/client";

export const dynamic = "force-dynamic";

type UpdateVisualEditingBody = {
  collectionSlug?: string;
  documentId?: string;
  fieldPath?: string;
  globalSlug?: string;
  value?: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function cloneNode<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

function setNestedValue(target: Record<string, unknown>, fieldPath: string, value: string) {
  const segments = fieldPath.split(".").filter(Boolean);

  if (segments.length === 0) {
    throw new Error("Missing field path.");
  }

  let cursor: unknown = target;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    const nextSegment = segments[index + 1];
    const segmentIndex = Number(segment);
    const nextIsIndex = Number.isInteger(Number(nextSegment));

    if (Number.isInteger(segmentIndex)) {
      if (!Array.isArray(cursor)) {
        throw new Error(`Field path ${fieldPath} does not resolve to an array.`);
      }

      if (!cursor[segmentIndex]) {
        cursor[segmentIndex] = nextIsIndex ? [] : {};
      }

      cursor = cursor[segmentIndex];
      continue;
    }

    if (!isPlainObject(cursor)) {
      throw new Error(`Field path ${fieldPath} does not resolve to an object.`);
    }

    const existing = cursor[segment];

    if (existing === undefined || existing === null) {
      cursor[segment] = nextIsIndex ? [] : {};
    }

    cursor = cursor[segment];
  }

  const finalSegment = segments[segments.length - 1];
  const finalIndex = Number(finalSegment);

  if (Number.isInteger(finalIndex)) {
    if (!Array.isArray(cursor)) {
      throw new Error(`Field path ${fieldPath} does not resolve to an array.`);
    }

    cursor[finalIndex] = value;
    return;
  }

  if (!isPlainObject(cursor)) {
    throw new Error(`Field path ${fieldPath} does not resolve to an object.`);
  }

  cursor[finalSegment] = value;
}

function normalizeDocumentId(documentId: string) {
  return /^\d+$/.test(documentId) ? Number(documentId) : documentId;
}

function sanitizePayloadDoc(value: Record<string, unknown>) {
  const nextData = cloneNode(value);

  delete nextData.id;
  delete nextData.createdAt;
  delete nextData.updatedAt;

  return nextData;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as UpdateVisualEditingBody | null;
  const fieldPath = body?.fieldPath?.trim();
  const globalSlug = body?.globalSlug?.trim();
  const collectionSlug = body?.collectionSlug?.trim();
  const documentId = body?.documentId?.trim();
  const hasGlobalTarget = Boolean(globalSlug);
  const hasCollectionTarget = Boolean(collectionSlug && documentId);

  if (!fieldPath || typeof body?.value !== "string" || (hasGlobalTarget ? hasCollectionTarget : !hasCollectionTarget)) {
    return NextResponse.json({ message: "Invalid visual editing payload." }, { status: 400 });
  }

  const payload = await getPayloadClient();
  const auth = await payload.auth({
    headers: request.headers,
  });

  if (!auth.user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  if (globalSlug) {
    const current = await payload.findGlobal({
      slug: globalSlug,
      depth: 0,
      draft: true,
      overrideAccess: true,
    });

    const nextData = sanitizePayloadDoc(current as Record<string, unknown>);
    setNestedValue(nextData, fieldPath, body.value);

    const updated = await payload.updateGlobal({
      slug: globalSlug,
      data: nextData,
      draft: true,
      overrideAccess: true,
    });

    return NextResponse.json({
      ok: true,
      scope: "global",
      updatedAt: updated.updatedAt,
      value: body.value,
    });
  }

  const id = normalizeDocumentId(documentId as string);
  const current = (await payload.findByID({
    collection: collectionSlug as "caseStudies" | "mediaArticles" | "podcastEpisodes",
    id,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })) as Record<string, unknown>;

  const nextData = sanitizePayloadDoc(current);
  setNestedValue(nextData, fieldPath, body.value);

  const updated = await payload.update({
    collection: collectionSlug as "caseStudies" | "mediaArticles" | "podcastEpisodes",
    id,
    data: nextData,
    draft: true,
    overrideAccess: true,
  });

  return NextResponse.json({
    ok: true,
    documentId: String(updated.id ?? documentId),
    scope: "collection",
    updatedAt: updated.updatedAt,
    value: body.value,
  });
}
