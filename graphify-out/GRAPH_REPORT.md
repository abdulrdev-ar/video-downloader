# Graph Report - video-downloader  (2026-10-29)

## Corpus Check
- 84 files · ~45,375 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 617 nodes · 1122 edges · 29 communities (25 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a69e3a2f`
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
- Architecture
- 7. Frontend Conventions
- sw.js
- Component Usage
- 3. Layered Architecture
- 11. Clean Architecture Rules
- 5. Authentication & Sessions
- generate-icons.mjs
- AGENTS.md
- jest.config.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `AppException` - 22 edges
2. `MediaSourceModel` - 21 edges
3. `IMediaDataSource` - 18 edges
4. `compilerOptions` - 18 edges
5. `react` - 16 edges
6. `TAppException` - 16 edges
7. `Architecture` - 16 edges
8. `PlatformType` - 14 edges
9. `isPlatformUrl()` - 14 edges
10. `fetchOk()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `HistoryList()` --calls--> `platformInfo`  [EXTRACTED]
  src/app/history/components/history-list.tsx → src/common/constants/platforms.ts
- `platformInfo` --references--> `PlatformType`  [EXTRACTED]
  src/common/constants/platforms.ts → src/common/lib/url-validators.ts
- `Downloader()` --calls--> `platformInfo`  [EXTRACTED]
  src/components/download/downloader.tsx → src/common/constants/platforms.ts
- `MediaResult()` --calls--> `platformInfo`  [EXTRACTED]
  src/components/download/media-result.tsx → src/common/constants/platforms.ts
- `QueueRequest` --references--> `PlatformType`  [EXTRACTED]
  src/common/hooks/use-download-queue.ts → src/common/lib/url-validators.ts

## Import Cycles
- None detected.

## Communities (29 total, 4 thin omitted)

### Community 0 - "youtube-downloader.tsx"
Cohesion: 0.06
Nodes (24): immutable, nextConfig, .next, metadata, metadata, dmSans, fraunces, metadata (+16 more)

### Community 1 - "social-image.service.ts"
Cohesion: 0.07
Nodes (53): injectAll, AppException, getYoutube(), getYoutubeInfo(), resolveYoutubeFormat(), YoutubeClient, ExceptionCode, decodeSnapSaveResponse() (+45 more)

### Community 2 - "twitter.service.ts"
Cohesion: 0.09
Nodes (42): react, pickFile(), QueueItem, QueueRequest, QueueStatus, useDownloadQueue(), withExt(), compact (+34 more)

### Community 3 - "instagram.service.ts"
Cohesion: 0.09
Nodes (22): inject, safeFilename(), Downloader(), hmac(), secret(), SignatureManager, logger, TAppException (+14 more)

### Community 4 - "devDependencies"
Cohesion: 0.04
Nodes (45): jest, jest-environment-jsdom, oxfmt, oxlint, devDependencies, jest, jest-environment-jsdom, oxfmt (+37 more)

### Community 5 - "compilerOptions"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts (+22 more)

### Community 6 - "threads.service.ts"
Cohesion: 0.11
Nodes (20): dateFormat, HistoryList(), metadata, PlatformType, PersistedState, useAppStore, useHistory(), useHistoryActions() (+12 more)

### Community 7 - "youtube.service.ts"
Cohesion: 0.08
Nodes (24): 10. Risiko, 1. Permintaan dan keputusan, 2.1 Alur hari ini, 2.2 Tabel temuan, 2.3 Hasil uji sumber data tanpa binary (IP lokal, 2026-10-29), 2.4 Batasan, 2. Review (kondisi sebelum refactor), 3. Penerapan ARCHITECTURE.md (+16 more)

### Community 8 - "spike/route.ts"
Cohesion: 0.09
Nodes (21): categories, correctness, perf, suspicious, ignorePatterns, graphify-out, node_modules, .playwright-mcp (+13 more)

### Community 9 - "download-job-store.ts"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 10 - "dependencies"
Cohesion: 0.06
Nodes (33): cheerio, class-variance-authority, clsx, fp-ts, mediabunny, next, dependencies, cheerio (+25 more)

### Community 11 - "Migrasi ke Vercel Hobby dengan arsitektur ARCHITECTURE.md"
Cohesion: 0.08
Nodes (24): 10. Risiko, 1. Tujuan dan keputusan, 2.1 Alur download hari ini, 2.2 Tabel temuan, 2.3 Batasan, 2. Review (kondisi sekarang), 3. Penerapan ARCHITECTURE.md, 4. Struktur target (+16 more)

### Community 12 - "facebook.service.ts"
Cohesion: 0.13
Nodes (14): experimentalSortImports, experimentalTailwindcss, stylesheet, ignorePatterns, graphify-out/**, .playwright-mcp/**, printWidth, $schema (+6 more)

### Community 13 - "tiktok.service.ts"
Cohesion: 0.47
Nodes (11): HeroLinkForm(), isPlatformUrl(), isValidFacebookUrl(), isValidInstagramUrl(), isValidThreadsUrl(), isValidTikTokUrl(), isValidTwitterUrl(), isValidYoutubeUrl() (+3 more)

### Community 14 - "SaveIt Media Downloader"
Cohesion: 0.10
Nodes (19): Coolify deployment, Creating cookie secrets on Windows, Docker reports that a host port is already allocated, Environment variables, Facebook returns only one image, How extraction works, Important limitations, Legal notice (+11 more)

### Community 15 - "CLAUDE.md"
Cohesion: 0.12
Nodes (16): 1. Review, 2. Planning, 3. Eksekusi, Architecture, Architecture Analysis, Before Implementing, Claude.md, Data Fetching (+8 more)

### Community 16 - "manifest.json"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, lang, name, orientation (+6 more)

### Community 17 - "8. State Management (Zustand Slice Pattern)"
Cohesion: 0.15
Nodes (13): 8.10 Sequence: Logout / Flush, 8.11 Adding a New Domain Slice, 8.12 Re-render Rules, 8.1 Folder Layout, 8.2 Four Layers, One Direction, 8.3 The Slice Contract: `context` + `actions`, 8.4 Anatomy of a Slice, 8.5 The Composition Root (+5 more)

### Community 19 - "Architecture"
Cohesion: 0.18
Nodes (10): 10. Build & Deployment, 1. Overview & Tech Stack, 2. Top-Level Folder Structure, 4. Network / Request-Response Pipeline, 6. App Router Structure, 9. SEO Conventions, Architecture, Code (+2 more)

### Community 27 - "7. Frontend Conventions"
Cohesion: 0.29
Nodes (7): 7. Frontend Conventions, Component Organization, Feature-Folder Pattern, Forms, Global Components, Page-specific Components, Reusable Principle

### Community 29 - "sw.js"
Cohesion: 0.48
Nodes (6): cacheableResponse(), isHttpRequest(), PRECACHE_URLS, safePut(), shouldSkipRequest(), SKIP_CACHE_PATTERNS

### Community 32 - "Component Usage"
Cohesion: 0.33
Nodes (6): Adding Components, Component Priority, Component Usage, Custom Components, Lint/Format Standards (oxlint + oxfmt), Rules

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
- **273 isolated node(s):** `$schema`, `printWidth`, `tabWidth`, `singleQuote`, `semi` (+268 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `twitter.service.ts` to `spike/route.ts`, `youtube-downloader.tsx`, `tiktok.service.ts`, `threads.service.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `PlatformType` connect `threads.service.ts` to `youtube-downloader.tsx`, `social-image.service.ts`, `twitter.service.ts`, `tiktok.service.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `plugins` connect `spike/route.ts` to `twitter.service.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `$schema`, `printWidth`, `tabWidth` to the rest of the system?**
  _273 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `youtube-downloader.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06462585034013606 - nodes in this community are weakly interconnected._
- **Should `social-image.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07030812324929972 - nodes in this community are weakly interconnected._
- **Should `twitter.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08942139099941554 - nodes in this community are weakly interconnected._