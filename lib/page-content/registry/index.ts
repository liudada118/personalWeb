import { aboutPageDefinition } from "./about";
import { contactPageDefinition } from "./contact";
import { homePageDefinition } from "./home";
import { mediaPageDefinition } from "./media";
import { podcastPageDefinition } from "./podcast";
import type { EditableFieldDefinition, EditablePageDefinition, EditablePageId } from "./types";

export type { EditableFieldDefinition, EditablePageDefinition, EditablePageId } from "./types";

export const editablePages: EditablePageDefinition[] = [
  homePageDefinition,
  aboutPageDefinition,
  mediaPageDefinition,
  podcastPageDefinition,
  contactPageDefinition,
];

export function getEditablePageById(pageId: string | undefined) {
  return editablePages.find((page) => page.id === pageId) ?? editablePages[0];
}

export function getEditableFieldByKey(fieldKey: string | undefined) {
  if (!fieldKey) {
    return null;
  }

  for (const page of editablePages) {
    const match = page.fields.find((field) => field.key === fieldKey);

    if (match) {
      return match;
    }
  }

  return null;
}

export function listEditableFieldsByPage(pageId: EditablePageId) {
  return getEditablePageById(pageId)?.fields ?? [];
}
