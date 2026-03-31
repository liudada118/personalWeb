"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { editablePages, getEditableFieldByKey, getEditablePageById, type EditablePageId } from "@/lib/page-content/registry";
import type { PageContentValue } from "@/lib/types";

import { EditorToolbar } from "./editor-toolbar";
import { FieldInspectorPanel } from "./field-inspector-panel";
import { FieldListPanel } from "./field-list-panel";
import { PreviewFrame } from "./preview-frame";
import styles from "./visual-editor-shell.module.css";

type VisualEditorShellProps = {
  initialPageId: EditablePageId;
};

type DraftMap = Record<string, PageContentValue>;

function cloneValue<T>(value: T): T {
  return typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value)) as T;
}

function buildInitialValueMap() {
  const entries = editablePages.flatMap((page) => page.fields.map((field) => [field.key, cloneValue(field.defaultValue)] as const));
  return Object.fromEntries(entries) as DraftMap;
}

function valuesMatch(left: PageContentValue, right: PageContentValue) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function timestampLabel(prefix: string) {
  return `${prefix} ${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`;
}

export function VisualEditorShell({ initialPageId }: VisualEditorShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedPageId, setSelectedPageId] = useState<EditablePageId>(initialPageId);
  const [draftValues, setDraftValues] = useState<DraftMap>(() => buildInitialValueMap());
  const [savedValues, setSavedValues] = useState<DraftMap>(() => buildInitialValueMap());
  const [statusMessage, setStatusMessage] = useState("Shell ready. Save and Publish are local placeholders in this step.");

  const currentPage = useMemo(() => getEditablePageById(selectedPageId), [selectedPageId]);
  const [selectedFieldKey, setSelectedFieldKey] = useState<string>(currentPage.fields[0]?.key ?? "");

  useEffect(() => {
    if (!currentPage.fields.some((field) => field.key === selectedFieldKey)) {
      setSelectedFieldKey(currentPage.fields[0]?.key ?? "");
    }
  }, [currentPage.fields, selectedFieldKey]);

  const selectedField = useMemo(() => getEditableFieldByKey(selectedFieldKey), [selectedFieldKey]);

  const dirtyCount = useMemo(
    () =>
      currentPage.fields.filter((field) => !valuesMatch(draftValues[field.key], savedValues[field.key])).length,
    [currentPage.fields, draftValues, savedValues],
  );

  function syncPageToUrl(pageId: EditablePageId) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageId);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  function handlePageChange(pageId: EditablePageId) {
    setSelectedPageId(pageId);
    setSelectedFieldKey(getEditablePageById(pageId).fields[0]?.key ?? "");
    syncPageToUrl(pageId);
    setStatusMessage(`Switched to ${getEditablePageById(pageId).title}.`);
  }

  function handleFieldValueChange(value: PageContentValue) {
    if (!selectedField) {
      return;
    }

    setDraftValues((current) => ({
      ...current,
      [selectedField.key]: cloneValue(value),
    }));
  }

  function handleSave() {
    setSavedValues((current) => {
      const next = { ...current };

      for (const field of currentPage.fields) {
        next[field.key] = cloneValue(draftValues[field.key]);
      }

      return next;
    });

    setStatusMessage(timestampLabel("Local draft snapshot saved."));
  }

  function handleReset() {
    setDraftValues((current) => {
      const next = { ...current };

      for (const field of currentPage.fields) {
        next[field.key] = cloneValue(savedValues[field.key]);
      }

      return next;
    });

    setStatusMessage(timestampLabel("Current page reverted to last local snapshot."));
  }

  function handlePublish() {
    setStatusMessage(timestampLabel("Publish is still a placeholder. Payload writeback arrives in Step 5."));
  }

  return (
    <div className={styles.shell}>
      <div className={styles.frame}>
        <section className={styles.topbar}>
          <div className={styles.topbarCopy}>
            <p className={styles.eyebrow}>Visual Editor Shell</p>
            <h1 className={styles.title}>固定页面的三栏可视化编辑壳已经就位。</h1>
            <p className={styles.subtitle}>
              左侧来自 schema-driven 字段注册，中间 iframe 加载真实前台页面，右侧是选中字段的本地草稿编辑器。字段级 postMessage 联动和 Payload 持久化将在后续步骤接入。
            </p>
          </div>

          <div className={styles.topbarMeta}>
            <span className={styles.badge}>Route /admin/visual-editor</span>
            <span className={styles.badge}>Page {currentPage.title}</span>
            <span className={styles.badge}>Fields {currentPage.fields.length}</span>
          </div>
        </section>

        <section className={styles.layout}>
          <FieldListPanel onSelectField={setSelectedFieldKey} page={currentPage} selectedFieldKey={selectedFieldKey} />

          <div className={styles.panel}>
            <EditorToolbar
              dirtyCount={dirtyCount}
              onPageChange={handlePageChange}
              onPublish={handlePublish}
              onReset={handleReset}
              onSave={handleSave}
              pages={editablePages}
              selectedPageId={selectedPageId}
              statusMessage={statusMessage}
            />
            <div className={styles.panelBody} style={{ padding: 0 }}>
              <PreviewFrame page={currentPage} selectedField={selectedField} />
            </div>
          </div>

          <FieldInspectorPanel
            field={selectedField}
            onChangeValue={handleFieldValueChange}
            value={selectedField ? draftValues[selectedField.key] : undefined}
          />
        </section>
      </div>
    </div>
  );
}
