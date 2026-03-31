"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PreviewTool } from "@/components/studio/preview-tool";
import type { VisualEditorTarget } from "@/lib/visual-editing";
import { withBasePath } from "@/lib/site-paths";

const workbenchTargets: VisualEditorTarget[] = [
  { label: "站点信息", adminHref: "/cms/admin/globals/siteSettings", previewHref: "/" },
  { label: "首页", adminHref: "/cms/admin/globals/homePage", previewHref: "/" },
  { label: "关于页", adminHref: "/cms/admin/globals/aboutPage", previewHref: "/about" },
  { label: "媒体页", adminHref: "/cms/admin/globals/mediaPage", previewHref: "/media" },
  { label: "播客页", adminHref: "/cms/admin/globals/podcastPage", previewHref: "/podcast" },
  { label: "联系页", adminHref: "/cms/admin/globals/contactPage", previewHref: "/contact" },
  { label: "媒体内容", adminHref: "/cms/admin/collections/mediaPosts", previewHref: "/media" },
  { label: "播客单集", adminHref: "/cms/admin/collections/podcastEpisodes", previewHref: "/podcast" },
];

export function LiveWorkbench() {
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

  function handleVisualTarget(target: VisualEditorTarget) {
    handleTargetChange(target);
  }

  const editorFrameSrc = withBasePath(selectedTarget.adminHref);

  return (
    <div className="admin-workbench-shell">
      <div className="admin-workbench-topbar">
        <div className="admin-workbench-copy">
          <p className="eyebrow">可视化编辑台</p>
          <h1 className="admin-workbench-title">在预览里选中区域，在左侧继续使用 Payload 原生编辑器。</h1>
          <p className="section-description">
            这个工作台保留 Payload 的版本、草稿和权限模型，同时把站点预览放到同一屏里，便于在页面和后台之间来回校对。
          </p>
        </div>

        <div className="admin-workbench-actions">
          <Link className="admin-workbench-link" href="/cms/admin">
            返回后台首页
          </Link>
          <Link className="admin-workbench-link" href={fullscreenHref}>
            全屏预览
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
        <span className="admin-workbench-context">当前编辑目标：{selectedTarget.label}</span>
        <Link className="admin-workbench-link" href={selectedTarget.adminHref} target="_blank">
          新标签打开编辑页
        </Link>
        <Link className="admin-workbench-link" href={fullscreenHref} target="_blank">
          新标签打开预览
        </Link>
      </div>

      <div className="cms-workbench">
        <section className="cms-workbench-panel">
          <div className="cms-workbench-heading">
            <p className="eyebrow">编辑区</p>
            <h3>{selectedTarget.label}</h3>
            <p>左侧继续使用 Payload 原生编辑器。右侧预览保持在当前页面，便于边改边看。</p>
          </div>

          <div className="cms-workbench-frame-shell">
            <iframe
              className="cms-embed-frame"
              key={`${selectedTarget.adminHref}-${editorSeed}`}
              src={editorFrameSrc}
              title="Payload admin editor"
            />
          </div>
        </section>

        <section className="cms-workbench-panel cms-workbench-panel-preview">
          <PreviewTool
            activeRoute={previewRoute}
            compact
            onActiveRouteChange={setPreviewRoute}
            onSelectVisualTarget={handleVisualTarget}
          />
        </section>
      </div>
    </div>
  );
}
