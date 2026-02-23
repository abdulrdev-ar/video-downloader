"use client";
import { useState, useTransition } from "react";
import DownloaderShell from "@/components/downloader-shell";
import {
  getInstagramInfoAction,
  prepareInstagramDownloadAction,
} from "@/actions/instagram-downloader.action";
import type {
  InstagramVideoInfo,
  InstagramEntry,
} from "@/core/services/instagram.service";

function fmtDuration(s: number) {
  if (!s) return "";
  const m = Math.floor(s / 60),
    sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}
function fmtCount(n: number) {
  return n >= 1e6
    ? `${(n / 1e6).toFixed(1)}M`
    : n >= 1e3
      ? `${(n / 1e3).toFixed(1)}K`
      : String(n);
}

const MT_ICON: Record<string, string> = {
  reel: "🎬",
  post: "🖼",
  igtv: "📺",
  story: "⭕",
};

function Spinner() {
  return (
    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
  );
}

const IG_GRADIENT = "linear-gradient(135deg,#f9a825,#e91e8c,#9c27b0)";

export default function InstagramDownloader() {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState<InstagramVideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadingIdx, setDownloadingIdx] = useState<
    number | "single" | null
  >(null);
  const [isPending, start] = useTransition();
  const loading = isPending || downloadingIdx !== null;

  const handleFetch = () => {
    setError(null);
    setInfo(null);
    start(async () => {
      const r = await getInstagramInfoAction(url);
      if (r.success && r.data) setInfo(r.data);
      else setError(r.error ?? "Unknown error");
    });
  };

  const handleDownload = (entryIndex?: number) => {
    if (!info) return;
    setError(null);
    setDownloadingIdx(entryIndex !== undefined ? entryIndex : "single");
    const title =
      entryIndex !== undefined
        ? `${info.uploader_id || info.uploader}-slide${entryIndex + 1}`
        : info.title || info.uploader_id || "instagram";
    start(async () => {
      const r = await prepareInstagramDownloadAction(url, title, entryIndex);
      if (!r.success || !r.downloadPath) {
        setError(r.error ?? "Failed");
        setDownloadingIdx(null);
        return;
      }
      const a = document.createElement("a");
      a.href = r.downloadPath;
      a.download = r.filename ?? "instagram.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadingIdx(null);
    });
  };

  const isCarousel = info && info.entries.length > 0;

  return (
    <DownloaderShell
      accentClass="text-purple-400"
      glowClass="bg-purple-600/5"
      borderGlow="border-purple-500/10"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20"
          style={{ background: IG_GRADIENT }}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </div>
        <div>
          <h1 className="font-syne text-xl font-700 text-white">
            Instagram Downloader
          </h1>
          <p className="text-xs text-zinc-500">
            Reels · Posts · IGTV · Carousels
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="relative group">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity pointer-events-none" />
        <div className="relative flex gap-2 glass rounded-2xl p-2 border border-white/6 group-focus-within:border-purple-500/30 transition-colors">
          <input
            type="url"
            placeholder="Paste Instagram URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !loading && url.trim() && handleFetch()
            }
            className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none"
          />
          <button
            onClick={handleFetch}
            disabled={loading || !url.trim()}
            className="px-4 py-2 rounded-xl text-white text-sm font-syne font-600 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shadow-lg flex-shrink-0"
            style={{ background: IG_GRADIENT }}
          >
            {isPending && downloadingIdx === null ? (
              <span className="flex items-center gap-1.5">
                <Spinner /> Fetching
              </span>
            ) : (
              "Fetch"
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-zinc-700 text-center">
        Public content only · /reel/ · /p/ · /tv/
      </p>

      {error && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm">
          <span className="flex-shrink-0">⚠</span> {error}
        </div>
      )}

      {info && (
        <div className="glass rounded-3xl border border-white/6 space-y-5 p-5">
          {/* Meta */}
          <div className="flex gap-4">
            {info.thumbnail ? (
              <img
                src={info.thumbnail}
                alt=""
                className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-zinc-900"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#f9a82520,#9c27b020)",
                }}
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-zinc-700">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
            )}
            <div className="min-w-0 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/4 border border-white/6 text-zinc-500">
                  {MT_ICON[info.media_type] ?? "📄"} {info.media_type}
                </span>
                {isCarousel && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    {info.entries.length} slides
                  </span>
                )}
              </div>
              <p className="text-purple-400 font-medium text-sm">
                @{info.uploader_id || info.uploader}
              </p>
              {info.description && (
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  {info.description}
                </p>
              )}
              <div className="flex gap-3 text-xs text-zinc-600">
                {info.duration > 0 && (
                  <span>⏱ {fmtDuration(info.duration)}</span>
                )}
                {info.like_count > 0 && (
                  <span>❤️ {fmtCount(info.like_count)}</span>
                )}
              </div>
            </div>
          </div>

          {/* No video banner */}
          {info.hasNoVideo && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-amber-400 text-sm">
              <span className="text-xl">🖼</span>
              <div>
                <p className="font-semibold text-sm">Image-only post</p>
                <p className="text-xs text-amber-400/70 mt-0.5">
                  This post has no downloadable video.
                </p>
              </div>
            </div>
          )}

          {/* Single download */}
          {!isCarousel && !info.hasNoVideo && (
            <button
              onClick={() => handleDownload()}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-white font-syne font-600 text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-xl flex items-center justify-center gap-2"
              style={{ background: IG_GRADIENT }}
            >
              {downloadingIdx === "single" ? (
                <>
                  <Spinner /> Preparing...
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="currentColor"
                  >
                    <path d="M12 16l-6-6h4V4h4v6h4l-6 6zm-7 2h14v2H5v-2z" />
                  </svg>
                  Download {MT_ICON[info.media_type]} {info.media_type}
                </>
              )}
            </button>
          )}

          {/* Carousel grid */}
          {isCarousel && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider">
                Select slide
              </p>
              <div className="grid grid-cols-2 gap-2">
                {info.entries.map((entry, i) => (
                  <div
                    key={entry.id}
                    className="rounded-2xl overflow-hidden border border-white/6 hover:border-white/12 transition-colors bg-white/[0.02]"
                  >
                    <div className="relative aspect-square bg-zinc-900">
                      {entry.thumbnail ? (
                        <img
                          src={entry.thumbnail}
                          alt={`slide ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700 text-3xl">
                          {entry.isVideo ? "🎬" : "🖼"}
                        </div>
                      )}
                      {entry.duration > 0 && (
                        <span className="absolute bottom-1.5 right-1.5 text-[10px] bg-black/70 px-1.5 py-0.5 rounded-lg text-white">
                          {fmtDuration(entry.duration)}
                        </span>
                      )}
                      <span className="absolute top-1.5 left-1.5 text-[10px] bg-black/70 px-1.5 py-0.5 rounded-lg text-zinc-300 font-syne font-600">
                        {i + 1}
                      </span>
                    </div>
                    {entry.isVideo ? (
                      <button
                        onClick={() => handleDownload(i)}
                        disabled={loading}
                        className="w-full py-2.5 text-xs font-syne font-600 text-white flex items-center justify-center gap-1.5 hover:bg-white/5 disabled:opacity-50 transition-colors"
                      >
                        {downloadingIdx === i ? (
                          <>
                            <Spinner /> Preparing
                          </>
                        ) : (
                          <>
                            <svg
                              viewBox="0 0 24 24"
                              className="w-3 h-3"
                              fill="currentColor"
                            >
                              <path d="M12 16l-6-6h4V4h4v6h4l-6 6zm-7 2h14v2H5v-2z" />
                            </svg>
                            Download
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="w-full py-2.5 text-xs text-center text-zinc-700">
                        🖼 Image only
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </DownloaderShell>
  );
}
