# Architecture

Last updated: `2026-03-23 10:53`  
Git branch: `N/A`

## 1. Overview

This project is a self-hosted personal brand website built with `Next.js + Payload CMS`.

It has three layers:
- public site for brand presentation and lead capture
- custom operations shell under `/cms`
- Payload Admin under `/cms/admin`

Legacy `/studio` traffic is redirected to `/cms/admin` so old bookmarks still work after the CMS migration.

## 2. Core decisions

- Content is stored on your own server, not in a third-party hosted content lake.
- Payload is used as the CMS because it is self-hosted and integrates cleanly with a Next.js app.
- SQLite is used for the initial deployment footprint.
- Public pages keep a demo-data fallback so the site can render even before the local CMS is populated.
- Payload Admin is localized to built-in Simplified Chinese via `payload/i18n/zh`, with custom wording overrides for the sidebar and common editing actions.
- The custom `/cms` route acts as a visual management hub: daily editing is steered toward the protected workbench, while native Payload Admin remains available only for advanced operations.
- The app now supports deployment under a subpath by using `NEXT_PUBLIC_BASE_PATH`, and client fetch / iframe / upload URL handling is normalized through a shared base-path helper.

## 3. Tech stack

| Area | Choice | Purpose |
| :--- | :--- | :--- |
| Framework | Next.js 15 App Router | Public pages, CMS shell, API routes |
| UI runtime | React 19 | Components and client-side interactions |
| Language | TypeScript | Shared types and safer refactors |
| CMS | Payload CMS 3 | Admin UI, auth, content modeling, uploads, versions |
| Database | SQLite | Self-hosted content storage |
| Uploads | Local filesystem | Media files under `public/media` |
| Package manager | pnpm 10 | Dependency management |

Development note:
- Local development uses plain `next dev` on this project version.
- This local Next.js CLI only exposes `--turbo` / `--turbopack` as opt-in dev flags, so forcing `--webpack` breaks startup with an unknown-option error.
- Production deployment can use `output: "standalone"` and run the generated `server.js` behind Nginx.

## 4. Route structure

### Public routes

| Route | Purpose |
| :--- | :--- |
| `/` | Homepage |
| `/about` | Personal profile |
| `/media` | Media works |
| `/podcast` | Tiger Legal Talks |
| `/contact` | Contact page |
| `/cases/[slug]` | Case detail page |

### CMS routes

| Route | Purpose |
| :--- | :--- |
| `/cms` | Dashboard overview |
| `/cms/preview` | Legacy redirect to `/cms/admin/workbench` |
| `/cms/files` | Uploaded file overview |
| `/cms/admin` | Payload Admin dashboard and nested admin views |
| `/cms/admin/workbench` | Protected split workbench with editing and draft preview |
| `/cms/admin/preview-fullscreen` | Protected full-screen draft preview |
| `/studio` | Redirect to `/cms/admin` |

### API routes

| Method | Route | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/analytics` | Record page views into local analytics JSON |
| `POST` | `/api/contact` | Save contact submissions to Payload, then local fallback |
| `GET` | `/api/admin/stats` | Dashboard metrics |
| `GET` | `/api/admin/assets` | Asset list for the custom CMS shell |
| `POST` | `/api/admin/clear-cache` | Clear managed cache folders |
| `POST/DELETE` | `/api/preview/session` | Create or clear a preview session token after verifying a valid Payload admin session |
| `GET/POST/...` | `/api/payload/[...slug]` | Payload REST API |
| `POST` | `/api/payload/graphql` | Payload GraphQL endpoint |
| `GET` | `/api/payload/graphql-playground` | Disabled placeholder route |

## 5. Directory map

```text
app/
  (site)/
  (cms)/
  (payload)/
  (payload)/cms/admin/
  (studio)/studio/[[...tool]]/
  api/
components/
  studio/
lib/
  payload/
  payload/admin-session.ts
  server/
  demo-data.ts
  types.ts
data/
public/
  media/
