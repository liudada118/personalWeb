"use client";

import type { EditablePageDefinition, EditablePageId } from "@/lib/page-content/registry";

import styles from "./visual-editor-shell.module.css";

type EditorToolbarProps = {
  dirtyCount: number;
  onPageChange: (pageId: EditablePageId) => void;
  onPublish: () => void;
  onReset: () => void;
  onSave: () => void;
  pages: EditablePageDefinition[];
  selectedPageId: EditablePageId;
  statusMessage: string;
};

export function EditorToolbar({
  dirtyCount,
  onPageChange,
  onPublish,
  onReset,
  onSave,
  pages,
  selectedPageId,
  statusMessage,
}: EditorToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarGroup}>
        <select className={styles.pageSelect} onChange={(event) => onPageChange(event.target.value as EditablePageId)} value={selectedPageId}>
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.title}
            </option>
          ))}
        </select>
        <span className={styles.badge}>当前未保存字段 {dirtyCount}</span>
      </div>

      <div className={styles.toolbarGroup}>
        <button className={styles.buttonSecondary} onClick={onReset} type="button">
          Reset
        </button>
        <button className={styles.buttonPrimary} onClick={onSave} type="button">
          Save
        </button>
        <button className={styles.buttonGhost} onClick={onPublish} type="button">
          Publish
        </button>
      </div>

      <div className={styles.statusText}>{statusMessage}</div>
    </div>
  );
}
