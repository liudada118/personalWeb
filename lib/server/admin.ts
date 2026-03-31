import { mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

import { demoDashboardStats } from "@/lib/demo-data";
import { getPayloadClient } from "@/lib/payload/client";
import { withBasePath } from "@/lib/site-paths";
import { readJsonFile, writeJsonFile } from "@/lib/server/json-store";
import type { ContactSubmission, DashboardStats } from "@/lib/types";

type AnalyticsStore = {
  days: Record<string, { total: number; paths: Record<string, number> }>;
};

type AssetItem = {
  id: number | string;
  alt?: string;
  filename?: string;
  filesize?: number;
  mimeType?: string;
  updatedAt?: string;
  url?: string;
};

const analyticsFile = "analytics.json";
const contactsFile = "contact-submissions.json";
const cacheTargets = [path.join(process.cwd(), ".next", "cache", "images"), path.join(process.cwd(), "data", "cache")];

function getDateKey(offsetDays = 0) {
  const now = new Date();
  now.setDate(now.getDate() + offsetDays);

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
  }).format(now);
}

function formatBytes(bytes: number) {
  if (!bytes) {
    return "0 MB";
  }

  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(value >= 100 || index === 0 ? 0 : 1)} ${units[index]}`;
}

async function getDirectorySize(targetPath: string): Promise<number> {
  try {
    const info = await stat(targetPath);

    if (!info.isDirectory()) {
      return info.size;
    }

    const entries = await readdir(targetPath, { withFileTypes: true });
    const sizes = await Promise.all(entries.map((entry) => getDirectorySize(path.join(targetPath, entry.name))));

    return sizes.reduce((sum, size) => sum + size, 0);
  } catch {
    return 0;
  }
}

async function getLocalContactCount() {
  const contacts = await readJsonFile<ContactSubmission[]>(contactsFile, []);
  return contacts.length;
}

async function getPayloadSafe() {
  try {
    return await getPayloadClient();
  } catch {
    return null;
  }
}

export async function recordPageView(pathname: string) {
  const analytics = await readJsonFile<AnalyticsStore>(analyticsFile, { days: {} });
  const key = getDateKey();
  const dayEntry = analytics.days[key] ?? { total: 0, paths: {} };

  dayEntry.total += 1;
  dayEntry.paths[pathname] = (dayEntry.paths[pathname] ?? 0) + 1;
  analytics.days[key] = dayEntry;

  await writeJsonFile(analyticsFile, analytics);
}

export async function storeContactSubmission(submission: ContactSubmission) {
  const list = await readJsonFile<ContactSubmission[]>(contactsFile, []);
  list.unshift(submission);
  await writeJsonFile(contactsFile, list);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const analytics = await readJsonFile<AnalyticsStore>(analyticsFile, { days: {} });
  const todayKey = getDateKey();
  const yesterdayKey = getDateKey(-1);

  const localContactCount = await getLocalContactCount();
  const cacheSizeBytes = await Promise.all(cacheTargets.map((item) => getDirectorySize(item))).then((values) =>
    values.reduce((sum, size) => sum + size, 0),
  );
  const storageSizeBytes = await Promise.all(
    [path.join(process.cwd(), "data"), path.join(process.cwd(), "public")].map((item) => getDirectorySize(item)),
  ).then((values) => values.reduce((sum, size) => sum + size, 0));

  const payload = await getPayloadSafe();

  if (!payload) {
    return {
      ...demoDashboardStats,
      todayViews: analytics.days[todayKey]?.total ?? demoDashboardStats.todayViews,
      yesterdayViews: analytics.days[yesterdayKey]?.total ?? demoDashboardStats.yesterdayViews,
      caseCount: demoDashboardStats.caseCount,
      podcastCount: demoDashboardStats.podcastCount,
      contactCount: localContactCount || demoDashboardStats.contactCount,
      cacheSize: formatBytes(cacheSizeBytes),
      serverStorageUsed: formatBytes(storageSizeBytes),
    };
  }

  try {
    const [articles, cases, podcasts, contacts, assets] = await Promise.all([
      payload.find({ collection: "mediaPosts", depth: 0, limit: 1, overrideAccess: true }),
      payload.find({ collection: "caseStudies", depth: 0, limit: 1, overrideAccess: true }),
      payload.find({ collection: "podcastEpisodes", depth: 0, limit: 1, overrideAccess: true }),
      payload.find({ collection: "contactSubmissions", depth: 0, limit: 1, overrideAccess: true }),
      payload.find({ collection: "media", depth: 0, limit: 1, overrideAccess: true }),
    ]);

    return {
      todayViews: analytics.days[todayKey]?.total ?? 0,
      yesterdayViews: analytics.days[yesterdayKey]?.total ?? 0,
      articleCount: articles.totalDocs,
      caseCount: cases.totalDocs,
      podcastCount: podcasts.totalDocs,
      updateCount: cases.totalDocs + podcasts.totalDocs,
      contactCount: contacts.totalDocs + localContactCount,
      assetCount: assets.totalDocs,
      cacheSize: formatBytes(cacheSizeBytes),
      serverStorageUsed: formatBytes(storageSizeBytes),
    };
  } catch {
    return {
      ...demoDashboardStats,
      todayViews: analytics.days[todayKey]?.total ?? demoDashboardStats.todayViews,
      yesterdayViews: analytics.days[yesterdayKey]?.total ?? demoDashboardStats.yesterdayViews,
      caseCount: demoDashboardStats.caseCount,
      podcastCount: demoDashboardStats.podcastCount,
      contactCount: localContactCount || demoDashboardStats.contactCount,
      cacheSize: formatBytes(cacheSizeBytes),
      serverStorageUsed: formatBytes(storageSizeBytes),
    };
  }
}

export async function clearManagedCaches() {
  await Promise.all(
    cacheTargets.map(async (target) => {
      await rm(target, { recursive: true, force: true });
      await mkdir(target, { recursive: true });
    }),
  );

  return {
    cacheSize: formatBytes(0),
  };
}

export async function getAssetList() {
  const payload = await getPayloadSafe();

  if (!payload) {
    return [] as AssetItem[];
  }

  try {
    const assets = await payload.find({
      collection: "media",
      depth: 0,
      limit: 50,
      overrideAccess: true,
      sort: "-updatedAt",
    });

    return assets.docs.map((asset) => ({
      id: asset.id,
      alt: typeof asset.alt === "string" ? asset.alt : undefined,
      filename: typeof asset.filename === "string" ? asset.filename : undefined,
      filesize: typeof asset.filesize === "number" ? asset.filesize : undefined,
      mimeType: typeof asset.mimeType === "string" ? asset.mimeType : undefined,
      updatedAt: typeof asset.updatedAt === "string" ? asset.updatedAt : undefined,
      url: typeof asset.url === "string" ? withBasePath(asset.url) : undefined,
    })) as AssetItem[];
  } catch {
    return [];
  }
}

export async function createContactSubmissionInPayload(submission: ContactSubmission) {
  const payload = await getPayloadSafe();

  if (!payload) {
    return false;
  }

  try {
    await payload.create({
      collection: "contactSubmissions",
      data: submission,
      overrideAccess: true,
    });
    return true;
  } catch {
    return false;
  }
}

export function formatFileSize(size?: number) {
  return formatBytes(size ?? 0);
}

