import { NextRequest, NextResponse } from "next/server";
import {
  tiktokDownloaderService,
  isValidTikTokUrl,
} from "@/core/services/tiktok.service";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const variant = (searchParams.get("variant") ?? "nowatermark") as
    | "nowatermark"
    | "watermark"
    | "audio";
  const filename = searchParams.get("filename") ?? "tiktok.mp4";

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  if (!isValidTikTokUrl(url)) {
    return NextResponse.json({ error: "Invalid TikTok URL" }, { status: 400 });
  }

  try {
    // Pipe yt-dlp stdout directly — yt-dlp handles all TikTok CDN auth/headers internally
    const contentType = variant === "audio" ? "audio/mpeg" : "video/mp4";
    const ytStream = tiktokDownloaderService.createDownloadStream(url, variant);

    const webStream = new ReadableStream<Uint8Array>({
      start(controller) {
        ytStream.on("data", (chunk: Buffer) => controller.enqueue(chunk));
        ytStream.on("end", () => controller.close());
        ytStream.on("error", (err: Error) => {
          console.error("[tiktok stream]", err.message);
          controller.error(err);
        });
      },
      cancel() {
        if ("destroy" in ytStream) (ytStream as any).destroy();
      },
    });

    return new Response(webStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err: any) {
    console.error("[/internal/download/tiktok]", err?.message);
    return NextResponse.json(
      { error: err?.message ?? "Download failed" },
      { status: 500 },
    );
  }
}
