# Technical Overview

## Summary

The project uses `Next.js + Payload CMS` in a single codebase.

Main goals:
- self-hosted content management
- strong public-facing brand site
- lightweight custom operations dashboard
- local ownership of database and uploaded media

## Main runtime pieces

### Public pages

Public routes live under `app/(site)`.

They load data through `lib/payload/api.ts`, which:
- reads from Payload globals and collections
- maps documents into shared `lib/types.ts` shapes
- falls back to `lib/demo-data.ts` when needed

### Payload Admin

Payload Admin lives at `/cms/admin`.

Important files:
- `payload.config.ts`
- `app/(payload)/cms/admin/layout.tsx`
- `app/(payload)/cms/admin/[[...segments]]/page.tsx`
- `app/api/payload/[...slug]/route.ts`

### Custom CMS shell

The custom shell under `/cms` is for:
- dashboard metrics
- visual preview
- file overview

It is not the primary editor. Actual content editing happens in Payload Admin.

### Legacy studio route

`/studio` now redirects to `/cms/admin`.

## Storage

- SQLite database: `data/payload.db`
- Upload directory: `public/media`
- Local analytics: `data/analytics.json`
- Local contact fallback: `data/contact-submissions.json`

## Content model

Globals:
- `siteSettings`
- `homePage`
- `aboutPage`
- `mediaPage`
- `podcastPage`
- `contactPage`

Collections:
- `users`
- `mediaAssets`
- `caseStudies`
- `mediaArticles`
- `podcastEpisodes`
- `contactSubmissions`

## Admin and versioning

- Payload auth manages admin users
- Payload drafts / versions manage content history
- Git / deployment platform should manage code rollback

## Environment

Required:
- `DATABASE_URL`
- `PAYLOAD_SECRET`

## Current behavior

- Empty or unavailable CMS content does not break the public site
- Contact submissions prefer Payload and fall back locally
- Uploaded files are listed in `/cms/files`
- Dashboard metrics combine local analytics with Payload collection counts
