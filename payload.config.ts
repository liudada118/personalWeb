import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import { buildConfig } from "payload";
import { zh } from "payload/i18n/zh";

import { Articles } from "./payload/collections/Articles";
import { CaseStudies } from "./payload/collections/CaseStudies";
import { ContactSubmissions } from "./payload/collections/ContactSubmissions";
import { Media } from "./payload/collections/Media";
import { MediaPosts } from "./payload/collections/MediaPosts";
import { PageContent } from "./payload/collections/PageContent";
import { PodcastEpisodes } from "./payload/collections/PodcastEpisodes";
import { Users } from "./payload/collections/Users";
import { AboutPage } from "./payload/globals/AboutPage";
import { ContactPage } from "./payload/globals/ContactPage";
import { HomePage } from "./payload/globals/HomePage";
import { MediaPage } from "./payload/globals/MediaPage";
import { PodcastPage } from "./payload/globals/PodcastPage";
import { SiteSettings } from "./payload/globals/SiteSettings";
import { seedDemoContent } from "./payload/seed";
import { ensurePayloadSQLiteCompatibility } from "./payload/sqlite-compat";

const databaseUrl = process.env.DATABASE_URL || "file:./data/payload.db";

export default buildConfig({
  admin: {
    user: "users",
  },
  collections: [Users, Media, CaseStudies, MediaPosts, Articles, PodcastEpisodes, PageContent, ContactSubmissions],
  globals: [SiteSettings, HomePage, AboutPage, MediaPage, PodcastPage, ContactPage],
  db: sqliteAdapter({
    client: {
      url: databaseUrl,
    },
  }),
  editor: lexicalEditor(),
  i18n: {
    fallbackLanguage: "zh",
    supportedLanguages: {
      zh,
    },
  },
  onInit: async (payload) => {
    try {
      await ensurePayloadSQLiteCompatibility(databaseUrl);
    } catch (error) {
      payload.logger.warn({ err: error }, "Failed to run SQLite compatibility patch");
    }

    try {
      await seedDemoContent(payload);
    } catch {
      // SQLite tables may not exist on the very first boot during build.
      // Public pages still fall back to local demo data until admin content is saved.
    }
  },
  routes: {
    admin: "/cms/admin",
    api: "/api/payload",
    graphQL: "/api/payload/graphql",
  },
  secret: process.env.PAYLOAD_SECRET || "tiger-legal-dev-secret",
  sharp,
  telemetry: false,
  typescript: {
    autoGenerate: false,
  },
});
