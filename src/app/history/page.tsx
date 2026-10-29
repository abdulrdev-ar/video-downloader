import type { Metadata } from "next";

import HistoryList from "./components/history-list";

export const metadata: Metadata = {
  title: "Riwayat Unduhan",
  description:
    "Daftar file yang pernah kamu simpan lewat SaveIt di browser ini.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 sm:pt-14">
      <div className="mb-6 space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Riwayat unduhan
        </h1>
        <p className="text-[17px] leading-relaxed text-muted-foreground">
          Tersimpan hanya di browser ini. Kami tidak mencatat apa yang kamu
          unduh.
        </p>
      </div>
      <HistoryList />
    </div>
  );
}
