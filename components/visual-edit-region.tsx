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

  function resolveTarget() {
    const resolvedPreviewHref = previewHref || (typeof window === "undefined" ? "/" : window.location.pathname);

    return {
      adminHref,
      label,
      previewHref: resolvedPreviewHref,
    };
  }

  function postTarget(type: "open-target" | "select-field") {
    if (!visualEditorEnabled || typeof window === "undefined") {
      return;
    }

    window.parent?.postMessage(
      {
        source: VISUAL_EDITOR_MESSAGE_SOURCE,
        target: resolveTarget(),
        type,
      },
      window.location.origin,
    );
  }

  function handleRegionClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!visualEditorEnabled) {
      return;
    }

    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.closest("[data-inline-editable='true']")) {
      event.preventDefault();
      event.stopPropagation();
      postTarget("select-field");
      return;
    }

    if (target.closest(".visual-edit-handle")) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    postTarget("open-target");
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
          onClick={() => postTarget("open-target")}
          type="button"
        >
          编辑区域
          <span>{label}</span>
        </button>
      ) : null}
      {children}
    </div>
  );
}
