# Architecture

Last updated: `2026-04-01 09:53`  
Git branch: `liu`

## 1. Overview

This project is a self-hosted personal brand website built with `Next.js + Payload CMS`. The active `liu` branch now carries an alternate Dennis Yuxuan Liu homepage direction while the main branch remains the Tiger Legal baseline.

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
- Day-to-day page editing now follows a WordPress-like visual-editing loop: editors work inside `/cms/admin/workbench`, click regions directly inside the preview, and let the left-side Payload editor jump to the matching page or collection.
- The app now supports deployment under a subpath by using `NEXT_PUBLIC_BASE_PATH`, and client fetch / iframe / upload URL handling is normalized through a shared base-path helper.
- The `liu` branch is now allowed to diverge at the homepage and site chrome level so a Dennis/Liu front page can coexist with the existing Tiger Legal CMS and inner-page stack without forcing that redesign onto `main`.

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
| `/admin/visual-editor` | Protected custom visual-editor shell for fixed pages |
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
  (site)/liu-home.module.css
  (cms)/
  (payload)/
  (payload)/cms/admin/
  admin/visual-editor/
  (studio)/studio/[[...tool]]/
  api/
components/
  scroll-reveal-text.tsx
  site-chrome.module.css
  studio/
  visual-edit-region.tsx
lib/
  payload/
  payload/admin-session.ts
  page-content/registry/
  server/
  visual-editing.ts
  demo-data.ts
  types.ts
payload/
  collections/
  globals/
  seed.ts
  shared.ts
  sqlite-compat.ts
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

These page globals are intentionally kept as a transition layer. Public page rendering still reads them today, while the new `pageContent` collection is being introduced for the upcoming custom Visual Editor.

### Collections

- `users`
- `media`
- `caseStudies`
- `mediaPosts`
- `articles`
- `podcastEpisodes`
- `pageContent`
- `contactSubmissions`

### Fixed page content strategy

- `pageContent` stores one editable fixed-page field per document.
- Each record carries `page`, `fieldKey`, `type`, `locale`, `value`, and computed `docKey`.
- Stable keys such as `home.hero.title` or `mediaPage.header.title` make the model reusable across future fixed pages.
- The collection is generic enough for the future `/admin/visual-editor` route, but it still lives entirely inside Payload.

### Structured content strategy

- `mediaPosts`, `podcastEpisodes`, `caseStudies`, and `articles` remain standard Payload collections for repeatable content.
- `media` is the shared upload bucket referenced by page sections, podcast episodes, case studies, and future visual-editor image fields.
- This keeps layout-aware page editing and repeatable content management separate without introducing a second persistence layer.

### Admin-facing labels

- collections and globals use grouped admin descriptions so editors can tell legacy page globals apart from structured collections and the new visual-editor storage collection
- `pageContent` is grouped separately so the future visual editor can target a dedicated Payload area without changing Payload's role as the source of truth

### Versioning

- collection content uses Payload drafts / versions
- global content uses Payload versions
- collection and global drafts both use autosave for faster preview feedback
- `pageContent` also uses collection drafts, so fixed-page field edits can later participate in the same draft workflow as structured content
- code rollback remains a deployment / Git concern, not a CMS concern
## 7. Runtime data flow

### Public page reads

1. Public pages call functions in `lib/payload/api.ts`.
2. Those functions use the local Payload client from `lib/payload/client.ts`.
3. If the request carries a valid preview token, the same queries are executed with `draft: true` so pages resolve the latest Payload draft versions.
4. Structured media content now reads from `mediaPosts`, `podcastEpisodes`, and `caseStudies`.
5. Fixed page sections still resolve through the legacy globals during the transition period, with `pageContent` now seeded and ready for the future custom Visual Editor integration.
6. If Payload is unavailable or empty, they fall back to `lib/demo-data.ts`.

### Contact submissions

1. The contact form posts to `/api/contact`.
2. The handler tries `createContactSubmissionInPayload`.
3. If Payload write fails, the submission is written to `data/contact-submissions.json`.

### Dashboard metrics

1. Frontend tracking posts to `/api/analytics`.
2. Metrics are stored in `data/analytics.json`.
3. `/cms` reads local analytics plus Payload collection counts.
4. Asset listings come from the `media` Payload collection.
5. The current dashboard article KPI is still sourced from `mediaPosts`, matching the existing public media page.
6. The `articles` collection is already modeled and seeded inside Payload, but it is not yet surfaced on the public site or in the custom dashboard.
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

