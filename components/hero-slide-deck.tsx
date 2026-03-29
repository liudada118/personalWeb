"use client";

import { useEffect, useState } from "react";

import { VisualEditableText } from "@/components/visual-editable-text";
import type { HeroSlide } from "@/lib/types";

type HeroSlideDeckEditConfig = {
  adminHref: string;
  globalSlug: string;
  previewHref: string;
};

type HeroSlideDeckProps = {
  editConfig?: HeroSlideDeckEditConfig;
  slides: HeroSlide[];
};

export function HeroSlideDeck({ editConfig, slides }: HeroSlideDeckProps) {
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
          <span>
            {editConfig ? (
              <VisualEditableText
                adminHref={editConfig.adminHref}
                as="span"
                fieldPath={`heroSlides.${activeIndex}.eyebrow`}
                globalSlug={editConfig.globalSlug}
                label={`轮播 Eyebrow ${activeIndex + 1}`}
                previewHref={editConfig.previewHref}
                value={activeSlide.eyebrow}
              />
            ) : (
              activeSlide.eyebrow
            )}
          </span>
          <strong>
            {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </strong>
        </div>
        <h3>
          {editConfig ? (
            <VisualEditableText
              adminHref={editConfig.adminHref}
              as="span"
              fieldPath={`heroSlides.${activeIndex}.title`}
              globalSlug={editConfig.globalSlug}
              label={`轮播标题 ${activeIndex + 1}`}
              previewHref={editConfig.previewHref}
              value={activeSlide.title}
            />
          ) : (
            activeSlide.title
          )}
        </h3>
        <p>
          {editConfig ? (
            <VisualEditableText
              adminHref={editConfig.adminHref}
              as="span"
              fieldPath={`heroSlides.${activeIndex}.description`}
              globalSlug={editConfig.globalSlug}
              label={`轮播说明 ${activeIndex + 1}`}
              multiline
              previewHref={editConfig.previewHref}
              value={activeSlide.description}
            />
          ) : (
            activeSlide.description
          )}
        </p>
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
