import { injectable } from "tsyringe";
import type { Misc } from "youtubei.js";

type Format = Misc.Format;
import { AppException } from "@/core/handler/exception";
import { getYoutube, getYoutubeInfo } from "@/core/services/youtube-client";
import type {
  MediaFile,
  MediaSourceModel,
  PlaylistEntry,
  StreamSource,
} from "@/data/models/media/media.model";

import type { IMediaDataSource } from "./media.data-source";

const MERGED_HEIGHTS = [1080, 720, 480];
const PLAYLIST_LIMIT = 300;
const AUDIO_ITAG = 140;
const PROGRESSIVE_ITAG = 18;

interface PlaylistNode {
  id?: string;
  content_id?: string;
  title?: { toString(): string };
  metadata?: { title?: { text?: string } };
  duration?: { seconds?: number };
}

export function youtubeVideoId(rawUrl: string): string | null {
  const url = new URL(rawUrl);
  if (url.hostname.toLowerCase().endsWith("youtu.be")) {
    return url.pathname.slice(1, 12) || null;
  }
  return (
    url.searchParams.get("v") ??
    url.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{11})/)?.[1] ??
    null
  );
}

/** Best mp4/avc1 video-only format per height; avc1 plays everywhere. */
export function pickMergedFormats(formats: Format[]) {
  return MERGED_HEIGHTS.flatMap((height) => {
    const match = formats
      .filter(
        (format) =>
          format.mime_type.startsWith("video/mp4") &&
          format.mime_type.includes("avc1") &&
          format.quality_label?.startsWith(`${height}p`)
      )
      .toSorted((a, b) => b.bitrate - a.bitrate)[0];
    return match ? [{ height, format: match }] : [];
  });
}

@injectable()
export class YoutubeDataSource implements IMediaDataSource {
  readonly platform = "youtube" as const;

  async getInfo(url: string): Promise<MediaSourceModel> {
    const id = youtubeVideoId(url);
    const listId = new URL(url).searchParams.get("list");
    if (!id && listId) return this.getPlaylist(url, listId);
    if (!id)
      throw AppException.badRequest(
        "Tautan YouTube ini tidak berisi ID video."
      );

    const [android, ios] = await Promise.all([
      getYoutubeInfo(id, "ANDROID"),
      getYoutubeInfo(id, "IOS"),
    ]);
    const adaptive = ios.streaming_data?.adaptive_formats ?? [];
    const audio = adaptive.find((format) => format.itag === AUDIO_ITAG);
    const progressive = android.streaming_data?.formats?.find(
      (format) => format.itag === PROGRESSIVE_ITAG
    );
    const yt = (itag: number, client: "ANDROID" | "IOS"): StreamSource => ({
      type: "youtube",
      id,
      itag,
      client,
    });

    const files: MediaFile<StreamSource>[] = [];
    if (audio) {
      for (const { height, format } of pickMergedFormats(adaptive)) {
        files.push({
          kind: "video",
          label: `${height}p`,
          detail: "Digabung di perangkatmu",
          ext: "mp4",
          size:
            (format.content_length ?? 0) + (audio.content_length ?? 0) ||
            undefined,
          source: yt(format.itag, "IOS"),
          audio: yt(AUDIO_ITAG, "IOS"),
        });
      }
    }
    if (progressive) {
      files.push({
        kind: "video",
        label: "360p",
        detail: "Paling cepat",
        ext: "mp4",
        size: progressive.content_length,
        source: yt(PROGRESSIVE_ITAG, "ANDROID"),
      });
    }
    if (audio) {
      files.push({
        kind: "audio",
        label: "Audio",
        detail: "Kualitas asli",
        ext: "m4a",
        size: audio.content_length,
        source: yt(AUDIO_ITAG, "IOS"),
      });
    }
    if (!files.length) {
      throw AppException.unavailable(
        "YouTube tidak memberikan file untuk video ini. Siaran langsung belum didukung."
      );
    }

    const basic = ios.basic_info;
    return {
      platform: "youtube",
      sourceUrl: url,
      title: basic.title ?? "Video YouTube",
      author: basic.author,
      thumbnail: {
        type: "url",
        url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      },
      duration: basic.duration,
      views: basic.view_count,
      files,
    };
  }

  private async getPlaylist(
    url: string,
    listId: string
  ): Promise<MediaSourceModel> {
    const yt = await getYoutube();
    let page = await yt.getPlaylist(listId);
    const entries: PlaylistEntry[] = [];

    for (;;) {
      for (const item of page.items) {
        // Playlists return PlaylistVideo or, on the newer layout, LockupView.
        const node = item as unknown as PlaylistNode;
        const id = node.content_id ?? node.id;
        if (!id || entries.length >= PLAYLIST_LIMIT) continue;
        entries.push({
          id,
          title:
            node.metadata?.title?.text ?? node.title?.toString() ?? "Video",
          url: `https://www.youtube.com/watch?v=${id}`,
          thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
          duration: node.duration?.seconds,
        });
      }
      if (!page.has_continuation || entries.length >= PLAYLIST_LIMIT) break;
      page = await page.getContinuation();
    }

    if (!entries.length) {
      throw AppException.unavailable("Playlist ini kosong atau privat.");
    }
    return {
      platform: "youtube",
      sourceUrl: url,
      title: page.info.title ?? "Playlist YouTube",
      author: page.info.author?.name,
      files: [],
      entries,
    };
  }
}
