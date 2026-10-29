"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { isPlatformUrl, normalizeUrl } from "@/common/lib/url-validators";
import LinkInput from "@/components/download/link-input";

/** Detects the platform from the pasted link and hands it to that platform's downloader. */
export default function HeroLinkForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = () => {
    const normalized = normalizeUrl(url);
    const platform = normalized ? isPlatformUrl(normalized) : null;
    if (!normalized || !platform) {
      setError(
        "Tautan ini belum kami kenali. Pastikan tautannya mengarah ke satu post di YouTube, TikTok, Instagram, Facebook, X, atau Threads."
      );
      return;
    }
    setBusy(true);
    router.push(`/${platform}?url=${encodeURIComponent(normalized)}`);
  };

  return (
    <LinkInput
      value={url}
      onChange={(value) => {
        setUrl(value);
        setError(null);
      }}
      onSubmit={submit}
      busy={busy}
      busyLabel="Membuka..."
      placeholder="https://..."
      submitLabel="Cari file"
      error={error}
    />
  );
}
