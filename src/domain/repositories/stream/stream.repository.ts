import type { Either } from "fp-ts/lib/Either";

import type { TAppException } from "@/core/types/exception";

interface IStreamRepository {
  /** Verifies a signed token and returns the upstream body as a download response. */
  open(
    token: string,
    inline: boolean
  ): Promise<Either<TAppException, Response>>;
}

export default IStreamRepository;
