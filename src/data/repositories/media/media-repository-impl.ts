import type { Either } from "fp-ts/lib/Either";
import { injectable, injectAll } from "tsyringe";

import { isPlatformUrl } from "@/common/lib/url-validators";
import { AppException } from "@/core/handler/exception";
import type { TAppException } from "@/core/types/exception";
import type { IMediaDataSource } from "@/data/data-sources/media/media.data-source";
import type { MediaSourceModel } from "@/data/models/media/media.model";
import type IMediaRepository from "@/domain/repositories/media/media.repository";

import BaseRepository from "../base-repository";

@injectable()
export default class MediaRepository
  extends BaseRepository
  implements IMediaRepository
{
  constructor(
    @injectAll("IMediaDataSource") private sources: IMediaDataSource[]
  ) {
    super();
  }

  getInfo(url: string): Promise<Either<TAppException, MediaSourceModel>> {
    return this.run("media.getInfo", async () => {
      const platform = isPlatformUrl(url);
      const source = this.sources.find(
        (candidate) => candidate.platform === platform
      );
      if (!source)
        throw AppException.badRequest(
          "Tautan ini bukan post dari platform yang didukung."
        );
      return source.getInfo(url);
    });
  }
}
