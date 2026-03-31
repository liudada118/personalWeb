import type { GlobalConfig } from "payload";

import { globalVersions, primitiveItemsField, publicReadAccess } from "../shared";

export const AboutPage: GlobalConfig = {
  slug: "aboutPage",
  admin: {
    description: "Legacy singleton About page content kept during the transition to pageContent.",
    group: "Legacy page globals",
  },
  label: "About page (legacy)",
  versions: globalVersions,
  access: {
    read: publicReadAccess,
  },
  fields: [
    { name: "heroTitle", label: "Title", type: "textarea", required: true },
    { name: "intro", label: "Intro", type: "textarea", required: true },
    {
      name: "resumeBlocks",
      label: "Resume blocks",
      type: "array",
      fields: [
        { name: "title", label: "Title", type: "text", required: true },
        primitiveItemsField("items", "Items"),
      ],
    },
    primitiveItemsField("husuIntro", "Husu intro"),
    primitiveItemsField("mediaIntro", "Media intro"),
    {
      name: "awards",
      label: "Awards",
      type: "array",
      fields: [
        { name: "year", label: "Year", type: "text", required: true },
        { name: "title", label: "Title", type: "text", required: true },
        { name: "issuer", label: "Issuer", type: "text", required: true },
      ],
    },
  ],
};
