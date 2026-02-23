"use client";
import { useState, useTransition } from "react";
import DownloaderShell from "@/components/downloader-shell";
import {
  getTikTokInfoAction,
  prepareTikTokDownloadAction,
} from "@/actions/tiktok-downloader.action";
import type { TikTokVideoInfo } from "@/core/services/tiktok.service";

function fmtDuration(s: number) {
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

const VARIANTS = [
  {
    value: "nowatermark",
    icon: "✨",
    label: "No Watermark",
    sub: "Clean file",
  },
  { value: "watermark", icon: "🎵", label: "With Watermark", sub: "Original" },
  { value: "audio", icon: "🎧", label: "Audio Only", sub: "MP3" },
] as const;

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

export default function TikTokDownloader() {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState<TikTokVideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [variant, setVariant] = useState<"nowatermark" | "watermark" | "audio">(
    "nowatermark",
  );
  const [downloading, setDownloading] = useState(false);
  const [isPending, start] = useTransition();
  const loading = isPending || downloading;

  const handleFetch = () => {
    setError(null);
    setInfo(null);
    start(async () => {
      const r = await getTikTokInfoAction(url);
      if (r.success && r.data) setInfo(r.data);
      else setError(r.error ?? "Unknown error");
    });
  };

  const handleDownload = () => {
    if (!info) return;
    setError(null);
    setDownloading(true);
    start(async () => {
      const r = await prepareTikTokDownloadAction(url, variant, info.title);
      if (!r.success || !r.downloadPath) {
        setError(r.error ?? "Failed");
        setDownloading(false);
        return;
      }
      const a = document.createElement("a");
      a.href = r.downloadPath;
      a.download = r.filename ?? "tiktok.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloading(false);
    });
  };

  return (
    <DownloaderShell
      accentClass="text-pink-400"
      glowClass="bg-pink-600/5"
      borderGlow="border-pink-500/10"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-pink-500/20"
          style={{ background: "linear-gradient(135deg,#ff2d6b,#00e5ff)" }}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
          </svg>
        </div>
        <div>
          <h1 className="font-syne text-xl font-700 text-white">
            TikTok Downloader
          </h1>
          <p className="text-xs text-zinc-500">
            No watermark · All regions · Audio extract
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="relative group">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 to-cyan-500/10 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity pointer-events-none" />
        <div className="relative flex gap-2 glass rounded-2xl p-2 border border-white/6 group-focus-within:border-pink-500/30 transition-colors">
          <input
            type="url"
            placeholder="Paste TikTok URL..."
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
            style={{ background: "linear-gradient(135deg,#ff2d6b,#00e5ff)" }}
          >
            {isPending && !downloading ? (
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
        tiktok.com/@user/video/... · vm.tiktok.com · vt.tiktok.com
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
                className="w-20 h-28 object-cover rounded-xl flex-shrink-0 bg-zinc-900"
              />
            ) : (
              <div
                className="w-20 h-28 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl"
                style={{
                  background: "linear-gradient(135deg,#ff2d6b20,#00e5ff20)",
                }}
              >
                ♪
              </div>
            )}
            <div className="min-w-0 space-y-2">
              <p className="font-syne font-600 text-white text-sm leading-snug line-clamp-3">
                {info.title}
              </p>
              <p className="text-pink-400 text-sm font-medium">
                @{info.uploader_id || info.uploader}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-600">
                {info.duration > 0 && (
                  <span>⏱ {fmtDuration(info.duration)}</span>
                )}
                {info.view_count > 0 && (
                  <span>👁 {fmtCount(info.view_count)}</span>
                )}
                {info.like_count > 0 && (
                  <span>❤️ {fmtCount(info.like_count)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Variant selector */}
          <div className="space-y-2">
            <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider">
              Download as
            </p>
            <div className="grid grid-cols-3 gap-2">
              {VARIANTS.map((v) => (
                <button
                  key={v.value}
                  onClick={() => setVariant(v.value)}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border transition-all text-center ${
                    variant === v.value
                      ? "border-pink-500/50 bg-pink-500/10 text-white"
                      : "border-white/6 text-zinc-500 hover:border-white/12"
                  }`}
                >
                  <span className="text-xl">{v.icon}</span>
                  <span className="text-xs font-syne font-600">{v.label}</span>
                  <span className="text-[10px] opacity-60">{v.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-white font-syne font-600 text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-xl flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#ff2d6b,#00e5ff)" }}
          >
            {downloading ? (
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
                Download {VARIANTS.find((v) => v.value === variant)?.label}
              </>
            )}
          </button>
        </div>
      )}
    </DownloaderShell>
  );
}
