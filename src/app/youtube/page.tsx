import PlatformPage, {
  platformMetadata,
} from "@/components/download/platform-page";

export const metadata = platformMetadata("youtube");

export default function Page() {
  return <PlatformPage id="youtube" />;
}
