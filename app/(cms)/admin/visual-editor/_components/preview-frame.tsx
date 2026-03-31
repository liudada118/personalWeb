"use client";

import { useMemo } from "react";

import type { EditableFieldDefinition, EditablePageDefinition } from "@/lib/page-content/registry";
import { withBasePath } from "@/lib/site-paths";
import { VISUAL_EDITOR_QUERY_PARAM } from "@/lib/visual-editing";

import styles from "./visual-editor-shell.module.css";

type PreviewFrameProps = {
  page: EditablePageDefinition;
  selectedField?: EditableFieldDefinition | null;
};

export function PreviewFrame({ page, selectedField }: PreviewFrameProps) {
  const iframeSrc = useMemo(() => {
    const params = new URLSearchParams();
    params.set(VISUAL_EDITOR_QUERY_PARAM, "1");
    return `${withBasePath(page.route)}?${params.toString()}`;
  }, [page.route]);

  return (
    <div className={styles.previewWrap}>
      <div className={styles.previewCard}>
        <strong>{selectedField ? `当前字段：${selectedField.label}` : `当前页面：${page.title}`}</strong>
        <p>这一列直接加载真实前台页面，不使用假页面。字段级选中与实时联动会在下一步接入 postMessage。</p>
        <div className={styles.previewMeta}>
          <span>iframe 真实路由</span>
          <span>{page.route}</span>
          {selectedField ? <span>{selectedField.key}</span> : null}
        </div>
        <div className={styles.previewMeta}>
          <a className={styles.buttonSecondary} href={iframeSrc} rel="noreferrer" target="_blank">
            新标签打开预览
          </a>
        </div>
      </div>

      <div className={styles.previewFrameShell}>
        <iframe className={styles.previewFrame} src={iframeSrc} title={`${page.title} preview`} />
      </div>
    </div>
  );
}
