export const VISUAL_EDITOR_QUERY_PARAM = "visualEditor";
export const VISUAL_EDITOR_MESSAGE_SOURCE = "tiger-legal-visual-editor";
export const VISUAL_EDITOR_API_ROUTE = "/api/visual-editing";

export type VisualEditorTarget = {
  adminHref: string;
  label: string;
  previewHref: string;
};

type VisualEditorFieldBase = VisualEditorTarget & {
  fieldPath: string;
  multiline?: boolean;
};

export type VisualEditorGlobalField = VisualEditorFieldBase & {
  collectionSlug?: never;
  documentId?: never;
  globalSlug: string;
};

export type VisualEditorCollectionField = VisualEditorFieldBase & {
  collectionSlug: string;
  documentId: string;
  globalSlug?: never;
};

export type VisualEditorField = VisualEditorGlobalField | VisualEditorCollectionField;

export type VisualEditorSaveRequest = {
  field: VisualEditorField;
  value: string;
};

type VisualEditorOpenTargetMessage = {
  source: typeof VISUAL_EDITOR_MESSAGE_SOURCE;
  target: VisualEditorTarget;
  type: "open-target";
};

type VisualEditorEditingStateMessage = {
  active: boolean;
  source: typeof VISUAL_EDITOR_MESSAGE_SOURCE;
  target?: VisualEditorTarget;
  type: "editing-state";
};

export type VisualEditorMessage = VisualEditorOpenTargetMessage | VisualEditorEditingStateMessage;

function isVisualEditorTarget(value: unknown): value is VisualEditorTarget {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<VisualEditorTarget>;

  return (
    typeof candidate.adminHref === "string" &&
    typeof candidate.label === "string" &&
    typeof candidate.previewHref === "string"
  );
}

export function isVisualEditorField(value: unknown): value is VisualEditorField {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<VisualEditorField> & Partial<VisualEditorTarget>;

  if (
    typeof candidate.adminHref !== "string" ||
    typeof candidate.label !== "string" ||
    typeof candidate.previewHref !== "string" ||
    typeof candidate.fieldPath !== "string" ||
    (candidate.multiline !== undefined && typeof candidate.multiline !== "boolean")
  ) {
    return false;
  }

  const isGlobalField =
    typeof candidate.globalSlug === "string" &&
    candidate.collectionSlug === undefined &&
    candidate.documentId === undefined;
  const isCollectionField =
    candidate.globalSlug === undefined &&
    typeof candidate.collectionSlug === "string" &&
    typeof candidate.documentId === "string";

  return isGlobalField || isCollectionField;
}

export function isVisualEditorMessage(value: unknown): value is VisualEditorMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<VisualEditorMessage>;

  if (candidate.source !== VISUAL_EDITOR_MESSAGE_SOURCE) {
    return false;
  }

  if (candidate.type === "open-target") {
    return isVisualEditorTarget(candidate.target);
  }

  if (candidate.type === "editing-state") {
    return typeof candidate.active === "boolean" && (candidate.target === undefined || isVisualEditorTarget(candidate.target));
  }

  return false;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeHref(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^(https?:|mailto:|tel:|\/|#)/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function normalizeTextNodes(value: string, multiline: boolean) {
  const normalizedWhitespace = value.replace(/\r\n?/g, "\n").replace(/\u00a0/g, " ");

  return multiline
    ? normalizedWhitespace.replace(/\n/g, "<br>")
    : normalizedWhitespace.replace(/\s+/g, " ");
}

export function sanitizeVisualHtml(value: string, options?: { multiline?: boolean }) {
  const multiline = options?.multiline ?? false;
  const normalized = value
    .replace(/\r\n?/g, "\n")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\1\s*>/gi, "")
    .replace(/<\s*br\s*\/?>/gi, "<br>")
    .replace(/<\/?(div|p|section|article|header|footer|blockquote|li|ul|ol|h[1-6])[^>]*>/gi, "\n");

  const withAllowedTags = normalized.replace(/<([^>]+)>/g, (match, rawTag) => {
    const content = String(rawTag).trim();
    const isClosing = content.startsWith("/");
    const tagName = (isClosing ? content.slice(1) : content).split(/\s+/)[0]?.toLowerCase();

    if (!tagName) {
      return "";
    }

    if (tagName === "br") {
      return multiline ? "<br>" : " ";
    }

    if (tagName === "b" || tagName === "strong") {
      return isClosing ? "</strong>" : "<strong>";
    }

    if (tagName === "i" || tagName === "em") {
      return isClosing ? "</em>" : "<em>";
    }

    if (tagName === "a") {
      if (isClosing) {
        return "</a>";
      }

      const hrefMatch = content.match(/\bhref\s*=\s*(['"])(.*?)\1/i) ?? content.match(/\bhref\s*=\s*([^\s>]+)/i);
      const hrefValue = normalizeHref(hrefMatch?.[2] ?? hrefMatch?.[1] ?? "");

      return hrefValue ? `<a href="${escapeHtml(hrefValue)}">` : "";
    }

    return "";
  });

  const collapsed = multiline
    ? withAllowedTags
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\n/g, "<br>")
        .replace(/(?:<br>\s*){3,}/g, "<br><br>")
    : withAllowedTags.replace(/\n+/g, " ");

  return collapsed.trim();
}

export function renderVisualValue(value: string, options?: { multiline?: boolean }) {
  const multiline = options?.multiline ?? false;
  const normalizedValue = value ?? "";

  if (!normalizedValue) {
    return "";
  }

  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(normalizedValue);

  if (looksLikeHtml) {
    return sanitizeVisualHtml(normalizedValue, { multiline });
  }

  return normalizeTextNodes(escapeHtml(normalizedValue), multiline);
}
