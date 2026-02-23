import type { Metadata } from "next";
import YoutubeDownloader from "./youtube-downloader";

export const metadata: Metadata = {
  title: "YouTube Video Downloader — HD 1080p, MP4, Audio",
  description:
    "Download YouTube videos in up to 1080p HD. Supports MP4, audio-only, and Shorts. Free, fast, no login required.",
  keywords: [
    "youtube downloader",
    "download youtube video",
    "youtube to mp4",
    "youtube 1080p download",
    "youtube shorts download",
  ],
  alternates: { canonical: "https://saveit.app/youtube" },
  openGraph: {
    title: "YouTube Downloader — HD 1080p Free",
    description:
      "Download YouTube videos in HD quality. MP4, audio, shorts — all supported.",
    url: "https://saveit.app/youtube",
  },
};

export default function Page() {
  return <YoutubeDownloader />;
}
