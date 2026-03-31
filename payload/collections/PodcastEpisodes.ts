import type { CollectionConfig } from "payload";

import { collectionVersions, linkArrayField, publicReadAccess } from "../shared";

export const PodcastEpisodes: CollectionConfig = {
  slug: "podcastEpisodes",
  labels: {
    plural: "Podcast episodes",
    singular: "Podcast episode",
  },
  admin: {
    description: "Structured Tiger Legal Talks episode records.",
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "episodeCode", "releasedAt", "featured"],
  },
  access: {
    read: publicReadAccess,
  },
  versions: collectionVersions,
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, unique: true },
    { name: "episodeCode", label: "Episode code", type: "text", required: true },
    { name: "releasedAt", label: "Released at", type: "date", required: true },
    { name: "duration", label: "Duration", type: "text", required: true },
    { name: "guest", label: "Guest", type: "text" },
    { name: "summary", label: "Summary", type: "textarea", required: true },
    { name: "featured", label: "Featured", type: "checkbox", defaultValue: false },
    linkArrayField("platformLinks", "Platform links"),
    {
      name: "cover",
      label: "Cover image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "showNotes",
      label: "Show notes",
      type: "richText",
    },
  ],
};
