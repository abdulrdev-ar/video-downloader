// F0 spike for docs/vercel-migration.md. Temporary: delete after the spike
// results are recorded. Disabled unless SPIKE_KEY is set.
import { timingSafeEqual } from "node:crypto";
import { runInNewContext } from "node:vm";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";
import { Innertube, Platform } from "youtubei.js";
import {
  decodeSnapSaveResponse,
  extractInstagramEmbedVideoUrls,
  extractThreadsMedia,
} from "@/core/services/social-image.service";
import {
  isPlatformUrl,
  type PlatformType,
} from "@/core/utils/url-validators";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface Candidate {
  label: string;
  url: string;
}

const REFERERS: Partial<Record<PlatformType, string>> = {
  tiktok: "https://www.tiktok.com/",
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  threads: "https://www.threads.net/",
};

// youtubei.js needs a JS evaluator to decipher stream URLs. The player script
// comes from YouTube, so run it in a fresh vm context with no Node globals.
Platform.shim.eval = (data, env) =>
  runInNewContext(
    `(() => { ${data.output}\nreturn process(${JSON.stringify(env.n ?? "")}, ${JSON.stringify(env.sp ?? "")}, ${JSON.stringify(env.sig ?? "")}); })()`,
    { URL, URLSearchParams },
    { timeout: 5_000 },
  );

function keyMatches(given: string | null): boolean {
  const expected = process.env.SPIKE_KEY;
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function youtubeId(raw: string): string | null {
  const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  if (url.hostname.toLowerCase().endsWith("youtu.be")) {
    return url.pathname.slice(1, 12);
  }
  return (
    url.searchParams.get("v") ??
    url.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{11})/)?.[1] ??
    null
  );
}

async function youtube(url: string): Promise<Candidate[]> {
  const id = youtubeId(url);
  if (!id) throw new Error("No video id");
  const yt = await Innertube.create({ retrieve_player: true });
  const out: Candidate[] = [];
  for (const client of ["WEB", "MWEB", "IOS", "ANDROID", "TV"] as const) {
    for (const opts of [
      { type: "video+audio", quality: "best" },
      { type: "video", quality: "1080p" },
      { type: "audio", quality: "best" },
    ] as const) {
      const label = `${client} ${opts.type} ${opts.quality}`;
      try {
        const format = await yt.getStreamingData(id, { ...opts, client });
        out.push({ label, url: await format.decipher(yt.session.player) });
      } catch (error) {
        out.push({ label: `${label} ERROR ${(error as Error).message}`, url: "" });
      }
    }
  }
  return out;
}

async function twitter(url: string): Promise<Candidate[]> {
  const id = url.match(/\/status\/(\d+)/)?.[1];
  if (!id) throw new Error("No tweet id");
  const token = ((Number(id) / 1e15) * Math.PI)
    .toString(36)
    .replace(/(0+|\.)/g, "");
  const response = await fetch(
    `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=${token}&lang=en`,
    { signal: AbortSignal.timeout(15_000) },
  );
  if (!response.ok) throw new Error(`syndication HTTP ${response.status}`);
  const data = (await response.json()) as {
    mediaDetails?: {
      video_info?: {
        variants?: { content_type: string; url: string; bitrate?: number }[];
      };
    }[];
  };
  return (data.mediaDetails ?? []).flatMap((media) =>
    (media.video_info?.variants ?? [])
      .filter((variant) => variant.content_type === "video/mp4")
      .map((variant) => ({ label: `mp4 ${variant.bitrate ?? 0}`, url: variant.url })),
  );
}

async function tiktok(url: string): Promise<Candidate[]> {
  const response = await fetch("https://www.tikwm.com/api/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0",
    },
    body: new URLSearchParams({ url, hd: "1" }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`tikwm HTTP ${response.status}`);
  const { code, msg, data } = (await response.json()) as {
    code: number;
    msg?: string;
    data?: Record<string, unknown>;
  };
  if (code !== 0 || !data) throw new Error(`tikwm code ${code} ${msg ?? ""}`);
  return ["hdplay", "play", "wmplay", "music"].flatMap((key) => {
    const value = data[key];
    if (typeof value !== "string" || !value) return [];
    return [{ label: key, url: new URL(value, "https://www.tikwm.com").href }];
  });
}