### Custom visual editor shell

1. `/admin/visual-editor` requires the same Payload admin session used by `/cms/admin`.
2. `lib/page-content/registry` defines page-level editable metadata, including stable field keys, field types, sections, and default placeholder values.
3. The shell renders a three-column layout: schema-driven field list, real frontend iframe preview, and a selected-field inspector.
4. The iframe already loads real public routes with `visualEditor=1` so the shell never relies on a fake preview page.
5. In STEP 3, Save / Reset / Publish only manage local shell state; iframe messaging and Payload persistence are intentionally deferred to later steps.
### Visual edit bridge

1. `PreviewTool` appends `visualEditor=1` to preview URLs whenever the preview is running inside the protected workbench.
2. Public pages, key homepage sections, and the shared site header/footer are wrapped by `components/visual-edit-region.tsx`.
3. In visual-edit mode, hovering a region shows an 鈥滅紪杈戞鍖哄煙鈥?handle, and the region body itself is also clickable so editors do not need to hunt for a separate sidebar action.
4. Clicking a region posts a typed message defined in `lib/visual-editing.ts` from the preview iframe back to the parent workbench.
5. `components/studio/preview-tool.tsx` receives that message, switches the preview route if needed, and tells `components/studio/live-workbench.tsx` to retarget the left-side Payload iframe to the matching global or collection.
6. This keeps the editing model field-based and version-safe like Payload, while making the interaction feel closer to WordPress-style front-end visual editing.

### Seeding

- `payload.config.ts` seeds demo content on init when tables already exist.
- On the very first boot, seed may be skipped until the local SQLite schema exists.
- Payload startup now also patches the legacy SQLite `payload_locked_documents_rels` table when renamed collection slugs introduce new relation columns such as `media_id` or `media_posts_id`.
- Public rendering still works because demo data remains available as a fallback.

### Drafting and autosave

- Collection documents use `versions.drafts.autosave`.
- Global page documents now also use `versions.drafts.autosave`, so homepage and other singleton page edits can surface in preview without a manual save loop.
- `app/(site)/layout.tsx` adds a visible "鑽夌棰勮涓? badge when a request is being rendered through the preview token path.

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

The active `liu` branch now intentionally splits the homepage from the older Tiger Legal public-site direction.

Current homepage structure on `/`:

1. `Dennis/Liu sticky wordmark header`
2. `Split-screen neon hero`
3. `Quote + intro + video statement band`
4. `Podcast rail`
5. `Featured episode block`
6. `Profile strip`
7. `Featured works grid`
8. `Dennis/Liu dark footer`

Branch-specific behavior:
- `app/(site)/page.tsx` is now a dedicated Dennis/Liu homepage instead of the former Tiger Legal editorial homepage.
- `app/(site)/liu-home.module.css` owns the homepage visual system so the large redesign is isolated from the shared legacy stylesheet.
- `components/site-header.tsx` now branches on `pathname === "/"`: the homepage uses a Dennis/Liu wordmark and compact uppercase nav, while inner pages still use the existing shared Tiger Legal header.
- `components/site-footer.tsx` follows the same split: `/` gets a dedicated Dennis/Liu dark footer, while non-home pages keep the previous shared footer.
- The homepage keeps `VisualEditRegion` wrappers around the major fixed sections so the new design still participates in the visual-editing flow.
- The podcast rail and featured episode block still read from `podcastEpisodes` through `getHomePageData()`, with local fallback content when Payload is empty.
- The featured-works block is currently a design-faithful static placeholder layer for the Liu homepage direction; it can later be connected to `mediaPosts` or `pageContent` without changing the page shell.
- This means `liu` can evolve as a second website direction without overwriting the Tiger Legal homepage behavior documented on `main`.

