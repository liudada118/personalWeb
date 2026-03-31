"use client";

import type { EditableFieldDefinition } from "@/lib/page-content/registry";
import type { PageContentImageValue, PageContentLinkValue, PageContentValue } from "@/lib/types";

import styles from "./visual-editor-shell.module.css";

type FieldInspectorPanelProps = {
  field?: EditableFieldDefinition | null;
  onChangeValue: (value: PageContentValue) => void;
  value?: PageContentValue;
};

function asLinkValue(value: PageContentValue | undefined): PageContentLinkValue {
  if (value && typeof value === "object" && !Array.isArray(value) && "label" in value && "href" in value) {
    const candidate = value as Partial<PageContentLinkValue>;

    return {
      label: typeof candidate.label === "string" ? candidate.label : "",
      href: typeof candidate.href === "string" ? candidate.href : "",
    };
  }

  return {
    label: "",
    href: "",
  };
}

function asImageValue(value: PageContentValue | undefined): PageContentImageValue {
  if (value && typeof value === "object" && !Array.isArray(value) && "mediaId" in value) {
    const candidate = value as Partial<PageContentImageValue>;

    return {
      mediaId: typeof candidate.mediaId === "string" || typeof candidate.mediaId === "number" ? candidate.mediaId : "",
      alt: typeof candidate.alt === "string" ? candidate.alt : "",
    };
  }

  return {
    mediaId: "",
    alt: "",
  };
}

export function FieldInspectorPanel({ field, onChangeValue, value }: FieldInspectorPanelProps) {
  if (!field) {
    return (
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>字段编辑器</h2>
          <p className={styles.panelText}>从左侧选择一个字段后，这里会出现对应控件。</p>
        </div>

        <div className={styles.panelBody}>
          <div className={styles.emptyState}>先选择一个字段，再在右侧调整占位草稿值。</div>
        </div>
      </div>
    );
  }

  const linkValue = asLinkValue(value);
  const imageValue = asImageValue(value);

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>{field.label}</h2>
        <p className={styles.panelText}>{field.description || "这个字段已经注册进 Visual Editor schema，可在下一步接入 iframe 实时联动。"}</p>

        <div className={styles.infoList}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Field Key</span>
            <div className={styles.infoValue}>{field.key}</div>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Field Type</span>
            <div className={styles.infoValue}>{field.type}</div>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Section</span>
            <div className={styles.infoValue}>{field.section}</div>
          </div>
        </div>
      </div>

      <div className={styles.panelBody}>
        <div className={styles.formGrid}>
          {(field.type === "text" || field.type === "textarea" || field.type === "richtext") && (
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel} htmlFor={field.key}>
                {field.type === "richtext" ? "Rich text (MVP textarea)" : "Content"}
              </label>
              <span className={styles.controlHelp}>
                {field.type === "text" ? "单行文本字段。" : "这一阶段先用 textarea 占位，后续再接实际 iframe 联动和 Payload 保存。"}
              </span>
              {field.type === "text" ? (
                <input
                  className={styles.input}
                  id={field.key}
                  onChange={(event) => onChangeValue(event.target.value)}
                  placeholder={field.placeholder}
                  type="text"
                  value={typeof value === "string" ? value : ""}
                />
              ) : (
                <textarea
                  className={styles.textarea}
                  id={field.key}
                  onChange={(event) => onChangeValue(event.target.value)}
                  placeholder={field.placeholder}
                  value={typeof value === "string" ? value : ""}
                />
              )}
            </div>
          )}

          {field.type === "boolean" && (
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel} htmlFor={field.key}>
                Toggle
              </label>
              <label className={styles.checkboxRow} htmlFor={field.key}>
                <input
                  checked={Boolean(value)}
                  id={field.key}
                  onChange={(event) => onChangeValue(event.target.checked)}
                  type="checkbox"
                />
                <span>{Boolean(value) ? "Enabled" : "Disabled"}</span>
              </label>
            </div>
          )}

          {field.type === "link" && (
            <>
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel} htmlFor={`${field.key}-label`}>
                  Link label
                </label>
                <input
                  className={styles.input}
                  id={`${field.key}-label`}
                  onChange={(event) => onChangeValue({ ...linkValue, label: event.target.value })}
                  type="text"
                  value={linkValue.label}
                />
              </div>
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel} htmlFor={`${field.key}-href`}>
                  Link href
                </label>
                <input
                  className={styles.input}
                  id={`${field.key}-href`}
                  onChange={(event) => onChangeValue({ ...linkValue, href: event.target.value })}
                  type="text"
                  value={linkValue.href}
                />
              </div>
            </>
          )}

          {field.type === "image" && (
            <>
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel} htmlFor={`${field.key}-media`}>
                  Media ID
                </label>
                <input
                  className={styles.input}
                  id={`${field.key}-media`}
                  onChange={(event) => onChangeValue({ ...imageValue, mediaId: event.target.value })}
                  type="text"
                  value={String(imageValue.mediaId ?? "")}
                />
              </div>
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel} htmlFor={`${field.key}-alt`}>
                  Alt text
                </label>
                <input
                  className={styles.input}
                  id={`${field.key}-alt`}
                  onChange={(event) => onChangeValue({ ...imageValue, alt: event.target.value })}
                  type="text"
                  value={imageValue.alt || ""}
                />
              </div>
            </>
          )}

          <div className={styles.mutedBox}>
            Save / Publish 在这一步仍然是本地壳层占位。下一步会接入 iframe selection 和 postMessage，之后再把数据真正写回 Payload。
          </div>
        </div>
      </div>
    </div>
  );
}
