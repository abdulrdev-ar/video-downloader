# Graph Report - video-downloader  (2026-10-29)

## Corpus Check
- 89 files · ~65,752 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 726 nodes · 1266 edges · 47 communities (39 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `069ab7e3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- youtube-downloader.tsx
- social-image.service.ts
- twitter.service.ts
- instagram.service.ts
- devDependencies
- compilerOptions
- threads.service.ts
- youtube.service.ts
- spike/route.ts
- download-job-store.ts
- dependencies
- Migrasi ke Vercel Hobby dengan arsitektur ARCHITECTURE.md
- facebook.service.ts
- tiktok.service.ts
- SaveIt Media Downloader
- CLAUDE.md
- manifest.json
- 8. State Management (Zustand Slice Pattern)
- Proposed Changes — 8 Self-Contained Tasks
- Architecture
- Task 2: Facebook Platform Support
- layout.tsx
- Task 3: X (Twitter) Platform Support
- Task 4: Threads Platform Support
- Task 1: Test Infrastructure + Shared Utilities Refactoring
- Task 7: PWA Support
- Task 6: Batch Download with Progress Bars
- 7. Frontend Conventions
- Task 5: Download History (localStorage)
- sw.js
- app/page.tsx
- spike/page.tsx
- Component Usage
- Task 8: Landing Page Update + Final Integration Polish
- facebook/page.tsx
- 3. Layered Architecture
- 11. Clean Architecture Rules
- 5. Authentication & Sessions
- generate-icons.mjs
- pwa-install-prompt.tsx
- AGENTS.md
- eslint.config.mjs
- jest.config.ts
- next.config.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `useDownloadHistory()` - 20 edges
2. `compilerOptions` - 16 edges
3. `Architecture` - 16 edges
4. `useBatchDownload()` - 15 edges
5. `createCompatibleMp4Stream()` - 14 edges
6. `extractThreadsMedia()` - 14 edges
7. `extractSocialImages()` - 14 edges
8. `fmtDuration()` - 14 edges
9. `nodeStreamToWebResponse()` - 13 edges
10. `SocialImageAsset` - 13 edges

## Surprising Connections (you probably didn't know these)
- `threads()` --calls--> `extractThreadsMedia()`  [EXTRACTED]
  src/app/internal/spike/route.ts → src/core/services/social-image.service.ts
- `GetFacebookInfoResult` --references--> `FacebookVideoInfo`  [EXTRACTED]
  src/actions/facebook-downloader.action.ts → src/core/services/facebook.service.ts
- `FacebookDownloader()` --calls--> `getFacebookInfoAction()`  [EXTRACTED]
  src/app/facebook/facebook-downloader.tsx → src/actions/facebook-downloader.action.ts
- `FacebookDownloader()` --calls--> `prepareFacebookDownloadAction()`  [EXTRACTED]
  src/app/facebook/facebook-downloader.tsx → src/actions/facebook-downloader.action.ts
- `GetInstagramInfoResult` --references--> `InstagramVideoInfo`  [EXTRACTED]
  src/actions/instagram-downloader.action.ts → src/core/services/instagram.service.ts

## Import Cycles
- None detected.

## Communities (47 total, 8 thin omitted)

### Community 0 - "youtube-downloader.tsx"
Cohesion: 0.06
Nodes (51): getInstagramInfoAction(), prepareInstagramDownloadAction(), getTikTokInfoAction(), prepareTikTokDownloadAction(), prepareDownloadAction(), preparePlaylistDownloadsAction(), FacebookDownloader(), QUALITY_PRESETS (+43 more)

### Community 1 - "social-image.service.ts"
Cohesion: 0.07
Nodes (62): convertImageStream(), fetchImageUpstream(), GET(), getRequestedOutputFormat(), ImageOutputFormat, PLATFORMS, GET(), instagram() (+54 more)

### Community 2 - "twitter.service.ts"
Cohesion: 0.11
Nodes (25): getTwitterInfoAction(), GetTwitterInfoResult, prepareTwitterDownloadAction(), PrepareTwitterDownloadResult, GET(), GET(), GET(), GET() (+17 more)

### Community 3 - "instagram.service.ts"
Cohesion: 0.11
Nodes (24): GetInstagramInfoResult, PrepareInstagramDownloadResult, cleanInstagramUrl(), getBinaryPath(), getInstagramCookieArgs(), hasVideoFormats(), IG_HEADERS, inferMediaType() (+16 more)

### Community 4 - "devDependencies"
Cohesion: 0.07
Nodes (29): eslint, eslint-config-next, jest, jest-environment-jsdom, devDependencies, eslint, eslint-config-next, jest (+21 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 6 - "threads.service.ts"
Cohesion: 0.13
Nodes (20): getThreadsInfoAction(), GetThreadsInfoResult, prepareThreadsDownloadAction(), PrepareThreadsDownloadResult, GET(), ImageMediaGalleryProps, getThreadsMediaAssets(), SocialImageAsset (+12 more)

### Community 7 - "youtube.service.ts"
Cohesion: 0.14
Nodes (19): cleanUrlForDownload(), getVideoInfoAction(), GetVideoInfoResult, PlaylistDownloadRequest, PrepareDownloadResult, cleanUrl(), cleanYoutubeInputUrl(), DirectUrlResult (+11 more)

### Community 8 - "spike/route.ts"
Cohesion: 0.16
Nodes (23): Candidate, EXTRACTORS, facebook(), GET(), keyMatches(), probe(), REFERERS, threads() (+15 more)

### Community 9 - "download-job-store.ts"
Cohesion: 0.14
Nodes (22): POST(), GET(), POST(), GET(), allowedInternalPrefixes, cancelDownloadJob(), createDownloadJob(), downloadDir (+14 more)

### Community 10 - "dependencies"
Cohesion: 0.08
Nodes (24): cheerio, next, dependencies, cheerio, next, react, react-dom, @tobyg74/tiktok-api-dl (+16 more)

### Community 11 - "Migrasi ke Vercel Hobby dengan arsitektur ARCHITECTURE.md"
Cohesion: 0.08
Nodes (24): 10. Risiko, 1. Tujuan dan keputusan, 2.1 Alur download hari ini, 2.2 Tabel temuan, 2.3 Batasan, 2. Review (kondisi sekarang), 3. Penerapan ARCHITECTURE.md, 4. Struktur target (+16 more)

### Community 12 - "facebook.service.ts"
Cohesion: 0.19
Nodes (15): getFacebookInfoAction(), GetFacebookInfoResult, prepareFacebookDownloadAction(), PrepareFacebookDownloadResult, GET(), cleanFacebookUrl(), FacebookDownloaderService, FacebookFormat (+7 more)

### Community 13 - "tiktok.service.ts"
Cohesion: 0.15
Nodes (15): GetTikTokInfoResult, PrepareTikTokDownloadResult, mockExecPromise, mockExecStream, mockGetSocialImageAssets, cleanTikTokUrl(), extractPhotoUrlFromError(), getBinaryPath() (+7 more)

### Community 14 - "SaveIt Media Downloader"
Cohesion: 0.10
Nodes (19): Coolify deployment, Creating cookie secrets on Windows, Docker reports that a host port is already allocated, Environment variables, Facebook returns only one image, How extraction works, Important limitations, Legal notice (+11 more)

### Community 15 - "CLAUDE.md"
Cohesion: 0.12
Nodes (16): 1. Review, 2. Planning, 3. Eksekusi, Architecture, Architecture Analysis, Before Implementing, Claude.md, Data Fetching (+8 more)

### Community 16 - "manifest.json"
Cohesion: 0.14
Nodes (13): background_color, categories, description, display, icons, name, orientation, scope (+5 more)

### Community 17 - "8. State Management (Zustand Slice Pattern)"
Cohesion: 0.15
Nodes (13): 8.10 Sequence: Logout / Flush, 8.11 Adding a New Domain Slice, 8.12 Re-render Rules, 8.1 Folder Layout, 8.2 Four Layers, One Direction, 8.3 The Slice Contract: `context` + `actions`, 8.4 Anatomy of a Slice, 8.5 The Composition Root (+5 more)

### Community 18 - "Proposed Changes — 8 Self-Contained Tasks"
Cohesion: 0.17
Nodes (11): Automated Tests, Background, Current Architecture Pattern (per platform), Design System, Manual Verification, Open Questions, Proposed Changes — 8 Self-Contained Tasks, SaveIt — Multi-Platform Expansion + Batch Download + History + PWA (+3 more)

### Community 19 - "Architecture"
Cohesion: 0.18
Nodes (10): 10. Build & Deployment, 1. Overview & Tech Stack, 2. Top-Level Folder Structure, 4. Network / Request-Response Pipeline, 6. App Router Structure, 9. SEO Conventions, Architecture, Code (+2 more)

### Community 20 - "Task 2: Facebook Platform Support"
Cohesion: 0.18
Nodes (11): [MODIFY] [globals.css](file:///c:/laragon/www/video-downloader/src/app/globals.css), [MODIFY] [navbar.tsx](file:///c:/laragon/www/video-downloader/src/components/navbar.tsx), [MODIFY] [next.config.ts](file:///c:/laragon/www/video-downloader/next.config.ts), [MODIFY] [page.tsx](file:///c:/laragon/www/video-downloader/src/app/page.tsx) (landing page), [NEW] [src/actions/facebook-downloader.action.ts](file:///c:/laragon/www/video-downloader/src/actions/facebook-downloader.action.ts), [NEW] [src/app/facebook/facebook-downloader.tsx](file:///c:/laragon/www/video-downloader/src/app/facebook/facebook-downloader.tsx), [NEW] [src/app/facebook/page.tsx](file:///c:/laragon/www/video-downloader/src/app/facebook/page.tsx), [NEW] [src/app/internal/download/facebook/route.ts](file:///c:/laragon/www/video-downloader/src/app/internal/download/facebook/route.ts) (+3 more)

### Community 21 - "layout.tsx"
Cohesion: 0.20
Nodes (8): dmSans, metadata, syne, viewport, ClientEnhancements(), IdleWindow, OfflineIndicator, PwaInstallPrompt

### Community 22 - "Task 3: X (Twitter) Platform Support"
Cohesion: 0.20
Nodes (10): [MODIFY] [globals.css](file:///c:/laragon/www/video-downloader/src/app/globals.css), [MODIFY] [navbar.tsx](file:///c:/laragon/www/video-downloader/src/components/navbar.tsx), [MODIFY] [page.tsx](file:///c:/laragon/www/video-downloader/src/app/page.tsx) (landing page), [NEW] [src/actions/twitter-downloader.action.ts](file:///c:/laragon/www/video-downloader/src/actions/twitter-downloader.action.ts), [NEW] [src/app/internal/download/twitter/route.ts](file:///c:/laragon/www/video-downloader/src/app/internal/download/twitter/route.ts), [NEW] [src/app/twitter/page.tsx](file:///c:/laragon/www/video-downloader/src/app/twitter/page.tsx), [NEW] [src/app/twitter/twitter-downloader.tsx](file:///c:/laragon/www/video-downloader/src/app/twitter/twitter-downloader.tsx), [NEW] [src/core/services/__tests__/twitter.service.test.ts](file:///c:/laragon/www/video-downloader/src/core/services/__tests__/twitter.service.test.ts) (+2 more)

### Community 23 - "Task 4: Threads Platform Support"
Cohesion: 0.22
Nodes (9): [MODIFY] [globals.css](file:///c:/laragon/www/video-downloader/src/app/globals.css), [MODIFY] [navbar.tsx](file:///c:/laragon/www/video-downloader/src/components/navbar.tsx) + [page.tsx](file:///c:/laragon/www/video-downloader/src/app/page.tsx), [NEW] [src/actions/threads-downloader.action.ts](file:///c:/laragon/www/video-downloader/src/actions/threads-downloader.action.ts), [NEW] [src/app/internal/download/threads/route.ts](file:///c:/laragon/www/video-downloader/src/app/internal/download/threads/route.ts), [NEW] [src/app/threads/page.tsx](file:///c:/laragon/www/video-downloader/src/app/threads/page.tsx), [NEW] [src/app/threads/threads-downloader.tsx](file:///c:/laragon/www/video-downloader/src/app/threads/threads-downloader.tsx), [NEW] [src/core/services/__tests__/threads.service.test.ts](file:///c:/laragon/www/video-downloader/src/core/services/__tests__/threads.service.test.ts), [NEW] [src/core/services/threads.service.ts](file:///c:/laragon/www/video-downloader/src/core/services/threads.service.ts) (+1 more)

### Community 24 - "Task 1: Test Infrastructure + Shared Utilities Refactoring"
Cohesion: 0.22
Nodes (9): [MODIFY] [instagram-downloader.tsx](file:///c:/laragon/www/video-downloader/src/app/instagram/instagram-downloader.tsx), [MODIFY] [tiktok-downloader.tsx](file:///c:/laragon/www/video-downloader/src/app/tiktok/tiktok-downloader.tsx), [MODIFY] [youtube-downloader.tsx](file:///c:/laragon/www/video-downloader/src/app/youtube/youtube-downloader.tsx), [NEW] [jest.config.ts](file:///c:/laragon/www/video-downloader/jest.config.ts), [NEW] [src/core/utils/format-helpers.ts](file:///c:/laragon/www/video-downloader/src/core/utils/format-helpers.ts), [NEW] [src/core/utils/__tests__/format-helpers.test.ts](file:///c:/laragon/www/video-downloader/src/core/utils/__tests__/format-helpers.test.ts), [NEW] [src/core/utils/__tests__/url-validators.test.ts](file:///c:/laragon/www/video-downloader/src/core/utils/__tests__/url-validators.test.ts), [NEW] [src/core/utils/url-validators.ts](file:///c:/laragon/www/video-downloader/src/core/utils/url-validators.ts) (+1 more)

### Community 25 - "Task 7: PWA Support"
Cohesion: 0.22
Nodes (9): [MODIFY] [layout.tsx](file:///c:/laragon/www/video-downloader/src/app/layout.tsx), [MODIFY] [next.config.ts](file:///c:/laragon/www/video-downloader/next.config.ts), [NEW] [public/icons/icon-192x192.png](file:///c:/laragon/www/video-downloader/public/icons/icon-192x192.png), [NEW] [public/icons/icon-512x512.png](file:///c:/laragon/www/video-downloader/public/icons/icon-512x512.png), [NEW] [public/manifest.json](file:///c:/laragon/www/video-downloader/public/manifest.json), [NEW] [public/sw.js](file:///c:/laragon/www/video-downloader/public/sw.js), [NEW] [src/components/offline-indicator.tsx](file:///c:/laragon/www/video-downloader/src/components/offline-indicator.tsx), [NEW] [src/components/pwa-install-prompt.tsx](file:///c:/laragon/www/video-downloader/src/components/pwa-install-prompt.tsx) (+1 more)

### Community 26 - "Task 6: Batch Download with Progress Bars"
Cohesion: 0.25
Nodes (8): [MODIFY] [downloader-shell.tsx](file:///c:/laragon/www/video-downloader/src/components/downloader-shell.tsx), [MODIFY] [globals.css](file:///c:/laragon/www/video-downloader/src/app/globals.css), [MODIFY] [instagram-downloader.tsx](file:///c:/laragon/www/video-downloader/src/app/instagram/instagram-downloader.tsx), [NEW] [src/components/batch-progress.tsx](file:///c:/laragon/www/video-downloader/src/components/batch-progress.tsx), [NEW] [src/components/ui/progress-bar.tsx](file:///c:/laragon/www/video-downloader/src/components/ui/progress-bar.tsx), [NEW] [src/core/hooks/__tests__/use-batch-download.test.ts](file:///c:/laragon/www/video-downloader/src/core/hooks/__tests__/use-batch-download.test.ts), [NEW] [src/core/hooks/use-batch-download.ts](file:///c:/laragon/www/video-downloader/src/core/hooks/use-batch-download.ts), Task 6: Batch Download with Progress Bars

### Community 27 - "7. Frontend Conventions"
Cohesion: 0.29
Nodes (7): 7. Frontend Conventions, Component Organization, Feature-Folder Pattern, Forms, Global Components, Page-specific Components, Reusable Principle

### Community 28 - "Task 5: Download History (localStorage)"
Cohesion: 0.29
Nodes (7): [MODIFY] All 6 platform downloader client components, [MODIFY] [navbar.tsx](file:///c:/laragon/www/video-downloader/src/components/navbar.tsx), [NEW] [src/app/history/history-page.tsx](file:///c:/laragon/www/video-downloader/src/app/history/history-page.tsx), [NEW] [src/app/history/page.tsx](file:///c:/laragon/www/video-downloader/src/app/history/page.tsx), [NEW] [src/core/hooks/__tests__/use-download-history.test.ts](file:///c:/laragon/www/video-downloader/src/core/hooks/__tests__/use-download-history.test.ts), [NEW] [src/core/hooks/use-download-history.ts](file:///c:/laragon/www/video-downloader/src/core/hooks/use-download-history.ts), Task 5: Download History (localStorage)

### Community 29 - "sw.js"
Cohesion: 0.48
Nodes (6): cacheableResponse(), isHttpRequest(), PRECACHE_URLS, safePut(), shouldSkipRequest(), SKIP_CACHE_PATTERNS

### Community 30 - "app/page.tsx"
Cohesion: 0.29
Nodes (5): BENEFITS, FAQS, HOW_IT_WORKS, metadata, PLATFORMS

### Community 31 - "spike/page.tsx"
Cohesion: 0.33
Nodes (3): metadata, SpikeItem, SpikeRunner()

### Community 32 - "Component Usage"
Cohesion: 0.33
Nodes (6): Adding Components, Component Priority, Component Usage, Custom Components, Lint/Format Standards (oxlint + oxfmt), Rules

### Community 33 - "Task 8: Landing Page Update + Final Integration Polish"
Cohesion: 0.33
Nodes (6): [MODIFY] [Dockerfile](file:///c:/laragon/www/video-downloader/Dockerfile), [MODIFY] [layout.tsx](file:///c:/laragon/www/video-downloader/src/app/layout.tsx), [MODIFY] [navbar.tsx](file:///c:/laragon/www/video-downloader/src/components/navbar.tsx), [MODIFY] [page.tsx](file:///c:/laragon/www/video-downloader/src/app/page.tsx) (landing page), [MODIFY] [README.md](file:///c:/laragon/www/video-downloader/README.md), Task 8: Landing Page Update + Final Integration Polish

### Community 35 - "3. Layered Architecture"
Cohesion: 0.40
Nodes (5): 3. Layered Architecture, Database and seeds, DI Bootstrap, DTO vs. Model, The Vertical Slice (repeated per domain)

### Community 36 - "11. Clean Architecture Rules"
Cohesion: 0.50
Nodes (4): 11. Clean Architecture Rules, Handler Exception, Repository, Response & DTO

### Community 37 - "5. Authentication & Sessions"
Cohesion: 0.50
Nodes (4): 5. Authentication & Sessions, Middleware (`src/proxy.ts`), RBAC (optional), Sessions

## Knowledge Gaps
- **314 isolated node(s):** `eslintConfig`, `config`, `nextConfig`, `name`, `version` (+309 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Proposed Changes — 8 Self-Contained Tasks` connect `Proposed Changes — 8 Self-Contained Tasks` to `Task 8: Landing Page Update + Final Integration Polish`, `Task 2: Facebook Platform Support`, `Task 3: X (Twitter) Platform Support`, `Task 4: Threads Platform Support`, `Task 1: Test Infrastructure + Shared Utilities Refactoring`, `Task 7: PWA Support`, `Task 6: Batch Download with Progress Bars`, `Task 5: Download History (localStorage)`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `SocialImageAsset` connect `threads.service.ts` to `youtube-downloader.tsx`, `social-image.service.ts`, `twitter.service.ts`, `instagram.service.ts`, `facebook.service.ts`, `tiktok.service.ts`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `config`, `nextConfig` to the rest of the system?**
  _314 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `youtube-downloader.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05929989550679206 - nodes in this community are weakly interconnected._
- **Should `social-image.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07272727272727272 - nodes in this community are weakly interconnected._
- **Should `twitter.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10810810810810811 - nodes in this community are weakly interconnected._
- **Should `instagram.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10967741935483871 - nodes in this community are weakly interconnected._