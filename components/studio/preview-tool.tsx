"use client";

import { useEffect, useMemo, useState } from "react";

import { PREVIEW_QUERY_PARAM } from "@/lib/payload/preview-constants";
import { previewRoutes } from "@/lib/payload/preview-routes";
import { withBasePath } from "@/lib/site-paths";

type PreviewSessionResponse = {
  enabled?: boolean;
  expiresAt?: string;
  message?: string;
  previewToken?: string;
};

type PreviewToolProps = {
  activeRoute?: string;
  compact?: boolean;
  onActiveRouteChange?: (href: string) => void;
};

export function PreviewTool({ activeRoute, compact = false, onActiveRouteChange }: PreviewToolProps) {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [internalRoute, setInternalRoute] = useState(previewRoutes[0].href);
  const [loading, setLoading] = useState(true);
  const [previewToken, setPreviewToken] = useState("");
  const [refreshSeed, setRefreshSeed] = useState(() => Date.now());

  const resolvedRoute = activeRoute ?? internalRoute;

  useEffect(() => {
    let cancelled = false;

    async function enablePreview() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(withBasePath("/api/preview/session"), {
          cache: "no-store",
          method: "POST",
        });
        const payload = (await response.json().catch(() => null)) as PreviewSessionResponse | null;

        if (!response.ok || !payload?.previewToken) {
          throw new Error(payload?.message || "无法开启草稿预览。");
        }

        if (!cancelled) {
          setExpiresAt(payload.expiresAt || "");
          setPreviewToken(payload.previewToken);
          setRefreshSeed(Date.now());
        }
      } catch (issue) {
        if (!cancelled) {
          setPreviewToken("");
          setExpiresAt("");
          setError(issue instanceof Error ? issue.message : "无法开启草稿预览。");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    enablePreview().catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!previewToken || !autoRefresh) {
      return;
    }

    const timer = window.setInterval(() => {
      setRefreshSeed(Date.now());
    }, 2500);

    return () => window.clearInterval(timer);
  }, [autoRefresh, previewToken]);

  const frameSrc = useMemo(() => {
    if (!previewToken) {
      return "";
    }

    const params = new URLSearchParams();
    params.set(PREVIEW_QUERY_PARAM, previewToken);
    params.set("preview", String(refreshSeed));

    return `${withBasePath(resolvedRoute)}?${params.toString()}`;
  }, [previewToken, refreshSeed, resolvedRoute]);

  function handleRouteChange(href: string) {
    if (activeRoute === undefined) {
      setInternalRoute(href);
    }

    onActiveRouteChange?.(href);
  }

  async function disablePreview() {
    setLoading(true);

    try {
      await fetch(withBasePath("/api/preview/session"), {
        cache: "no-store",
        method: "DELETE",
      });
    } finally {
      setAutoRefresh(false);
      setExpiresAt("");
      setLoading(false);
      setPreviewToken("");
      setRefreshSeed(Date.now());
    }
  }

  return (
    <div className={`cms-tool${compact ? " cms-tool-compact" : ""}`}>
      <div className="section-heading">
        <p className="eyebrow">{compact ? "草稿预览" : "页面预览"}</p>
        <h2>{compact ? "右侧只显示草稿效果，正式官网不会跟着变。" : "在后台编辑时，单独查看草稿页面，不再影响正式官网。"}</h2>
        <p className="section-description">
          {compact
            ? "未发布内容只会出现在这里。只有点击 Publish changes，正式官网才会更新。"
            : "预览只在这个页面生效。你可以一边在 /cms/admin 修改内容，一边在这里检查草稿效果；正式官网仍然保持已发布版本。"}
        </p>
      </div>

      <div className="cms-toolbar">
        <button className={previewToken ? "is-active" : ""} disabled={loading} onClick={() => setRefreshSeed(Date.now())} type="button">
          {loading ? "正在连接预览" : previewToken ? "草稿预览已连接" : "预览未连接"}
        </button>
        <button className={autoRefresh ? "is-active" : ""} disabled={!previewToken || loading} onClick={() => setAutoRefresh((value) => !value)} type="button">
          {autoRefresh ? "自动刷新：开" : "自动刷新：关"}
        </button>
        <button disabled={!previewToken || loading} onClick={() => setRefreshSeed(Date.now())} type="button">
          立即刷新
        </button>
        <button disabled={!previewToken || loading} onClick={() => disablePreview().catch(() => setLoading(false))} type="button">
          关闭预览
        </button>
      </div>

      {expiresAt ? <p className="section-description">本次预览有效期至：{new Date(expiresAt).toLocaleString("zh-CN")}</p> : null}

      {error ? <div className="cms-tool cms-empty">{error}</div> : null}

      <div className="cms-toolbar">
        {previewRoutes.map((route) => (
          <button
            className={route.href === resolvedRoute ? "is-active" : ""}
            key={route.href}
            onClick={() => handleRouteChange(route.href)}
            type="button"
          >
            {route.label}
          </button>
        ))}
      </div>

      {frameSrc ? (
        <div className={`cms-frame${compact ? " cms-frame-compact" : ""}`}>
          <iframe key={frameSrc} src={frameSrc} style={{ border: 0, height: "100%", minHeight: compact ? "72vh" : "78vh", width: "100%" }} title="Site preview" />
        </div>
      ) : (
        <div className="cms-tool cms-empty">登录后台后，这里会建立一个单独的草稿预览窗口。</div>
      )}
    </div>
  );
}
