"use client";

import { useState, useTransition } from "react";
import {
  getInstagramInfoAction,
  prepareInstagramDownloadAction,
} from "@/actions/instagram-downloader.action";
import type {
  InstagramVideoInfo,
  InstagramEntry,
} from "@/core/services/instagram.service";
import Link from "next/link";

function formatDuration(seconds: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const MEDIA_TYPE_LABEL: Record<string, string> = {
  reel: "🎬 Reel",
  post: "🖼 Post",
  igtv: "📺 IGTV",
  story: "⭕ Story",
};

export default function InstagramDownloaderPage() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<InstagramVideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadingIndex, setDownloadingIndex] = useState<
    number | "single" | null
  >(null);
  const [isPending, startTransition] = useTransition();

  const handleFetchInfo = () => {
    setError(null);
    setVideoInfo(null);

    startTransition(async () => {
      const result = await getInstagramInfoAction(url);
      if (result.success && result.data) {
        setVideoInfo(result.data);
      } else {
        setError(result.error ?? "Unknown error");
      }
    });
  };

  const handleDownload = (entryIndex?: number) => {
    if (!videoInfo) return;
    setError(null);
    setDownloadingIndex(entryIndex !== undefined ? entryIndex : "single");

    const title =
      entryIndex !== undefined
        ? `${videoInfo.uploader_id || videoInfo.uploader} - slide ${entryIndex + 1}`
        : videoInfo.title || videoInfo.uploader_id || "instagram";

    startTransition(async () => {
      const result = await prepareInstagramDownloadAction(
        url,
        title,
        entryIndex,
      );

      if (!result.success || !result.downloadPath) {
        setError(result.error ?? "Failed to prepare download");
        setDownloadingIndex(null);
        return;
      }

      const a = document.createElement("a");
      a.href = result.downloadPath;
      a.download = result.filename ?? "instagram.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadingIndex(null);
    });
  };

  const isCarousel = videoInfo && videoInfo.entries.length > 0;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Instagram gradient icon */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Instagram Downloader
            </h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="text-xs px-3 py-1.5 rounded-full border border-gray-700 hover:border-red-500 hover:text-red-400 transition text-gray-400"
            >
              ▶ YouTube
            </Link>
            <Link
              href="/tiktok"
              className="text-xs px-3 py-1.5 rounded-full border border-gray-700 hover:border-pink-500 hover:text-pink-400 transition text-gray-400"
            >
              ♪ TikTok
            </Link>
          </div>
        </div>

        {/* URL Input */}
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Paste Instagram URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFetchInfo()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-pink-500 transition text-sm"
          />
          <button
            onClick={handleFetchInfo}
            disabled={isPending || !url.trim()}
            className="disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-lg font-medium transition whitespace-nowrap text-white"
            style={{
              background: "linear-gradient(45deg, #f09433, #dc2743, #bc1888)",
            }}
          >
            {isPending && downloadingIndex === null ? "Fetching..." : "Fetch"}
          </button>
        </div>

        <p className="text-xs text-gray-600 text-center">
          Supports: /reel/ · /p/ (posts &amp; carousels) · /tv/ &nbsp;|&nbsp;
          Public content only · Stories not supported
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
            {/* Meta header */}
            <div className="flex gap-4">
              {videoInfo.thumbnail ? (
                <img
                  src={videoInfo.thumbnail}
                  alt="thumbnail"
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0 bg-gray-800"
                />
              ) : (
                <div
                  className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(45deg, #f09433, #dc2743, #bc1888)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 fill-white opacity-50"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </div>
              )}

              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400">
                    {MEDIA_TYPE_LABEL[videoInfo.media_type] ??
                      videoInfo.media_type}
                  </span>
                  {isCarousel && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/50 border border-purple-700 text-purple-300">
                      {videoInfo.entries.length} slides
                    </span>
                  )}
                </div>
                <p className="text-pink-400 font-semibold text-sm">
                  @{videoInfo.uploader_id || videoInfo.uploader}
                </p>
                {videoInfo.description && (
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                    {videoInfo.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                  {videoInfo.duration > 0 && (
                    <span>⏱ {formatDuration(videoInfo.duration)}</span>
                  )}
                  {videoInfo.like_count > 0 && (
                    <span>❤️ {formatCount(videoInfo.like_count)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* No video banner */}
            {videoInfo.hasNoVideo && (
              <div className="bg-yellow-900/40 border border-yellow-700 rounded-xl p-4 text-yellow-300 text-sm flex items-center gap-2">
                <span className="text-xl">🖼</span>
                <div>
                  <p className="font-semibold">No video in this post</p>
                  <p className="text-yellow-400/70 text-xs mt-0.5">
                    This post contains only images and cannot be downloaded as
                    video.
                  </p>
                </div>
              </div>
            )}

            {/* Single video download */}
            {!isCarousel && !videoInfo.hasNoVideo && (
              <button
                onClick={() => handleDownload()}
                disabled={downloadingIndex !== null || isPending}
                className="w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(45deg, #f09433, #dc2743, #bc1888)",
                }}
              >
                {downloadingIndex === "single" ? (
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
                    Download {MEDIA_TYPE_LABEL[videoInfo.media_type] ?? "Video"}
                  </>
                )}
              </button>
            )}

            {/* Carousel: grid of slides */}
            {isCarousel && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400">
                  Select slide to download
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {videoInfo.entries.map((entry, i) => (
                    <div
                      key={entry.id}
                      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-pink-500 transition"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-square bg-gray-900">
                        {entry.thumbnail ? (
                          <img
                            src={entry.thumbnail}
                            alt={`slide ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600 text-3xl">
                            {entry.duration > 0 ? "🎬" : "🖼"}
                          </div>
                        )}
                        {entry.duration > 0 && (
                          <span className="absolute bottom-1 right-1 text-xs bg-black/70 px-1.5 py-0.5 rounded">
                            {formatDuration(entry.duration)}
                          </span>
                        )}
                        <span className="absolute top-1 left-1 text-xs bg-black/70 px-1.5 py-0.5 rounded">
                          {i + 1}
                        </span>
                      </div>

                      {/* Download button — only for video slides */}
                      {entry.isVideo ? (
                        <button
                          onClick={() => handleDownload(i)}
                          disabled={downloadingIndex !== null || isPending}
                          className="w-full py-2 text-sm font-medium flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-pink-600"
                        >
                          {downloadingIndex === i ? (
                            <>
                              <svg
                                className="animate-spin w-3 h-3"
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
                                className="w-3 h-3"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 16l-6-6h4V4h4v6h4l-6 6zm-7 2h14v2H5v-2z" />
                              </svg>
                              Download
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="w-full py-2 text-xs text-center text-gray-600">
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

        <p className="text-xs text-gray-600 text-center">
          Requires <code>yt-dlp</code> installed on the server. Private accounts
          not supported.
        </p>
      </div>
    </main>
  );
}
