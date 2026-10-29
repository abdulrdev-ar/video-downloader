import type { Either } from "fp-ts/lib/Either";
import { inject, injectable } from "tsyringe";

import { AppException } from "@/core/handler/exception";
import { SignatureManager } from "@/core/services/encrypt-manager";
import type { TAppException } from "@/core/types/exception";
import type { IStreamDataSource } from "@/data/data-sources/stream/stream.data-source";
import type { StreamTokenPayload } from "@/data/models/media/media.model";
import type IStreamRepository from "@/domain/repositories/stream/stream.repository";

import BaseRepository from "../base-repository";

@injectable()
export default class StreamRepository
  extends BaseRepository
  implements IStreamRepository
{
  constructor(
    @inject("IStreamDataSource") private dataSource: IStreamDataSource
  ) {
    super();
  }

  open(
    token: string,
    inline: boolean
  ): Promise<Either<TAppException, Response>> {
    return this.run("stream.open", async () => {
      const payload = SignatureManager.verify<StreamTokenPayload>(token);
      if (!payload) {
        throw AppException.forbidden(
          "Tautan unduhan sudah kedaluwarsa. Ambil ulang info post."
        );
      }
      return this.dataSource.open(payload, inline);
    });
  }
}
