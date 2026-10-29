import { runInNewContext } from "node:vm";

import { Innertube, Platform } from "youtubei.js";

import { AppException } from "@/core/handler/exception";

export type YoutubeClient = "ANDROID" | "IOS";

// youtubei.js needs a JS evaluator to decipher stream URLs. The player script
// comes from YouTube, so run it in a fresh context with no Node globals.
Platform.shim.eval = (data, env) =>
  runInNewContext(
    `(() => { ${data.output}\nreturn process(${JSON.stringify(env.n ?? "")}, ${JSON.stringify(env.sp ?? "")}, ${JSON.stringify(env.sig ?? "")}); })()`,
    { URL, URLSearchParams },
    { timeout: 5_000 }
  );

const SESSION_TTL_MS = 60 * 60 * 1000;
let session: { yt: Promise<Innertube>; createdAt: number } | null = null;

/** One Innertube session per warm instance, refreshed hourly for a fresh player. */
export function getYoutube(): Promise<Innertube> {
  if (!session || Date.now() - session.createdAt > SESSION_TTL_MS) {
    const yt = Innertube.create({ retrieve_player: true });
    yt.catch(() => {
      session = null;
    });
    session = { yt, createdAt: Date.now() };
  }
  return session.yt;
}

export async function getYoutubeInfo(id: string, client: YoutubeClient) {
  const yt = await getYoutube();
  const info = await yt.getBasicInfo(id, { client });
  const status = info.playability_status;
  if (status && status.status !== "OK") {
    throw AppException.unavailable(
      status.reason ?? "Video ini tidak bisa diputar tanpa login."
    );
  }
  return info;
}

/**
 * googlevideo URLs are bound to the IP that extracted them, so the stream
 * route calls this in the same invocation that downloads the bytes.
 */
export async function resolveYoutubeFormat(
  id: string,
  itag: number,
  client: YoutubeClient
) {
  const yt = await getYoutube();
  const info = await getYoutubeInfo(id, client);
  const format = [
    ...(info.streaming_data?.formats ?? []),
    ...(info.streaming_data?.adaptive_formats ?? []),
  ].find((candidate) => candidate.itag === itag);
  if (!format) throw AppException.notFound("Format video tidak tersedia lagi.");

  return {
    url: await format.decipher(yt.session.player),
    size: format.content_length,
    contentType: format.mime_type.split(";")[0],
  };
}
