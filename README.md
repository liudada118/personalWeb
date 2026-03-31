# Tiger Legal Personal Site

Self-hosted personal brand site built with `Next.js + Payload CMS`.

This project now stores content on your own server:
- database: `data/payload.db`
- uploads: `public/media`
- local analytics / fallback files: `data/*.json`

`/studio` is no longer a Sanity Studio entry. It now redirects to Payload Admin at `/cms/admin`.

The app also supports deployment under a URL subpath through `NEXT_PUBLIC_BASE_PATH`.

## Routes

Public site:
- `/`
- `/about`
- `/media`
- `/podcast`
- `/contact`
- `/cases/[slug]`

Operations / CMS:
- `/cms` custom dashboard
- `/cms/preview` page preview
- `/cms/files` uploaded asset list
- `/cms/admin` Payload Admin
- `/studio` legacy redirect to `/cms/admin`

## Stack

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Payload CMS 3`
- `SQLite`

## Content model

Globals (legacy fixed-page transition layer):
- `siteSettings`
- `homePage`
- `aboutPage`
- `mediaPage`
- `podcastPage`
- `contactPage`

Collections:
- `users`
- `media`
- `caseStudies`
- `mediaPosts`
- `podcastEpisodes`
- `articles`
- `pageContent`
- `contactSubmissions`

## Local development

```bash
pnpm install
pnpm dev
```

Open:
- site: `http://localhost:3000`
- cms: `http://localhost:3000/cms`
- payload admin: `http://localhost:3000/cms/admin`

On first admin visit, Payload will ask you to create the first admin user if none exists yet.

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
DATABASE_URL=file:./data/payload.db
PAYLOAD_SECRET=change_me_for_production
NEXT_PUBLIC_BASE_PATH=
```

Examples:
- local root deployment: leave `NEXT_PUBLIC_BASE_PATH` empty
- path deployment: `NEXT_PUBLIC_BASE_PATH=/tiger-legal`

## Data behavior

- Public pages read from Payload when content exists.
- If Payload is unavailable or empty, the site falls back to `lib/demo-data.ts`.
- Contact submissions try Payload first, then fall back to `data/contact-submissions.json`.
- Dashboard analytics are stored in `data/analytics.json`.
- Payload drafts / versions provide content history and rollback.

## Verification

Verified on this repo:

```bash
pnpm typecheck
pnpm build
```

## Notes

- The custom `/cms` pages are an operations shell around Payload, not a replacement for Payload Admin.
- Media uploads are managed by Payload and stored locally in `public/media`.
- The current database adapter is SQLite for simple self-hosted deployment. You can swap adapters later if needed.
- During the very first build / boot, Payload seed initialization may skip silently until local tables exist. The public site still works because it falls back to demo data.
- For server deployment under a path, build with `NEXT_PUBLIC_BASE_PATH=/your-path` so preview iframes, API fetches, asset URLs, and Payload admin embeds resolve correctly.

## Docs

- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)

