import type { Metadata } from "next";
import { Suspense } from "react";

import { platformInfo, SITE_URL } from "@/common/constants/platforms";
import type { PlatformType } from "@/common/lib/url-validators";
import PlatformIcon from "@/components/icon/platform-icon";

import Downloader from "./downloader";

export function platformMetadata(id: PlatformType): Metadata {
  const platform = platformInfo(id);
  return {
    title: platform.seoTitle,
    description: platform.seoDescription,
    alternates: { canonical: `${SITE_URL}${platform.href}` },
    openGraph: {
      title: platform.seoTitle,
      description: platform.seoDescription,
      url: `${SITE_URL}${platform.href}`,
    },
  };
}

/** Shared body of the six downloader routes; the page itself stays static. */
export default function PlatformPage({ id }: { id: PlatformType }) {
  const platform = platformInfo(id);
  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 sm:pt-14">
      <div className="mb-6 space-y-3">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <PlatformIcon platform={id} className="size-4" />
          {platform.name}
        </p>
        <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
          {platform.seoTitle}
        </h1>
        <p className="text-[17px] leading-relaxed text-muted-foreground">
          {platform.saves}
        </p>
      </div>
      <Suspense>
        <Downloader platform={id} />
      </Suspense>
    </div>
  );
}
