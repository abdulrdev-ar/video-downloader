import type { Metadata } from "next";
import Link from "next/link";

import { PLATFORMS, SITE_URL } from "@/common/constants/platforms";
import PlatformIcon from "@/components/icon/platform-icon";

import HeroLinkForm from "./components/hero-link-form";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

const FACTS = [
  {
    term: "Server kami hanya meneruskan",
    detail:
      "File mengalir dari server platform ke browsermu lewat SaveIt. Tidak ada salinan yang kami simpan setelah unduhan selesai.",
  },
  {
    term: "Video 1080p disusun di perangkatmu",
    detail:
      "Untuk kualitas tinggi, YouTube memisahkan gambar dan suara. Browsermu menyatukan keduanya tanpa mengurangi kualitas, jadi ada jeda beberapa detik setelah unduhan.",
  },
  {
    term: "Riwayat tetap di browsermu",
    detail:
      "Daftar file yang pernah kamu simpan hanya ada di perangkat ini, dan bisa kamu hapus kapan saja.",
  },
  {
    term: "Hanya konten publik",
    detail:
      "Kami tidak meminta login. Karena itu post privat, Story Instagram, dan akun yang dikunci tidak bisa diambil.",
  },
];

const FAQS = [
  {
    q: "Kenapa unduhan 1080p lebih lama daripada 360p?",
    a: "Pilihan 360p adalah satu file utuh dari YouTube. Untuk 480p, 720p, dan 1080p, YouTube mengirim gambar dan suara sebagai dua file terpisah. SaveIt mengunduh keduanya lalu menyatukannya di browsermu, tanpa kompresi ulang.",
  },
  {
    q: "Apakah video TikTok-nya tanpa watermark?",
    a: "Ya. Pilihan HD dan Standar diambil dari file tanpa watermark. Kalau HD tidak bisa diputar di perangkatmu, pilih Standar, karena HD kadang memakai format H.265.",
  },
  {
    q: "Format audionya apa?",
    a: "Untuk YouTube, Instagram, Facebook, X, dan Threads, audio disimpan sebagai M4A (AAC) dengan kualitas aslinya, tanpa dikonversi ulang. Untuk TikTok, kamu mendapat suara asli post dalam MP3.",
  },
  {
    q: "Di iPhone, filenya tersimpan di mana?",
    a: "Safari menyimpan unduhan ke app Files, folder Unduhan. Untuk memindahkan video ke app Foto, buka filenya, tekan Bagikan, lalu pilih Simpan Video.",
  },
  {
    q: "Kenapa ada post yang gagal diambil?",
    a: "Biasanya karena post itu privat, sudah dihapus, atau dibatasi untuk negara tertentu. Sebagian platform juga sesekali mengubah cara mereka menampilkan media. Kalau post publik tetap gagal, coba lagi beberapa menit kemudian.",
  },
  {
    q: "Boleh dipakai untuk mengunggah ulang konten orang lain?",
    a: "SaveIt dibuat untuk menyimpan konten demi keperluan pribadi, misalnya ditonton saat offline. Untuk mengunggah ulang, minta izin pembuatnya dan cantumkan sumbernya.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function LandingPage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pt-10 pb-14 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:pt-24 lg:pb-24">
        <div className="space-y-5">
          <h1 className="font-display text-[2.6rem] leading-[1.05] font-semibold tracking-tight sm:text-6xl">
            Tempel tautannya.
            <br />
            <span className="text-primary italic">Simpan videonya.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            SaveIt mengambil video, foto, dan audio dari post publik YouTube,
            TikTok, Instagram, Facebook, X, dan Threads. Gratis dan tanpa akun.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-[0_18px_50px_-24px_rgba(42,33,28,0.4)] sm:p-6">
          <HeroLinkForm />
          <p className="mt-3 text-sm text-muted-foreground">
            Kami mengenali platformnya dari tautan, lalu membuka halaman yang
            tepat.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="platform"
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16"
      >
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="space-y-3">
            <h2
              id="platform"
              className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Dari platform mana?
            </h2>
            <p className="text-[17px] leading-relaxed text-muted-foreground">
              Tiap platform menyimpan medianya dengan cara berbeda. Ini yang
              bisa kamu bawa pulang dari masing-masing.
            </p>
          </div>
          <ul className="cut-line">
            {PLATFORMS.map((platform) => (
              <li
                key={platform.id}
                className="border-b border-dashed border-input"
              >
                <Link
                  href={platform.href}
                  className="group flex items-start gap-4 rounded-md py-5 transition-colors hover:bg-muted/60 sm:px-3"
                >
                  <PlatformIcon
                    platform={platform.id}
                    className="mt-1 size-6 shrink-0"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl font-semibold group-hover:text-primary">
                      {platform.name}
                    </span>
                    <span className="block text-[15px] leading-relaxed text-muted-foreground">
                      {platform.saves}
                    </span>
                  </span>
                  <span className="mt-1 hidden text-sm font-semibold text-primary sm:inline">
                    Buka
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="file" className="bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <h2
            id="file"
            className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Yang terjadi setelah kamu menekan Unduh
          </h2>
          <dl className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {FACTS.map((fact) => (
              <div key={fact.term} className="space-y-2">
                <dt className="text-lg font-semibold">{fact.term}</dt>
                <dd className="text-[15px] leading-relaxed text-muted-foreground">
                  {fact.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        aria-labelledby="tanya"
        className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20"
      >
        <h2
          id="tanya"
          className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Pertanyaan yang sering masuk
        </h2>
        <div className="mt-8 divide-y border-y">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span
                  aria-hidden="true"
                  className="font-display text-2xl leading-none text-primary transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </section>
    </>
  );
}