payload.config.ts
middleware.ts
```

## 6. Content model

### Globals

- `siteSettings`
- `homePage`
- `aboutPage`
- `mediaPage`
- `podcastPage`
- `contactPage`

### Collections

- `users`
- `mediaAssets`
- `caseStudies`
- `mediaArticles`
- `podcastEpisodes`
- `contactSubmissions`

### Admin-facing labels

- collections and globals now use Chinese labels in the sidebar
- editor-facing collection descriptions explain what each menu item is for
- collections are grouped into Chinese admin sections such as system access, content assets, and inquiry leads

### Versioning

- collection content uses Payload drafts / versions
- global content uses Payload versions
- collection and global drafts now both use autosave for faster preview feedback
- code rollback remains a deployment / Git concern, not a CMS concern

## 7. Runtime data flow

### Public page reads

1. Public pages call functions in `lib/payload/api.ts`.
2. Those functions use the local Payload client from `lib/payload/client.ts`.
3. If the request carries a valid preview token, the same queries are executed with `draft: true` so pages resolve the latest Payload draft versions.
4. If Payload content is readable, they map Payload documents into the shared `lib/types.ts` shapes.
5. If Payload is unavailable or empty, they fall back to `lib/demo-data.ts`.

### Contact submissions

1. The contact form posts to `/api/contact`.
2. The handler tries `createContactSubmissionInPayload`.
3. If Payload write fails, the submission is written to `data/contact-submissions.json`.

### Dashboard metrics

1. Frontend tracking posts to `/api/analytics`.
2. Metrics are stored in `data/analytics.json`.
3. `/cms` reads local analytics plus Payload collection counts.
4. Asset listings come from the `mediaAssets` Payload collection.
5. The dashboard now exposes separate counts for articles, case studies, and podcast episodes so the management UI can render a clearer content breakdown instead of a single opaque "updates" number.

### Draft preview flow

1. `/cms/admin/workbench` and `/cms/admin/preview-fullscreen` use `components/studio/preview-tool.tsx`.
2. The tool calls `POST /api/preview/session`.
3. The route verifies the current browser has a valid Payload admin login via `payload.auth({ headers })`.
4. If authentication succeeds, the route returns a signed preview token instead of enabling a site-wide draft cookie.
5. The preview iframe appends that token to the selected public URL, and `middleware.ts` copies it into `x-preview-token` for that request only.
6. `lib/payload/preview.ts` verifies the token server-side and only then enables `draft: true` reads plus `noStore()` for the preview request.
7. The preview iframe reloads the selected public route every 2.5 seconds, so edits saved or autosaved in `/cms/admin` appear in the protected preview surfaces without changing the normal homepage tab.
8. `DELETE /api/preview/session` clears the local preview state in the preview shell; published-site requests stay on published content unless a valid token is present.

### Protected admin workbench

1. `app/(payload)/cms/admin/workbench/page.tsx` requires a valid Payload admin session before rendering.
2. The page renders `components/studio/live-workbench.tsx`, which keeps editing and preview inside the `/cms/admin` URL space instead of exposing them on a public-facing CMS shell page.
3. The left column embeds same-origin Payload admin routes in an iframe, with shortcuts for site settings, homepage, core pages, and content collections.
4. The right column reuses `PreviewTool` in compact mode, keeping the draft preview connected without leaving the page.
5. A dedicated `/cms/admin/preview-fullscreen` page renders `components/studio/fullscreen-preview.tsx` for larger visual checks.
6. `/cms/preview` now exists only as a compatibility redirect into the protected admin workbench.

### Seeding

- `payload.config.ts` seeds demo content on init when tables already exist.
- On the very first boot, seed may be skipped until the local SQLite schema exists.
- Public rendering still works because demo data remains available as a fallback.

### Drafting and autosave

- Collection documents use `versions.drafts.autosave`.
- Global page documents now also use `versions.drafts.autosave`, so homepage and other singleton page edits can surface in preview without a manual save loop.
- `app/(site)/layout.tsx` adds a visible "草稿预览中" badge when a request is being rendered through the preview token path.

### Admin routing nuance

- `app/(payload)/cms/admin/[[...segments]]/page.tsx` intentionally keeps root admin params as `undefined`.
- This avoids a trailing-slash mismatch inside Payload's `RootPage`, which would otherwise treat `/cms/admin/` as a non-dashboard route after login and render a 404.
- The app now uses separate route-group root layouts for `(site)`, `(cms)`, `(payload)`, and `(studio)`.
- Payload Admin is mounted under its own root layout so `@payloadcms/next` can own the `html/body` boundary and inject its SCSS without being nested under the public site root layout.
- `app/(payload)/payload-admin.css` now imports Payload's bundled production stylesheet as a local CSS entry.
- `app/(payload)/payload-workbench.css` adds scoped styles for the protected custom admin workbench and full-screen preview pages.
- This avoids the Windows dev/runtime case where the admin shell could render with minimal structure but without the expected visual skin.
- `app/(payload)/cms/admin/[[...segments]]/page.tsx` also exports `generateMetadata`, keeping the embedded admin page aligned with Payload's official `generatePageMetadata` flow.
- `app/(cms)/cms/page.tsx` and `components/studio/dashboard-tool.tsx` now present `/cms` as a more visual "management hub" with a primary workbench entry, a secondary advanced-admin entry, traffic comparison, content mix, and system-state panels.

## 8. Storage layout

| Path | Purpose |
| :--- | :--- |
| `data/payload.db` | SQLite database |
| `public/media` | Uploaded media managed by Payload |
| `data/analytics.json` | Local page-view analytics |
| `data/contact-submissions.json` | Fallback contact storage |
| `.next/cache/images` | Managed image cache |
| `data/cache` | Extra managed cache directory |

## 9. Environment variables

| Variable | Purpose |
| :--- | :--- |
| `DATABASE_URL` | SQLite connection string |
| `PAYLOAD_SECRET` | Payload auth / signing secret |
| `NEXT_PUBLIC_BASE_PATH` | Optional URL path prefix such as `/tiger-legal` |

## 10. Deployment note

- A working path deployment is now verified at `http://8.140.238.44/tiger-legal`
- Public admin entry: `http://8.140.238.44/tiger-legal/cms/admin`
- Protected workbench: `http://8.140.238.44/tiger-legal/cms/admin/workbench`
- The deployed server runs as a `systemd` service named `tiger-legal`
- Nginx proxies the regex location `^/tiger-legal(?:$|/)` to the local Next.js process on `127.0.0.1:3010`

