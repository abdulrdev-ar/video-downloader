import { isLeft } from "fp-ts/lib/Either";
import type { NextRequest } from "next/server";

import { injection } from "@/common/di/injection";
import type IStreamRepository from "@/domain/repositories/stream/stream.repository";

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t");
  if (!token || token.length > 4096) {
    return Response.json({ message: "Token tidak ada." }, { status: 400 });
  }

  const repository = injection.resolve<IStreamRepository>("IStreamRepository");
  const result = await repository.open(
    token,
    request.nextUrl.searchParams.has("inline")
  );
  if (isLeft(result)) {
    return Response.json(
      { message: result.left.message },
      { status: result.left.status }
    );
  }
  return result.right;
}
