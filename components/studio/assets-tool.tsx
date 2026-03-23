"use client";

import { useEffect, useState } from "react";

import { withBasePath } from "@/lib/site-paths";

type AssetItem = {
  id: number | string;
  mimeType?: string;
  filename?: string;
  url?: string;
  readableSize?: string;
  updatedAt?: string;
};

function formatDate(value?: string) {
  if (!value) {
    return "未记录";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function AssetsTool() {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(withBasePath("/api/admin/assets"))
      .then((response) => response.json())
      .then((data) => {
        setAssets(data as AssetItem[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="cms-tool cms-empty">正在加载素材文件...</div>;
  }

  return (
    <div className="cms-tool">
      <div className="section-heading">
        <p className="eyebrow">文件管理</p>
        <h2>查看已上传的图片、视频和文件素材。</h2>
        <p className="section-description">素材主要来自文章、播客、案例封面和首页轮播图等上传字段。</p>
      </div>

      {assets.length ? (
        <div className="cms-assets-grid">
          {assets.map((asset) => (
            <article className="list-card" key={asset.id}>
              <h3>{asset.filename || String(asset.id)}</h3>
              <p>{asset.mimeType || "未标注类型"}</p>
              <p>大小：{asset.readableSize || "未知"}</p>
              <p>更新：{formatDate(asset.updatedAt)}</p>
              {asset.url ? (
                <a href={asset.url} rel="noreferrer" target="_blank">
                  打开文件
                </a>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="cms-empty">目前还没有可列出的素材文件。</div>
      )}
    </div>
  );
}
