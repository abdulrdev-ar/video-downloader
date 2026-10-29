"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { PLATFORMS } from "@/common/constants/platforms";
import { cn } from "@/common/lib/utils";
import { ChevronIcon } from "@/components/icon/icons";
import PlatformIcon from "@/components/icon/platform-icon";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = (href: string) =>
    cn(
      "inline-flex h-11 items-center gap-2 rounded-md px-3 text-[15px] transition-colors hover:bg-muted",
      pathname === href
        ? "font-semibold text-foreground"
        : "text-muted-foreground"
    );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link
          href="/"
          className="mr-auto inline-flex h-11 items-center rounded-md font-display text-2xl font-semibold tracking-tight"
        >
          SaveIt
        </Link>

        <nav aria-label="Platform" className="hidden items-center lg:flex">
          {PLATFORMS.map((platform) => (
            <Link
              key={platform.id}
              href={platform.href}
              className={linkClass(platform.href)}
            >
              {platform.name}
            </Link>
          ))}
        </nav>
        <Link href="/history" className={linkClass("/history")}>
          Riwayat
        </Link>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="menu-platform"
          className="inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-md border border-input bg-card px-3 text-[15px] font-medium lg:hidden"
        >
          Platform
          <ChevronIcon
            className={cn("size-4 transition-transform", open && "rotate-180")}
          />
        </button>
      </div>

      {open && (
        <nav
          id="menu-platform"
          aria-label="Platform"
          className="border-t bg-background lg:hidden"
        >
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-4 py-3 sm:grid-cols-3 sm:px-6">
            {PLATFORMS.map((platform) => (
              <li key={platform.id}>
                <Link
                  href={platform.href}
                  className={cn(linkClass(platform.href), "w-full")}
                  aria-current={pathname === platform.href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <PlatformIcon platform={platform.id} className="size-4" />
                  {platform.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
