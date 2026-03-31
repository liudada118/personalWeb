import type { CollectionConfig } from "payload";

import {
  buildPageContentDocKey,
  collectionVersions,
  isValidPageContentValue,
  pageContentFieldTypes,
  publicReadAccess,
} from "../shared";

export const PageContent: CollectionConfig = {
  slug: "pageContent",
  labels: {
    plural: "Page content",
    singular: "Page content item",
  },
  admin: {
    description: "Generic fixed-page field storage for the custom Visual Editor.",
    group: "Visual editor",
    useAsTitle: "fieldKey",
    defaultColumns: ["page", "fieldKey", "type", "locale", "updatedAt"],
  },
  access: {
    read: publicReadAccess,
  },
  versions: collectionVersions,
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) {
          return data;
        }

        const page = typeof data.page === "string" ? data.page.trim() : "";
        const fieldKey = typeof data.fieldKey === "string" ? data.fieldKey.trim() : "";
        const type = typeof data.type === "string" ? data.type.trim() : "";
        const locale = typeof data.locale === "string" && data.locale.trim() ? data.locale.trim() : "zh";

        if (page) {
          data.page = page;
        }

        if (fieldKey) {
          data.fieldKey = fieldKey;
          data.docKey = buildPageContentDocKey(fieldKey, locale);
        }

        if (locale) {
          data.locale = locale;
        }

        if (type && !pageContentFieldTypes.includes(type as (typeof pageContentFieldTypes)[number])) {
          throw new Error(`Unsupported pageContent type: ${type}`);
        }

        if (type && data.value !== undefined && !isValidPageContentValue(type, data.value)) {
          throw new Error(`Value does not match pageContent type "${type}".`);
        }

        return data;
      },
    ],
  },
  fields: [
    {
      name: "docKey",
      label: "Document key",
      type: "text",
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "page",
      label: "Page",
      type: "text",
      required: true,
    },
    {
      name: "fieldKey",
      label: "Field key",
      type: "text",
      required: true,
    },
    {
      name: "type",
      label: "Field type",
      type: "select",
      required: true,
      options: pageContentFieldTypes.map((value) => ({
        label: value,
        value,
      })),
    },
    {
      name: "locale",
      label: "Locale",
      type: "text",
      required: true,
      defaultValue: "zh",
    },
    {
      name: "value",
      label: "Value",
      type: "json",
      required: true,
    },
  ],
};
