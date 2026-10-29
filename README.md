# SaveIt

SaveIt saves videos, photos, and audio from public posts on YouTube, TikTok,
Instagram, Facebook, X, and Threads. It runs on Vercel (or any Node host)
without system binaries: no `yt-dlp`, `ffmpeg`, `gallery-dl`, or `python3`.

## How it works

1. `getMediaAction(url)` picks the data-source for the platform and reads the
   post with plain `fetch` (YouTube through `youtubei.js`).
2. Every file comes back to the browser as a short-lived HMAC-signed token.
3. The browser downloads the token through `/internal/stream`, which only
   fetches hosts on an allowlist and follows redirects by hand.
4. YouTube 480p and above arrive as separate video and audio files. The
   browser joins them with `mediabunny` without re-encoding. Audio-only files
   from Instagram, Facebook, X, and Threads are cut from the video the same
   way. JPG and PNG conversion uses a canvas.
5. Download history lives in `localStorage` through a zustand store.

| Platform | Source |
| --- | --- |
| YouTube | `youtubei.js` (ANDROID client for 360p, IOS client for adaptive formats) |
| TikTok | tikwm.com API |
| Instagram | Public `/embed/captioned/` page |
| Facebook | snapsave.app |
| X | `cdn.syndication.twimg.com/tweet-result` |
| Threads | lovethreads.net |

The non-YouTube sources are unofficial and can change without notice. Each
lives in its own data-source under `src/data/data-sources/media/`.

The code follows `ARCHITECTURE.md`. The refactor plan and its verification
results are in `docs/refactor-redesign.md`.

## Setup

```bash
pnpm install
cp .env.example .env.local   # set STREAM_SECRET
pnpm dev
```

`STREAM_SECRET` is required in production. Generate one with
`node -e "console.log(crypto.randomBytes(32).toString('base64url'))"`.

## Scripts

- `pnpm dev`, `pnpm build`, `pnpm start`
- `pnpm test`: jest
- `pnpm lint`: oxlint
- `pnpm format`: oxfmt (writes)
- `pnpm check`: lint plus format check

## Limits

- Only public posts. Private posts, Instagram Stories, and locked accounts are
  not supported.
- Large YouTube files are held in browser memory while they are merged.
- Streaming through Vercel counts against the plan's data transfer quota.
