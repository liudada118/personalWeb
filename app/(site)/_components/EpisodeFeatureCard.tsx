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
      badge: "▶",
      name: "大喧哥",
      em: "饥饿 欲望 黑暗原力",
      title: "做题家的一种人生解法",
      stats: ["20.3万", "2932", "01:45:06"],
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
      badge: "▶",
      name: "演讲台",
      em: "法律叙事与公众表达",
      title: "从案例文件到公共叙事",
      stats: ["1500+", "48", "00:52:00"],
    },
  },
  {
    id: "book",
    label: "书籍专著",
    rows: [
      { code: "BOOK", title: "法的叙事" },
      { code: "ESSAY", title: "注意力经济中的法律叙事" },
      { code: "TALK", title: "法律叙事与内容传播" },
    ],
    thumb: {
      badge: "▶",
      name: "书籍",
      em: "系统性法律叙事作品",
      title: "构建个人品牌内容体系",
      stats: ["3部", "2篇", "5次"],
    },
  },
];

// Each card transition occupies 100vh of scroll distance
const SCROLL_PER_TRANSITION = 100; // vh units, converted to px via window.innerHeight
const STACK_OFFSET_Y = 72;          // px offset per collapsed card below the top
const COLLAPSED_SCALE = 0.96;       // scale of collapsed cards
const COLLAPSED_OPACITY = 0.45;     // opacity of collapsed cards

