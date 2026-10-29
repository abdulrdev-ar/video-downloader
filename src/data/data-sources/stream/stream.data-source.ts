import { injectable } from "tsyringe";

import { AppException } from "@/core/handler/exception";
import { resolveYoutubeFormat } from "@/core/services/youtube-client";
import type { StreamTokenPayload } from "@/data/models/media/media.model";

import { MOBILE_UA } from "../media/media.data-source";

/** CDNs the extractors hand out. Anything else is refused, even with a valid token. */
const ALLOWED_HOSTS = [
  "googlevideo.com",
  "ytimg.com",
  "tikwm.com",
  "tiktokcdn.com",
  "tiktokcdn-us.com",
  "tiktokcdn-eu.com",
  "tiktokv.com",
  "ibyteimg.com",
  "byteimg.com",
  "cdninstagram.com",
  "fbcdn.net",
  "twimg.com",
  "rapidcdn.app",
  "snapcdn.app",
  "lovethreads.net",
];
const MAX_REDIRECTS = 4;
// googlevideo throttles one long request to playback speed; 10 MB ranges are not.
const YOUTUBE_CHUNK = 10 * 1024 * 1024;

export function isAllowedHost(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase();
    return (
      url.protocol === "https:" &&
      ALLOWED_HOSTS.some(
        (domain) => host === domain || host.endsWith(`.${domain}`)
      )
    );
  } catch {
    return false;
  }
}

export function contentDisposition(filename: string, inline: boolean): string {
  const ascii = filename.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "");
  return `${inline ? "inline" : "attachment"}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

export interface IStreamDataSource {
  open(payload: StreamTokenPayload, inline: boolean): Promise<Response>;
}

@injectable()
export class StreamDataSource implements IStreamDataSource {
  async open({ s: source, f: filename }: StreamTokenPayload, inline: boolean) {
    const upstream =
      source.type === "youtube"
        ? await this.youtube(source.id, source.itag, source.client)
        : await this.follow(source.url, source.referer);

    const headers = new Headers({
      "Content-Type": upstream.contentType,
      "Content-Disposition": contentDisposition(filename, inline),
      "Cache-Control": inline ? "private, max-age=600" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
    });
    if (upstream.size) headers.set("Content-Length", String(upstream.size));
    return new Response(upstream.body, { headers });
  }

  /** Follows redirects by hand so every hop is checked against the allowlist. */
  private async follow(start: string, referer?: string) {
    let url = start;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
      if (!isAllowedHost(url))
        throw AppException.forbidden("Sumber file ini tidak diizinkan.");
      const response = await fetch(url, {
        headers: {
          "User-Agent": MOBILE_UA,
          ...(referer ? { Referer: referer } : {}),
        },
        redirect: "manual",
        signal: AbortSignal.timeout(30_000),
      });
      const location = response.headers.get("location");
      if (response.status >= 300 && response.status < 400 && location) {
        await response.body?.cancel();
        url = new URL(location, url).href;
        continue;
      }
      if (!response.ok || !response.body) {
        throw AppException.upstream(
          `Server file menolak unduhan (HTTP ${response.status}). Ambil ulang info post lalu coba lagi.`
        );
      }
      return {
        body: response.body,
        size: Number(response.headers.get("content-length")) || undefined,
        contentType:
          response.headers.get("content-type") ?? "application/octet-stream",
      };
    }
    throw AppException.upstream("Terlalu banyak pengalihan dari server file.");
  }

  private async youtube(id: string, itag: number, client: "ANDROID" | "IOS") {
    const format = await resolveYoutubeFormat(id, itag, client);
    if (!isAllowedHost(format.url))
      throw AppException.forbidden("Sumber file ini tidak diizinkan.");
    const size = format.size;
    if (!size)
      return {
        ...(await this.follow(format.url)),
        contentType: format.contentType,
      };

    let offset = 0;
    const body = new ReadableStream<Uint8Array>({
      async pull(controller) {
        if (offset >= size) return controller.close();
        const end = Math.min(offset + YOUTUBE_CHUNK, size) - 1;
        const response = await fetch(format.url, {
          headers: { "User-Agent": MOBILE_UA, Range: `bytes=${offset}-${end}` },
          signal: AbortSignal.timeout(60_000),
        });
        if (!response.ok) {
          return controller.error(
            new Error(`googlevideo HTTP ${response.status}`)
          );
        }
        controller.enqueue(new Uint8Array(await response.arrayBuffer()));
        offset = end + 1;
      },
    });
    return { body, size, contentType: format.contentType };
  }
}
