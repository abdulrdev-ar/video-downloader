import type { Either } from "fp-ts/lib/Either";

import type { TAppException } from "@/core/types/exception";
import type { MediaSourceModel } from "@/data/models/media/media.model";

interface IMediaRepository {
  getInfo(url: string): Promise<Either<TAppException, MediaSourceModel>>;
}

export default IMediaRepository;
