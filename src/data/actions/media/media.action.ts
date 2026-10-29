"use server";

import { left, map, type Either } from "fp-ts/lib/Either";

import { injection } from "@/common/di/injection";
import { safeFilename } from "@/common/lib/format";
import { isPlatformUrl, normalizeUrl } from "@/common/lib/url-validators";
import { AppException } from "@/core/handler/exception";
import { SignatureManager } from "@/core/services/encrypt-manager";
import type { TAppException } from "@/core/types/exception";
import {
  STREAM_TOKEN_TTL_MS,
  type MediaModel,
  type MediaSourceModel,
  type StreamSource,
} from "@/data/models/media/media.model";
import type IMediaRepository from "@/domain/repositories/media/media.repository";

function sign(source: StreamSource, filename: string): string {
  return SignatureManager.sign({ s: source, f: filename }, STREAM_TOKEN_TTL_MS);
}

/** Replaces every raw CDN source with a signed token the client can stream. */
function toClientModel(media: MediaSourceModel): MediaModel {
  const base = safeFilename(media.title);
  const multiple = media.files.length > 1;
  return {
    ...media,
    thumbnail: media.thumbnail
      ? sign(media.thumbnail, `${base}.jpg`)
      : undefined,
    files: media.files.map((file) => {
      const filename = multiple
        ? `${base} (${file.label}).${file.ext}`
        : `${base}.${file.ext}`;
      return {
        ...file,
        filename,
        source: sign(file.source, filename),
        audio: file.audio ? sign(file.audio, `${base}.m4a`) : undefined,
      };
    }),
  };
}

export async function getMediaAction(
  rawUrl: string
): Promise<Either<TAppException, MediaModel>> {
  const url =
    typeof rawUrl === "string" && rawUrl.length < 2048
      ? normalizeUrl(rawUrl)
      : null;
  if (!url || !isPlatformUrl(url)) {
    return left(
      AppException.from(
        AppException.badRequest(
          "Tautan ini tidak dikenali. Tempel tautan post dari YouTube, TikTok, Instagram, Facebook, X, atau Threads."
        )
      )
    );
  }

  const repository = injection.resolve<IMediaRepository>("IMediaRepository");
  return map(toClientModel)(await repository.getInfo(url));
}
