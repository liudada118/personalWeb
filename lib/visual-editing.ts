export const VISUAL_EDITOR_QUERY_PARAM = "visualEditor";
export const VISUAL_EDITOR_MESSAGE_SOURCE = "tiger-legal-visual-editor";

type VisualEditorBaseTarget = {
  adminHref: string;
  label: string;
  previewHref: string;
};

export type VisualEditorFieldTarget = VisualEditorBaseTarget & {
  fieldPath: string;
  collectionSlug?: string;
  documentId?: string;
  globalSlug?: string;
};

export type VisualEditorTarget = VisualEditorBaseTarget;
export type VisualEditorSelectionTarget = VisualEditorTarget | VisualEditorFieldTarget;

export type VisualEditorMessage = {
  source: typeof VISUAL_EDITOR_MESSAGE_SOURCE;
  target: VisualEditorSelectionTarget;
  type: "open-target" | "select-field" | "refresh-preview";
};

function isBaseTarget(value: unknown): value is VisualEditorBaseTarget {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<VisualEditorBaseTarget>;

  return (
    typeof candidate.adminHref === "string" &&
    typeof candidate.label === "string" &&
    typeof candidate.previewHref === "string"
  );
}

export function isVisualEditorFieldTarget(value: unknown): value is VisualEditorFieldTarget {
  if (!isBaseTarget(value)) {
    return false;
  }

  const candidate = value as Partial<VisualEditorFieldTarget>;
  const hasGlobalTarget = typeof candidate.globalSlug === "string";
  const hasCollectionTarget =
    typeof candidate.collectionSlug === "string" && typeof candidate.documentId === "string";

  return typeof candidate.fieldPath === "string" && (hasGlobalTarget || hasCollectionTarget);
}

export function isVisualEditorMessage(value: unknown): value is VisualEditorMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<VisualEditorMessage>;

  return (
    candidate.source === VISUAL_EDITOR_MESSAGE_SOURCE &&
    (candidate.type === "open-target" || candidate.type === "select-field" || candidate.type === "refresh-preview") &&
    isBaseTarget(candidate.target)
  );
}
