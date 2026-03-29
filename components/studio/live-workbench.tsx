"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PreviewTool } from "@/components/studio/preview-tool";
import type { VisualEditorTarget } from "@/lib/visual-editing";
import { withBasePath } from "@/lib/site-paths";

const workbenchTargets: VisualEditorTarget[] = [
  { label: "Site Settings", adminHref: "/cms/admin/globals/siteSettings", previewHref: "/" },
  { label: "Home Page", adminHref: "/cms/admin/globals/homePage", previewHref: "/" },
  { label: "About Page", adminHref: "/cms/admin/globals/aboutPage", previewHref: "/about" },
  { label: "Media Page", adminHref: "/cms/admin/globals/mediaPage", previewHref: "/media" },
  { label: "Podcast Page", adminHref: "/cms/admin/globals/podcastPage", previewHref: "/podcast" },
  { label: "Contact Page", adminHref: "/cms/admin/globals/contactPage", previewHref: "/contact" },
  { label: "Media Articles", adminHref: "/cms/admin/collections/mediaArticles", previewHref: "/media" },
  { label: "Podcast Episodes", adminHref: "/cms/admin/collections/podcastEpisodes", previewHref: "/podcast" },
];

export function LiveWorkbench() {
  const [isEditorPanelCollapsed, setIsEditorPanelCollapsed] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState<VisualEditorTarget>(workbenchTargets[0]);
  const [previewRoute, setPreviewRoute] = useState(workbenchTargets[0].previewHref);
  const [editorSeed, setEditorSeed] = useState(() => Date.now());

  const fullscreenHref = useMemo(
    () => `/cms/admin/preview-fullscreen?target=${encodeURIComponent(previewRoute)}`,
    [previewRoute],
  );

  function handleTargetChange(target: VisualEditorTarget) {
    setSelectedTarget(target);
    setPreviewRoute(target.previewHref);
    setEditorSeed(Date.now());
  }

  const editorFrameSrc = withBasePath(selectedTarget.adminHref);

  return (
    <div className="admin-workbench-shell">
      <div className="admin-workbench-topbar">
        <div className="admin-workbench-copy">
          <p className="eyebrow">Visual Editing</p>
          <h1 className="admin-workbench-title">Inline Payload editing inside the live preview.</h1>
          <p className="section-description">
            Click text on the right to type directly in place. The left Payload panel starts minimized and can be opened anytime for field-level admin access, draft review, and publishing.
          </p>
        </div>

        <div className="admin-workbench-actions">
          <Link className="admin-workbench-link" href="/cms/admin">
            Admin home
          </Link>
          <Link className="admin-workbench-link" href={fullscreenHref}>
            Fullscreen preview
          </Link>
        </div>
      </div>

      <div className="cms-toolbar">
        {workbenchTargets.map((target) => (
          <button
            className={target.adminHref === selectedTarget.adminHref ? "is-active" : ""}
            key={`${target.adminHref}-${target.label}`}
            onClick={() => handleTargetChange(target)}
            type="button"
          >
            {target.label}
          </button>
        ))}
      </div>

      <div className="cms-toolbar cms-toolbar-context">
        <span className="admin-workbench-context">Current target: {selectedTarget.label}</span>
        <button
          className={`admin-workbench-toggle${isEditorPanelCollapsed ? " is-collapsed" : ""}`}
          onClick={() => setIsEditorPanelCollapsed((value) => !value)}
          type="button"
        >
          {isEditorPanelCollapsed ? "Open Payload panel" : "Collapse Payload panel"}
        </button>
        <Link className="admin-workbench-link" href={selectedTarget.adminHref} target="_blank">
          Open Payload in new tab
        </Link>
        <Link className="admin-workbench-link" href={fullscreenHref} target="_blank">
          Open fullscreen preview
        </Link>
      </div>

      <div className={`cms-workbench${isEditorPanelCollapsed ? " is-editor-collapsed" : ""}`}>
        <section className={`cms-workbench-panel cms-workbench-panel-editor${isEditorPanelCollapsed ? " is-collapsed" : ""}`}>
          <div className="cms-workbench-heading">
            <p className="eyebrow">Payload</p>
            <h3>{selectedTarget.label}</h3>
            <p>
              Keep the panel collapsed for a document-like editing flow, or expand it when you need the full Payload form.
            </p>
          </div>

          {isEditorPanelCollapsed ? (
            <div className="cms-editor-collapsed-rail">
              <p>{selectedTarget.label}</p>
              <button onClick={() => setIsEditorPanelCollapsed(false)} type="button">
                Expand
              </button>
            </div>
          ) : (
            <div className="cms-workbench-frame-shell">
              <iframe
                className="cms-embed-frame"
                key={`${selectedTarget.adminHref}-${editorSeed}`}
                src={editorFrameSrc}
                title="Payload admin editor"
              />
            </div>
          )}
        </section>

        <section className="cms-workbench-panel cms-workbench-panel-preview">
          <PreviewTool
            activeRoute={previewRoute}
            compact
            onActiveRouteChange={setPreviewRoute}
            onSelectVisualTarget={handleTargetChange}
          />
        </section>
      </div>
    </div>
  );
}
