import type { MetadataRoute } from "next";

import { PLATFORMS, SITE_URL } from "@/common/constants/platforms";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    ...PLATFORMS.map((platform) => ({
      url: `${SITE_URL}${platform.href}`,
      priority: 0.8,
    })),
  ];
}
