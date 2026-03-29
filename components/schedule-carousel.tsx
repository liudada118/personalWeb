"use client";

import { useEffect, useState } from "react";

import { VisualEditableText } from "@/components/visual-editable-text";
import type { ScheduleItem } from "@/lib/types";

type ScheduleCarouselEditConfig = {
  adminHref: string;
  globalSlug: string;
  previewHref: string;
};

type ScheduleCarouselProps = {
  editConfig?: ScheduleCarouselEditConfig;
  items: ScheduleItem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function ScheduleCarousel({ editConfig, items }: ScheduleCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length < 2 || paused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 4600);

    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  if (!items.length) {
    return null;
  }

  const activeItem = items[activeIndex];

  return (
    <div
      className={`schedule-card interactive-card${paused ? " is-paused" : ""}`}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onFocusCapture={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="schedule-head">
        <span>近期日程</span>
        <strong>{formatDate(activeItem.date)}</strong>
      </div>
      <div className="schedule-body">
        <h3>
          {editConfig ? (
            <VisualEditableText
              adminHref={editConfig.adminHref}
              as="span"
              fieldPath={`scheduleItems.${activeIndex}.title`}
              globalSlug={editConfig.globalSlug}
              label={`日程标题 ${activeIndex + 1}`}
              previewHref={editConfig.previewHref}
              value={activeItem.title}
            />
          ) : (
            activeItem.title
          )}
        </h3>
        <p>
          {editConfig ? (
            <VisualEditableText
              adminHref={editConfig.adminHref}
              as="span"
              fieldPath={`scheduleItems.${activeIndex}.description`}
              globalSlug={editConfig.globalSlug}
              label={`日程说明 ${activeIndex + 1}`}
              multiline
              previewHref={editConfig.previewHref}
              value={activeItem.description}
            />
          ) : (
            activeItem.description
          )}
        </p>
      </div>
      <div className="schedule-meta">
        <span>
          {editConfig ? (
            <VisualEditableText
              adminHref={editConfig.adminHref}
              as="span"
              fieldPath={`scheduleItems.${activeIndex}.venue`}
              globalSlug={editConfig.globalSlug}
              label={`日程地点 ${activeIndex + 1}`}
              previewHref={editConfig.previewHref}
              value={activeItem.venue}
            />
          ) : (
            activeItem.venue
          )}
        </span>
        <a href={activeItem.href} rel="noreferrer" target="_blank">
          查看安排
        </a>
      </div>
      <div className="schedule-tabs">
        {items.map((item, index) => (
          <button
            className={index === activeIndex ? "is-active" : ""}
            key={`${item.date}-${item.title}`}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            {formatDate(item.date)}
          </button>
        ))}
      </div>
    </div>
  );
}
