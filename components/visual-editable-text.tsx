"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { withBasePath } from "@/lib/site-paths";
import {
  isVisualEditorFieldTarget,
  VISUAL_EDITOR_MESSAGE_SOURCE,
  VISUAL_EDITOR_QUERY_PARAM,
  type VisualEditorFieldTarget,
} from "@/lib/visual-editing";

type VisualEditableBaseProps = {
  adminHref: string;
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "li" | "td" | "th" | "blockquote" | "figcaption";
  className?: string;
  fieldPath: string;
  label: string;
  multiline?: boolean;
  previewHref?: string;
  value: string;
};

type GlobalVisualEditableProps = VisualEditableBaseProps & {
  collectionSlug?: never;
  documentId?: never;
  globalSlug: string;
};

type CollectionVisualEditableProps = VisualEditableBaseProps & {
  collectionSlug: string;
  documentId: string;
  globalSlug?: never;
};

type VisualEditableTextProps = GlobalVisualEditableProps | CollectionVisualEditableProps;

type ToolbarPosition = {
  left: number;
  mode: "element" | "selection";
  top: number;
  visible: boolean;
};

type VisualEditingUpdateEventDetail = {
  collectionSlug?: string;
  documentId?: string;
  fieldPath: string;
  globalSlug?: string;
  value: string;
};

const hiddenToolbar: ToolbarPosition = {
  left: 0,
  mode: "element",
  top: 0,
  visible: false,
};

function isSameFieldTarget(
  target: VisualEditorFieldTarget,
  fieldPath: string,
  globalSlug?: string,
  collectionSlug?: string,
  documentId?: string,
) {
  if (target.fieldPath !== fieldPath) {
    return false;
  }

  if (globalSlug) {
    return target.globalSlug === globalSlug;
  }

  return target.collectionSlug === collectionSlug && target.documentId === documentId;
}

