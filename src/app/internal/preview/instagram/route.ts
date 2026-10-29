import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Instagram CDN (fbcdn.net) blocks cross-origin image loads.
// This proxy fetches the image server-side and re-serves it,
// so the browser sees it coming from our own origin.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url", { status: 400 });
  }

  // Only allow Instagram / Facebook CDN domains
  const allowed = ["fbcdn.net", "cdninstagram.com", "instagram.com"];
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  if (!allowed.some((d) => hostname.endsWith(d))) {
    return new NextResponse("Domain not allowed", { status: 403 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        Referer: "https://www.instagram.com/",
      },
    });

    if (!response.ok) {
      return new NextResponse("Failed to fetch thumbnail", {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        // Cache thumbnails for 1 hour — they don't change
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: any) {
    return new NextResponse("Proxy error", { status: 500 });
  }
}
