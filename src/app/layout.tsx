import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import Script from "next/script";

import { SITE_URL } from "@/common/constants/platforms";
import ClientEnhancements from "@/components/feedback/client-enhancements";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";

import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const DESCRIPTION =
  "Simpan video, foto, dan audio dari post publik YouTube, TikTok, Instagram, Facebook, X, dan Threads. Tempel tautannya, pilih kualitas, selesai. Gratis, tanpa daftar.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SaveIt: Simpan Video dan Foto dari Media Sosial",
    template: "%s | SaveIt",
  },
  description: DESCRIPTION,
  applicationName: "SaveIt",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "SaveIt",
    title: "SaveIt: Simpan Video dan Foto dari Media Sosial",
    description: DESCRIPTION,
  },
  twitter: { card: "summary", title: "SaveIt", description: DESCRIPTION },
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icons/saveit-icon-192.png", sizes: "192x192" }],
    apple: [
      { url: "/icons/saveit-icon-192.png" },
      { url: "/icons/saveit-icon-512.png", sizes: "512x512" },
    ],
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "SaveIt" },
};

export const viewport: Viewport = {
  themeColor: "#faf5ee",
  width: "device-width",
  initialScale: 1,
};

const SW_REGISTER = `if ('serviceWorker' in navigator) { window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); }); }`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#konten"
          className="sr-only z-50 rounded-md bg-card px-4 py-3 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Langsung ke konten
        </a>
        <SiteHeader />
        <main id="konten" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <ClientEnhancements />
        <Script id="saveit-sw" strategy="lazyOnload">
          {SW_REGISTER}
        </Script>
      </body>
    </html>
  );
}
