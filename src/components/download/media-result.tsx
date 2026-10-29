"use client";

import { useState } from "react";

import { platformInfo } from "@/common/constants/platforms";
import type { QueueRequest } from "@/common/hooks/use-download-queue";
import { fmtBytes, fmtCount, fmtDuration } from "@/common/lib/format";
import { streamUrl } from "@/common/lib/media-file";
import { DownloadIcon } from "@/components/icon/icons";
import { Button } from "@/components/ui/button";
import type {
  MediaFileModel,
  MediaModel,
} from "@/data/models/media/media.model";

interface MediaResultProps {
  media: MediaModel;
  onDownload: (requests: QueueRequest[]) => void;
}

const GROUPS: { kind: MediaFileModel["kind"]; title: string }[] = [
  { kind: "video", title: "Video" },
  { kind: "audio", title: "Audio" },
  { kind: "image", title: "Foto" },
];

export default function MediaResult({ media, onDownload }: MediaResultProps) {
  const request = (
    file: MediaFileModel,
    convert?: "jpg" | "png"
  ): QueueRequest => ({
    title: media.title,
    platform: media.platform,
    sourceUrl: media.sourceUrl,
    file,
    convert,
  });
  const facts = [
    media.author,
    media.duration ? fmtDuration(media.duration) : null,
    media.views ? `${fmtCount(media.views)} kali ditonton` : null,
  ].filter(Boolean);

  return (
    <article className="overflow-hidden rounded-lg border bg-card">
      <header className="flex gap-4 p-4 sm:p-5">
        {media.thumbnail && <Thumbnail token={media.thumbnail} />}
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">
            {platformInfo(media.platform).name}
          </p>
          <h2 className="font-display text-lg leading-snug font-semibold break-words sm:text-xl">
            {media.title}
          </h2>
          {facts.length > 0 && (
            <p className="text-sm text-muted-foreground">{facts.join(" · ")}</p>
          )}
        </div>
      </header>

      {GROUPS.map(({ kind, title }) => {
        const files = media.files.filter((file) => file.kind === kind);
        if (!files.length) return null;
        return (
          <section
            key={kind}
            className="px-4 py-4 cut-line sm:px-5"
            aria-label={title}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-semibold">{title}</h3>
              {kind === "image" && files.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(files.map((file) => request(file)))}
                >
                  Unduh semua ({files.length})
                </Button>
              )}
            </div>
            {kind === "image" ? (
              <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3">
                {files.map((file) => (
                  <li
                    key={file.source}
                    className="overflow-hidden rounded-md border bg-background"
                  >
                    <ImagePreview
                      token={file.source}
                      alt={`${file.label} dari ${media.title}`}
                    />
                    <p className="px-3 pt-2.5 text-sm font-medium">
                      {file.label}
                    </p>
                    <div className="grid grid-cols-3 gap-1.5 p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDownload([request(file)])}
                        aria-label={`Unduh ${file.label} ukuran asli`}
                      >
                        Asli
                      </Button>
                      {(["jpg", "png"] as const).map((format) => (
                        <Button
                          key={format}
                          variant="outline"
                          size="sm"
                          onClick={() => onDownload([request(file, format)])}
                          aria-label={`Unduh ${file.label} sebagai ${format.toUpperCase()}`}
                        >
                          {format.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="divide-y">
                {files.map((file) => (
                  <li
                    key={`${file.label}-${file.source}`}
                    className="flex items-center gap-3 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{file.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {[
                          file.detail,
                          fmtBytes(file.size ?? null),
                          file.ext.toUpperCase(),
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => onDownload([request(file)])}
                      aria-label={
                        file.label === title
                          ? `Unduh ${title}`
                          : `Unduh ${title} ${file.label}`
                      }
                    >
                      <DownloadIcon />
                      Unduh
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </article>
  );
}

function Thumbnail({ token }: { token: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    // oxlint-disable-next-line nextjs/no-img-element -- signed same-origin stream, next/image cannot optimize it
    <img
      src={streamUrl(token, true)}
      alt=""
      onError={() => setFailed(true)}
      className="h-20 w-28 shrink-0 rounded-md bg-muted object-cover sm:h-24 sm:w-36"
    />
  );
}

function ImagePreview({ token, alt }: { token: string; alt: string }) {
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  return (
    <div className="relative aspect-square bg-muted">
      {state !== "ready" && (
        <p className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-muted-foreground">
          {state === "loading"
            ? "Memuat pratinjau..."
            : "Pratinjau gagal dimuat. Tombol unduh tetap bisa dicoba."}
        </p>
      )}
      {/* oxlint-disable-next-line nextjs/no-img-element -- signed same-origin stream, next/image cannot optimize it */}
      <img
        src={streamUrl(token, true)}
        alt={alt}
        loading="lazy"
        onLoad={() => setState("ready")}
        onError={() => setState("failed")}
        className={
          state === "ready"
            ? "size-full object-cover"
            : "size-full object-cover opacity-0"
        }
      />
    </div>
  );
}
