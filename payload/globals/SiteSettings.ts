import type { GlobalConfig } from "payload";

import { globalVersions, linkArrayField, publicReadAccess } from "../shared";

export const SiteSettings: GlobalConfig = {
  slug: "siteSettings",
  admin: {
    description: "Site-wide navigation, footer, and social profile settings.",
    group: "Site configuration",
  },
  label: "Site settings",
  versions: globalVersions,
  access: {
    read: publicReadAccess,
  },
  fields: [
    { name: "siteTitle", label: "Site title", type: "text", required: true },
    { name: "shortTitle", label: "Short title", type: "text", required: true },
    { name: "siteTagline", label: "Site tagline", type: "textarea", required: true },
    { name: "logoText", label: "Logo text", type: "text", required: true },
    linkArrayField("navItems", "Navigation links"),
    linkArrayField("socialLinks", "Social links", true),
    { name: "contactEmail", label: "Contact email", type: "email", required: true },
    { name: "contactPhone", label: "Contact phone", type: "text", required: true },
    { name: "address", label: "Address", type: "text", required: true },
    { name: "footerNote", label: "Footer note", type: "textarea", required: true },
  ],
};
