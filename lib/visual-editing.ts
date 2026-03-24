export const VISUAL_EDITOR_QUERY_PARAM = "visualEditor";
export const VISUAL_EDITOR_MESSAGE_SOURCE = "tiger-legal-visual-editor";

export type VisualEditorTarget = {
  adminHref: string;
  label: string;
  previewHref: string;
};

export type VisualEditorMessage = {
  source: typeof VISUAL_EDITOR_MESSAGE_SOURCE;
  target: VisualEditorTarget;
  type: "open-target";
};

export function isVisualEditorMessage(value: unknown): value is VisualEditorMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<VisualEditorMessage>;

  return (
    candidate.source === VISUAL_EDITOR_MESSAGE_SOURCE &&
    candidate.type === "open-target" &&
    !!candidate.target &&
    typeof candidate.target.adminHref === "string" &&
    typeof candidate.target.label === "string" &&
    typeof candidate.target.previewHref === "string"
  );
}
