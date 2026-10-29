export function fmtDuration(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `${m}:${String(sec).padStart(2, "0")}`;
}

export function fmtBytes(b: number | null): string | null {
  if (!b) return null;
  return b >= 1048576
    ? `${(b / 1048576).toFixed(0)}MB`
    : `${(b / 1024).toFixed(0)}KB`;
}

/** A title that is safe as a file name on Windows, macOS, Android, and iOS. */
export function safeFilename(title: string): string {
  const clean = title
    // oxlint-disable-next-line no-control-regex -- control characters are invalid in file names
    .replace(/[<>:"/\\|?*#\u0000-\u001f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80)
    .trim();
  return clean || "saveit";
}

const compact = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** 1.250.000 becomes "1,3 jt", the way Indonesian apps show counts. */
export function fmtCount(n: number): string {
  return compact.format(n);
}
