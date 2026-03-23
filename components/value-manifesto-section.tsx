"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type ManifestoItem = {
  title: string;
  body: string;
};

type ValueManifestoSectionProps = {
  eyebrow: string;
  title: string;
  principles: ManifestoItem[];
  footnotes: string[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ValueManifestoSection({
  eyebrow,
  title,
  principles,
  footnotes,
}: ValueManifestoSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const scaledProgress = progress * principles.length;
  const activeIndex = clamp(Math.floor(scaledProgress), 0, Math.max(principles.length - 1, 0));
  const currentProgress = clamp(scaledProgress - activeIndex, 0, 1);

  useEffect(() => {
    const updateProgress = () => {
      const node = sectionRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 0.18;
      const end = rect.height - viewportHeight * 0.52;
      const rawProgress = (-rect.top + start) / Math.max(end, 1);

      setProgress(clamp(rawProgress, 0, 1));
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="container value-shell value-scroll-shell"
      ref={sectionRef}
      style={{ "--value-progress": progress.toFixed(4) } as CSSProperties}
    >
      <div className="value-pane-sticky">
        <div className="value-heading">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>

        <div className="value-body value-footnotes">
          {footnotes.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>

      <div className="value-principles value-principles-scroll" aria-label="理念列表">
        {principles.map((item, index) => {
          const stateClass =
            index < activeIndex ? " is-past" : index === activeIndex ? " is-current" : "";

          return (
            <article
              className={`value-principle${stateClass}`}
              key={item.title}
              style={
                index === activeIndex
                  ? ({ "--value-current-progress": currentProgress.toFixed(4) } as CSSProperties)
                  : undefined
              }
            >
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
