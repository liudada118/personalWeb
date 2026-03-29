"use client";

import Link from "next/link";
import { useState } from "react";

import { PreviewTool } from "@/components/studio/preview-tool";

type FullscreenPreviewProps = {
  initialRoute: string;
};

export function FullscreenPreview({ initialRoute }: FullscreenPreviewProps) {
  const [activeRoute, setActiveRoute] = useState(initialRoute);

  return (
    <div className="admin-workbench-shell admin-workbench-shell-full">
      <div className="admin-workbench-topbar">
        <div className="admin-workbench-copy">
          <p className="eyebrow">全屏预览</p>
          <h1 className="admin-workbench-title">单独查看当前草稿页面</h1>
          <p className="section-description">这里仍然读取草稿内容，但不再挤在双栏里，适合检查大图、排版和整体节奏。</p>
        </div>

        <div className="admin-workbench-actions">
          <Link className="admin-workbench-link" href="/cms/admin/workbench">
            返回编辑预览台
          </Link>
          <Link className="admin-workbench-link" href={activeRoute} target="_blank">
            打开正式页面
          </Link>
        </div>
      </div>

      <PreviewTool activeRoute={activeRoute} mode="canvas" onActiveRouteChange={setActiveRoute} />
    </div>
  );
}
