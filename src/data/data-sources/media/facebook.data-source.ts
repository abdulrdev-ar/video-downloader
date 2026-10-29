import * as cheerio from "cheerio";
import { injectable } from "tsyringe";

import { AppException } from "@/core/handler/exception";
import type {
  MediaFile,
  MediaSourceModel,
  StreamSource,
} from "@/data/models/media/media.model";

import { fetchOk, titleFrom, type IMediaDataSource } from "./media.data-source";

/** SnapSave answers with a packed script; this reverses its character packing. */
export function decodeSnapSaveResponse(source: string): string {
  const match = source.match(
    /\}\("([^"]+)",\d+,"([^"]+)",(\d+),(\d+),\d+\)\)\s*$/
  );
  if (!match)
    throw AppException.upstream(
      "Layanan Facebook mengirim jawaban yang tidak dikenali."
    );

  const [, encoded, alphabet, shiftRaw, baseRaw] = match;
  const shift = Number(shiftRaw);
  const base = Number(baseRaw);
  let decoded = "";
  for (const chunk of encoded.split(alphabet[base])) {
    if (!chunk) continue;
    let digits = chunk;
    for (let index = 0; index < alphabet.length; index += 1) {
      digits = digits.replaceAll(alphabet[index], String(index));
    }
    decoded += String.fromCharCode(Number.parseInt(digits, base) - shift);
  }
  return Buffer.from(decoded, "binary").toString("utf8");
}

function unescapeJs(value: string): string {
  return value
    .replaceAll('\\"', '"')
    .replaceAll("\\/", "/")
    .replaceAll("\\n", "");
}

export function mapSnapSave(
  sourceUrl: string,
  decoded: string
): MediaSourceModel {
  const html = decoded.match(
    /download-section"\)\.innerHTML\s*=\s*"([\s\S]*?)";\s*(?:document|\})/
  )?.[1];
  if (!html) {
    const reason = decoded
      .match(/innerHTML\s*=\s*"Error:\s*([^"<]*)/)?.[1]
      ?.trim();
    throw AppException.unavailable(
      reason?.toLowerCase().includes("private")
        ? "Post Facebook ini privat. Hanya post publik yang bisa disimpan."
        : "Facebook tidak menampilkan media post ini. Pastikan post bersifat publik."
    );
  }

  const $ = cheerio.load(unescapeJs(html));
  const files: MediaFile<StreamSource>[] = [];
  $("tbody tr").each((_, row) => {
    const href = $(row).find("a[href^='https://']").attr("href");
    const quality = $(row).find(".video-quality").text().trim();
    if (!href || !quality) return;
    const [label, note] = quality.split(/\s+\(/);
    files.push({
      kind: "video",
      label,
      detail: note ? note.replace(/\)$/, "") : undefined,
      ext: "mp4",
      source: { type: "url", url: href },
    });
  });

  let photos = 0;
  $(
    ".download-items a[href^='https://'], .download-items__btn a[href^='https://']"
  ).each((_, anchor) => {
    const href = $(anchor).attr("href");
    if (!href || /\.mp4|video/i.test(href)) return;
    photos += 1;
    files.push({
      kind: "image",
      label: `Foto ${photos}`,
      ext: "jpg",
      source: { type: "url", url: href },
    });
  });

  const best = files.find((file) => file.kind === "video");
  if (best) {
    files.push({
      ...best,
      kind: "audio",
      label: "Audio",
      detail: "M4A dari video",
      ext: "m4a",
      extractAudio: true,
    });
  }
  if (!files.length) {
    throw AppException.unavailable(
      "Post ini tidak berisi video atau foto yang bisa diunduh."
    );
  }

  // SnapSave's thumbnail proxy often carries an empty source URL, so it is skipped.
  return {
    platform: "facebook",
    sourceUrl,
    title: titleFrom(
      $(".video-des").text().replace(/^\.+$/, ""),
      "Video Facebook"
    ),
    files,
  };
}

@injectable()
export class FacebookDataSource implements IMediaDataSource {
  readonly platform = "facebook" as const;

  async getInfo(url: string): Promise<MediaSourceModel> {
    const response = await fetchOk("https://snapsave.app/action.php", {
      label: "Layanan Facebook",
      method: "POST",
      timeoutMs: 30_000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: "https://snapsave.app",
        Referer: "https://snapsave.app/",
      },
      body: new URLSearchParams({ url }),
    });
    return mapSnapSave(url, decodeSnapSaveResponse(await response.text()));
  }
}