async function instagram(url: string): Promise<Candidate[]> {
  const path = new URL(url).pathname.replace(/\/+$/, "");
  const response = await fetch(
    `https://www.instagram.com${path}/embed/captioned/`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(20_000),
    },
  );
  if (!response.ok) throw new Error(`embed HTTP ${response.status}`);
  return extractInstagramEmbedVideoUrls(await response.text()).map((u) => ({
    label: "embed video",
    url: u,
  }));
}

async function facebook(url: string): Promise<Candidate[]> {
  const response = await fetch("https://snapsave.app/action.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: "https://snapsave.app",
      Referer: "https://snapsave.app/",
      "User-Agent": "Mozilla/5.0",
    },
    body: new URLSearchParams({ url }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`snapsave HTTP ${response.status}`);
  const decoded = decodeSnapSaveResponse(await response.text());
  const html =
    decoded
      .match(/innerHTML\s*=\s*"([\s\S]*?)"\s*;/)?.[1]
      ?.replaceAll("\\/", "/")
      .replaceAll('\\"', '"') ?? decoded;
  const $ = cheerio.load(html);
  return $("a[href]")
    .toArray()
    .map((element) => ({
      label: $(element).closest("tr").text().replace(/\s+/g, " ").trim() ||
        $(element).text().trim(),
      url: $(element).attr("href") ?? "",
    }))
    .filter((candidate) => candidate.url.startsWith("https://"));
}

async function threads(url: string): Promise<Candidate[]> {
  const media = await extractThreadsMedia(url);
  return media.videos.map((video, index) => ({
    label: `video ${index}`,
    url: video.remoteUrl,
  }));
}

const EXTRACTORS: Record<PlatformType, (url: string) => Promise<Candidate[]>> = {
  youtube,
  twitter,
  tiktok,
  instagram,
  facebook,
  threads,
};

async function probe(url: string, origin: string, referer?: string) {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      headers: {
        Range: "bytes=0-1023",
        Origin: origin,
        "User-Agent": "Mozilla/5.0",
        ...(referer ? { Referer: referer } : {}),
      },
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
    });
    await response.body?.cancel();
    const h = response.headers;
    return {
      status: response.status,
      ms: Date.now() - started,
      contentType: h.get("content-type"),
      contentRange: h.get("content-range"),
      contentLength: h.get("content-length"),
      allowOrigin: h.get("access-control-allow-origin"),
      disposition: h.get("content-disposition"),
      location: h.get("location"),
    };
  } catch (error) {
    return { error: (error as Error).message, ms: Date.now() - started };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  if (!keyMatches(searchParams.get("key"))) {
    return new NextResponse(null, { status: 404 });
  }

  const url = searchParams.get("url") ?? "";
  const platform = isPlatformUrl(url);
  if (!platform) {
    return NextResponse.json({ error: "Unsupported URL" }, { status: 400 });
  }

  const started = Date.now();
  try {
    const candidates = await EXTRACTORS[platform](url);
    const extractMs = Date.now() - started;
    const referer = REFERERS[platform];
    const items = await Promise.all(
      candidates.map(async (candidate) => {
        if (!candidate.url.startsWith("https://")) return { ...candidate };
        const plain = await probe(candidate.url, origin);
        const ok = (plain.status ?? 999) < 300;
        const location = plain.location?.startsWith("https://")
          ? plain.location
          : undefined;
        return {
          ...candidate,
          host: new URL(candidate.url).hostname,
          ipBound: new URL(candidate.url).searchParams.has("ip"),
          probe: plain,
          probeRedirect: location ? await probe(location, origin) : undefined,
          probeWithReferer:
            !ok && referer ? await probe(candidate.url, origin, referer) : undefined,
        };
      }),
    );
    return NextResponse.json({
      platform,
      region: process.env.VERCEL_REGION ?? "local",
      extractMs,
      items,
    });
  } catch (error) {
    return NextResponse.json({
      platform,
      region: process.env.VERCEL_REGION ?? "local",
      extractMs: Date.now() - started,
      error: (error as Error).message,
    });
  }
}