export function VisualEditableText(props: VisualEditableTextProps) {
  const {
    adminHref,
    as = "span",
    className,
    fieldPath,
    label,
    multiline = false,
    previewHref,
    value,
  } = props;
  const collectionSlug = "collectionSlug" in props ? props.collectionSlug : undefined;
  const documentId = "documentId" in props ? props.documentId : undefined;
  const globalSlug = "globalSlug" in props ? props.globalSlug : undefined;
  const searchParams = useSearchParams();
  const visualEditorEnabled = searchParams.get(VISUAL_EDITOR_QUERY_PARAM) === "1";
  const [draftValue, setDraftValue] = useState(value);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"" | "error" | "saved">("");
  const [toolbarPosition, setToolbarPosition] = useState<ToolbarPosition>(hiddenToolbar);
  const ref = useRef<HTMLElement | null>(null);
  const latestValueRef = useRef(value);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = (as ?? "span") as any;

  useEffect(() => {
    latestValueRef.current = value;
    setDraftValue(value);

    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value]);

  const target = useMemo<VisualEditorFieldTarget>(
    () => ({
      adminHref,
      collectionSlug,
      documentId,
      fieldPath,
      globalSlug,
      label,
      previewHref: previewHref || (typeof window === "undefined" ? "/" : window.location.pathname),
    }),
    [adminHref, collectionSlug, documentId, fieldPath, globalSlug, label, previewHref],
  );

  useEffect(() => {
    if (!visualEditorEnabled) {
      return;
    }

    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) {
        return;
      }

      const message = event.data;

      if (
        !message ||
        typeof message !== "object" ||
        message.source !== VISUAL_EDITOR_MESSAGE_SOURCE ||
        message.type !== "select-field" ||
        !isVisualEditorFieldTarget(message.target) ||
        !isSameFieldTarget(message.target, fieldPath, globalSlug, collectionSlug, documentId)
      ) {
        return;
      }

      ref.current?.focus();
      document.getSelection()?.selectAllChildren(ref.current as Node);
    }

    function handleVisualUpdate(event: Event) {
      const detail = (event as CustomEvent<VisualEditingUpdateEventDetail>).detail;

      if (
        !detail ||
        !isSameFieldTarget(
          {
            adminHref,
            collectionSlug: detail.collectionSlug,
            documentId: detail.documentId,
            fieldPath: detail.fieldPath,
            globalSlug: detail.globalSlug,
            label,
            previewHref: target.previewHref,
          },
          fieldPath,
          globalSlug,
          collectionSlug,
          documentId,
        )
      ) {
        return;
      }

      latestValueRef.current = detail.value;
      setDraftValue(detail.value);

      if (ref.current && ref.current.textContent !== detail.value) {
        ref.current.textContent = detail.value;
      }
    }

    window.addEventListener("message", handleMessage);
    window.addEventListener("visual-editing:updated", handleVisualUpdate as EventListener);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("visual-editing:updated", handleVisualUpdate as EventListener);
    };
  }, [adminHref, collectionSlug, documentId, fieldPath, globalSlug, label, target.previewHref, visualEditorEnabled]);

  useEffect(() => {
    if (!visualEditorEnabled) {
      setToolbarPosition(hiddenToolbar);
      return;
    }

    function updateToolbarPosition() {
      const node = ref.current;

      if (!node || (!focused && !hovered)) {
        setToolbarPosition(hiddenToolbar);
        return;
      }

      const selection = document.getSelection();
      const hasSelection =
        focused &&
        selection &&
        !selection.isCollapsed &&
        node.contains(selection.anchorNode) &&
        node.contains(selection.focusNode) &&
        selection.rangeCount > 0;

      if (hasSelection) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (rect.width || rect.height) {
          setToolbarPosition({
            left: rect.left + rect.width / 2,
            mode: "selection",
            top: rect.top - 14,
            visible: true,
          });
          return;
        }
      }

      const rect = node.getBoundingClientRect();

      setToolbarPosition({
        left: rect.left + Math.min(rect.width / 2, 160),
        mode: "element",
        top: rect.top - 14,
        visible: true,
      });
    }

    updateToolbarPosition();

    window.addEventListener("resize", updateToolbarPosition);
    document.addEventListener("selectionchange", updateToolbarPosition);

    return () => {
      window.removeEventListener("resize", updateToolbarPosition);
      document.removeEventListener("selectionchange", updateToolbarPosition);
    };
  }, [focused, hovered, visualEditorEnabled]);

  async function save(nextValue: string) {
    if (nextValue === latestValueRef.current) {
      setStatus("");
      return;
    }

    setSaving(true);
    setStatus("");

    try {
      const response = await fetch(withBasePath("/api/visual-editing"), {
        body: JSON.stringify({
          collectionSlug,
          documentId,
          fieldPath,
          globalSlug,
          value: nextValue,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to save changes.");
      }

      latestValueRef.current = nextValue;
      setStatus("saved");
      window.parent?.postMessage(
        {
          source: VISUAL_EDITOR_MESSAGE_SOURCE,
          target,
          type: "refresh-preview",
        },
        window.location.origin,
      );
      window.dispatchEvent(
        new CustomEvent<VisualEditingUpdateEventDetail>("visual-editing:updated", {
          detail: {
            collectionSlug,
            documentId,
            fieldPath,
            globalSlug,
            value: nextValue,
          },
        }),
      );
    } catch {
      setStatus("error");
      setDraftValue(latestValueRef.current);

      if (ref.current) {
        ref.current.textContent = latestValueRef.current;
      }
    } finally {
      setSaving(false);
    }
  }

  function handleInput(event: React.FormEvent<HTMLElement>) {
    setDraftValue(event.currentTarget.textContent ?? "");
  }

  function handleFocus() {
    setFocused(true);
    setStatus("");
    window.parent?.postMessage(
      {
        source: VISUAL_EDITOR_MESSAGE_SOURCE,
        target,
        type: "select-field",
      },
      window.location.origin,
    );
  }

  async function handleBlur(event: React.FocusEvent<HTMLElement>) {
    setFocused(false);
    const nextValue = (event.currentTarget.textContent ?? "").trim();
    setDraftValue(nextValue);
    await save(nextValue);
  }

  function handleCancel() {
    setDraftValue(latestValueRef.current);
    setStatus("");

    if (ref.current) {
      ref.current.textContent = latestValueRef.current;
      ref.current.blur();
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
      return;
    }

    if (!multiline && event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      handleCancel();
    }
  }

  function handleOpenPayload() {
    window.parent?.postMessage(
      {
        source: VISUAL_EDITOR_MESSAGE_SOURCE,
        target,
        type: "open-target",
      },
      window.location.origin,
    );
  }

  async function handleSaveClick() {
    const nextValue = (ref.current?.textContent ?? draftValue).trim();
    setDraftValue(nextValue);
    await save(nextValue);
    ref.current?.blur();
  }

  return (
    <span
      className={`visual-inline-edit-shell${visualEditorEnabled ? " is-enabled" : ""}${focused ? " is-focused" : ""}${hovered ? " is-hovered" : ""}${multiline ? " is-multiline" : ""}`}
      data-visual-edit-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Tag
        className={className}
        contentEditable={visualEditorEnabled}
        data-inline-editable="true"
        data-inline-editing={focused ? "true" : "false"}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        ref={ref as React.LegacyRef<HTMLElement>}
        role={visualEditorEnabled ? "textbox" : undefined}
        spellCheck={visualEditorEnabled}
        suppressContentEditableWarning
      >
        {draftValue}
      </Tag>

      {visualEditorEnabled && toolbarPosition.visible ? (
        <span
          className={`visual-inline-toolbar visual-inline-toolbar-${toolbarPosition.mode}`}
          role="status"
          style={{
            left: `${toolbarPosition.left}px`,
            top: `${toolbarPosition.top}px`,
          }}
        >
          <button
            className="visual-inline-toolbar-button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => ref.current?.focus()}
            type="button"
          >
            编辑
          </button>
          <button
            className="visual-inline-toolbar-button"
            disabled={saving}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => handleSaveClick().catch(() => undefined)}
            type="button"
          >
            保存
          </button>
          <button
            className="visual-inline-toolbar-button"
            disabled={saving}
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleCancel}
            type="button"
          >
            取消
          </button>
          <button
            className="visual-inline-toolbar-button is-secondary"
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleOpenPayload}
            type="button"
          >
            Payload
          </button>
          <span className="visual-inline-toolbar-meta">{label}</span>
          <span className={`visual-inline-toolbar-state${saving ? " is-busy" : ""}`}>
            {saving
              ? "保存中"
              : status === "saved"
                ? "已保存"
                : status === "error"
                  ? "保存失败"
                  : multiline
                    ? "Cmd/Ctrl+Enter 保存"
                    : "Enter 保存"}
          </span>
        </span>
      ) : null}
    </span>
  );
}
