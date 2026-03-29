"use client";

import { useEffect, useId, useMemo, useRef, useState, type ElementType, type JSX as ReactJSX } from "react";
import { useSearchParams } from "next/navigation";

import { withBasePath } from "@/lib/site-paths";
import {
  renderVisualValue,
  VISUAL_EDITOR_API_ROUTE,
  VISUAL_EDITOR_MESSAGE_SOURCE,
  VISUAL_EDITOR_QUERY_PARAM,
  type VisualEditorField,
} from "@/lib/visual-editing";

type VisualEditableTextProps = VisualEditorField & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: any;
  value: string;
};

type SaveState = "error" | "idle" | "saved" | "saving";

function normalizeLinkHref(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^(https?:|mailto:|tel:|\/|#)/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function VisualEditableText({
  as = "span",
  value,
  multiline = false,
  ...field
}: VisualEditableTextProps) {
  const searchParams = useSearchParams();
  const visualEditorEnabled = searchParams.get(VISUAL_EDITOR_QUERY_PARAM) === "1";
  const Element = as as ElementType;
  const elementId = useId();
  const elementRef = useRef<HTMLElement | null>(null);
  const hideStatusTimerRef = useRef<number | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const savingSequenceRef = useRef(0);
  const selectionRangeRef = useRef<Range | null>(null);

  const initialHtml = useMemo(() => renderVisualValue(value, { multiline }), [multiline, value]);
  const [committedHtml, setCommittedHtml] = useState(initialHtml);
  const [isEditing, setIsEditing] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [toolbarPosition, setToolbarPosition] = useState<{ left: number; top: number } | null>(null);

  function getElementFromNode(node: Node | null) {
    if (!node) {
      return null;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      return node as Element;
    }

    return node.parentElement;
  }

  useEffect(() => {
    if (!isEditing) {
      setCommittedHtml(initialHtml);
    }
  }, [initialHtml, isEditing]);

  useEffect(() => {
    return () => {
      if (hideStatusTimerRef.current) {
        window.clearTimeout(hideStatusTimerRef.current);
      }

      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!visualEditorEnabled) {
      return;
    }

    function updateSelectionToolbar() {
      const element = elementRef.current;
      const selection = window.getSelection();

      if (!element || !selection || selection.rangeCount === 0) {
        setToolbarPosition(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const commonNode = getElementFromNode(range.commonAncestorContainer);

      if (!commonNode || !element.contains(commonNode)) {
        setToolbarPosition(null);
        return;
      }

      selectionRangeRef.current = range.cloneRange();

      if (selection.isCollapsed) {
        setToolbarPosition(null);
        return;
      }

      const rect = range.getBoundingClientRect();

      if (!rect.width && !rect.height) {
        setToolbarPosition(null);
        return;
      }

      setToolbarPosition({
        left: rect.left + rect.width / 2,
        top: Math.max(rect.top - 16, 16),
      });
    }

    document.addEventListener("selectionchange", updateSelectionToolbar);
    window.addEventListener("resize", updateSelectionToolbar);
    window.addEventListener("scroll", updateSelectionToolbar, true);

    return () => {
      document.removeEventListener("selectionchange", updateSelectionToolbar);
      window.removeEventListener("resize", updateSelectionToolbar);
      window.removeEventListener("scroll", updateSelectionToolbar, true);
    };
  }, [visualEditorEnabled]);

  function postMessage(type: "editing-state" | "open-target", active?: boolean) {
    if (typeof window === "undefined") {
      return;
    }

    const target = {
      adminHref: field.adminHref,
      label: field.label,
      previewHref: field.previewHref,
    };

    window.parent?.postMessage(
      type === "open-target"
        ? {
            source: VISUAL_EDITOR_MESSAGE_SOURCE,
            target,
            type,
          }
        : {
            active: Boolean(active),
            source: VISUAL_EDITOR_MESSAGE_SOURCE,
            target,
            type,
          },
      window.location.origin,
    );
  }

  async function saveHtml(rawHtml: string, immediate = false) {
    const nextHtml = renderVisualValue(rawHtml, { multiline });

    if (nextHtml === committedHtml && saveState !== "error") {
      if (elementRef.current && elementRef.current.innerHTML !== nextHtml) {
        elementRef.current.innerHTML = nextHtml;
      }

      return;
    }

    const sequence = ++savingSequenceRef.current;

    setSaveState("saving");

    try {
      const response = await fetch(withBasePath(VISUAL_EDITOR_API_ROUTE), {
        body: JSON.stringify({
          field: {
            ...field,
            multiline,
          },
          value: nextHtml,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as
        | {
            message?: string;
            savedValue?: string;
          }
        | null;

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to save this text block.");
      }

      if (sequence !== savingSequenceRef.current) {
        return;
      }

      const savedValue = payload?.savedValue && typeof payload.savedValue === "string" ? payload.savedValue : nextHtml;

      setCommittedHtml(savedValue);

      if (!document.activeElement || document.activeElement !== elementRef.current) {
        if (elementRef.current) {
          elementRef.current.innerHTML = savedValue;
        }
      }

      setSaveState("saved");

      if (hideStatusTimerRef.current) {
        window.clearTimeout(hideStatusTimerRef.current);
      }

      hideStatusTimerRef.current = window.setTimeout(() => {
        setSaveState("idle");
      }, 1600);
    } catch {
      if (sequence === savingSequenceRef.current) {
        setSaveState("error");
      }
    }
  }

  function scheduleSave() {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      saveHtml(element.innerHTML).catch(() => undefined);
    }, 500);
  }

  function restoreSelection() {
    const selection = window.getSelection();
    const range = selectionRangeRef.current;

    if (!selection || !range) {
      return;
    }

    selection.removeAllRanges();
    selection.addRange(range);
  }

  function handleFocus() {
    setIsEditing(true);
    postMessage("open-target");
    postMessage("editing-state", true);
  }

  function handleBlur() {
    setIsEditing(false);
    setToolbarPosition(null);
    postMessage("editing-state", false);

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    if (elementRef.current) {
      saveHtml(elementRef.current.innerHTML, true).catch(() => undefined);
    }
  }

  function handleInput() {
    scheduleSave();
  }

  function handleClickCapture(event: React.MouseEvent<HTMLElement>) {
    if (!visualEditorEnabled) {
      return;
    }

    const target = event.target;

    if (target instanceof HTMLElement && target.closest("a")) {
      event.preventDefault();
    }

    event.stopPropagation();
  }

  function applyCommand(command: "bold" | "italic" | "createLink" | "unlink", valueArg?: string) {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    element.focus();
    restoreSelection();
    document.execCommand("styleWithCSS", false, "false");
    document.execCommand(command, false, valueArg);
    scheduleSave();
  }

  function applyLink() {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    const existingAnchor = getElementFromNode(selection?.anchorNode ?? null)?.closest("a");

    const url = window.prompt("Link URL", existingAnchor?.getAttribute("href") || "");

    if (url === null) {
      return;
    }

    const normalizedHref = normalizeLinkHref(url);

    if (!normalizedHref && !selectedText) {
      return;
    }

    if (!normalizedHref) {
      applyCommand("unlink");
      return;
    }

    applyCommand("createLink", normalizedHref);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (!visualEditorEnabled) {
      return;
    }

    if (!multiline && event.key === "Enter") {
      event.preventDefault();
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
      event.preventDefault();
      applyCommand("bold");
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "i") {
      event.preventDefault();
      applyCommand("italic");
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      applyLink();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      elementRef.current?.blur();
    }
  }

  const statusLabel =
    saveState === "saving" ? "Saving" : saveState === "saved" ? "Saved" : saveState === "error" ? "Retry" : "Edit";

  if (!visualEditorEnabled) {
    return (
      <Element
        dangerouslySetInnerHTML={{ __html: committedHtml }}
        id={elementId}
      />
    );
  }

  return (
    <>
      <span className={`visual-editable-shell${isEditing ? " is-editing" : ""}${multiline ? " is-multiline" : ""}`}>
        <Element
          aria-label={field.label}
          className="visual-editable-text"
          contentEditable
          dangerouslySetInnerHTML={{ __html: committedHtml }}
          id={elementId}
          onBlur={handleBlur}
          onClickCapture={handleClickCapture}
          onFocus={handleFocus}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          ref={(node: HTMLElement | null) => {
            elementRef.current = node;
          }}
          spellCheck
          suppressContentEditableWarning
        />
        <span className={`visual-editable-handle visual-editable-handle-${saveState}`} contentEditable={false}>
          {statusLabel}
        </span>
      </span>

      {toolbarPosition ? (
        <div
          className="visual-edit-toolbar"
          style={{
            left: toolbarPosition.left,
            top: toolbarPosition.top,
          }}
        >
          <button
            aria-label="Bold"
            onMouseDown={(event) => {
              event.preventDefault();
              applyCommand("bold");
            }}
            type="button"
          >
            B
          </button>
          <button
            aria-label="Italic"
            onMouseDown={(event) => {
              event.preventDefault();
              applyCommand("italic");
            }}
            type="button"
          >
            I
          </button>
          <button
            aria-label="Link"
            onMouseDown={(event) => {
              event.preventDefault();
              applyLink();
            }}
            type="button"
          >
            Link
          </button>
        </div>
      ) : null}
    </>
  );
}
