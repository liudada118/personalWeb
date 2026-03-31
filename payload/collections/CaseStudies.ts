import type { CollectionConfig } from "payload";

import { collectionVersions, primitiveItemsField, publicReadAccess } from "../shared";

export const CaseStudies: CollectionConfig = {
  slug: "caseStudies",
  labels: {
    plural: "Case studies",
    singular: "Case study",
  },
  admin: {
    description: "Structured case study records for repeatable editorial and marketing surfaces.",
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "category", "year", "updatedAt"],
  },
  access: {
    read: publicReadAccess,
  },
  versions: collectionVersions,
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, unique: true },
    { name: "category", label: "Category", type: "text", required: true },
    { name: "year", label: "Year", type: "text", required: true },
    { name: "summary", label: "Summary", type: "textarea", required: true },
    primitiveItemsField("highlights", "Highlights"),
    primitiveItemsField("detail", "Detail"),
    {
      name: "image",
      label: "Cover image",
      type: "upload",
      relationTo: "media",
    },
  ],
};
