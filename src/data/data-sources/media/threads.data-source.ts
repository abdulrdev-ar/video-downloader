import * as cheerio from "cheerio";
import { injectable } from "tsyringe";

import { AppException } from "@/core/handler/exception";
import type {
  MediaFile,
  MediaSourceModel,
  StreamSource,
} from "@/data/models/media/media.model";

import { fetchOk, type IMediaDataSource } from "./media.data-source";

interface LoveThreadsPayload {
  status?: string;
  mess?: string;
  data?: string;
}

export function mapLoveThreads(
  sourceUrl: string,
  payload: LoveThreadsPayload
): MediaSourceModel {
  if (payload.status !== "ok" || !payload.data) {
    throw AppException.unavailable(
      payload.mess?.toLowerCase().includes("private")
        ? "Post Threads ini privat. Hanya post publik yang bisa disimpan."
        : "Threads tidak menampilkan media post ini."
    );
  }

  const $ = cheerio.load(payload.data);
  const files: MediaFile<StreamSource>[] = [];
  let videos = 0;
  let photos = 0;
  $(".download-box > li").each((_, element) => {
    const item = $(element);
    if (item.find(".icon-dlvideo").length) {
      const href =
        item.find('a[title="Download Video"]').attr("href") ??
        item.find(".download-items__btn a").attr("href");
      if (!href?.startsWith("https://")) return;
      videos += 1;
      files.push({
        kind: "video",
        label: `Video ${videos}`,
        ext: "mp4",
        source: { type: "url", url: href },
      });
      return;
    }
    const image =
      item.find(".photo-option option").first().attr("value") ??
      item.find("img").attr("src");
    if (!image?.startsWith("https://")) return;
    photos += 1;
    files.push({
      kind: "image",
      label: `Foto ${photos}`,
      ext: "jpg",
      source: { type: "url", url: image },
    });
  });

  const firstVideo = files.find((file) => file.kind === "video");
  if (firstVideo && videos === 1) {
    files.push({
      ...firstVideo,
      kind: "audio",
      label: "Audio",
      detail: "M4A dari video",
      ext: "m4a",
      extractAudio: true,
    });
  }
  if (!files.length)
    throw AppException.unavailable("Post ini tidak berisi video atau foto.");

  const username = new URL(sourceUrl).pathname.match(/^\/@([^/]+)/)?.[1];
  const preview = files.find((file) => file.kind === "image")?.source;
  return {
    platform: "threads",
    sourceUrl,
    title: username ? `Post Threads @${username}` : "Post Threads",
    author: username ? `@${username}` : undefined,
    thumbnail: preview,
    files,
  };
}

@injectable()
export class ThreadsDataSource implements IMediaDataSource {
  readonly platform = "threads" as const;

  async getInfo(url: string): Promise<MediaSourceModel> {
    const response = await fetchOk("https://lovethreads.net/api/ajaxSearch", {
      label: "Layanan Threads",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "https://lovethreads.net",
        Referer: "https://lovethreads.net/en",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: new URLSearchParams({ q: url, t: "media", lang: "en" }),
    });
    return mapLoveThreads(url, (await response.json()) as LoveThreadsPayload);
  }
}
