"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PreviewTool } from "@/components/studio/preview-tool";
import type { VisualEditorTarget } from "@/lib/visual-editing";
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
          <h1 className="admin-workbench-title">像 WordPress 一样，在预览页面上点区域，再到左侧直接修改。</h1>
          <p className="section-description">
            右侧预览里的区块本身就能直接点，悬浮时还会出现“编辑此区域”把手。点击后，左侧 Payload 编辑器会跳到对应页面或内容集合；仍然保留草稿、发布、版本和权限能力。
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
          新标签全屏预览
        </Link>
      </div>

      <div className="cms-workbench">
        <section className="cms-workbench-panel">
          <div className="cms-workbench-heading">
            <p className="eyebrow">编辑区</p>
            <h3>{selectedTarget.label}</h3>
            <p>左侧保持 Payload 原生编辑器。你可以直接在右侧页面点区块或把手，再回到这里保存草稿或发布变更。</p>
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
