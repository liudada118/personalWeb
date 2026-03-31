import type { CollectionConfig } from "payload";

import { collectionVersions, publicReadAccess } from "../shared";

export const Articles: CollectionConfig = {
  slug: "articles",
  labels: {
    plural: "Articles",
    singular: "Article",
  },
  admin: {
    description: "Structured long-form authored articles managed inside Payload.",
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "featured"],
  },
  access: {
    read: publicReadAccess,
  },
  versions: collectionVersions,
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, unique: true },
    { name: "publishedAt", label: "Published at", type: "date", required: true },
    { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
    { name: "category", label: "Category", type: "text", required: true },
    { name: "authorName", label: "Author name", type: "text" },
    { name: "readTime", label: "Read time", type: "text" },
    { name: "featured", label: "Featured", type: "checkbox", defaultValue: false },
    {
      name: "cover",
      label: "Cover image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "body",
      label: "Body",
      type: "richText",
      required: true,
    },
  ],
};
