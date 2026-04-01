"use client";

import { useState } from "react";

import styles from "../liu-home.module.css";

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
];

type EpisodeCardId = "podcast" | "media" | "deep";

export function EpisodeFeatureCard() {
  const [activeCard, setActiveCard] = useState<EpisodeCardId>("podcast");

  const current = episodeCards.find((c) => c.id === activeCard)!;

  return (
    <div className={styles.episodeFeatureCard}>
      {/* FIX 6: Two stacked upper content cards — layered push interaction */}
      <div className={styles.episodeFeatureUpperCards}>
        {episodeCards.map((card) => (
          <button
            className={`${styles.episodeFeatureUpperCard} ${activeCard === card.id ? styles.episodeFeatureUpperCardActive : ""}`}
            key={card.id}
            onClick={() => setActiveCard(card.id as EpisodeCardId)}
            type="button"
          >
            <span className={styles.episodeFeatureUpperCardLabel}>{card.label}</span>
            <strong className={styles.episodeFeatureUpperCardTitle}>
              {card.rows[1]?.title ?? card.rows[0]?.title}
            </strong>
            <span className={styles.episodeFeatureUpperCardArrow}>›</span>
          </button>
        ))}
      </div>

      {/* FIX 6: Rows animate in as active card pushes forward into main card */}
      <div className={styles.episodeFeatureRows}>
        {current.rows.map((row, index) => (
          <div
            className={`${styles.episodeFeatureRow} ${index === 1 ? styles.episodeFeatureRowActive : ""}`}
            key={`${row.code}-${activeCard}`}
          >
            <span className={styles.episodeFeatureRowCode}>{row.code}</span>
            <strong className={styles.episodeFeatureRowTitle}>{row.title}</strong>
            <span className={styles.episodeFeatureRowArrow}>›</span>
          </div>
        ))}
      </div>

      {/* FIX 4 & 5: Main card — bigger title, better composition, layered push */}
      <div
        className={styles.episodeHeroThumb}
        key={activeCard}
        style={{
          animation: "episodeCardPush 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        }}
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

      <style>{`
        @keyframes episodeCardPush {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
