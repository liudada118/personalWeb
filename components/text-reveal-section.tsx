"use client";

import { useEffect, useRef, useState } from "react";

type TextRevealSectionProps = {
  title: string;
  paragraphs: string[];
  className?: string;
};

/**
 * Text Reveal Section - Inspired by sidneydekker.com
 * Character-by-character reveal animation on scroll
 */
export function TextRevealSection({ title, paragraphs, className = "" }: TextRevealSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress based on section position
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Progress goes from 0 (section entering viewport) to 1 (section leaving viewport)
      const rawProgress = 1 - (sectionTop + sectionHeight) / (windowHeight + sectionHeight);
      setProgress(Math.max(0, Math.min(1, rawProgress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className={`text-reveal-section ${className}`} ref={sectionRef}>
      <div className="text-reveal-container">
        <h2 className="text-reveal-title">{title}</h2>
        <div className="text-reveal-content">
          {paragraphs.map((paragraph, pIndex) => (
            <TextRevealParagraph
              key={pIndex}
              paragraph={paragraph}
              progress={progress}
              rangeStart={pIndex / paragraphs.length}
              rangeEnd={(pIndex + 1) / paragraphs.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type TextRevealParagraphProps = {
  paragraph: string;
  progress: number;
  rangeStart: number;
  rangeEnd: number;
};

function TextRevealParagraph({ paragraph, progress, rangeStart, rangeEnd }: TextRevealParagraphProps) {
  const characters = Array.from(paragraph);
  const localProgress = Math.max(0, Math.min(1, (progress - rangeStart) / (rangeEnd - rangeStart)));

  return (
    <p className="text-reveal-paragraph">
      {characters.map((char, index) => {
        const threshold = characters.length <= 1 ? 0 : index / (characters.length - 1);
        const charProgress = Math.max(0, Math.min(1, (localProgress - threshold + 0.1) / 0.1));
        const opacity = charProgress;

        return (
          <span
            className="text-reveal-char"
            key={`${char}-${index}`}
            style={{ opacity }}
          >
            {char}
          </span>
        );
      })}
    </p>
  );
}
