import type { GlobalConfig } from "payload";

import { globalVersions, publicReadAccess } from "../shared";

export const MediaPage: GlobalConfig = {
  slug: "mediaPage",
  admin: {
    description: "Legacy singleton Media page content kept during the transition to pageContent.",
    group: "Legacy page globals",
  },
  label: "Media page (legacy)",
  versions: globalVersions,
  access: {
    read: publicReadAccess,
  },
  fields: [
    { name: "heroTitle", label: "Title", type: "textarea", required: true },
    { name: "intro", label: "Intro", type: "textarea", required: true },
  ],
};