## 10.1 Repository hygiene

- the project now includes a root `.gitignore` for repository publishing
- local runtime output such as `.next`, `node_modules`, `.pnpm-store`, temporary logs, and local SQLite / analytics data are excluded from version control
- only the placeholder `data/.gitkeep` remains tracked under `data/` so the folder structure survives without committing local content state

## 11. Current homepage system

The homepage is structured as:

1. `Header`
2. `Hero`
3. `Value`
4. `Services`
5. `Credibility`
6. `Resources`
7. `Contact CTA`
8. `Footer`

Interaction and visual behavior:
- sticky header state change on scroll
- the homepage now opens with a full-bleed cinematic hero instead of an editorial text-first opening, using one primary headline, one primary CTA, and one short supporting line
- the homepage header stays transparent over the hero at the top of the page and only condenses into a surfaced navigation bar after scroll
- the home header now drops the circular brand-mark treatment at the top of the homepage and behaves more like a reference-style wordmark + nav + outlined contact control
- the home header now also changes its sticky state more aggressively: after a deeper scroll threshold it turns from a transparent overlay into a full-width, top-anchored brand bar with a flatter silhouette closer to the benchmark site
- the homepage hero has been tightened to a single-story layout: the secondary proof card and raised evidence band were removed so the title can use much more horizontal space and behave more like the benchmark brand site
- the homepage hero now overrides the shared balanced-heading behavior, widens the title block to roughly half the desktop viewport, and pulls the CTA back upward so the primary action remains inside the first screen instead of slipping below the fold
- the second homepage section now reads as a dark manifesto band rather than a light article block, so the site moves from first impression into a stronger editorial-style statement of method
- the manifesto section now uses a wider two-column declaration layout with a dominant left thesis, larger staggered doctrine lines on the right, and restrained footnote copy underneath
- the manifesto section is now implemented as a dedicated client component with scroll-driven behavior: the left column stays sticky, while the right-side doctrine lines progressively lift and brighten from grey to full emphasis as the viewer scrolls through the section before the next screen takes over
- the manifesto highlight behavior now advances at the sentence-block level instead of a continuous per-line fade, so the right column reads as distinct statements activating one after another rather than characters appearing to glow individually
- the homepage body copy has been rewritten into clean Chinese editorial content, replacing the earlier garbled copy and aligning the narrative tone across hero, manifesto, services, credibility, resources, and contact closeout
- the services section now presents capability items as numbered editorial entries beside a larger spotlight module, and the credibility section has been tightened with clearer publication proof, metric hierarchy, and case follow-through
- the homepage now uses a dedicated wide container instead of the default inner-page content width, so the header, hero, and manifesto section sit much closer to the viewport edges like the reference brand site while ordinary text blocks still keep their own reading measure
- homepage sections now separate narrative roles more clearly: value framing, service capability, credibility proof, resource assets, final contact
- CTA rhythm now returns mid-page through inline section callouts before the final contact banner
- section reveal is now layered: the section shell enters first, then internal items reveal with light stagger
- rotating homepage panels pause on hover / focus so motion supports reading instead of interrupting it
- homepage color usage is now driven by semantic design tokens in `app/globals.css`, centered on `background / surface / foreground / muted / border / primary / primary-foreground / accent / accent-foreground`
- the public-facing homepage now uses one warm neutral base with a single deep brand color and a restrained secondary accent, instead of mixing multiple unrelated greens / whites in component-level hardcoded values
- low-density layout with a controlled typography scale, larger section spacing, and restrained hover states for CTA, links, and interactive content surfaces
- responsive tuning now keeps the homepage metrics, inline CTA panels, and contact closeout readable across tablet and mobile breakpoints, with narrower cards, balanced headings, and single-column fallbacks only where needed
- obsolete homepage template selectors from earlier layout iterations have been removed from `app/globals.css`, reducing redundant visual rules that no longer map to the live homepage structure
- shared CSS now defines the previously missing `primary-foreground-muted` and `primary-border-soft` tokens, and older hardcoded public / CMS colors have been pulled back onto the same semantic palette so headers, buttons, footer surfaces, dashboard highlights, and fallback screens no longer drift between separate green / beige schemes
- local validation on Windows currently passes via `pnpm exec next dev`, while `pnpm build` still hits OS-level `EPERM` issues during standalone symlink tracing rather than page-code compilation failures
- `pnpm typecheck` can still fail on this machine when stale `.next/types` references exist before a fresh Next runtime regenerates them; the homepage rebuild itself compiled successfully through the webpack production compile stage

