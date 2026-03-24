"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { ScrollRevealText } from "@/components/scroll-reveal-text";

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

  useEffect(() => {
    const updateProgress = () => {
      const node = sectionRef.current;
      if (!node) {
        return;
      }

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 0.1;
      const end = rect.height - viewportHeight * 0.18;
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
          const segmentSize = 1 / Math.max(principles.length, 1);
          const segmentStart = index * segmentSize;
          const segmentEnd = segmentStart + segmentSize;
          const bodyStart = segmentStart + segmentSize * 0.14;

          return (
            <article className="value-principle" key={item.title}>
              <ScrollRevealText
                as="h3"
                className="value-principle-title"
                progress={progress}
                rangeEnd={segmentEnd}
                rangeStart={segmentStart}
                softness={0.11}
                text={item.title}
                transitionMs={260}
              />
              <ScrollRevealText
                activeAlpha={0.72}
                as="p"
                className="value-principle-body"
                mutedAlpha={0.12}
                progress={progress}
                rangeEnd={segmentEnd}
                rangeStart={bodyStart}
                softness={0.09}
                text={item.body}
                transitionMs={240}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}
