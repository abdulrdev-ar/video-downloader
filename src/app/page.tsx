"use client";

import { useState, useTransition } from "react";
import {
  getVideoInfoAction,
  prepareDownloadAction,
} from "@/actions/download.action";
import type { VideoInfo, VideoFormat } from "@/core/services/youtube.service";

function formatBytes(bytes: number | null): string {
  if (!bytes) return "Unknown";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const QUALITY_PRESETS = [
  { label: "Best (auto)", value: "best", hint: "Fast" },
  { label: "1080p", value: "1080p", hint: "Slow (server merge)" },
  { label: "720p", value: "720p", hint: "Fast" },
  { label: "480p", value: "480p", hint: "Fast" },
  { label: "360p", value: "360p", hint: "Fast" },
  { label: "Audio Only", value: "audio", hint: "Fast" },
];

export default function YoutubeDownloaderPage() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState("best");
  const [selectedFormatId, setSelectedFormatId] = useState<
    string | undefined
  >();
  const [downloading, setDownloading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleFetchInfo = () => {
    setError(null);
    setVideoInfo(null);
    setSelectedFormatId(undefined);

    startTransition(async () => {
      const result = await getVideoInfoAction(url);
      if (result.success && result.data) {
        setVideoInfo(result.data);
      } else {
        setError(result.error ?? "Unknown error");
      }
    });
  };

  const handleDownload = async () => {
    setError(null);
    setDownloading(true);

    startTransition(async () => {
      const result = await prepareDownloadAction(
        url,
        selectedQuality,
        videoInfo?.title ?? "video",
        selectedFormatId,
      );

      if (!result.success || !result.downloadPath) {
        setError(result.error ?? "Failed to prepare download");
        setDownloading(false);
        return;
      }

      // Trigger browser download via anchor click
      const a = document.createElement("a");
      a.href = result.downloadPath;
      a.download = result.filename ?? "video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloading(false);
    });
  };

  const videoFormats =
    videoInfo?.formats.filter((f) => f.vcodec !== "none") ?? [];
  const audioFormats =
    videoInfo?.formats.filter((f) => f.vcodec === "none") ?? [];

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-red-500">YouTube Downloader</h1>

        {/* URL Input */}
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Paste YouTube URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFetchInfo()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-red-500 transition"
          />
          <button
            onClick={handleFetchInfo}
            disabled={isPending || !url.trim()}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-lg font-medium transition"
          >
            {isPending ? "Fetching..." : "Fetch"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/40 border border-red-700 rounded-lg p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Video Info Card */}
        {videoInfo && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden space-y-4 p-4">
            <div className="flex gap-4">
              {videoInfo.thumbnail && (
                <img
                  src={videoInfo.thumbnail}
                  alt="thumbnail"
                  className="w-36 h-24 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="space-y-1 min-w-0">
                <h2 className="font-semibold text-lg leading-snug line-clamp-2">
                  {videoInfo.title}
                </h2>
                <p className="text-gray-400 text-sm">{videoInfo.uploader}</p>
                <p className="text-gray-500 text-sm">
                  {formatDuration(videoInfo.duration)} •{" "}
                  {videoInfo.view_count.toLocaleString()} views
                </p>
              </div>
            </div>

            {/* Quality Preset Selector */}
            <div>
              <p className="text-sm text-gray-400 mb-2">Quality Preset</p>
              <div className="flex flex-wrap gap-2">
                {QUALITY_PRESETS.map((q) => (
                  <button
                    key={q.value}
                    onClick={() => {
                      setSelectedQuality(q.value);
                      setSelectedFormatId(undefined);
                    }}
                    className={`px-3 py-1 rounded-full text-sm border transition flex flex-col items-center leading-tight ${
                      selectedQuality === q.value && !selectedFormatId
                        ? "bg-red-600 border-red-600"
                        : "border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    <span>{q.label}</span>
                    <span
                      className={`text-[10px] ${selectedQuality === q.value && !selectedFormatId ? "text-red-200" : "text-gray-500"}`}
                    >
                      {q.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced: specific format */}
            {videoFormats.length > 0 && (
              <details className="text-sm text-gray-400">
                <summary className="cursor-pointer hover:text-white transition">
                  Advanced: Pick specific format
                </summary>
                <div className="mt-2 space-y-1 max-h-48 overflow-y-auto pr-1">
                  {videoFormats.slice(0, 20).map((f) => (
                    <button
                      key={f.format_id}
                      onClick={() => setSelectedFormatId(f.format_id)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition text-xs ${
                        selectedFormatId === f.format_id
                          ? "border-red-500 bg-red-900/30"
                          : "border-gray-800 hover:border-gray-600"
                      }`}
                    >
                      <span className="font-mono text-gray-300">
                        {f.format_id}
                      </span>
                      <span className="ml-2">{f.resolution}</span>
                      {f.fps && (
                        <span className="ml-1 text-gray-500">{f.fps}fps</span>
                      )}
                      <span className="ml-1 text-gray-500">.{f.ext}</span>
                      <span className="ml-1 text-gray-500">
                        {formatBytes(f.filesize)}
                      </span>
                    </button>
                  ))}
                </div>
              </details>
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloading || isPending}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
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
                  {selectedFormatId
                    ? `(format ${selectedFormatId})`
                    : selectedQuality}
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