## 12. Project status

| Time | Branch | Completed work | Notes |
| :--- | :--- | :--- | :--- |
| 2026-03-18 14:16 | N/A | Public site and custom CMS shell | Added the five core public pages plus dashboard, preview, and files views |
| 2026-03-18 16:38 | N/A | Homepage visual and interaction system | Added sticky header behavior, reveal system, and improved visual hierarchy |
| 2026-03-18 19:03 | N/A | Sanity to Payload migration | Replaced Sanity with self-hosted Payload, added local admin routes, SQLite storage, and legacy `/studio` redirect |
| 2026-03-18 19:51 | N/A | Payload Admin runtime fix | Marked the admin server function as a server action and disabled the unstable GraphQL Playground integration route |
| 2026-03-18 21:40 | N/A | Payload Admin route fix | Fixed root admin route normalization so authenticated visits to `/cms/admin` resolve the dashboard instead of a 404 |
| 2026-03-18 21:40 | N/A | Dev runtime stabilization | Attempted to force webpack mode for local development on Windows |
| 2026-03-18 22:03 | N/A | Dev command correction | Reverted the unsupported `--webpack` flag and restored the compatible default `next dev` command |
| 2026-03-18 22:18 | N/A | Admin style isolation | Split route-group root layouts so Payload Admin no longer inherits the public site root layout boundary |
| 2026-03-19 11:10 | N/A | Payload Admin style fallback | Added a local admin stylesheet entry that imports Payload's bundled CSS and restored embedded admin metadata generation |
| 2026-03-19 11:31 | N/A | Draft preview flow | Added browser-scoped draft-mode preview so `/cms/admin` edits can be reviewed live in `/cms/preview` |
| 2026-03-19 11:35 | N/A | Global autosave for preview | Enabled autosave on Payload globals so singleton pages refresh more naturally during draft preview |
| 2026-03-19 16:17 | N/A | Token-scoped preview isolation | Replaced the browser-wide draft cookie flow with a signed preview token path so `/cms/preview` can read drafts without making the normal homepage read unpublished content |
| 2026-03-19 17:05 | N/A | Split editing workbench | Upgraded `/cms/preview` into a same-page editing workbench that embeds Payload Admin beside the draft preview |
| 2026-03-19 17:17 | N/A | Protected admin workbench and fullscreen preview | Moved editing/preview into `/cms/admin/workbench`, added auth-gated full-screen preview, and turned `/cms/preview` into a compatibility redirect |
| 2026-03-19 17:49 | N/A | Payload Admin Chinese localization | Switched the admin i18n runtime to built-in Chinese, translated common admin actions, and localized collection/global labels plus purpose descriptions |
| 2026-03-19 18:24 | N/A | Visual CMS dashboard simplification | Reframed `/cms` as the primary management hub, improved daily-entry guidance, and rebuilt the dashboard into a more visual control surface with clearer content metrics |
| 2026-03-19 21:05 | N/A | Subpath deployment support and live server publish | Added shared base-path handling, enabled standalone output, and published the app behind Nginx at `/tiger-legal` |
| 2026-03-20 08:58 | N/A | Homepage narrative and interaction pass | Rebuilt the homepage into a clearer brand narrative flow with a single-focus hero, mid-page CTA return points, staggered reveal items, and hover-pause behavior on rotating panels |
| 2026-03-20 09:07 | N/A | Homepage color token system | Added semantic homepage color tokens, replaced the active public-page color usage with token-driven values, and tightened text / border / background / CTA hierarchy around a warm neutral palette |
| 2026-03-20 09:30 | N/A | Homepage responsive cleanup pass | Tightened homepage mobile/tablet spacing, made metrics and CTA panels adapt more gracefully at smaller widths, and removed obsolete homepage selectors from the shared stylesheet |
| 2026-03-20 14:21 | N/A | Global color consistency pass | Filled missing semantic color tokens and replaced remaining hardcoded public/CMS colors so the warm-neutral palette is applied consistently across buttons, headers, cards, footer surfaces, and fallback screens |
| 2026-03-20 16:53 | N/A | Cinematic homepage hero rebuild | Replaced the text-first homepage opening with a full-bleed hero, transparent-over-hero header behavior, a raised proof band, and responsive hero adjustments so the homepage reads as a brand narrative site instead of an editorial landing |
| 2026-03-20 19:23 | N/A | Homepage manifesto section pass | Reframed the second homepage section into a dark manifesto band with stronger statement hierarchy and responsive layout tuning so the page transitions from hero into a more decisive brand argument |
| 2026-03-21 11:32 | N/A | Homepage body section rewrite | Rewrote the homepage JSX with clean Chinese content and sharpened the service / credibility editorial structure so the post-hero narrative reads as a cohesive brand page instead of legacy module content |
| 2026-03-21 22:09 | N/A | Homepage full-width container pass | Added a homepage-only wide container so the header, hero, and manifesto title blocks use much more of the viewport width, reducing the large desktop side gutters that remained from the default shared container |
| 2026-03-22 15:11 | N/A | Strict reference-alignment pass | Rewrote the homepage JSX again, removed first-screen secondary proof modules, tightened the home header into a more reference-like wordmark/navigation treatment, widened the hero and manifesto structure, and validated production compilation up to the existing Windows `spawn EPERM` limit |
| 2026-03-22 16:31 | N/A | Scroll manifesto and sticky-header refinement | Added a dedicated client manifesto component for the second screen, introduced progressive scroll-based highlighting on the right-side doctrine lines, and changed the home header sticky state to a flatter top bar closer to the benchmark site's scroll behavior |
| 2026-03-22 16:42 | N/A | Hero width and above-the-fold CTA correction | Overrode the shared balanced title wrapping for the homepage hero, increased first-screen title occupancy toward the benchmark's roughly half-width composition, and tightened hero spacing so the primary CTA remains on the first screen |
| 2026-03-22 16:48 | N/A | Manifesto activation refinement | Changed the second-screen manifesto from continuous opacity interpolation to sentence-block activation states, widened the right-side manifesto column, and kept the sticky left column / scroll-driven progression while revalidating compilation up to the same Windows `spawn EPERM` limit |
| 2026-03-23 10:53 | N/A | Repository initialization prep | Added a root `.gitignore` so the project can be published without committing local build output, logs, or SQLite runtime data |

