"use client";

import { useMemo, type CSSProperties } from "react";

type ScrollRevealTextProps = {
  activeAlpha?: number;
  as?: "div" | "h2" | "h3" | "p" | "span";
  className?: string;
  mutedAlpha?: number;
  progress: number;
  rangeEnd?: number;
  rangeStart?: number;
  softness?: number;
  text: string;
  transitionMs?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ScrollRevealText({
  activeAlpha = 1.0,
  as = "p",
  className,
  mutedAlpha = 0.15,
  progress,
  rangeEnd = 1,
  rangeStart = 0,
  softness = 0.08,
  text,
  transitionMs = 280,
}: ScrollRevealTextProps) {
  const characters = useMemo(() => Array.from(text), [text]);
  const Element = as;
  const localProgress = clamp((progress - rangeStart) / Math.max(rangeEnd - rangeStart, 0.0001), 0, 1);

  return (
    <Element
      aria-label={text}
      className={`scroll-reveal-text${className ? ` ${className}` : ""}`}
      data-reveal-text=""
    >
      {characters.map((character, index) => {
        const threshold = characters.length <= 1 ? 0 : index / (characters.length - 1);
        const charProgress = clamp((localProgress - threshold + softness) / Math.max(softness, 0.0001), 0, 1);
        const alpha = mutedAlpha + (activeAlpha - mutedAlpha) * charProgress;

        return (
          <span
            aria-hidden="true"
            className="scroll-reveal-char"
            key={`${character}-${index}`}
            style={
              {
                "--char-opacity": alpha.toFixed(3),
                "--char-transition": `${transitionMs}ms`,
              } as CSSProperties
            }
          >
            {character}
          </span>
        );
      })}
    </Element>
  );
}
