import { injectable } from "tsyringe";

import { AppException } from "@/core/handler/exception";
import type {
  MediaFile,
  MediaSourceModel,
  StreamSource,
} from "@/data/models/media/media.model";

import {
  extFromUrl,
  fetchOk,
  titleFrom,
  type IMediaDataSource,
} from "./media.data-source";

export interface SyndicationTweet {
  text?: string;
  user?: { screen_name?: string };
  mediaDetails?: {
    type: "photo" | "video" | "animated_gif";
    media_url_https?: string;
    video_info?: {
      duration_millis?: number;
      variants?: { content_type: string; url: string; bitrate?: number }[];
    };
  }[];
}

/** Token the public embed widget sends; the endpoint rejects requests without it. */
export function syndicationToken(id: string): string {
  return ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");
}

function resolutionLabel(url: string): string | undefined {
  const size = url.match(/\/(\d+)x(\d+)\//);
  return size ? `${Math.min(Number(size[1]), Number(size[2]))}p` : undefined;
}

export function mapSyndication(
  sourceUrl: string,
  tweet: SyndicationTweet
): MediaSourceModel {
  const files: MediaFile<StreamSource>[] = [];
  const media = tweet.mediaDetails ?? [];
  let photos = 0;

  media.forEach((item, index) => {
    if (item.type === "photo" && item.media_url_https) {
      photos += 1;
      const url = new URL(item.media_url_https);
      url.searchParams.set("name", "orig");
      files.push({
        kind: "image",
        label: `Foto ${photos}`,
        ext: extFromUrl(item.media_url_https, "jpg"),
        source: { type: "url", url: url.href },
      });
      return;
    }
    const variants = (item.video_info?.variants ?? [])
      .filter((variant) => variant.content_type === "video/mp4")
      .toSorted((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));
    const prefix = media.length > 1 ? `Video ${index + 1} ` : "";
    variants.forEach((variant, rank) => {
      files.push({
        kind: "video",
        label: `${prefix}${resolutionLabel(variant.url) ?? (rank === 0 ? "Terbaik" : `Pilihan ${rank + 1}`)}`,
        detail: item.type === "animated_gif" ? "GIF sebagai MP4" : undefined,
        ext: "mp4",
        source: { type: "url", url: variant.url },
      });
    });
  });

  const best = files.find((file) => file.kind === "video");
  if (best && media.length === 1 && media[0].type === "video") {
    files.push({
      ...best,
      kind: "audio",
      label: "Audio",
      detail: "M4A dari video",
      ext: "m4a",
      extractAudio: true,
    });
  }
  if (!files.length)
    throw AppException.unavailable("Post ini tidak berisi video atau foto.");

  const first = media[0];
  return {
    platform: "twitter",
    sourceUrl,
    title: titleFrom(tweet.text, "Post X"),
    author: tweet.user?.screen_name ? `@${tweet.user.screen_name}` : undefined,
    thumbnail: first?.media_url_https
      ? { type: "url", url: first.media_url_https }
      : undefined,
    duration: first?.video_info?.duration_millis
      ? Math.round(first.video_info.duration_millis / 1000)
      : undefined,
    files,
  };
}

@injectable()
export class TwitterDataSource implements IMediaDataSource {
  readonly platform = "twitter" as const;

  async getInfo(url: string): Promise<MediaSourceModel> {
    const id = new URL(url).pathname.match(/\/status\/(\d+)/)?.[1];
    if (!id)
      throw AppException.badRequest(
        "Tautan X harus mengarah ke satu post (/status/...)."
      );

    const response = await fetchOk(
      `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=${syndicationToken(id)}&lang=en`,
      { label: "X" }
    );
    const tweet = (await response.json()) as SyndicationTweet & {
      __typename?: string;
    };
    if (tweet.__typename === "TweetTombstone") {
      throw AppException.unavailable(
        "Post ini dilindungi, dihapus, atau hanya untuk pengguna yang login."
      );
    }
    return mapSyndication(url, tweet);
  }
}
