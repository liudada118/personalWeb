"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { PREVIEW_QUERY_PARAM } from "@/lib/payload/preview-constants";
import { previewRoutes } from "@/lib/payload/preview-routes";
import { withBasePath } from "@/lib/site-paths";
import {
  isVisualEditorMessage,
  type VisualEditorTarget,
  VISUAL_EDITOR_QUERY_PARAM,
} from "@/lib/visual-editing";

type PreviewSessionResponse = {
  enabled?: boolean;
  expiresAt?: string;
  message?: string;
  previewToken?: string;
};

type PreviewToolProps = {
  activeRoute?: string;
  compact?: boolean;
  onActiveRouteChange?: (href: string) => void;
  onSelectVisualTarget?: (target: VisualEditorTarget) => void;
};

export function PreviewTool({
  activeRoute,
  compact = false,
  onActiveRouteChange,
  onSelectVisualTarget,
}: PreviewToolProps) {
  const [autoRefresh, setAutoRefresh] = useState(() => !onSelectVisualTarget);
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [inlineEditingActive, setInlineEditingActive] = useState(false);
  const [internalRoute, setInternalRoute] = useState(previewRoutes[0].href);
  const [loading, setLoading] = useState(true);
  const [previewToken, setPreviewToken] = useState("");
  const [refreshSeed, setRefreshSeed] = useState(() => Date.now());

  const resolvedRoute = activeRoute ?? internalRoute;
  const visualEditingEnabled = Boolean(onSelectVisualTarget);

  const handleRouteChange = useCallback(
    (href: string) => {
      if (activeRoute === undefined) {
        setInternalRoute(href);
      }

      onActiveRouteChange?.(href);
    },
    [activeRoute, onActiveRouteChange],
  );

  useEffect(() => {
    let cancelled = false;

    async function enablePreview() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(withBasePath("/api/preview/session"), {
          cache: "no-store",
          method: "POST",
        });
        const payload = (await response.json().catch(() => null)) as PreviewSessionResponse | null;

        if (!response.ok || !payload?.previewToken) {
          throw new Error(payload?.message || "Unable to enable preview.");
        }

        if (!cancelled) {
          setExpiresAt(payload.expiresAt || "");
          setPreviewToken(payload.previewToken);
          setRefreshSeed(Date.now());
        }
      } catch (issue) {
        if (!cancelled) {
          setPreviewToken("");
          setExpiresAt("");
          setError(issue instanceof Error ? issue.message : "Unable to enable preview.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    enablePreview().catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!previewToken || !autoRefresh || inlineEditingActive) {
      return;
    }

    const timer = window.setInterval(() => {
      setRefreshSeed(Date.now());
    }, 2500);

    return () => window.clearInterval(timer);
  }, [autoRefresh, inlineEditingActive, previewToken]);

  useEffect(() => {
    if (!visualEditingEnabled) {
      return;
    }

    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || !isVisualEditorMessage(event.data)) {
        return;
      }

      if (event.data.type === "editing-state") {
        setInlineEditingActive(event.data.active);

        if (event.data.active && event.data.target) {
          handleRouteChange(event.data.target.previewHref);
          onSelectVisualTarget?.(event.data.target);
        }

        return;
      }

      handleRouteChange(event.data.target.previewHref);
      onSelectVisualTarget?.(event.data.target);
    }

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [handleRouteChange, onSelectVisualTarget, visualEditingEnabled]);

  const frameSrc = useMemo(() => {
    if (!previewToken) {
      return "";
    }

    const params = new URLSearchParams();
    params.set(PREVIEW_QUERY_PARAM, previewToken);
    params.set("preview", String(refreshSeed));

    if (visualEditingEnabled) {
      params.set(VISUAL_EDITOR_QUERY_PARAM, "1");
    }

    return `${withBasePath(resolvedRoute)}?${params.toString()}`;
  }, [previewToken, refreshSeed, resolvedRoute, visualEditingEnabled]);

  async function disablePreview() {
    setLoading(true);

    try {
      await fetch(withBasePath("/api/preview/session"), {
        cache: "no-store",
        method: "DELETE",
      });
    } finally {
      setAutoRefresh(false);
      setExpiresAt("");
      setLoading(false);
      setPreviewToken("");
      setRefreshSeed(Date.now());
    }
  }

  return (
    <div className={`cms-tool${compact ? " cms-tool-compact" : ""}`}>
      <div className="section-heading">
        <p className="eyebrow">{compact ? "Preview" : "Page Preview"}</p>
        <h2>{compact ? "Click and type inside the live preview." : "Draft preview with inline visual editing."}</h2>
        <p className="section-description">
          The preview runs against Payload draft data. Inline edits save through the visual editing API and the left panel can still jump to the matching Payload screen.
        </p>
      </div>

      <div className="cms-toolbar">
        <button className={previewToken ? "is-active" : ""} disabled={loading} onClick={() => setRefreshSeed(Date.now())} type="button">
          {loading ? "Connecting preview" : previewToken ? "Preview connected" : "Preview offline"}
        </button>
        <button className={autoRefresh ? "is-active" : ""} disabled={!previewToken || loading} onClick={() => setAutoRefresh((value) => !value)} type="button">
          {autoRefresh ? "Auto refresh on" : "Auto refresh off"}
        </button>
        <button disabled={!previewToken || loading} onClick={() => setRefreshSeed(Date.now())} type="button">
          Refresh now
        </button>
        <button disabled={!previewToken || loading} onClick={() => disablePreview().catch(() => setLoading(false))} type="button">
          Stop preview
        </button>
      </div>

      {visualEditingEnabled ? (
        <div className="cms-empty cms-visual-note">
          Click text to edit directly in preview. Hover a section to reveal the admin handle.
          {inlineEditingActive ? " Auto refresh is paused while you type." : ""}
        </div>
      ) : null}

      {expiresAt ? <p className="section-description">Preview session expires at {new Date(expiresAt).toLocaleString("zh-CN")}.</p> : null}

      {error ? <div className="cms-tool cms-empty">{error}</div> : null}

      <div className="cms-toolbar">
        {previewRoutes.map((route) => (
          <button
            className={route.href === resolvedRoute ? "is-active" : ""}
            key={route.href}
            onClick={() => handleRouteChange(route.href)}
            type="button"
          >
            {route.label}
          </button>
        ))}
      </div>

      {frameSrc ? (
        <div className={`cms-frame${compact ? " cms-frame-compact" : ""}`}>
          <iframe
            key={frameSrc}
            src={frameSrc}
            style={{ border: 0, height: "100%", minHeight: compact ? "72vh" : "78vh", width: "100%" }}
            title="Site preview"
          />
        </div>
      ) : (
        <div className="cms-tool cms-empty">Preview will appear here after the Payload admin session is detected.</div>
      )}
    </div>
  );
}
