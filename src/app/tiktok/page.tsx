"use client";

import { useState, useTransition } from "react";
import {
  getTikTokInfoAction,
  prepareTikTokDownloadAction,
} from "@/actions/tiktok-downloader.action";
import type { TikTokVideoInfo } from "@/core/services/tiktok.service";
import Link from "next/link";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const VARIANTS = [
  {
    value: "nowatermark" as const,
    label: "No Watermark",
    desc: "Clean video without TikTok logo",
    icon: "✨",
  },
  {
    value: "watermark" as const,
    label: "With Watermark",
    desc: "Original with TikTok watermark",
    icon: "🎵",
  },
  {
    value: "audio" as const,
    label: "Audio Only",
    desc: "Extract audio as MP3",
    icon: "🎧",
  },
];

export default function TikTokDownloaderPage() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<TikTokVideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<
    "nowatermark" | "watermark" | "audio"
  >("nowatermark");
  const [downloading, setDownloading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleFetchInfo = () => {
    setError(null);
    setVideoInfo(null);

    startTransition(async () => {
      const result = await getTikTokInfoAction(url);
      if (result.success && result.data) {
        setVideoInfo(result.data);
      } else {
        setError(result.error ?? "Unknown error");
      }
    });
  };

  const handleDownload = () => {
    if (!videoInfo) return;
    setError(null);
    setDownloading(true);

    startTransition(async () => {
      const result = await prepareTikTokDownloadAction(
        url,
        selectedVariant,
        videoInfo.title,
      );

      if (!result.success || !result.downloadPath) {
        setError(result.error ?? "Failed to prepare download");
        setDownloading(false);
        return;
      }

      const a = document.createElement("a");
      a.href = result.downloadPath;
      a.download = result.filename ?? "tiktok.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloading(false);
    });
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-gray-700 hover:border-red-500 hover:text-red-400 transition text-gray-400"
          >
            ▶ YouTube
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {/* TikTok-style gradient logo */}
          <div className="relative w-9 h-9 flex-shrink-0">
            <div className="absolute inset-0 rounded-lg bg-black flex items-center justify-center">
              <span className="text-xl">♪</span>
            </div>
            <div className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded bg-cyan-400 opacity-70 blur-[2px]" />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded bg-pink-500 opacity-70 blur-[2px]" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-white to-cyan-400 bg-clip-text text-transparent">
            TikTok Downloader
          </h1>
        </div>

        {/* URL Input */}
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Paste TikTok URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFetchInfo()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-pink-500 transition text-sm"
          />
          <button
            onClick={handleFetchInfo}
            disabled={isPending || !url.trim()}
            className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-lg font-medium transition whitespace-nowrap"
          >
            {isPending && !downloading ? "Fetching..." : "Fetch"}
          </button>
        </div>

        {/* Supported formats hint */}
        <p className="text-xs text-gray-600 text-center">
          Supports: tiktok.com/@user/video/... · vm.tiktok.com · vt.tiktok.com
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-900/40 border border-red-700 rounded-lg p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Video Info Card */}
        {videoInfo && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden space-y-5 p-5">
            {/* Thumbnail + meta */}
            <div className="flex gap-4">
              {videoInfo.thumbnail ? (
                <img
                  src={videoInfo.thumbnail}
                  alt="thumbnail"
                  className="w-24 h-36 object-cover rounded-lg flex-shrink-0 bg-gray-800"
                />
              ) : (
                <div className="w-24 h-36 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">♪</span>
                </div>
              )}

              <div className="space-y-2 min-w-0">
                <p className="font-semibold leading-snug line-clamp-3 text-sm">
                  {videoInfo.title}
                </p>
                <p className="text-pink-400 text-sm font-medium">
                  @{videoInfo.uploader_id || videoInfo.uploader}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  {videoInfo.duration > 0 && (
                    <span>⏱ {formatDuration(videoInfo.duration)}</span>
                  )}
                  {videoInfo.view_count > 0 && (
                    <span>👁 {formatCount(videoInfo.view_count)} views</span>
                  )}
                  {videoInfo.like_count > 0 && (
                    <span>❤️ {formatCount(videoInfo.like_count)}</span>
                  )}
                </div>
                {/* Format badges */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {videoInfo.formats.slice(0, 4).map((f) => (
                    <span
                      key={f.format_id}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400"
                    >
                      {f.resolution} · {f.ext}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Variant Selector */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Download as</p>
              <div className="grid grid-cols-3 gap-2">
                {VARIANTS.map((v) => (
                  <button
                    key={v.value}
                    onClick={() => setSelectedVariant(v.value)}
                    className={`p-3 rounded-xl border text-left transition space-y-1 ${
                      selectedVariant === v.value
                        ? "border-pink-500 bg-pink-950/40"
                        : "border-gray-700 hover:border-gray-500 bg-gray-800/50"
                    }`}
                  >
                    <div className="text-lg">{v.icon}</div>
                    <div className="text-xs font-semibold">{v.label}</div>
                    <div className="text-[10px] text-gray-500 leading-tight">
                      {v.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloading || isPending}
              className="w-full bg-gradient-to-r from-pink-600 to-cyan-600 hover:from-pink-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              {downloading || isPending ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
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
                  Preparing...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 16l-6-6h4V4h4v6h4l-6 6zm-7 2h14v2H5v-2z" />
                  </svg>
                  Download{" "}
                  {VARIANTS.find((v) => v.value === selectedVariant)?.label}
                </>
              )}
            </button>
          </div>
        )}

        <p className="text-xs text-gray-600 text-center">
          Requires <code>yt-dlp</code> installed on the server.
        </p>
      </div>
    </main>
  );
}
