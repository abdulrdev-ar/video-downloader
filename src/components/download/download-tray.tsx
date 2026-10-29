"use client";

import { useState } from "react";

import type { QueueItem } from "@/common/hooks/use-download-queue";
import { fmtBytes } from "@/common/lib/format";
import { cn } from "@/common/lib/utils";
import {
  AlertIcon,
  CheckIcon,
  ChevronIcon,
  Spinner,
} from "@/components/icon/icons";
import { Button } from "@/components/ui/button";

interface DownloadTrayProps {
  items: QueueItem[];
  onCancel: () => void;
  onRetry: () => void;
  onClear: () => void;
}

function statusText(item: QueueItem): string {
  switch (item.status) {
    case "waiting":
      return "Menunggu giliran";
    case "processing":
      return item.convert
        ? "Mengonversi gambar..."
        : "Menyusun file di perangkatmu...";
    case "done":
      return `Tersimpan · ${fmtBytes(item.received) ?? ""}`;
    case "failed":
      return item.error ?? "Gagal.";
    default: {
      const received = fmtBytes(item.received) ?? "0KB";
      const total = fmtBytes(item.total ?? null);
      return total ? `${received} dari ${total}` : `${received} diterima`;
    }
  }
}

export default function DownloadTray({
  items,
  onCancel,
  onRetry,
  onClear,
}: DownloadTrayProps) {
  const [collapsed, setCollapsed] = useState(false);
  if (!items.length) return null;

  const done = items.filter((item) => item.status === "done").length;
  const failed = items.filter((item) => item.status === "failed").length;
  const active = items.some((item) =>
    ["waiting", "downloading", "processing"].includes(item.status)
  );

  return (
    <section
      aria-label="Antrean unduhan"
      className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[calc(12px+env(safe-area-inset-bottom))] sm:px-6"
    >
      <div className="mx-auto max-w-2xl overflow-hidden rounded-lg border bg-card shadow-[0_-8px_30px_rgba(42,33,28,0.12)]">
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 sm:px-4">
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-expanded={!collapsed}
            className="mr-auto inline-flex h-11 cursor-pointer items-center gap-2 rounded-md pr-2 text-left"
          >
            <ChevronIcon
              className={cn(
                "size-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
            <span className="font-semibold">Unduhan</span>
            <span className="text-sm text-muted-foreground" aria-live="polite">
              {done} dari {items.length} selesai
              {failed ? `, ${failed} gagal` : ""}
            </span>
          </button>
          {active && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Batalkan
            </Button>
          )}
          {!active && failed > 0 && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Ulangi yang gagal
            </Button>
          )}
          {!active && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              Tutup
            </Button>
          )}
        </div>

        {!collapsed && (
          <ul className="max-h-[40dvh] divide-y overflow-y-auto border-t">
            {items.map((item) => {
              const percent =
                item.total && item.status === "downloading"
                  ? Math.min(
                      100,
                      Math.round((item.received / item.total) * 100)
                    )
                  : null;
              return (
                <li
                  key={item.id}
                  className="flex items-start gap-3 px-3 py-3 sm:px-4"
                >
                  <span className="mt-0.5 shrink-0" aria-hidden="true">
                    {item.status === "done" ? (
                      <CheckIcon className="size-4 text-success" />
                    ) : item.status === "failed" ? (
                      <AlertIcon className="size-4 text-destructive" />
                    ) : item.status === "waiting" ? (
                      <span className="block size-4 rounded-full border-2 border-input" />
                    ) : (
                      <Spinner className="size-4 text-primary" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <p
                      className="truncate text-[15px] font-medium"
                      title={item.title}
                    >
                      {item.title}
                    </p>
                    {item.status === "downloading" && (
                      // Without a known size the native element shows its indeterminate state.
                      <progress
                        aria-label={`Progres ${item.title}`}
                        max={100}
                        value={percent ?? undefined}
                        className="block h-1.5 w-full appearance-none overflow-hidden rounded-full bg-muted [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary"
                      />
                    )}
                    <p
                      className={cn(
                        "text-sm",
                        item.status === "failed"
                          ? "text-destructive"
                          : "text-muted-foreground"
                      )}
                    >
                      {statusText(item)}
                      {percent !== null && ` · ${percent}%`}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
