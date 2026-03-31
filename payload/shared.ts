import type { Field } from "payload";

export const publicReadAccess = () => true;

export const collectionVersions = {
  drafts: {
    autosave: true,
  },
  maxPerDoc: 50,
} as const;

export const globalVersions = {
  drafts: {
    autosave: true,
  },
  max: 50,
} as const;

export const pageContentFieldTypes = ["text", "textarea", "richtext", "image", "link", "boolean"] as const;

export type PageContentFieldType = (typeof pageContentFieldTypes)[number];

export const primitiveItemsField = (name: string, label: string): Field => ({
  name,
  label,
  type: "array",
  fields: [
    {
      name: "value",
      label: `${label} item`,
      type: "text",
      required: true,
    },
  ],
});

export const linkArrayField = (name: string, label: string, includePlatform = false): Field => ({
  name,
  label,
  type: "array",
  fields: [
    ...(includePlatform
      ? [
          {
            name: "platform",
            label: "Platform",
            type: "text",
            required: true,
          } satisfies Field,
        ]
      : []),
    {
      name: "label",
      label: "Label",
      type: "text",
      required: true,
    },
    {
      name: "href",
      label: "Href",
      type: "text",
      required: true,
    },
  ],
});

export function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function buildPageContentDocKey(fieldKey: string, locale: string) {
  return `${locale}:${fieldKey}`;
}

export function isValidPageContentValue(type: string, value: unknown) {
  switch (type) {
    case "text":
    case "textarea":
      return typeof value === "string";
    case "richtext":
      return typeof value === "string" || Array.isArray(value) || isRecord(value);
    case "boolean":
      return typeof value === "boolean";
    case "link":
      return isRecord(value) && typeof value.label === "string" && typeof value.href === "string";
    case "image":
      return (
        isRecord(value) &&
        (typeof value.mediaId === "string" || typeof value.mediaId === "number") &&
        (value.alt === undefined || typeof value.alt === "string")
      );
    default:
      return false;
  }
}
