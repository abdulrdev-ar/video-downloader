import type { PlatformType } from "@/common/lib/url-validators";

export interface PlatformInfo {
  id: PlatformType;
  name: string;
  href: `/${PlatformType}`;
  placeholder: string;
  /** What a visitor can save, in one line. Only capabilities the data-source really has. */
  saves: string;
  /** Honest limit shown under the input. */
  note: string;
  seoTitle: string;
  seoDescription: string;
}

export const PLATFORMS: PlatformInfo[] = [
  {
    id: "youtube",
    name: "YouTube",
    href: "/youtube",
    placeholder: "https://youtu.be/...",
    saves: "Video sampai 1080p, Shorts, playlist, dan audio M4A.",
    note: "Kualitas 480p ke atas digabung di perangkatmu, jadi ada jeda beberapa detik setelah unduhan selesai.",
    seoTitle: "Unduh Video YouTube sampai 1080p",
    seoDescription:
      "Simpan video YouTube, Shorts, dan playlist sampai 1080p, atau ambil audionya saja dalam M4A. Gratis, tanpa daftar.",
  },
  {
    id: "tiktok",
    name: "TikTok",
    href: "/tiktok",
    placeholder: "https://vt.tiktok.com/...",
    saves: "Video tanpa watermark, post foto, dan suara aslinya.",
    note: "Tautan pendek vt.tiktok.com dan vm.tiktok.com juga bisa dipakai.",
    seoTitle: "Unduh Video TikTok Tanpa Watermark",
    seoDescription:
      "Simpan video TikTok tanpa watermark, semua foto dari post slide, dan suara aslinya. Gratis, tanpa daftar.",
  },
  {
    id: "instagram",
    name: "Instagram",
    href: "/instagram",
    placeholder: "https://www.instagram.com/reel/...",
    saves: "Reel, video feed, foto, dan carousel dari akun publik.",
    note: "Story dan post dari akun privat tidak bisa diambil.",
    seoTitle: "Unduh Reel, Foto, dan Carousel Instagram",
    seoDescription:
      "Simpan Reel, video, foto, dan setiap slide carousel dari akun Instagram publik. Gratis, tanpa daftar.",
  },
  {
    id: "facebook",
    name: "Facebook",
    href: "/facebook",
    placeholder: "https://www.facebook.com/watch/?v=...",
    saves: "Video dan Reel publik dalam kualitas HD atau SD.",
    note: "Video privat atau dari grup tertutup tidak bisa diambil.",
    seoTitle: "Unduh Video dan Reel Facebook",
    seoDescription:
      "Simpan video dan Reel Facebook publik dalam HD atau SD, atau ambil audionya saja. Gratis, tanpa daftar.",
  },
  {
    id: "twitter",
    name: "X",
    href: "/twitter",
    placeholder: "https://x.com/.../status/...",
    saves: "Video, GIF, dan foto ukuran asli dari post publik.",
    note: "Post dari akun yang dikunci tidak bisa diambil.",
    seoTitle: "Unduh Video, GIF, dan Foto dari X (Twitter)",
    seoDescription:
      "Simpan video, GIF, dan foto ukuran asli dari post X publik. Pilih resolusi yang kamu mau. Gratis, tanpa daftar.",
  },
  {
    id: "threads",
    name: "Threads",
    href: "/threads",
    placeholder: "https://www.threads.com/@.../post/...",
    saves: "Video dan foto dari post Threads publik.",
    note: "Threads diambil lewat layanan pihak ketiga. Kalau gagal, coba lagi beberapa menit kemudian.",
    seoTitle: "Unduh Video dan Foto Threads",
    seoDescription:
      "Simpan video dan foto dari post Threads publik. Gratis, tanpa daftar.",
  },
];

export function platformInfo(id: PlatformType): PlatformInfo {
  return PLATFORMS.find((platform) => platform.id === id)!;
}

export const SITE_URL = "https://saveit.app";
