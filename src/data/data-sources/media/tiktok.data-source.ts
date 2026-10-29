import { injectable } from "tsyringe";

import { AppException } from "@/core/handler/exception";
import type {
  MediaFile,
  MediaSourceModel,
  StreamSource,
} from "@/data/models/media/media.model";

import { fetchOk, titleFrom, type IMediaDataSource } from "./media.data-source";

const TIKWM = "https://www.tikwm.com";
const REFERER = "https://www.tiktok.com/";

export interface TikwmPayload {
  code: number;
  msg?: string;
  data?: {
    title?: string;
    cover?: string;
    duration?: number;
    play_count?: number;
    play?: string;
    hdplay?: string;
    wmplay?: string;
    music?: string;
    size?: number;
    hd_size?: number;
    wm_size?: number;
    images?: string[];
    author?: { nickname?: string; unique_id?: string };
  };
}

function source(url: string): StreamSource {
  return { type: "url", url: new URL(url, TIKWM).href, referer: REFERER };
}

export function mapTikwm(
  sourceUrl: string,
  payload: TikwmPayload
): MediaSourceModel {
  const data = payload.data;
  if (payload.code !== 0 || !data) {
    throw AppException.unavailable(
      "TikTok tidak mengizinkan post ini diambil. Pastikan akunnya publik."
    );
  }

  const files: MediaFile<StreamSource>[] = [];
  if (data.images?.length) {
    data.images.forEach((image, index) => {
      files.push({
        kind: "image",
        label: `Foto ${index + 1}`,
        ext: "jpg",
        source: source(image),
      });
    });
  } else {
    const seen = new Set<string>();
    const videos: [
      string | undefined,
      string,
      string | undefined,
      number | undefined,
    ][] = [
      [
        data.hdplay,
        "HD",
        "Tanpa watermark. Kadang H.265, belum didukung pemutar lama",
        data.hd_size,
      ],
      [data.play, "Standar", "Tanpa watermark, paling kompatibel", data.size],
      [data.wmplay, "Asli", "Dengan watermark", data.wm_size],
    ];
    for (const [url, label, detail, size] of videos) {
      if (!url || seen.has(url)) continue;
      seen.add(url);
      files.push({
        kind: "video",
        label,
        detail,
        ext: "mp4",
        size: size || undefined,
        source: source(url),
      });
    }
  }
  if (data.music) {
    files.push({
      kind: "audio",
      label: "Audio",
      detail: "Suara asli post",
      ext: "mp3",
      source: source(data.music),
    });
  }
  if (!files.length)
    throw AppException.unavailable("Post ini tidak berisi video atau foto.");

  return {
    platform: "tiktok",
    sourceUrl,
    title: titleFrom(data.title, "Post TikTok"),
    author: data.author?.unique_id
      ? `@${data.author.unique_id}`
      : data.author?.nickname,
    thumbnail: data.cover ? source(data.cover) : undefined,
    duration: data.duration || undefined,
    views: data.play_count,
    files,
  };
}

@injectable()
export class TikTokDataSource implements IMediaDataSource {
  readonly platform = "tiktok" as const;

  async getInfo(url: string): Promise<MediaSourceModel> {
    const response = await fetchOk(`${TIKWM}/api/`, {
      label: "Layanan TikTok",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url, hd: "1" }),
    });
    return mapTikwm(url, (await response.json()) as TikwmPayload);
  }
}