Visual behavior:
- the homepage now uses a black / deep-green / neon-lime palette with light gradient accents instead of the warm neutral Tiger Legal system
- the first screen is a two-column hero with a typography-first left side and a stylized portrait placeholder panel on the right
- the second screen compresses quote, short introduction, and video callout into a tighter editorial band closer to the provided Dennis/Liu reference image
- lower sections alternate dark and light surfaces to mirror the screenshot's rhythm: dark podcast rail, light featured episode, dark profile strip, light featured works, dark footer
- responsive behavior now collapses the split hero, quote band, podcast cards, and works grid into stacked mobile layouts without changing the section order
- the homepage first screen was then refined again toward the Dennis/Liu reference: the header now floats as a transparent overlay, the left copy sits inside a continuous black-green space instead of a hard panel, and the right portrait zone behaves more like a full hero visual than a card module
- a second first-screen refinement pass pushed the hero closer to the reference by turning the headline into a single-line declaration, reducing nav/logo weight, and enlarging the right portrait zone so the visual center sits more decisively on the right side
- the hero utility links were then converted from decorative placeholders into actual outbound social links, with dedicated non-overlapping pill geometry so the homepage top-right social cluster stays readable and clickable
- the hero social pills now intentionally render short platform tags rather than long backend labels, preventing the first-screen utility row from colliding with the main navigation when Chinese labels are verbose
- that social cluster was then reduced one step further to icon-scale short tags and moved deeper into the portrait area so it no longer visually competes with the primary top navigation band


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
| 2026-03-23 14:35 | N/A | Manifesto block-highlighting correction | Adjusted the manifesto typography and activation styling so the right-side statements light up as whole blocks with broader Chinese line length instead of appearing to brighten character by character |
| 2026-03-23 18:46 | main | WordPress-style visual editing bridge | Added preview-side editable regions, click-to-edit messaging, and workbench retargeting so editors can jump from the front-end preview directly to the matching Payload editor |
| 2026-03-24 21:24 | main | Homepage hero spacing correction | Removed the light gap below the cinematic hero and widened first-screen copy so the opening frame sits flush against the dark manifesto section |
| 2026-03-24 21:41 | main | Character-level manifesto scroll reveal | Rebuilt the second-screen right column around a reusable character-splitting reveal component so manifesto copy now brightens letter-by-letter with scroll progress while the left column remains sticky |
| 2026-03-24 21:51 | main | Manifesto scroll pacing adjustment | Slowed the second-screen reading cadence by increasing the section scroll span and stretching the scroll-to-progress mapping so character highlighting advances more gradually |
| 2026-03-24 22:04 | main | Hero child-width alignment | Aligned the hero title and standfirst with the full width of the parent hero text column instead of letting them keep narrower internal max-width rules |
| 2026-03-24 22:16 | main | Hero H1-only reduction | Reduced the first screen to only the H1 and made the hero display element occupy the full hero text column without eyebrow, intro, or hero CTA competition |
| 2026-03-24 22:26 | main | Hero display width override fix | Added a stronger homepage-specific selector so later shared `.display-title` rules no longer override the hero H1 width |
| 2026-03-31 08:59 | main | Hybrid Payload content model foundation | Modularized Payload collections/globals, introduced `media`, `mediaPosts`, `articles`, and `pageContent`, and kept legacy page globals as the fixed-page transition layer for the upcoming visual editor |
| 2026-03-31 09:16 | main | SQLite compatibility patch for renamed Payload slugs | Added startup repair for legacy `payload_locked_documents_rels` metadata and patched the local database so Payload Admin can query lock state after the `mediaAssets/mediaArticles` to `media/mediaPosts` transition |
| 2026-03-31 11:15 | main | Visual Editor shell scaffold | Added the protected `/admin/visual-editor` route, schema-driven page registry, three-column editor shell, real iframe page preview, and local placeholder actions for Save / Reset / Publish |

| 2026-03-31 22:11 | liu | Dennis/Liu homepage split | Replaced the old Tiger Legal homepage on the `liu` branch with a separate Dennis/Liu one-page direction, added homepage-specific site chrome, and kept inner pages plus CMS infrastructure on the existing shared stack |

| 2026-03-31 23:13 | liu | Hero fidelity refinement | Reworked only the Dennis/Liu homepage first screen by lightening the overlay header, rebuilding the editorial left-title composition, and turning the right side into a stronger integrated hero visual zone |

| 2026-03-31 23:32 | liu | Hero second-pass alignment | Further tightened only the first screen by making the title a single-line statement, thinning the overlay navigation, and pushing the right portrait composition closer to the supplied reference balance |

| 2026-03-31 23:45 | liu | Homepage social-link overlap fix | Replaced the decorative top-right hero placeholders with real outbound social links and widened their geometry so ??? / B? / LinkedIn no longer overlap |

