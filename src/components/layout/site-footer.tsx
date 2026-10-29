import Link from "next/link";

import { PLATFORMS } from "@/common/constants/platforms";

export default function SiteFooter() {
  return (
    <footer className="mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="cut-line" />
        <div className="flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm space-y-2">
            <p className="font-display text-xl font-semibold">SaveIt</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Untuk menyimpan konten publik demi keperluan pribadi. Hormati hak
              cipta pembuatnya dan minta izin sebelum mengunggah ulang.
            </p>
          </div>
          <nav aria-label="Semua platform">
            <ul className="grid grid-cols-2 gap-x-8 text-[15px] sm:grid-cols-4">
              {PLATFORMS.map((platform) => (
                <li key={platform.id}>
                  <Link
                    href={platform.href}
                    className="inline-flex h-11 items-center hover:text-primary"
                  >
                    {platform.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/history"
                  className="inline-flex h-11 items-center hover:text-primary"
                >
                  Riwayat
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
