"use client";

import { isLeft } from "fp-ts/lib/Either";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  convertImage,
  extractAudio,
  fetchWithProgress,
  mergeVideoAudio,
  saveBlob,
} from "@/common/lib/media-file";
import type { PlatformType } from "@/common/lib/url-validators";
import { useHistoryActions } from "@/common/stores/hooks";
import { getMediaAction } from "@/data/actions/media/media.action";
import type { MediaFileModel } from "@/data/models/media/media.model";

export type QueueStatus =
  | "waiting"
  | "downloading"
  | "processing"
  | "done"
  | "failed";

export interface QueueRequest {
  title: string;
  platform: PlatformType;
  sourceUrl: string;
  /** Known file, or `pick` to resolve a playlist entry right before it downloads. */
  file?: MediaFileModel;
  pick?: string;
  convert?: "jpg" | "png";
}

export interface QueueItem extends QueueRequest {
  id: string;
  status: QueueStatus;
  received: number;
  total?: number;
  error?: string;
}

/** Playlist entries resolve late; take the requested quality or the closest fallback. */
function pickFile(
  files: MediaFileModel[],
  label: string
): MediaFileModel | undefined {
  return (
    files.find((file) => file.label === label) ??
    files.find((file) => file.kind === (label === "Audio" ? "audio" : "video"))
  );
}

function withExt(filename: string, ext: string): string {
  return filename.replace(/\.[^.]+$/, "") + `.${ext}`;
}

export function useDownloadQueue() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const itemsRef = useRef<QueueItem[]>([]);
  const runningRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const { add: addHistory } = useHistoryActions();

  const update = useCallback(
    (updater: (current: QueueItem[]) => QueueItem[]) => {
      itemsRef.current = updater(itemsRef.current);
      setItems(itemsRef.current);
    },
    []
  );

  const patch = useCallback(
    (id: string, values: Partial<QueueItem>) =>
      update((current) =>
        current.map((item) => (item.id === id ? { ...item, ...values } : item))
      ),
    [update]
  );

  const runOne = useCallback(
    async (item: QueueItem, signal: AbortSignal) => {
      let file = item.file;
      if (!file && item.pick) {
        const result = await getMediaAction(item.sourceUrl);
        if (isLeft(result)) throw new Error(result.left.message);
        file = pickFile(result.right.files, item.pick);
      }
      if (!file) throw new Error("File dengan kualitas ini tidak tersedia.");

      const total = file.size;
      patch(item.id, { status: "downloading", received: 0, total });
      const main = await fetchWithProgress(
        file.source,
        (received, size) => patch(item.id, { received, total: total ?? size }),
        signal
      );

      let blob = main;
      let filename = file.filename ?? `saveit.${file.ext}`;
      if (file.audio) {
        const audio = await fetchWithProgress(
          file.audio,
          (received) => patch(item.id, { received: main.size + received }),
          signal
        );
        patch(item.id, { status: "processing" });
        blob = await mergeVideoAudio(main, audio);
      } else if (file.extractAudio) {
        patch(item.id, { status: "processing" });
        blob = await extractAudio(main);
      } else if (item.convert) {
        patch(item.id, { status: "processing" });
        blob = await convertImage(main, item.convert);
        filename = withExt(filename, item.convert);
      }

      saveBlob(blob, filename);
      patch(item.id, { status: "done", received: blob.size, total: blob.size });
      addHistory({
        url: item.sourceUrl,
        platform: item.platform,
        title: item.title,
        label: item.convert ? item.convert.toUpperCase() : file.label,
        filename,
      });
    },
    [addHistory, patch]
  );

  const run = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    for (;;) {
      const next = itemsRef.current.find((item) => item.status === "waiting");
      if (!next) break;
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        await runOne(next, controller.signal);
      } catch (error) {
        patch(next.id, {
          status: "failed",
          error: controller.signal.aborted
            ? "Dibatalkan."
            : error instanceof Error
              ? error.message
              : "Unduhan gagal.",
        });
      }
    }
    abortRef.current = null;
    runningRef.current = false;
  }, [patch, runOne]);

  useEffect(() => {
    if (items.some((item) => item.status === "waiting")) void run();
  }, [items, run]);

  const enqueue = useCallback(
    (requests: QueueRequest[]) =>
      update((current) => [
        ...current,
        ...requests.map((request) => ({
          ...request,
          id: crypto.randomUUID(),
          status: "waiting" as const,
          received: 0,
        })),
      ]),
    [update]
  );

  const cancelAll = useCallback(() => {
    update((current) =>
      current.map((item) =>
        item.status === "waiting"
          ? { ...item, status: "failed", error: "Dibatalkan." }
          : item
      )
    );
    abortRef.current?.abort();
  }, [update]);

  const retryFailed = useCallback(
    () =>
      update((current) =>
        current.map((item) =>
          item.status === "failed"
            ? { ...item, status: "waiting", error: undefined, received: 0 }
            : item
        )
      ),
    [update]
  );

  const clearFinished = useCallback(
    () =>
      update((current) =>
        current.filter(
          (item) => item.status !== "done" && item.status !== "failed"
        )
      ),
    [update]
  );

  return { items, enqueue, cancelAll, retryFailed, clearFinished };
}
