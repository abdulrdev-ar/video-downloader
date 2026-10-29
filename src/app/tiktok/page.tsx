import PlatformPage, {
  platformMetadata,
} from "@/components/download/platform-page";

export const metadata = platformMetadata("tiktok");

export default function Page() {
  return <PlatformPage id="tiktok" />;
}
