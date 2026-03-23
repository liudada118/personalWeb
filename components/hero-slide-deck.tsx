"use client";

import { useEffect, useState } from "react";

import type { HeroSlide } from "@/lib/types";

type HeroSlideDeckProps = {
  slides: HeroSlide[];
};

export function HeroSlideDeck({ slides }: HeroSlideDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (!slides.length) {
    return null;
  }

  const activeSlide = slides[activeIndex];

  return (
    <div
      className={`rotator-card interactive-card${paused ? " is-paused" : ""}`}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onFocusCapture={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`rotator-visual${activeSlide.imageUrl ? " has-image" : ""}`}
        style={activeSlide.imageUrl ? { backgroundImage: `url(${activeSlide.imageUrl})` } : undefined}
      />
      <div className="rotator-copy">
        <div className="rotator-head">
          <span>{activeSlide.eyebrow}</span>
          <strong>
            {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </strong>
        </div>
        <h3>{activeSlide.title}</h3>
        <p>{activeSlide.description}</p>
        <a href={activeSlide.href} rel="noreferrer" target="_blank">
          查看详情
        </a>
      </div>
      <div className="rotator-dots" role="tablist" aria-label="首页工作场景轮换">
        {slides.map((slide, index) => (
          <button
            aria-label={slide.title}
            aria-selected={index === activeIndex}
            className={index === activeIndex ? "is-active" : ""}
            key={slide.title}
            onClick={() => setActiveIndex(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
