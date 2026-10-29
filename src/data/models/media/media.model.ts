import type { PlatformType } from "@/common/lib/url-validators";
import type { YoutubeClient } from "@/core/services/youtube-client";

/** Where `/internal/stream` fetches bytes from. Never sent to the client. */
export type StreamSource =
  | { type: "url"; url: string; referer?: string }
  | { type: "youtube"; id: string; itag: number; client: YoutubeClient };

/**
 * One downloadable file. `S` is a `StreamSource` on the server and a signed
 * token string once the action hands it to the client.
 */
export interface MediaFile<S> {
  kind: "video" | "audio" | "image";
  label: string;
  detail?: string;
  ext: string;
  size?: number;
  /** Save-as name, set by the action once the title is known. */
  filename?: string;
  source: S;
  /** Separate audio track, merged in the browser (YouTube 480p and up). */
  audio?: S;
  /** Download `source` as video, then keep only its audio track. */
  extractAudio?: boolean;
}

export interface PlaylistEntry {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  duration?: number;
}

export interface MediaInfo<S> {
  platform: PlatformType;
  sourceUrl: string;
  title: string;
  author?: string;
  thumbnail?: S;
  duration?: number;
  views?: number;
  files: MediaFile<S>[];
  entries?: PlaylistEntry[];
}

/** Signed into every stream token: what to fetch and the name to save it as. */
export interface StreamTokenPayload {
  s: StreamSource;
  f: string;
}

export const STREAM_TOKEN_TTL_MS = 30 * 60 * 1000;

export type MediaSourceModel = MediaInfo<StreamSource>;
export type MediaModel = MediaInfo<string>;
export type MediaFileModel = MediaFile<string>;
