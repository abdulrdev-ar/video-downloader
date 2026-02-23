import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saveit.app"),
  title: {
    default: "SaveIt — Download YouTube, TikTok & Instagram Videos Free",
    template: "%s | SaveIt",
  },
  description:
    "Download videos from YouTube, TikTok, and Instagram in seconds. No watermark, high quality MP4, free and no registration required.",
  keywords: [
    "video downloader",
    "youtube downloader",
    "tiktok downloader",
    "instagram downloader",
    "download youtube video",
    "download tiktok no watermark",
    "download instagram reel",
    "free video downloader",
    "mp4 downloader",
    "online video downloader",
  ],
  authors: [{ name: "SaveIt" }],
  creator: "SaveIt",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saveit.app",
    siteName: "SaveIt",
    title: "SaveIt — Download YouTube, TikTok & Instagram Videos Free",
    description:
      "Download videos from YouTube, TikTok, and Instagram in seconds. No watermark, high quality, free.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SaveIt Video Downloader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaveIt — Download YouTube, TikTok & Instagram Videos Free",
    description:
      "Download videos from YouTube, TikTok, and Instagram in seconds.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-[#080808] text-white antialiased font-dm">
        {children}
      </body>
    </html>
  );
}
