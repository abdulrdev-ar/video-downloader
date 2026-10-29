"use client";

import { isLeft } from "fp-ts/lib/Either";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { platformInfo } from "@/common/constants/platforms";
import { useDownloadQueue } from "@/common/hooks/use-download-queue";
import type { PlatformType } from "@/common/lib/url-validators";
import { AlertIcon, Spinner } from "@/components/icon/icons";
import { Button } from "@/components/ui/button";
import { getMediaAction } from "@/data/actions/media/media.action";
import type { MediaModel } from "@/data/models/media/media.model";

import DownloadTray from "./download-tray";
import LinkInput from "./link-input";
import MediaResult from "./media-result";
import PlaylistResult from "./playlist-result";

export default function Downloader({ platform }: { platform: PlatformType }) {
  const info = platformInfo(platform);
  const initialUrl = useSearchParams().get("url") ?? "";
  const [url, setUrl] = useState(initialUrl);
  const [media, setMedia] = useState<MediaModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const queue = useDownloadQueue();
  const resultRef = useRef<HTMLDivElement>(null);

  const fetchInfo = (target: string) => {
    setError(null);
    setMedia(null);
    startTransition(async () => {
      const result = await getMediaAction(target);
      if (isLeft(result)) {
        setError(result.left.message);
      } else {
        setMedia(result.right);
        resultRef.current?.focus();
      }
    });
  };

  // A link handed over from the landing page starts fetching right away.
  useEffect(() => {
    if (initialUrl) fetchInfo(initialUrl);
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- run once for the URL the page opened with
  }, []);

  return (
    <div className={queue.items.length ? "pb-56" : undefined}>
      <div className="rounded-lg border bg-card p-4 shadow-[0_12px_40px_-20px_rgba(42,33,28,0.35)] sm:p-6">
        <LinkInput
          value={url}
          onChange={(value) => {
            setUrl(value);
            setError(null);
          }}
          onSubmit={() => fetchInfo(url)}
          busy={pending}
          placeholder={info.placeholder}
          submitLabel="Ambil"
        />
        <p className="mt-3 text-sm text-muted-foreground">{info.note}</p>
      </div>

      <div
        ref={resultRef}
        tabIndex={-1}
        className="mt-6 outline-none"
        aria-live="polite"
      >
        {pending && (
          <div className="flex items-center gap-3 rounded-lg border bg-card p-5 text-[15px]">
            <Spinner className="size-5 text-primary" />
            Membaca post dan mencari file yang bisa diunduh...
          </div>
        )}

        {error && !pending && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-card p-5 sm:flex-row sm:items-start"
          >
            <AlertIcon className="mt-0.5 size-5 shrink-0 text-destructive" />
            <p className="flex-1 text-[15px]">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchInfo(url)}
              disabled={!url.trim()}
            >
              Coba lagi
            </Button>
          </div>
        )}

        {media &&
          !pending &&
          (media.entries ? (
            <PlaylistResult media={media} onDownload={queue.enqueue} />
          ) : (
            <MediaResult media={media} onDownload={queue.enqueue} />
          ))}
      </div>

      <DownloadTray
        items={queue.items}
        onCancel={queue.cancelAll}
        onRetry={queue.retryFailed}
        onClear={queue.clearFinished}
      />
    </div>
  );
}
