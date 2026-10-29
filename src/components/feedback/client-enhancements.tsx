"use client";

import { useEffect, useState } from "react";

import { useAppStore } from "@/common/stores/app.store";
import { useHistory } from "@/common/stores/hooks";
import { Button } from "@/components/ui/button";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

const DISMISS_KEY = "saveit-install-dismissed";

/** Mounted once from the root layout: restores saved history and handles offline and install banners. */
export default function ClientEnhancements() {
  const [offline, setOffline] = useState(false);
  const [install, setInstall] = useState<InstallPromptEvent | null>(null);
  // Offer installing only after the first saved file, when the visitor has seen the app work.
  const { entries } = useHistory();

  useEffect(() => {
    // Outside React render, so the store is used directly (ARCHITECTURE §8.7).
    void useAppStore.persist.rehydrate();

    const update = () => setOffline(!navigator.onLine);
    const onInstall = (event: Event) => {
      event.preventDefault();
      if (localStorage.getItem(DISMISS_KEY)) return;
      setInstall(event as InstallPromptEvent);
    };
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    window.addEventListener("beforeinstallprompt", onInstall);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      window.removeEventListener("beforeinstallprompt", onInstall);
    };
  }, []);

  const dismissInstall = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setInstall(null);
  };

  return (
    <>
      {offline && (
        <output className="fixed inset-x-0 top-16 z-40 block border-b bg-muted px-4 py-2.5 text-center text-sm">
          Kamu sedang offline. Unduhan baru bisa jalan lagi setelah internet
          tersambung.
        </output>
      )}
      {install && entries.length > 0 && (
        <div className="fixed inset-x-3 top-[76px] z-30 mx-auto flex max-w-md flex-wrap items-center gap-3 rounded-lg border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-6">
          <p className="min-w-48 flex-1 text-[15px]">
            Pasang SaveIt di layar utama supaya bisa dibuka seperti aplikasi.
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={dismissInstall}>
              Nanti
            </Button>
            <Button
              size="sm"
              onClick={async () => {
                await install.prompt();
                dismissInstall();
              }}
            >
              Pasang
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
