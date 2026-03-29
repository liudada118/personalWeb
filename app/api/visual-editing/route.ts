import { NextResponse } from "next/server";

import { getPayloadClient } from "@/lib/payload/client";
import {
  isVisualEditorField,
  sanitizeVisualHtml,
  type VisualEditorCollectionField,
  type VisualEditorField,
  type VisualEditorGlobalField,
  type VisualEditorSaveRequest,
} from "@/lib/visual-editing";

export const dynamic = "force-dynamic";

type PayloadDocument = Record<string, unknown>;

function cloneValue<T>(value: T): T {
  return value === undefined ? value : JSON.parse(JSON.stringify(value)) as T;
}

function toPathSegment(value: string) {
  return /^\d+$/.test(value) ? Number(value) : value;
}

function isGlobalField(field: VisualEditorField): field is VisualEditorGlobalField {
  return typeof field.globalSlug === "string";
}

function isCollectionField(field: VisualEditorField): field is VisualEditorCollectionField {
  return typeof field.collectionSlug === "string" && typeof field.documentId === "string";
}

function setNestedValue(target: unknown, segments: Array<number | string>, value: unknown): unknown {
  if (segments.length === 0) {
    return value;
  }

  const [head, ...tail] = segments;
  const isIndex = typeof head === "number";
  const container =
    target !== null && target !== undefined
      ? cloneValue(target)
      : isIndex
        ? []
        : {};

  if (Array.isArray(container)) {
    const arrayContainer = container as unknown[];
    const index = typeof head === "number" ? head : Number(head);
    const nextValue = arrayContainer[index];
    arrayContainer[index] = setNestedValue(nextValue, tail, value);
    return arrayContainer;
  }

  if (typeof container === "object") {
    const nextValue = (container as PayloadDocument)[String(head)];
    (container as PayloadDocument)[String(head)] = setNestedValue(nextValue, tail, value);
    return container;
  }

  if (isIndex) {
    const fallback: unknown[] = [];
    fallback[head] = setNestedValue(undefined, tail, value);
    return fallback;
  }

  return {
    [String(head)]: setNestedValue(undefined, tail, value),
  };
}

function buildTopLevelPatch(document: PayloadDocument, fieldPath: string, value: string) {
  const [topLevel, ...rest] = fieldPath.split(".");

  if (!topLevel) {
    throw new Error("Missing field path.");
  }

  if (rest.length === 0) {
    return {
      [topLevel]: value,
    };
  }

  const nestedSegments = rest.map(toPathSegment);

  return {
    [topLevel]: setNestedValue(document[topLevel], nestedSegments, value),
  };
}

async function requireAdmin(request: Request) {
  const payload = await getPayloadClient();
  const auth = await payload.auth({
    headers: request.headers,
  });

  if (!auth.user) {
    return null;
  }

  return payload;
}

async function readDraftDocument(payload: Awaited<ReturnType<typeof getPayloadClient>>, field: VisualEditorField) {
  if (isGlobalField(field)) {
    return (await payload.findGlobal({
      depth: 0,
      draft: true,
      overrideAccess: true,
      slug: field.globalSlug,
    })) as PayloadDocument;
  }

  if (!isCollectionField(field)) {
    throw new Error("Invalid collection field.");
  }

  return (await payload.findByID({
    collection: field.collectionSlug,
    depth: 0,
    draft: true,
    id: field.documentId,
    overrideAccess: true,
  })) as PayloadDocument;
}

async function writeDraftDocument(
  payload: Awaited<ReturnType<typeof getPayloadClient>>,
  field: VisualEditorField,
  data: PayloadDocument,
) {
  if (isGlobalField(field)) {
    await payload.updateGlobal({
      data,
      draft: true,
      overrideAccess: true,
      slug: field.globalSlug,
    });

    return;
  }

  if (!isCollectionField(field)) {
    throw new Error("Invalid collection field.");
  }

  await payload.update({
    collection: field.collectionSlug,
    data,
    draft: true,
    id: field.documentId,
    overrideAccess: true,
  });
}

export async function POST(request: Request) {
  const payload = await requireAdmin(request);

  if (!payload) {
    return NextResponse.json(
      {
        message: "Please sign in to Payload admin before editing preview text.",
      },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => null)) as VisualEditorSaveRequest | null;

  if (!body || !isVisualEditorField(body.field) || typeof body.value !== "string") {
    return NextResponse.json(
      {
        message: "Invalid visual editing payload.",
      },
      { status: 400 },
    );
  }

  const sanitizedValue = sanitizeVisualHtml(body.value, { multiline: body.field.multiline });

  try {
    const document = await readDraftDocument(payload, body.field);
    const patch = buildTopLevelPatch(document, body.field.fieldPath, sanitizedValue);

    await writeDraftDocument(payload, body.field, patch);

    return NextResponse.json({
      ok: true,
      savedValue: sanitizedValue,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unable to save visual edit.",
      },
      { status: 500 },
    );
  }
}
