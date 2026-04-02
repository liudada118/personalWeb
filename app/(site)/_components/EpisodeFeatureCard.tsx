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

const TOTAL_CARDS = episodeCards.length;

// Animation constants
const STACK_OFFSET_Y = 72;          // px vertical offset between stacked cards
const COLLAPSED_SCALE = 0.94;       // scale of collapsed (inactive) cards
const COLLAPSED_OPACITY = 0.38;     // opacity of collapsed cards
const EXPANDED_SCALE = 1;
const EXPANDED_OPACITY = 1;
const SNAP_DURATION_MIN = 0.2;
const SNAP_DURATION_MAX = 0.55;
const EASE = "power2.inOut";

export function EpisodeFeatureCard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const heroThumbRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef(-1);
  const [activeIndex, setActiveIndex] = useState(0);

  // ---------------------------------------------------------------------------
  // DOM hierarchy:
  // <section.episodeFeatureSection>           tall (min-height:300vh), scroll buffer
  //   <div.episodeFeatureSectionInner>        ref={sectionRef} — ScrollTrigger trigger
  //     <div.episodeFeatureCard>              ref={innerRef}  — GSAP pin target
  //       <div.episodeFeatureStack>           stacked upper cards container
  //         <div.episodeFeatureUpperCard /> × N   animated by GSAP
  //       <div.episodeFeatureRows />
  //       <div.episodeHeroThumb />
  //       <div.episodeFeatureProgress />
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // PHASE 1: Measure each card's expanded height (needed for height animation)
  // Runs once after mount via a separate useEffect with no deps.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Short pause so the DOM has rendered all card content at natural height
    const raf = requestAnimationFrame(() => {
      cardRefs.current.forEach((card) => {
        if (card) {
          // Store natural scrollHeight as a data attribute for GSAP to read
          (card as HTMLElement).dataset.expandedH = String(card.scrollHeight);
        }
      });
    });
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // PHASE 2: Set up GSAP + ScrollTrigger (runs once heights are measurable)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!sectionRef.current || !innerRef.current) return;

    const totalCards = TOTAL_CARDS;
    if (totalCards <= 1) return;

    const scrollDistance = (totalCards - 1) * window.innerHeight;

    // Initialise all cards to their starting states.
    // Card 0: expanded — full height, scale 1, opacity 1, zIndex = totalCards
    // Card i>0: collapsed — height 0, stacked below, reduced scale/opacity
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const expandedH = parseFloat((card as HTMLElement).dataset.expandedH || "0");
      gsap.set(card, {
        height: i === 0 ? (expandedH || "auto") : 0,
        opacity: i === 0 ? EXPANDED_OPACITY : COLLAPSED_OPACITY,
        y: i === 0 ? 0 : -(i * STACK_OFFSET_Y),
        scale: i === 0 ? EXPANDED_SCALE : COLLAPSED_SCALE,
        zIndex: i === 0 ? totalCards : totalCards - i,
        overflow: "hidden",
      });
    });

    const ctx = gsap.context(() => {
      // Single master timeline — all card transitions keyed to scroll progress
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: innerRef.current,
          scrub: 1.2,
          snap: {
            snapTo: 1 / (totalCards - 1),
            duration: { min: SNAP_DURATION_MIN, max: SNAP_DURATION_MAX },
            ease: EASE,
          },
          // Map scrub progress → activeIndex (React state only when segment changes)
          onUpdate(self) {
            const raw = Math.round(self.progress * (totalCards - 1));
            const idx = Math.max(0, Math.min(raw, totalCards - 1));
            if (idx !== lastActiveRef.current) {
              lastActiveRef.current = idx;
              setActiveIndex(idx);
            }
          },
        },
      });

      // For each segment i (transitioning from card i-1 to card i):
      //   exiting card i-1: collapses (y drops, scale↓, opacity↓, height→0)
      //   entering card i:   expands   (y→0,   scale↑, opacity↑, height→measured)
      for (let i = 1; i < totalCards; i++) {
        const exiting = cardRefs.current[i - 1];
        const entering = cardRefs.current[i];
        if (!exiting || !entering) continue;

        const segStart = (i - 1) / (totalCards - 1);
        const segEnd = i / (totalCards - 1);
        const holdEnd = Math.min(segEnd + 0.02, 1);

        const enteringExpandedH = parseFloat(
          (entering as HTMLElement).dataset.expandedH || "0"
        );

        // Exiting card collapses at the start of this segment
        tl.to(
          exiting,
          {
            y: -(i * STACK_OFFSET_Y),
            scale: COLLAPSED_SCALE,
            opacity: COLLAPSED_OPACITY,
            height: 0,
            ease: EASE,
          },
          segStart
        );
        tl.set(exiting, { zIndex: totalCards - i }, holdEnd);

        // Entering card expands simultaneously
        tl.fromTo(
          entering,
          {
            y: -(i * STACK_OFFSET_Y),
            scale: COLLAPSED_SCALE,
            opacity: COLLAPSED_OPACITY,
            height: 0,
          },
          {
            y: 0,
            scale: EXPANDED_SCALE,
            opacity: EXPANDED_OPACITY,
            height: enteringExpandedH || "auto",
            ease: EASE,
          },
          segStart
        );
        tl.set(entering, { zIndex: totalCards }, segStart);
      }
    }, sectionRef);

    return () => ctx.revert();
  // Runs when activeIndex changes → rebuilds gsap with updated expanded heights
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // ---------------------------------------------------------------------------
  // PHASE 3: Animate rows + hero thumb content swap when activeIndex changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!rowsRef.current.length || !heroThumbRef.current) return;

    // Stagger rows in with a subtle push
    rowsRef.current.forEach((row, i) => {
      if (!row) return;
      gsap.fromTo(
        row,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.32, ease: "power2.out", delay: i * 0.06 }
      );
    });

    // Fade-swap hero thumb: out → swap content → in
    const thumb = heroThumbRef.current;
    gsap.to(thumb, {
      opacity: 0,
      y: 14,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        gsap.to(thumb, { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" });
      },
    });
  }, [activeIndex]);

  const current = episodeCards[activeIndex];

  return (
    <div className={styles.episodeFeatureSectionInner} ref={sectionRef}>
      <div className={styles.episodeFeatureCard} ref={innerRef}>
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
