import type { PlatformType } from "@/common/lib/url-validators";
import { AppException } from "@/core/handler/exception";
import type { MediaSourceModel } from "@/data/models/media/media.model";

export interface IMediaDataSource {
  readonly platform: PlatformType;
  getInfo(url: string): Promise<MediaSourceModel>;
}

export const MOBILE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

/** `fetch` with a timeout that throws an AppException on a non-2xx answer. */
export async function fetchOk(
  url: string,
  init: RequestInit & { label: string; timeoutMs?: number }
): Promise<Response> {
  const { label, timeoutMs = 20_000, ...rest } = init;
  const response = await fetch(url, {
    ...rest,
    headers: { "User-Agent": MOBILE_UA, ...rest.headers },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (response.status === 404) {
    throw AppException.notFound("Post tidak ditemukan. Cek lagi tautannya.");
  }
  if (!response.ok) {
    throw AppException.upstream(
      `${label} menolak permintaan (HTTP ${response.status}).`
    );
  }
  return response;
}

/** First line of a caption, trimmed to something that fits a heading. */
export function titleFrom(text: string | undefined, fallback: string): string {
  const line = text
    ?.replace(/https:\/\/t\.co\/\w+/g, "")
    .split("\n")
    .find((part) => part.trim())
    ?.trim();
  if (!line) return fallback;
  return line.length > 100 ? `${line.slice(0, 97)}...` : line;
}

export function extFromUrl(url: string, fallback: string): string {
  try {
    const ext = new URL(url).pathname.match(/\.([a-z0-9]{3,4})$/i)?.[1];
    return ext?.toLowerCase() ?? fallback;
  } catch {
    return fallback;
  }
}