## 13. Update log

| Time | Branch | Change type | Description |
| :--- | :--- | :--- | :--- |
| 2026-03-18 14:16 | N/A | Initial doc | Created the first architecture snapshot |
| 2026-03-18 16:38 | N/A | Feature update | Recorded the homepage visual and interaction rebuild |
| 2026-03-18 19:03 | N/A | Refactor | Updated the architecture after replacing Sanity with Payload CMS |
| 2026-03-18 19:51 | N/A | Bug fix | Fixed the `/cms/admin` server action boundary and stabilized the optional GraphQL Playground route |
| 2026-03-18 21:40 | N/A | Bug fix | Fixed the root Payload Admin catch-all param normalization so `/cms/admin` no longer turns into a dashboard-breaking trailing-slash route after login |
| 2026-03-18 21:40 | N/A | Config change | Attempted to switch the local dev command to `next dev --webpack` during Windows runtime debugging |
| 2026-03-18 22:03 | N/A | Config change | Corrected the local dev command back to plain `next dev` because this installed Next.js CLI does not support `--webpack` |
| 2026-03-18 22:18 | N/A | Refactor | Split the app into route-group root layouts so Payload Admin runs inside its own root layout and style boundary |
| 2026-03-19 11:10 | N/A | Bug fix | Added a local Payload admin CSS entry and restored page metadata export so the embedded admin renders with its expected visual skin in development |
| 2026-03-19 11:31 | N/A | Feature update | Added authenticated draft preview mode with auto-refresh so content editors can review unpublished changes while editing in Payload Admin |
| 2026-03-19 11:35 | N/A | Feature update | Enabled autosave for global page documents so homepage-style singleton editing feels immediate in live preview |
| 2026-03-19 16:17 | N/A | Bug fix | Replaced the site-wide draft cookie preview with a signed per-request preview token, added middleware request forwarding, and surfaced a visible preview badge so unpublished edits no longer leak into the normal homepage tab |
| 2026-03-19 17:05 | N/A | Feature update | Converted `/cms/preview` into a dual-pane editor workspace and updated CMS navigation so editing and preview can happen in one page |
| 2026-03-19 17:17 | N/A | Feature update | Moved the editor-preview workflow under authenticated `/cms/admin` routes, added a full-screen preview page, and kept `/cms/preview` only as a redirect for backward compatibility |
| 2026-03-19 17:49 | N/A | Localization | Switched Payload Admin to Chinese via `payload/i18n/zh`, translated common list and version actions, and localized sidebar labels plus menu descriptions |
| 2026-03-19 18:24 | N/A | UX refinement | Simplified the CMS entry strategy, added separate case/podcast metrics to the dashboard data model, and redesigned `/cms` into a more visual management cockpit |
| 2026-03-19 21:05 | N/A | Deployment | Added `NEXT_PUBLIC_BASE_PATH` support, normalized client fetch / iframe paths for subpath hosting, enabled standalone output, and deployed the app to `http://8.140.238.44/tiger-legal` |
| 2026-03-20 08:58 | N/A | UX refinement | Reworked the homepage section rhythm, reduced the hero to a single visual center, added inline CTA return points, introduced staggered reveal items, and made rotating panels pause on hover / focus while confirming public routes via local dev runtime |
| 2026-03-20 09:07 | N/A | UX refinement | Consolidated the homepage palette into semantic CSS design tokens, replaced inconsistent public-page hardcoded colors with token-based background / surface / foreground / border / CTA values, and validated the homepage through a local dev runtime |
| 2026-03-20 09:30 | N/A | UX refinement | Cleaned obsolete homepage selectors from the global stylesheet, balanced heading wraps, refined tablet/mobile metric and CTA behavior, and revalidated compilation through `next build` up to the known Windows standalone symlink limit |
| 2026-03-20 14:21 | N/A | UX refinement | Fixed undefined color tokens that caused drift in dark CTA and contact surfaces, then converted remaining legacy hardcoded greens / warm whites in shared public and CMS styles to the semantic palette so the UI reads as one system again |
| 2026-03-20 16:53 | N/A | UX refinement | Rebuilt the homepage opening into a cinematic full-bleed hero with a transparent overlay header, moved proof content into a separate raised evidence band, removed the old text-first hero selectors from the live stylesheet, and revalidated webpack compilation up to the existing Windows `spawn EPERM` limit |
| 2026-03-20 19:23 | N/A | UX refinement | Converted the homepage value section into a dark manifesto-style statement band, strengthened second-screen hierarchy, and added responsive layout adjustments so the post-hero section reads more like a brand doctrine page than a standard content block |
| 2026-03-21 11:32 | N/A | UX refinement | Rewrote the homepage JSX with clean Chinese narrative copy, converted service capabilities into numbered editorial entries beside a spotlight module, tightened the credibility section hierarchy, and revalidated compilation through `next build` up to the same Windows `spawn EPERM` limit |
| 2026-03-21 22:09 | N/A | UX refinement | Added a homepage-only wide container, widened the hero and manifesto title measures, and brought the homepage header / title / second-screen content closer to the viewport edges so the layout behaves more like the reference full-width brand site |
| 2026-03-22 15:11 | N/A | UX refinement | Performed a stricter reference-site alignment pass by removing the homepage proof card/band from the first screen, simplifying the home header into a reference-like wordmark/navigation overlay, widening the hero headline, and restructuring the manifesto section into a broader benchmark-style declaration layout while confirming `next build` still compiles before the known Windows `spawn EPERM` stage |
| 2026-03-22 16:31 | N/A | UX refinement | Added a client-driven second-screen manifesto component with sticky left content and scroll-progress color activation on the right, raised the homepage scroll threshold, and changed the home header's sticky state from a rounded capsule into a flatter full-width top brand bar while revalidating compilation up to the same Windows `spawn EPERM` limit |
| 2026-03-22 16:42 | N/A | UX refinement | Corrected the benchmark mismatch where the homepage hero title only occupied a narrow column and pushed the CTA below the fold by widening the hero story measure, disabling balanced wrapping on desktop hero copy, and reducing vertical hero spacing while revalidating compilation up to the same Windows `spawn EPERM` limit |
| 2026-03-22 16:48 | N/A | UX refinement | Refined the second-screen manifesto so the right-side statements now activate as whole sentence blocks with broader line width instead of reading like character-by-character illumination, while revalidating compilation up to the same Windows `spawn EPERM` limit |
| 2026-03-23 10:53 | N/A | Repository setup | Added a root `.gitignore` to prepare the project for first-time publishing without checking in local runtime artifacts or database state |
