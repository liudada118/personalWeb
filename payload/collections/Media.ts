import path from "node:path";

import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    plural: "Media",
    singular: "Media item",
  },
  admin: {
    description: "Shared uploaded assets for pages, media posts, podcast episodes, and articles.",
    group: "Content",
    useAsTitle: "alt",
    defaultColumns: ["filename", "mimeType", "updatedAt"],
  },
  upload: {
    staticDir: path.resolve(process.cwd(), "public", "media"),
    mimeTypes: ["image/*", "video/*", "application/pdf"],
  },
  fields: [
    {
      name: "alt",
      label: "Alt text",
      type: "text",
    },
    {
      name: "caption",
      label: "Caption",
      type: "textarea",
    },
  ],
};
