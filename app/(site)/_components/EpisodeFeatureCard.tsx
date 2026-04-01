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
  {
    id: "deep",
    label: "深度内容",
    rows: [
      { code: "长文", title: "注意力经济中的法律叙事" },
      { code: "论文", title: "平台治理与言论规范研究" },
      { code: "书摘", title: "法的叙事：核心论点摘录" },
    ],
    thumb: {
      badge: "▶",
      name: "长文",
      em: "注意力经济中的法律叙事",
      title: "《南方周末》2025 年度文章",
      stats: ["5.2万", "876", "全文"],
    },
  },
];

type EpisodeCardId = "podcast" | "media" | "deep";

export function EpisodeFeatureCard() {
  const [activeCard, setActiveCard] = useState<EpisodeCardId>("podcast");

  const current = episodeCards.find((c) => c.id === activeCard)!;

  return (
    <div className={styles.episodeFeatureCard}>
      {/* FIX 6: Upper content-card strip with stacked-push animation */}
      <div className={styles.episodeFeatureIndexStrip}>
        {episodeCards.map((card) => (
          <button
            className={`${styles.episodeFeatureIndexItem} ${activeCard === card.id ? styles.episodeFeatureIndexItemActive : ""}`}
            key={card.id}
            onClick={() => setActiveCard(card.id as EpisodeCardId)}
            type="button"
          >
            {card.label}
          </button>
        ))}
      </div>

      {/* FIX 6: Rows animate in as active card pushes forward */}
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

      {/* FIX 4 & 5: Main card — bigger title, better composition */}
      <div className={styles.episodeHeroThumb}>
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
    </div>
  );
}