export function EpisodeFeatureCard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stackWrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const heroThumbRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // ---------------------------------------------------------------------------
  // 1. STATIC STRUCTURE
  // ---------------------------------------------------------------------------
  // HTML hierarchy:
  // <section.episodeFeatureSection>          <-- tall padding, scroll buffer
  //   <div.episodeFeatureSectionInner>       <-- GSAP pin target
  //     <div.episodeFeatureCard>
  //       <div.episodeFeatureStack>           <-- stacked cards container
  //         <div.episodeFeatureUpperCard /> × N
  //       <div.episodeFeatureRows />
  //       <div.episodeHeroThumb />
  //       <div.episodeFeatureProgress />
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // 2. SCROLLTRIGGER CONFIG
  // ---------------------------------------------------------------------------
  // - trigger: sectionRef (outer tall section)
  // - start: "top top" (section top hits viewport top → pin begins)
  // - end: "+=N" where N = (totalCards - 1) × 100vh
  // - pin: stackWrapRef (the inner container stays fixed during scroll)
  // - scrub: 1 (smooth 1-second lag)
  // - snap: snap to 1/N per card transition
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!sectionRef.current || !stackWrapRef.current) return;

    const totalCards = episodeCards.length;
    // Don't run ScrollTrigger if only one card
    if (totalCards <= 1) return;

    const scrollDistance = (totalCards - 1) * SCROLL_PER_TRANSITION * window.innerHeight;

    // Initialise all cards to their starting states
    // Card 0: expanded (top, full opacity, scale 1, zIndex = totalCards)
    // Card i>0: collapsed (stacked below, reduced opacity/scale, lower zIndex)
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      if (i === 0) {
        gsap.set(card, {
          height: "auto",
          opacity: 1,
          y: 0,
          scale: 1,
          zIndex: totalCards,
        });
      } else {
        gsap.set(card, {
          height: 0,
          opacity: COLLAPSED_OPACITY,
          y: -(i * STACK_OFFSET_Y),
          scale: COLLAPSED_SCALE,
          zIndex: totalCards - i,
        });
      }
    });

    const ctx = gsap.context(() => {
      // Create one ScrollTrigger for the whole section
      const st = ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: "top top",
        end: `+=${scrollDistance}`,
        pin: stackWrapRef.current,
        scrub: 1,
        snap: {
          snapTo: 1 / (totalCards - 1),
          duration: { min: 0.2, max: 0.6 },
          ease: "power2.inOut",
        },
        // 3. ACTIVE INDEX MAPPING
        // Map scroll progress (0→1) to card activeIndex
        onUpdate: (self) => {
          const rawIndex = Math.round(self.progress * (totalCards - 1));
          const clampedIndex = Math.max(0, Math.min(rawIndex, totalCards - 1));
          if (clampedIndex !== activeIndex) {
            setActiveIndex(clampedIndex);
          }
        },
      });

      // 4. CARD STATE TRANSITION ANIMATION
      // For each card transition segment, animate:
      //   - exiting card: collapse (height→0, y moves down, scale/opacity down)
      //   - entering card: expand  (height→auto, y→0, scale/opacity up)
      // We use gsap.to with scrollTrigger-aware timeline markers
      for (let i = 1; i < totalCards; i++) {
        const exitingCard = cardRefs.current[i - 1];
        const enteringCard = cardRefs.current[i];
        if (!exitingCard || !enteringCard) continue;

        // The start of this segment in the overall timeline
        // segment 0 = [0, 1/N], segment 1 = [1/N, 2/N], etc.
        const segmentStart = (i - 1) / (totalCards - 1);
        const segmentEnd = i / (totalCards - 1);

        // Exiting card collapses: starts at segmentStart, ends at segmentEnd
        // it "falls back" into the stack
        gsap.to(exitingCard, {
          height: 0,
          opacity: COLLAPSED_OPACITY,
          y: -(i * STACK_OFFSET_Y),
          scale: COLLAPSED_SCALE,
          zIndex: totalCards - i,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: "top top",
            end: `+=${scrollDistance}`,
            scrub: 1,
          },
          // keyframes: at segmentStart begin, at segmentEnd fully collapsed
          // We use snap-aware duration via the scrollTrigger scrub
        });

        // Entering card expands: starts at segmentStart, ends at segmentEnd
        gsap.to(enteringCard, {
          height: "auto",
          opacity: 1,
          y: 0,
          scale: 1,
          zIndex: totalCards,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: "top top",
            end: `+=${scrollDistance}`,
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [activeIndex]);

  // ---------------------------------------------------------------------------
  // 5. ROWS + HERO THUMB REACTIVITY
  // When activeIndex changes (after a card transition completes),
  // animate rows and hero thumb content swap
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!rowsRef.current.length || !heroThumbRef.current) return;

    const currentRows = episodeCards[activeIndex].rows;

    // Animate each row in with a staggered push
    rowsRef.current.forEach((row, i) => {
      if (!row) return;
      gsap.fromTo(
        row,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", delay: i * 0.07 }
      );
    });

    // Fade-swap the hero thumb
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
            duration: 0.4,
            ease: "power2.out",
          });
        }
      },
    });
  }, [activeIndex]);

  const current = episodeCards[activeIndex];

  return (
    <div className={styles.episodeFeatureSectionInner} ref={sectionRef}>
      <div className={styles.episodeFeatureCard} ref={stackWrapRef}>
        {/* ── Stacked Cards ── */}
        <div className={styles.episodeFeatureStack}>
          {episodeCards.map((card, i) => (
            <div
              className={`${styles.episodeFeatureUpperCard} ${activeIndex === i ? styles.episodeFeatureUpperCardActive : ""}`}
              key={card.id}
              ref={(el) => { cardRefs.current[i] = el; }}
            >
              <span className={styles.episodeFeatureUpperCardLabel}>{card.label}</span>
              <strong className={styles.episodeFeatureUpperCardTitle}>
                {card.rows[1]?.title ?? card.rows[0]?.title}
              </strong>
              <span className={styles.episodeFeatureUpperCardArrow}>›</span>
            </div>
          ))}
        </div>

        {/* ── Episode Rows ── */}
        <div className={styles.episodeFeatureRows}>
          {current.rows.map((row, index) => (
            <div
              className={`${styles.episodeFeatureRow} ${index === 1 ? styles.episodeFeatureRowActive : ""}`}
              key={`${row.code}-${activeIndex}`}
              ref={(el) => { if (el) rowsRef.current[index] = el; }}
            >
              <span className={styles.episodeFeatureRowCode}>{row.code}</span>
              <strong className={styles.episodeFeatureRowTitle}>{row.title}</strong>
              <span className={styles.episodeFeatureRowArrow}>›</span>
            </div>
          ))}
        </div>

        {/* ── Hero Thumbnail ── */}
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

        {/* ── Progress Dots ── */}
        <div className={styles.episodeFeatureProgress}>
          {episodeCards.map((_, i) => (
            <span
              key={i}
              className={`${styles.episodeFeatureDot} ${activeIndex === i ? styles.episodeFeatureDotActive : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
