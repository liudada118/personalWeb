import type { GlobalConfig } from "payload";

import { globalVersions, linkArrayField, primitiveItemsField, publicReadAccess } from "../shared";

export const PodcastPage: GlobalConfig = {
  slug: "podcastPage",
  admin: {
    description: "Legacy singleton Podcast page content kept during the transition to pageContent.",
    group: "Legacy page globals",
  },
  label: "Podcast page (legacy)",
  versions: globalVersions,
  access: {
    read: publicReadAccess,
  },
  fields: [
    { name: "heroTitle", label: "Title", type: "textarea", required: true },
    { name: "intro", label: "Intro", type: "textarea", required: true },
    primitiveItemsField("showDescription", "Show description"),
    linkArrayField("platformLinks", "Platform links"),
    primitiveItemsField("highlightBullets", "Highlight bullets"),
  ],
};
