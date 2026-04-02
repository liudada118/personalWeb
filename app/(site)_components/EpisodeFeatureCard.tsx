"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "../liu-home.module.css";

gsap.registerPlugin(ScrollTrigger);

const episodeCards = [
  {
    id: "podcast",
    label: "播客节目",
    rows: [
      { code: "EP01", title: "Can Law Survive the Attention Economy?" },
      { code: "EP02", title: "From Case File to Public Narrative" },
      { code: "EP03", title: "Winner's Hunger, Desire & Dark Force" },
    ],
    thumb: {
      badge: "EP",
      name: "大喧",
      em: "饥饿 欲望 黑暗原力",
      title: "做题家的一种人生解",
      stats: ["20.3", "2932", "01:45:06"],
    },
  },
  {
    id: "media",
    label: "媒体活动",
    rows: [
      { code: "活动一", title: "单向街书店 2025 演讲" },
      { code: "活动二", title: "《南方周末》访谈" },
      { code: "活动三", title: "法律叙事与内容传播论坛" },
    ],
    thumb: {
      badge: "活动",
      name: "演讲",
      em: "法律叙事与公众表达",
      title: "从案例文件到公共叙事",
      stats: ["1500+", "48", "00:52:00"],
    },
  },
];

const STACK_OFFSET = 72; // px offset per stacked card (collapsed height + gap)
const SCROLL_SEGMENT_PX = 400; // pixels per card transition

export function EpisodeFeatureCard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const heroThumbRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  // Update ref when activeIndex changes
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Main GSAP ScrollTrigger effect
  useEffect(() => {
    if (!sectionRef.current || !stackRef.current) return;

    const totalCards = episodeCards.length;
    const scrollSegments = totalCards - 1;
    const totalScrollDistance = scrollSegments * SCROLL_SEGMENT_PX;

    // Set initial states
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      if (i === 0) {
        gsap.set(card, { height: "auto", opacity: 1, y: 0, scale: 1, zIndex: totalCards });
      } else {
        gsap.set(card, {
          height: 0,
          opacity: 0.5,
          y: -(i * STACK_OFFSET),
          scale: 1 - i * 0.04,
          zIndex: totalCards - i,
        });
      }
    });

    // Create ScrollTrigger
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${totalScrollDistance}`,
      pin: true,
      pinSpacing: true,
      scrub: 1.5,
      snap: {
        snapTo: 1 / scrollSegments,
        duration: { min: 0.2, max: 0.6 },
        delay: 0,
        ease: "power2.inOut",
      },
      onUpdate: (self) => {
        const rawIndex = Math.round(self.progress * scrollSegments);
        const clampedIndex = Math.max(0, Math.min(rawIndex, scrollSegments));
        if (clampedIndex !== activeIndexRef.current) {
          setActiveIndex(clampedIndex);
        }
      },
    });

    // Create timeline for card transitions
    const tl = gsap.timeline({ scrollTrigger: st });

    for (let i = 1; i < totalCards; i++) {
      const exitingCard = cardRefs.current[i - 1];
      const enteringCard = cardRefs.current[i];

      if (!exitingCard || !enteringCard) continue;

      // Previous card collapses
      tl.to(
        exitingCard,
        {
          height: 0,
          opacity: 0.4,
          y: -(i * STACK_OFFSET),
          scale: 1 - i * 0.04,
          duration: 1,
          ease: "power2.inOut",
        },
        i - 1
      );

      // New card expands
      tl.to(
        enteringCard,
        {
          height: "auto",
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power2.inOut",
        },
        i - 1
      );
    }

    return () => {
      st.kill();
    };
  }, []); // Empty deps - only run once on mount

  // Animate rows and hero thumb when activeIndex changes
  useEffect(() => {
    if (!rowsRef.current.length || !heroThumbRef.current) return;

    // Animate rows in
    rowsRef.current.forEach((row, i) => {
      if (!row) return;
      gsap.fromTo(
        row,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
          delay: i * 0.05,
        }
      );
    });

    // Animate hero thumb transition
    gsap.to(heroThumbRef.current, {
      opacity: 0,
      y: 12,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        if (heroThumbRef.current) {
          gsap.to(heroThumbRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          });
        }
      },
    });
  }, [activeIndex]);

  const current = episodeCards[activeIndex];

  return (
    <div className={styles.episodeFeatureSectionInner} ref={sectionRef}>
      <div className={styles.episodeFeatureCard} ref={stackRef}>
        {/* Stacked Cards — dark index bars with order */}
        <div className={styles.episodeFeatureStack}>
          {episodeCards.map((card, i) => (
            <div
              className={`${styles.episodeFeatureUpperCard} ${activeIndex === i ? styles.episodeFeatureUpperCardActive : ""}`}
              key={card.id}
              ref={(el) => { cardRefs.current[i] = el; }}
            >
              <span className={styles.episodeFeatureUpperCardOrder}>0{i + 1}</span>
              <span className={styles.episodeFeatureUpperCardLabel}>{card.label}</span>
              <strong className={styles.episodeFeatureUpperCardTitle}>
                {card.rows[1]?.title ?? card.rows[0]?.title}
              </strong>
              <span className={styles.episodeFeatureUpperCardArrow}>→</span>
            </div>
          ))}
        </div>

        {/* Hero Thumb — large video cover as the main visual anchor */}
        <div
          className={styles.episodeHeroThumb}
          key={`${activeIndex}-thumb`}
          ref={heroThumbRef}
        >
          <div className={styles.episodeHeroBadge}>{current.thumb.badge}</div>
          <div className={styles.episodeHeroHeadline}>
            <span>{current.thumb.name}</span>
            <em>{current.thumb.em}</em>
            <strong>{current.thumb.title}</strong>
          </div>
          <div className={styles.episodeHeroStats}>
            {current.thumb.stats.map((s, i) => (
              <span key={`stat-${i}`}>{s}</span>
            ))}
          </div>
        </div>

        {/* Rows — revealed when a card is expanded */}
        <div className={styles.episodeFeatureRows}>
          {current.rows.map((row, index) => (
            <div
              className={`${styles.episodeFeatureRow} ${index === 1 ? styles.episodeFeatureRowActive : ""}`}
              key={`${row.code}-${activeIndex}`}
              ref={(el) => { if (el) rowsRef.current[index] = el; }}
            >
              <span className={styles.episodeFeatureRowCode}>{row.code}</span>
              <strong className={styles.episodeFeatureRowTitle}>{row.title}</strong>
              <span className={styles.episodeFeatureRowArrow}>→</span>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className={styles.episodeFeatureProgress}>
          {episodeCards.map((_, i) => (
            <span
              key={i}
              className={`${styles.episodeFeatureDot} ${activeIndex === i ? styles.episodeFeatureDotActive : ""}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes episodeCardPush {
          0% { opacity: 0; transform: translateY(12px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
