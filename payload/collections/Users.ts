import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    plural: "Admin Users",
    singular: "Admin User",
  },
  admin: {
    description: "Accounts that can log into Payload Admin.",
    group: "System",
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    {
      name: "displayName",
      label: "Display name",
      type: "text",
    },
  ],
};
