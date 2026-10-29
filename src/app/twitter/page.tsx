import PlatformPage, {
  platformMetadata,
} from "@/components/download/platform-page";

export const metadata = platformMetadata("twitter");

export default function Page() {
  return <PlatformPage id="twitter" />;
}
