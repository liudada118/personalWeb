"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PreviewTool } from "@/components/studio/preview-tool";
import { withBasePath } from "@/lib/site-paths";

const workbenchTargets = [
  { label: "站点信息", adminHref: "/cms/admin/globals/siteSettings", previewHref: "/" },
  { label: "首页", adminHref: "/cms/admin/globals/homePage", previewHref: "/" },
  { label: "个人介绍", adminHref: "/cms/admin/globals/aboutPage", previewHref: "/about" },
  { label: "媒体页", adminHref: "/cms/admin/globals/mediaPage", previewHref: "/media" },
  { label: "播客页", adminHref: "/cms/admin/globals/podcastPage", previewHref: "/podcast" },
  { label: "联系页", adminHref: "/cms/admin/globals/contactPage", previewHref: "/contact" },
  { label: "媒体文章", adminHref: "/cms/admin/collections/mediaArticles", previewHref: "/media" },
  { label: "播客单集", adminHref: "/cms/admin/collections/podcastEpisodes", previewHref: "/podcast" },
];

export function LiveWorkbench() {
  const [selectedTarget, setSelectedTarget] = useState(workbenchTargets[0]);
  const [previewRoute, setPreviewRoute] = useState(workbenchTargets[0].previewHref);

  const fullscreenHref = useMemo(
    () => `/cms/admin/preview-fullscreen?target=${encodeURIComponent(previewRoute)}`,
    [previewRoute],
  );

  function handleTargetChange(target: (typeof workbenchTargets)[number]) {
    setSelectedTarget(target);
    setPreviewRoute(target.previewHref);
  }

  return (
    <div className="admin-workbench-shell">
      <div className="admin-workbench-topbar">
        <div className="admin-workbench-copy">
          <p className="eyebrow">编辑预览台</p>
          <h1 className="admin-workbench-title">在 admin 内完成编辑、草稿预览和全屏检查</h1>
          <p className="section-description">
            左侧保留 Payload 原生编辑器，右侧只显示草稿预览。未发布内容不会直接进入正式官网；只有点击
            <code> Publish changes </code>
            才会上线。
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
            key={target.adminHref}
            onClick={() => handleTargetChange(target)}
            type="button"
          >
            {target.label}
          </button>
        ))}
      </div>

      <div className="cms-toolbar">
        <Link className="admin-workbench-link" href={selectedTarget.adminHref} target="_blank">
          新标签打开当前编辑页
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
            <p>这里嵌入的是受保护的 Payload 编辑页，保存、草稿、版本和发布操作都保持原生行为。</p>
          </div>

          <div className="cms-workbench-frame-shell">
            <iframe className="cms-embed-frame" src={withBasePath(selectedTarget.adminHref)} title="Payload admin editor" />
          </div>
        </section>

        <section className="cms-workbench-panel cms-workbench-panel-preview">
          <PreviewTool activeRoute={previewRoute} compact onActiveRouteChange={setPreviewRoute} />
        </section>
      </div>
    </div>
  );
}
