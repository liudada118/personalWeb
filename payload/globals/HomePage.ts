import type { GlobalConfig } from "payload";

import { globalVersions, linkArrayField, publicReadAccess } from "../shared";

export const HomePage: GlobalConfig = {
  slug: "homePage",
  admin: {
    description: "Legacy singleton homepage content kept during the transition to pageContent.",
    group: "Legacy page globals",
  },
  label: "Homepage (legacy)",
  versions: globalVersions,
  access: {
    read: publicReadAccess,
  },
  fields: [
    { name: "heroEyebrow", label: "Hero eyebrow", type: "text", required: true },
    { name: "heroTitle", label: "Hero title", type: "textarea", required: true },
    { name: "heroIntro", label: "Hero intro", type: "textarea", required: true },
    { name: "heroQuote", label: "Hero quote", type: "textarea", required: true },
    { name: "heroSource", label: "Hero quote source", type: "text", required: true },
    {
      name: "heroSlides",
      label: "Hero slides",
      type: "array",
      fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text", required: true },
        { name: "title", label: "Title", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea", required: true },
        { name: "href", label: "Href", type: "text", required: true },
        {
          name: "image",
          label: "Image",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
    {
      name: "tigerLegalLink",
      label: "Primary CTA link",
      type: "group",
      fields: [
        { name: "label", label: "Label", type: "text", required: true },
        { name: "href", label: "Href", type: "text", required: true },
      ],
    },
    linkArrayField("platformLinks", "Platform links"),
    {
      name: "scheduleItems",
      label: "Schedule items",
      type: "array",
      fields: [
        { name: "date", label: "Date", type: "date", required: true },
        { name: "title", label: "Title", type: "text", required: true },
        { name: "venue", label: "Venue", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea", required: true },
        { name: "href", label: "Href", type: "text", required: true },
      ],
    },
    { name: "bioBlurb", label: "Bio blurb", type: "textarea", required: true },
    {
      name: "featuredCases",
      label: "Featured cases",
      type: "relationship",
      hasMany: true,
      relationTo: "caseStudies",
    },
    { name: "footerBannerTitle", label: "Footer banner title", type: "textarea", required: true },
    { name: "footerBannerText", label: "Footer banner text", type: "textarea", required: true },
    linkArrayField("footerBannerLinks", "Footer banner links"),
  ],
};
