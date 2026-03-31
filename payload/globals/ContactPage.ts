import type { GlobalConfig } from "payload";

import { globalVersions, linkArrayField, primitiveItemsField, publicReadAccess } from "../shared";

export const ContactPage: GlobalConfig = {
  slug: "contactPage",
  admin: {
    description: "Legacy singleton Contact page content kept during the transition to pageContent.",
    group: "Legacy page globals",
  },
  label: "Contact page (legacy)",
  versions: globalVersions,
  access: {
    read: publicReadAccess,
  },
  fields: [
    { name: "heroTitle", label: "Title", type: "textarea", required: true },
    { name: "intro", label: "Intro", type: "textarea", required: true },
    { name: "formNote", label: "Form note", type: "textarea", required: true },
    primitiveItemsField("reasons", "Reasons"),
    linkArrayField("subscriptionLinks", "Subscription links"),
  ],
};
