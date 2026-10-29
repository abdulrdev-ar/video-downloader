import PlatformPage, {
  platformMetadata,
} from "@/components/download/platform-page";

export const metadata = platformMetadata("instagram");

export default function Page() {
  return <PlatformPage id="instagram" />;
}
