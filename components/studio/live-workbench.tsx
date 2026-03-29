"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PreviewTool } from "@/components/studio/preview-tool";
import type { VisualEditorSelectionTarget, VisualEditorTarget } from "@/lib/visual-editing";
import { withBasePath } from "@/lib/site-paths";

const workbenchTargets: VisualEditorTarget[] = [
  { label: "站点信息", adminHref: "/cms/admin/globals/siteSettings", previewHref: "/" },
  { label: "首页", adminHref: "/cms/admin/globals/homePage", previewHref: "/" },
  { label: "个人介绍页", adminHref: "/cms/admin/globals/aboutPage", previewHref: "/about" },
  { label: "媒体页", adminHref: "/cms/admin/globals/mediaPage", previewHref: "/media" },
  { label: "播客页", adminHref: "/cms/admin/globals/podcastPage", previewHref: "/podcast" },
  { label: "联系页", adminHref: "/cms/admin/globals/contactPage", previewHref: "/contact" },
  { label: "媒体文章", adminHref: "/cms/admin/collections/mediaArticles", previewHref: "/media" },
  { label: "播客单集", adminHref: "/cms/admin/collections/podcastEpisodes", previewHref: "/podcast" },
  { label: "案例库", adminHref: "/cms/admin/collections/caseStudies", previewHref: "/" },
];

export function LiveWorkbench() {
  const [panelOpen, setPanelOpen] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState<VisualEditorSelectionTarget>(workbenchTargets[0]);
  const [previewRoute, setPreviewRoute] = useState(workbenchTargets[0].previewHref);
  const [editorSeed, setEditorSeed] = useState(() => Date.now());

  const fullscreenHref = useMemo(
    () => `/cms/admin/preview-fullscreen?target=${encodeURIComponent(previewRoute)}`,
    [previewRoute],
  );

  function handleTargetChange(target: VisualEditorSelectionTarget) {
    setSelectedTarget(target);
    setPreviewRoute(target.previewHref);
    setEditorSeed(Date.now());
  }

  function handleVisualTarget(target: VisualEditorSelectionTarget) {
    setPanelOpen(true);
    handleTargetChange(target);
  }

  const editorFrameSrc = withBasePath(selectedTarget.adminHref);

  return (
    <div className="live-workbench-shell">
      <header className="live-workbench-topbar">
        <div className="live-workbench-copy">
          <p className="eyebrow">Inline CMS Workbench</p>
          <h1 className="live-workbench-title">直接在预览画布上编辑，用 Payload 继续负责存储、草稿和发布。</h1>
          <p className="live-workbench-description">
            现在的主视图是整页预览。左侧 Payload 面板收成抽屉，仅在需要结构化表单或媒体管理时展开。
          </p>
        </div>

        <div className="live-workbench-actions">
          <Link className="admin-workbench-link" href="/cms/admin">
            返回后台首页
          </Link>
          <Link className="admin-workbench-link" href={fullscreenHref} target="_blank">
            独立预览
          </Link>
        </div>
      </header>

      <div className="live-workbench-targets">
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

      <div className={`live-workbench-stage${panelOpen ? " is-panel-open" : " is-panel-collapsed"}`}>
        <aside className="live-workbench-panel">
          <div className="live-workbench-panel-head">
            <div>
              <p className="eyebrow">Payload Panel</p>
              <h2>{selectedTarget.label}</h2>
            </div>
            <button
              aria-label={panelOpen ? "收起 Payload 面板" : "展开 Payload 面板"}
              className="live-workbench-panel-toggle"
              onClick={() => setPanelOpen((value) => !value)}
              type="button"
            >
              {panelOpen ? "收起" : "展开"}
            </button>
          </div>

          <div className="live-workbench-panel-meta">
            <span>当前预览：{previewRoute}</span>
            {"fieldPath" in selectedTarget ? (
              <span>字段：{selectedTarget.fieldPath}</span>
            ) : (
              <span>点击文本可直接原位编辑</span>
            )}
          </div>

          <div className="live-workbench-panel-actions">
            <Link className="admin-workbench-link" href={selectedTarget.adminHref} target="_blank">
              新标签打开编辑页
            </Link>
          </div>

          <div className="live-workbench-frame-shell">
            <iframe
              className="live-workbench-embed-frame"
              key={`${selectedTarget.adminHref}-${editorSeed}`}
              src={editorFrameSrc}
              title="Payload admin editor"
            />
          </div>
        </aside>

        <button
          aria-label={panelOpen ? "最小化左侧面板" : "展开左侧面板"}
          className="live-workbench-rail-toggle"
          onClick={() => setPanelOpen((value) => !value)}
          type="button"
        >
          <span>{panelOpen ? "隐藏表单" : "打开 Payload"}</span>
        </button>

        <div className="live-workbench-canvas">
          <PreviewTool
            activeRoute={previewRoute}
            mode="canvas"
            onActiveRouteChange={setPreviewRoute}
            onSelectVisualTarget={handleVisualTarget}
          />
        </div>
      </div>
    </div>
  );
}
