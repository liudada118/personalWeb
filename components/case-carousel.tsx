"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { VisualEditableText } from "@/components/visual-editable-text";
import type { CaseStudy } from "@/lib/types";

type CaseCarouselProps = {
  items: CaseStudy[];
};

export function CaseCarousel({ items }: CaseCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length < 2 || paused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 5600);

    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  if (!items.length) {
    return null;
  }

  const activeItem = items[activeIndex];

  return (
    <div
      className={`case-showcase interactive-card${paused ? " is-paused" : ""}`}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onFocusCapture={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="case-current">
        <div className="case-badge-row">
          <span>
            <VisualEditableText
              adminHref="/cms/admin/collections/caseStudies"
              as="span"
              collectionSlug="caseStudies"
              documentId={activeItem._id}
              fieldPath="category"
              label="案例分类"
              previewHref="/"
              value={activeItem.category}
            />
          </span>
          <span>
            <VisualEditableText
              adminHref="/cms/admin/collections/caseStudies"
              as="span"
              collectionSlug="caseStudies"
              documentId={activeItem._id}
              fieldPath="year"
              label="案例年份"
              previewHref="/"
              value={activeItem.year}
            />
          </span>
        </div>
        <h3>
          <VisualEditableText
            adminHref="/cms/admin/collections/caseStudies"
            as="span"
            collectionSlug="caseStudies"
            documentId={activeItem._id}
            fieldPath="title"
            label="案例标题"
            previewHref="/"
            value={activeItem.title}
          />
        </h3>
        <p>
          <VisualEditableText
            adminHref="/cms/admin/collections/caseStudies"
            as="span"
            collectionSlug="caseStudies"
            documentId={activeItem._id}
            fieldPath="summary"
            label="案例摘要"
            multiline
            previewHref="/"
            value={activeItem.summary}
          />
        </p>
        <ul className="simple-list compact-list">
          {activeItem.highlights.map((item, index) => (
            <li key={item}>
              <VisualEditableText
                adminHref="/cms/admin/collections/caseStudies"
                as="span"
                collectionSlug="caseStudies"
                documentId={activeItem._id}
                fieldPath={`highlights.${index}.value`}
                label={`案例亮点 ${index + 1}`}
                previewHref="/"
                value={item}
              />
            </li>
          ))}
        </ul>
        <Link href={`/cases/${activeItem.slug}`}>查看案例详情</Link>
      </div>
      <div className="case-nav">
        {items.map((item, index) => (
          <button
            className={index === activeIndex ? "is-active" : ""}
            key={item._id}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            <span>{item.year}</span>
            <strong>
              <VisualEditableText
                adminHref="/cms/admin/collections/caseStudies"
                as="span"
                collectionSlug="caseStudies"
                documentId={item._id}
                fieldPath="title"
                label="案例导航标题"
                previewHref="/"
                value={item.title}
              />
            </strong>
          </button>
        ))}
      </div>
    </div>
  );
}
