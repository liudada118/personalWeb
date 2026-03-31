import type { CollectionConfig } from "payload";

export const ContactSubmissions: CollectionConfig = {
  slug: "contactSubmissions",
  labels: {
    plural: "Contact submissions",
    singular: "Contact submission",
  },
  admin: {
    description: "Lead and contact records submitted from the public site.",
    group: "Leads",
    useAsTitle: "name",
    defaultColumns: ["name", "email", "reason", "createdAt"],
  },
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "organization", label: "Organization", type: "text" },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "text" },
    { name: "reason", label: "Reason", type: "text", required: true },
    { name: "message", label: "Message", type: "textarea", required: true },
    { name: "createdAt", label: "Created at", type: "date", required: true },
  ],
};
