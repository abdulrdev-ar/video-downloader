import { randomUUID } from "node:crypto";

import { left, right, type Either } from "fp-ts/lib/Either";

import { AppException } from "@/core/handler/exception";
import { logger } from "@/core/services/logger";
import type { TAppException } from "@/core/types/exception";

export default abstract class BaseRepository {
  protected handleError(error: unknown): Either<TAppException, never> {
    return left(AppException.from(error));
  }

  /** Traces one repository call and turns any throw into `left`. */
  protected async run<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<Either<TAppException, T>> {
    const traceId = randomUUID();
    const started = Date.now();
    try {
      const value = await fn();
      logger.info({ traceId, name, ms: Date.now() - started }, "ok");
      return right(value);
    } catch (error) {
      logger.warn(
        { traceId, name, ms: Date.now() - started, err: error },
        "failed"
      );
      return this.handleError(error);
    }
  }
}
