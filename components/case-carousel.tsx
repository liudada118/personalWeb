"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
          <span>{activeItem.category}</span>
          <span>{activeItem.year}</span>
        </div>
        <h3>{activeItem.title}</h3>
        <p>{activeItem.summary}</p>
        <ul className="simple-list compact-list">
          {activeItem.highlights.map((item) => (
            <li key={item}>{item}</li>
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
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
