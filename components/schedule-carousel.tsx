"use client";

import { useEffect, useState } from "react";

import type { ScheduleItem } from "@/lib/types";

type ScheduleCarouselProps = {
  items: ScheduleItem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function ScheduleCarousel({ items }: ScheduleCarouselProps) {
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
        <h3>{activeItem.title}</h3>
        <p>{activeItem.description}</p>
      </div>
      <div className="schedule-meta">
        <span>{activeItem.venue}</span>
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
