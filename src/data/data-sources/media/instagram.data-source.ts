import * as cheerio from "cheerio";
import { injectable } from "tsyringe";

import { AppException } from "@/core/handler/exception";
import type {
  MediaFile,
  MediaSourceModel,
  StreamSource,
} from "@/data/models/media/media.model";

import { fetchOk, titleFrom, type IMediaDataSource } from "./media.data-source";

const REFERER = "https://www.instagram.com/";

interface ShortcodeNode {
  is_video?: boolean;
  video_url?: string;
  display_url?: string;
  video_duration?: number;
  video_view_count?: number;
  owner?: { username?: string };
  edge_media_to_caption?: { edges?: { node?: { text?: string } }[] };
  edge_sidecar_to_children?: { edges?: { node: ShortcodeNode }[] };
}

/** `contextJSON` is a JSON document stored as a JSON string inside the page. */
export function readEmbedContext(html: string): ShortcodeNode | null {
  const key = '"contextJSON":';
  const start = html.indexOf(key);
  if (start < 0 || html[start + key.length] !== '"') return null;

  let end = start + key.length + 1;
  while (end < html.length && !(html[end] === '"' && html[end - 1] !== "\\"))
    end += 1;
  try {
    const context = JSON.parse(
      JSON.parse(html.slice(start + key.length, end + 1))
    );
    return context?.gql_data?.shortcode_media ?? null;
  } catch {
    return null;
  }
}

function source(url: string): StreamSource {
  return { type: "url", url, referer: REFERER };
}

export function mapInstagramEmbed(
  sourceUrl: string,
  html: string
): MediaSourceModel {
  const media = readEmbedContext(html);
  const files: MediaFile<StreamSource>[] = [];

  if (media) {
    const nodes = media.edge_sidecar_to_children?.edges?.map(
      (edge) => edge.node
    ) ?? [media];
    let videos = 0;
    let photos = 0;
    for (const node of nodes) {
      if (node.is_video && node.video_url) {
        videos += 1;
        files.push({
          kind: "video",
          label: nodes.length > 1 ? `Video ${videos}` : "Video",
          ext: "mp4",
          source: source(node.video_url),
        });
      } else if (node.display_url) {
        photos += 1;
        files.push({
          kind: "image",
          label: `Foto ${photos}`,
          ext: "jpg",
          source: source(node.display_url),
        });
      }
    }
    const firstVideo = files.find((file) => file.kind === "video");
    if (firstVideo && nodes.length === 1) {
      files.push({
        ...firstVideo,
        kind: "audio",
        label: "Audio",
        detail: "M4A dari video",
        ext: "m4a",
        extractAudio: true,
      });
    }

    return {
      platform: "instagram",
      sourceUrl,
      title: titleFrom(
        media.edge_media_to_caption?.edges?.[0]?.node?.text,
        "Post Instagram"
      ),
      author: media.owner?.username ? `@${media.owner.username}` : undefined,
      thumbnail: media.display_url ? source(media.display_url) : undefined,
      duration: media.video_duration
        ? Math.round(media.video_duration)
        : undefined,
      views: media.video_view_count,
      files: assertFiles(files),
    };
  }

  // Some photo posts render the image without the JSON context.
  const $ = cheerio.load(html);
  const image = $("img.EmbeddedMediaImage").attr("src");
  if (image)
    files.push({
      kind: "image",
      label: "Foto 1",
      ext: "jpg",
      source: source(image),
    });
  const author = $(".UsernameText").first().text().trim();
  return {
    platform: "instagram",
    sourceUrl,
    title: "Post Instagram",
    author: author ? `@${author}` : undefined,
    thumbnail: image ? source(image) : undefined,
    files: assertFiles(files),
  };
}

function assertFiles<T>(files: T[]): T[] {
  if (!files.length) {
    throw AppException.unavailable(
      "Instagram tidak menampilkan media post ini. Biasanya karena akunnya privat atau post sudah dihapus."
    );
  }
  return files;
}

@injectable()
export class InstagramDataSource implements IMediaDataSource {
  readonly platform = "instagram" as const;

  async getInfo(url: string): Promise<MediaSourceModel> {
    const path = new URL(url).pathname.match(/^\/(?:p|reels?|tv)\/[\w-]+/)?.[0];
    if (!path) {
      throw AppException.badRequest(
        "Story dan profil belum didukung. Tempel tautan post, Reel, atau IGTV."
      );
    }
    const embedPath = path.replace(/^\/reels\//, "/reel/");
    const response = await fetchOk(
      `https://www.instagram.com${embedPath}/embed/captioned/`,
      {
        label: "Instagram",
        headers: { Accept: "text/html" },
      }
    );
    return mapInstagramEmbed(url, await response.text());
  }
}