| 2026-04-01 09:53 | codex | Hero social cluster compression | Reduced the homepage hero social links to icon-scale tags and pushed the utility cluster farther right so it stays inside the portrait zone instead of colliding with the main navigation |

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
| 2026-03-23 14:35 | N/A | UX refinement | Corrected the manifesto right-column highlight behavior by broadening the sentence measure and shifting the activation effect to the entire statement block, then revalidated production compilation up to the same Windows `spawn EPERM` limit |
| 2026-03-23 18:46 | main | Feature update | Added a WordPress-style visual editing bridge by wrapping public regions in click-to-edit overlays, appending a visual-editor preview flag inside the protected workbench, and routing preview clicks back into the matching Payload editor targets |
| 2026-03-24 21:24 | main | UX refinement | Removed the light body-color band beneath the homepage hero by zeroing the cinematic hero bottom padding and widened the hero title / standfirst measures so the first screen reads fuller and closer to the benchmark layout |
| 2026-03-24 21:41 | main | UX refinement | Replaced the manifesto right-column block-activation treatment with a reusable `ScrollRevealText` component that keeps all characters rendered up front, then binds each character's color transition to section scroll progress while preserving sticky left-column reading behavior |
| 2026-03-24 21:51 | main | UX refinement | Slowed the manifesto character-reveal pacing by extending the section's sticky scroll height and widening the progress denominator so the right-column text now brightens more gradually relative to page scroll |
| 2026-03-24 22:04 | main | UX refinement | Removed the separate hero title and standfirst max-width constraints so the children inside `hero-story` now follow the same column width as their parent container |
| 2026-03-24 22:16 | main | UX refinement | Simplified the first screen to an H1-only hero statement and kept `display-title hero-display` at full parent width so the opening frame no longer competes with an eyebrow, standfirst, or in-hero CTA |
| 2026-03-24 22:26 | main | Bug fix | Added a homepage-specific width override for `hero-story .display-title.hero-display` after the shared title scale block so the first-screen H1 no longer inherits the later `max-width: 9.5ch` constraint from `.display-title` |
| 2026-03-31 08:59 | main | Refactor | Split the monolithic Payload config into modular collection/global files, renamed structured content collections to `media`, `mediaPosts`, and `articles`, added the generic `pageContent` collection plus seed data, and updated legacy admin links and data readers to match the new Payload model |
| 2026-03-31 09:16 | main | Bug fix | Added a SQLite compatibility helper that backfills new locked-document relation columns for renamed Payload collections and repaired the local `data/payload.db` so `/cms/admin` no longer fails on missing `media_id` metadata columns |
| 2026-03-31 11:15 | main | Feature update | Implemented STEP 3 of the hybrid CMS by adding a protected `/admin/visual-editor` shell, schema-driven editable page registry, a real-route iframe preview, and modular left/center/right editor panels while intentionally leaving live iframe messaging and Payload writeback for later steps |
| 2026-03-31 22:11 | liu | UX refinement | Split the `liu` branch homepage away from the Tiger Legal design by rebuilding `/` into a Dennis/Liu reference-style landing page, adding dedicated homepage header/footer variants, and isolating the new visuals in `liu-home.module.css` plus `site-chrome.module.css` while keeping the rest of the site/CMS intact |
| 2026-03-31 23:13 | liu | UX refinement | Tightened the Dennis/Liu homepage first screen toward the supplied reference by converting the top navigation into a transparent overlay, reducing the left-side panel feeling, re-spacing the headline block, and rebuilding the right-side portrait area as a fuller hero visual composition |
| 2026-03-31 23:32 | liu | UX refinement | Performed a second Dennis/Liu first-screen fidelity pass by reducing the logo/nav weight, increasing the headline?s horizontal statement feel, and enlarging the right-side figure so the hero reads less like a split module and more like an editorial portrait-led opening |
| 2026-03-31 23:45 | liu | Bug fix | Fixed the Dennis/Liu homepage hero utility cluster by wiring the social pills to real site settings links and giving the top-right social icons enough width / no-wrap layout so they no longer overlap |
| 2026-03-31 23:49 | liu | Bug fix | Fixed the remaining homepage hero social overlap by rendering shortened platform tags like ? / B / in instead of full backend link labels, and by shifting the utility row farther right within the portrait panel |
| 2026-04-01 09:53 | codex | Bug fix | Compressed the homepage hero social links down to fixed-width short tags like ? / B / in and shifted the utility row deeper into the right visual area so the social links no longer overlap the primary navigation band |
