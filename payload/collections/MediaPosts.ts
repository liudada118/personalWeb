import type { CollectionConfig } from "payload";

import { collectionVersions, publicReadAccess } from "../shared";

export const MediaPosts: CollectionConfig = {
  slug: "mediaPosts",
  labels: {
    plural: "Media posts",
    singular: "Media post",
  },
  admin: {
    description: "Structured press, interview, feature, and public media entries.",
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "publication", "publishedAt", "featured"],
  },
  access: {
    read: publicReadAccess,
  },
  versions: collectionVersions,
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, unique: true },
    { name: "publication", label: "Publication", type: "text", required: true },
    { name: "publishedAt", label: "Published at", type: "date", required: true },
    { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
    { name: "category", label: "Category", type: "text", required: true },
    { name: "url", label: "External URL", type: "text", required: true },
    { name: "featured", label: "Featured", type: "checkbox", defaultValue: false },
    {
      name: "cover",
      label: "Cover image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "content",
      label: "Content",
      type: "richText",
    },
  ],
};
