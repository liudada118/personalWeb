"use client";

import { useMemo } from "react";

import type { EditablePageDefinition } from "@/lib/page-content/registry";

import styles from "./visual-editor-shell.module.css";

type FieldListPanelProps = {
  onSelectField: (fieldKey: string) => void;
  page: EditablePageDefinition;
  selectedFieldKey?: string;
};

export function FieldListPanel({ onSelectField, page, selectedFieldKey }: FieldListPanelProps) {
  const groupedFields = useMemo(() => {
    const groups = new Map<string, EditablePageDefinition["fields"]>();

    for (const field of page.fields) {
      const existing = groups.get(field.section) ?? [];
      existing.push(field);
      groups.set(field.section, existing);
    }

    return Array.from(groups.entries());
  }, [page.fields]);

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>字段列表</h2>
        <p className={styles.panelText}>{page.description}</p>
      </div>

      <div className={styles.panelBody}>
        <div className={styles.fieldList}>
          {groupedFields.map(([section, fields]) => (
            <section className={styles.fieldGroup} key={section}>
              <h3 className={styles.fieldGroupTitle}>{section}</h3>

              {fields.map((field) => {
                const active = field.key === selectedFieldKey;

                return (
                  <button
                    className={`${styles.fieldButton} ${active ? styles.fieldButtonActive : ""}`.trim()}
                    key={field.key}
                    onClick={() => onSelectField(field.key)}
                    type="button"
                  >
                    <div className={styles.fieldLabelRow}>
                      <span className={styles.fieldLabel}>{field.label}</span>
                      <span className={styles.fieldType}>{field.type}</span>
                    </div>
                    <div className={styles.fieldKey}>{field.key}</div>
                  </button>
                );
              })}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
