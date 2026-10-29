"use server";

import {
  instagramDownloaderService,
  InstagramVideoInfo,
  cleanInstagramUrl,
  isValidInstagramUrl,
} from "@/core/services/instagram.service";

export interface GetInstagramInfoResult {
  success: boolean;
  data?: InstagramVideoInfo;
  error?: string;
}

export async function getInstagramInfoAction(
  rawUrl: string,
): Promise<GetInstagramInfoResult> {
  if (!rawUrl?.trim()) {
    return { success: false, error: "URL is required" };
  }

  const url = cleanInstagramUrl(rawUrl.trim());

  if (!isValidInstagramUrl(url)) {
    return {
      success: false,
      error: "Invalid Instagram URL. Supported: /p/, /reel/, /tv/",
    };
  }

  try {
    const info = await instagramDownloaderService.getVideoInfo(url);
    return { success: true, data: info };
  } catch (err: any) {
    console.error("[getInstagramInfoAction]", err?.message);

    if (err?.message?.includes("login") || err?.message?.includes("private")) {
      return {
        success: false,
        error: "This content is private or requires Instagram login.",
      };
    }
    if (err?.message?.includes("Stories")) {
      return { success: false, error: err.message };
    }

    return {
      success: false,
      error: err?.message ?? "Failed to fetch Instagram info",
    };
  }
}

export interface PrepareInstagramDownloadResult {
  success: boolean;
  downloadPath?: string;
  filename?: string;
  error?: string;
}

export async function prepareInstagramDownloadAction(
  rawUrl: string,
  title: string = "instagram",
  entryIndex?: number,
): Promise<PrepareInstagramDownloadResult> {
  if (!rawUrl?.trim()) {
    return { success: false, error: "URL is required" };
  }

  const url = cleanInstagramUrl(rawUrl.trim());
  const filename = instagramDownloaderService.buildSafeFilename(title);
  const params = new URLSearchParams({
    url,
    filename,
    ...(entryIndex !== undefined ? { entry: String(entryIndex) } : {}),
  });

  return {
    success: true,
    downloadPath: `/internal/download/instagram?${params.toString()}`,
    filename,
  };
}
