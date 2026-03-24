"use client";

import { useSearchParams } from "next/navigation";

import { VISUAL_EDITOR_MESSAGE_SOURCE, VISUAL_EDITOR_QUERY_PARAM } from "@/lib/visual-editing";

type VisualEditRegionProps = {
  adminHref: string;
  children: React.ReactNode;
  label: string;
  previewHref?: string;
};

export function VisualEditRegion({ adminHref, children, label, previewHref }: VisualEditRegionProps) {
  const searchParams = useSearchParams();
  const visualEditorEnabled = searchParams.get(VISUAL_EDITOR_QUERY_PARAM) === "1";

  function handleEdit() {
    if (!visualEditorEnabled || typeof window === "undefined") {
      return;
    }

    const resolvedPreviewHref = previewHref || window.location.pathname;

    window.parent?.postMessage(
      {
        source: VISUAL_EDITOR_MESSAGE_SOURCE,
        target: {
          adminHref,
          label,
          previewHref: resolvedPreviewHref,
        },
        type: "open-target",
      },
      window.location.origin,
    );
  }

  function handleRegionClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!visualEditorEnabled) {
      return;
    }

    const target = event.target;

    if (!(target instanceof HTMLElement) || target.closest(".visual-edit-handle")) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    handleEdit();
  }

  return (
    <div
      className={`visual-edit-region${visualEditorEnabled ? " is-enabled" : ""}`}
      onClickCapture={handleRegionClick}
    >
      {visualEditorEnabled ? (
        <button
          aria-label={`编辑${label}`}
          className="visual-edit-handle"
          onClick={handleEdit}
          type="button"
        >
          编辑此区域
          <span>{label}</span>
        </button>
      ) : null}
      {children}
    </div>
  );
}
