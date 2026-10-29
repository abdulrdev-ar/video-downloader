"use client";

import Link from "next/link";
import { useState } from "react";

import { PLATFORMS, platformInfo } from "@/common/constants/platforms";
import {
  useHistory,
  useHistoryActions,
  useHistoryHydrated,
} from "@/common/stores/hooks";
import { CloseIcon, Spinner } from "@/components/icon/icons";
import PlatformIcon from "@/components/icon/platform-icon";
import { Button, buttonVariants } from "@/components/ui/button";

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function HistoryList() {
  const { entries } = useHistory();
  const { remove, flush } = useHistoryActions();
  const hydrated = useHistoryHydrated();
  const [confirming, setConfirming] = useState(false);

  if (!hydrated) {
    return (
      <p className="flex items-center gap-3 rounded-lg border bg-card p-5 text-[15px]">
        <Spinner className="size-5 text-primary" />
        Membuka riwayat...
      </p>
    );
  }

  if (!entries.length) {
    return (
      <div className="space-y-4 rounded-lg p-6 text-center cut-box">
        <p className="font-display text-xl font-semibold">
          Belum ada yang disimpan
        </p>
        <p className="text-[15px] text-muted-foreground">
          File yang kamu unduh akan muncul di sini. Mulai dari platform tempat
          kontennya berada.
        </p>
        <ul className="flex flex-wrap justify-center gap-2">
          {PLATFORMS.map((platform) => (
            <li key={platform.id}>
              <Link
                href={platform.href}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <PlatformIcon platform={platform.id} className="size-4" />
                {platform.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[15px] text-muted-foreground">
          {entries.length} file
        </p>
        {confirming ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">Hapus semua riwayat?</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirming(false)}
            >
              Batal
            </Button>
            <Button
              size="sm"
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                flush();
                setConfirming(false);
              }}
            >
              Hapus semua
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirming(true)}
          >
            Hapus semua
          </Button>
        )}
      </div>

      <ul className="divide-y overflow-hidden rounded-lg border bg-card">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-center gap-3 py-2 pr-2 pl-4">
            <PlatformIcon
              platform={entry.platform}
              className="size-5 shrink-0 text-muted-foreground"
            />
            <div className="min-w-0 flex-1 py-1">
              <a
                href={entry.url}
                target="_blank"
                rel="noreferrer"
                className="block truncate text-[15px] font-medium hover:text-primary hover:underline"
                title={entry.title}
              >
                {entry.title}
              </a>
              <p className="text-sm text-muted-foreground">
                {platformInfo(entry.platform).name} · {entry.label} ·{" "}
                {dateFormat.format(entry.timestamp)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => remove(entry.id)}
              aria-label={`Hapus ${entry.title} dari riwayat`}
            >
              <CloseIcon />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
