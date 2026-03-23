"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { withBasePath } from "@/lib/site-paths";
import type { DashboardStats } from "@/lib/types";

type EntryCard = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  tone?: "primary" | "secondary";
};

const entryCards: EntryCard[] = [
  {
    eyebrow: "推荐入口",
    title: "内容工作台",
    description: "日常改首页、介绍页、媒体页和联系页时，直接在这里完成编辑、草稿预览和全屏检查。",
    href: "/cms/admin/workbench",
    actionLabel: "进入内容工作台",
    tone: "primary",
  },
  {
    eyebrow: "高级入口",
    title: "高级管理",
    description: "只有在需要管理账号、版本细节、集合列表、API 或完整后台结构时，再进入原生 Payload Admin。",
    href: "/cms/admin",
    actionLabel: "进入高级管理",
    tone: "secondary",
  },
  {
    eyebrow: "资源入口",
    title: "素材文件",
    description: "查看媒体素材、历史上传资源和文件占用情况，便于整理图片、视频和 PDF。",
    href: "/cms/files",
    actionLabel: "打开素材文件",
    tone: "secondary",
  },
];

export function DashboardTool() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  async function loadStats() {
    setLoading(true);
    const response = await fetch(withBasePath("/api/admin/stats"));
    const data = (await response.json()) as DashboardStats;
    setStats(data);
    setLoading(false);
  }

  useEffect(() => {
    loadStats().catch(() => setLoading(false));
  }, []);

  async function handleClearCache() {
    setClearing(true);
    await fetch(withBasePath("/api/admin/clear-cache"), { method: "POST" });
    await loadStats();
    setClearing(false);
  }

  if (loading) {
    return <div className="cms-tool cms-empty">正在读取管理总台数据...</div>;
  }

  if (!stats) {
    return <div className="cms-tool cms-empty">暂时无法读取仪表盘数据。</div>;
  }

  const trafficDelta = stats.todayViews - stats.yesterdayViews;
  const trafficDirection = trafficDelta > 0 ? "up" : trafficDelta < 0 ? "down" : "flat";
  const trafficText =
    trafficDirection === "up"
      ? `较昨日增加 ${trafficDelta}`
      : trafficDirection === "down"
        ? `较昨日减少 ${Math.abs(trafficDelta)}`
        : "与昨日持平";
  const trafficBase = Math.max(stats.todayViews, stats.yesterdayViews, 1);
  const totalContent = stats.articleCount + stats.caseCount + stats.podcastCount;

  const kpis = [
    {
      label: "内容总量",
      value: totalContent,
      note: `文章 ${stats.articleCount} / 案例 ${stats.caseCount} / 播客 ${stats.podcastCount}`,
    },
    {
      label: "线索与咨询",
      value: stats.contactCount,
      note: "联系表单与后台线索记录",
    },
    {
      label: "素材资源",
      value: stats.assetCount,
      note: "图片、视频与 PDF 上传数",
    },
    {
      label: "更新项目",
      value: stats.updateCount,
      note: "案例与播客内容总和",
    },
  ];

  const contentBreakdown = [
    { label: "媒体文章", value: stats.articleCount, hint: "媒体代表作与公开内容" },
    { label: "案例库", value: stats.caseCount, hint: "首页轮播与案例详情页" },
    { label: "播客单集", value: stats.podcastCount, hint: "Tiger Legal Talks 节目内容" },
    { label: "联系线索", value: stats.contactCount, hint: "访客咨询与合作意向" },
    { label: "素材文件", value: stats.assetCount, hint: "图片、视频、PDF 等上传资源" },
  ];

  const maxContentValue = Math.max(...contentBreakdown.map((item) => item.value), 1);

  return (
    <div className="cms-dashboard">
      <section className="cms-overview-hero">
        <div className="cms-overview-copy">
          <p className="eyebrow">管理总台</p>
          <h2>把日常编辑、预览、发布和高级管理收成一条更清楚的工作流。</h2>
          <p className="section-description">
            日常只需要进入 <code>/cms/admin/workbench</code>。在那里改草稿、看预览、做全屏检查；只有在需要管理账号、列表结构、
            版本细节和完整系统能力时，再进入原生后台。
          </p>

          <div className="cms-entry-grid">
            {entryCards.map((item) => (
              <article className={`cms-entry-card${item.tone === "primary" ? " is-primary" : ""}`} key={item.title}>
                <span className="cms-entry-eyebrow">{item.eyebrow}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link className={item.tone === "primary" ? "button-primary" : "button-secondary"} href={item.href}>
                  {item.actionLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>

        <aside className="cms-pulse-card">
          <div className="cms-pulse-head">
            <span className="cms-pulse-label">今日站点脉搏</span>
            <span className={`cms-trend-pill is-${trafficDirection}`}>{trafficText}</span>
          </div>

          <div className="cms-pulse-value">
            <strong>{stats.todayViews}</strong>
            <p>今日访问</p>
          </div>

          <div className="cms-pulse-bars">
            <div className="cms-pulse-row">
              <div className="cms-pulse-row-top">
                <span>今日</span>
                <strong>{stats.todayViews}</strong>
              </div>
              <div className="cms-meter is-dark">
                <span style={{ width: `${(stats.todayViews / trafficBase) * 100}%` }} />
              </div>
            </div>

            <div className="cms-pulse-row">
              <div className="cms-pulse-row-top">
                <span>昨日</span>
                <strong>{stats.yesterdayViews}</strong>
              </div>
              <div className="cms-meter">
                <span style={{ width: `${(stats.yesterdayViews / trafficBase) * 100}%` }} />
              </div>
            </div>
          </div>

          <dl className="cms-pulse-meta">
            <div>
              <dt>缓存占用</dt>
              <dd>{stats.cacheSize}</dd>
            </div>
            <div>
              <dt>存储占用</dt>
              <dd>{stats.serverStorageUsed}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="cms-kpi-grid">
        {kpis.map((item) => (
          <article className="cms-kpi-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.note}</p>
          </article>
        ))}
      </section>

      <section className="cms-visual-grid">
        <article className="cms-panel">
          <div className="cms-panel-heading">
            <div>
              <p className="eyebrow">内容结构</p>
              <h3>内容矩阵一眼就能看清</h3>
            </div>
            <span className="cms-panel-badge">总量 {totalContent}</span>
          </div>

          <div className="cms-content-map">
            {contentBreakdown.map((item) => (
              <div className="cms-content-row" key={item.label}>
                <div className="cms-content-row-top">
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.hint}</p>
                  </div>
                  <span>{item.value}</span>
                </div>
                <div className="cms-bar">
                  <span style={{ width: `${(item.value / maxContentValue) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <div className="cms-side-panels">
          <article className="cms-panel">
            <div className="cms-panel-heading">
              <div>
                <p className="eyebrow">工作流</p>
                <h3>把日常流程压缩成三步</h3>
              </div>
            </div>

            <div className="cms-flow-list">
              <div className="cms-flow-step">
                <span className="cms-flow-index">1</span>
                <div>
                  <strong>进入内容工作台</strong>
                  <p>从同一页面完成编辑、草稿预览和全屏视觉检查，不再来回切多个后台页面。</p>
                </div>
              </div>
              <div className="cms-flow-step">
                <span className="cms-flow-index">2</span>
                <div>
                  <strong>确认草稿效果</strong>
                  <p>修改后先看右侧预览，确认图片、文案、间距和信息层级都合适。</p>
                </div>
              </div>
              <div className="cms-flow-step">
                <span className="cms-flow-index">3</span>
                <div>
                  <strong>最后再发布</strong>
                  <p>只有点击发布变更后，正式官网才会更新；版本记录仍保留在原生后台里。</p>
                </div>
              </div>
            </div>
          </article>

          <article className="cms-panel">
            <div className="cms-panel-heading">
              <div>
                <p className="eyebrow">系统状态</p>
                <h3>服务器与缓存</h3>
              </div>
            </div>

            <div className="cms-system-grid">
              <div className="cms-system-card">
                <span>项目占用</span>
                <strong>{stats.serverStorageUsed}</strong>
                <p>统计 `data` 与 `public` 目录的总占用体积。</p>
              </div>
              <div className="cms-system-card">
                <span>可清理缓存</span>
                <strong>{stats.cacheSize}</strong>
                <p>主要包含图片缓存和受控缓存目录，可按需手动清理。</p>
              </div>
            </div>

            <button className="button-primary" onClick={() => handleClearCache().catch(() => setClearing(false))} type="button">
              {clearing ? "清理中..." : "手动清理缓存"}
            </button>
          </article>
        </div>
      </section>
    </div>
  );
}
