"use client";

import { useState } from "react";

import type { QueueRequest } from "@/common/hooks/use-download-queue";
import { fmtDuration } from "@/common/lib/format";
import { cn } from "@/common/lib/utils";
import { Button } from "@/components/ui/button";
import type { MediaModel } from "@/data/models/media/media.model";

const QUALITIES = ["720p", "1080p", "360p", "Audio"];
const PAGE = 30;

export default function PlaylistResult({
  media,
  onDownload,
}: {
  media: MediaModel;
  onDownload: (requests: QueueRequest[]) => void;
}) {
  const [quality, setQuality] = useState(QUALITIES[0]);
  const [visible, setVisible] = useState(PAGE);
  const entries = media.entries ?? [];
  const request = (entry: (typeof entries)[number]): QueueRequest => ({
    title: entry.title,
    platform: "youtube",
    sourceUrl: entry.url,
    pick: quality,
  });

  return (
    <article className="overflow-hidden rounded-lg border bg-card">
      <header className="space-y-4 p-4 sm:p-5">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Playlist YouTube · {entries.length} video
          </p>
          <h2 className="font-display text-xl font-semibold break-words">
            {media.title}
          </h2>
          {media.author && (
            <p className="text-sm text-muted-foreground">{media.author}</p>
          )}
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">
            Kualitas untuk semua video
          </legend>
          <div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-4">
            {QUALITIES.map((value) => (
              <label
                key={value}
                className={cn(
                  "flex h-11 cursor-pointer items-center justify-center rounded-md border text-[15px] font-medium has-focus-visible:outline-2 has-focus-visible:outline-ring",
                  quality === value
                    ? "border-primary bg-muted text-foreground"
                    : "border-input bg-card"
                )}
              >
                <input
                  type="radio"
                  name="kualitas"
                  value={value}
                  checked={quality === value}
                  onChange={() => setQuality(value)}
                  className="sr-only"
                />
                {value}
              </label>
            ))}
          </div>
        </fieldset>

        <Button
          className="w-full"
          onClick={() => onDownload(entries.map(request))}
        >
          Unduh semua {entries.length} video
        </Button>
        <p className="text-sm text-muted-foreground">
          Video diunduh satu per satu. Browser mungkin bertanya sekali apakah
          boleh menyimpan banyak file.
        </p>
      </header>

      <ol className="divide-y cut-line">
        {entries.slice(0, visible).map((entry, index) => (
          <li
            key={`${entry.id}-${index}`}
            className="flex items-center gap-3 px-4 py-2.5 sm:px-5"
          >
            <span className="w-6 shrink-0 text-right text-sm text-muted-foreground tabular-nums">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-[15px]">{entry.title}</p>
              {entry.duration ? (
                <p className="text-sm text-muted-foreground tabular-nums">
                  {fmtDuration(entry.duration)}
                </p>
              ) : null}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload([request(entry)])}
              aria-label={`Unduh ${entry.title}`}
            >
              Unduh
            </Button>
          </li>
        ))}
      </ol>
      {visible < entries.length && (
        <div className="p-4 cut-line">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setVisible((count) => count + PAGE)}
          >
            Tampilkan {Math.min(PAGE, entries.length - visible)} video lagi
          </Button>
        </div>
      )}
    </article>
  );
}
