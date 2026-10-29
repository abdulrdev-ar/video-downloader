import type { MetadataRoute } from "next";

import { SITE_URL } from "@/common/constants/platforms";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/internal/", "/history"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
