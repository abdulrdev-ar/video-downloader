export type ExceptionCode =
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "UNAVAILABLE"
  | "UPSTREAM"
  | "FORBIDDEN"
  | "UNKNOWN";

export interface TAppException {
  code: ExceptionCode;
  message: string;
  status: number;
}
