import "server-only";
import "reflect-metadata";
import { container as injection } from "tsyringe";

import { FacebookDataSource } from "@/data/data-sources/media/facebook.data-source";
import { InstagramDataSource } from "@/data/data-sources/media/instagram.data-source";
import type { IMediaDataSource } from "@/data/data-sources/media/media.data-source";
import { ThreadsDataSource } from "@/data/data-sources/media/threads.data-source";
import { TikTokDataSource } from "@/data/data-sources/media/tiktok.data-source";
import { TwitterDataSource } from "@/data/data-sources/media/twitter.data-source";
import { YoutubeDataSource } from "@/data/data-sources/media/youtube.data-source";
import {
  StreamDataSource,
  type IStreamDataSource,
} from "@/data/data-sources/stream/stream.data-source";
import MediaRepository from "@/data/repositories/media/media-repository-impl";
import StreamRepository from "@/data/repositories/stream/stream-repository-impl";
import type IMediaRepository from "@/domain/repositories/media/media.repository";
import type IStreamRepository from "@/domain/repositories/stream/stream.repository";

// One registration per platform under the same token; MediaRepository picks by `platform`.
for (const useClass of [
  YoutubeDataSource,
  TikTokDataSource,
  InstagramDataSource,
  FacebookDataSource,
  TwitterDataSource,
  ThreadsDataSource,
]) {
  injection.register<IMediaDataSource>("IMediaDataSource", { useClass });
}
injection.register<IStreamDataSource>("IStreamDataSource", {
  useClass: StreamDataSource,
});
injection.register<IMediaRepository>("IMediaRepository", {
  useClass: MediaRepository,
});
injection.register<IStreamRepository>("IStreamRepository", {
  useClass: StreamRepository,
});

export { injection };
