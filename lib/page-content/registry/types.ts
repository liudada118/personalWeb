import type { PageContentFieldType, PageContentValue } from "@/lib/types";

export type EditablePageId = "home" | "about" | "mediaPage" | "podcastPage" | "contactPage";

export type EditableFieldDefinition = {
  defaultValue: PageContentValue;
  description?: string;
  key: string;
  label: string;
  page: EditablePageId;
  placeholder?: string;
  section: string;
  type: PageContentFieldType;
};

export type EditablePageDefinition = {
  description: string;
  fields: EditableFieldDefinition[];
  id: EditablePageId;
  route: string;
  title: string;
};
