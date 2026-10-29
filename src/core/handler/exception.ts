import type { ExceptionCode, TAppException } from "@/core/types/exception";

export class AppException extends Error implements TAppException {
  constructor(
    readonly code: ExceptionCode,
    message: string,
    readonly status: number
  ) {
    super(message);
  }

  static badRequest(message: string) {
    return new AppException("BAD_REQUEST", message, 400);
  }

  static forbidden(message: string) {
    return new AppException("FORBIDDEN", message, 403);
  }

  static notFound(message: string) {
    return new AppException("NOT_FOUND", message, 404);
  }

  /** The post exists but is private, removed, or region-locked. */
  static unavailable(message: string) {
    return new AppException("UNAVAILABLE", message, 422);
  }

  /** A platform or third-party source answered with something unusable. */
  static upstream(message: string) {
    return new AppException("UPSTREAM", message, 502);
  }

  static from(error: unknown): TAppException {
    if (error instanceof AppException) {
      return { code: error.code, message: error.message, status: error.status };
    }
    if (error instanceof Error && error.name === "TimeoutError") {
      return {
        code: "UPSTREAM",
        message: "Sumbernya terlalu lama merespons. Coba lagi sebentar lagi.",
        status: 504,
      };
    }
    return {
      code: "UNKNOWN",
      message: "Ada yang tidak beres di sisi kami. Coba lagi.",
      status: 500,
    };
  }
}
