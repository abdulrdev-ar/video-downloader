import PlatformPage, {
  platformMetadata,
} from "@/components/download/platform-page";

export const metadata = platformMetadata("facebook");

export default function Page() {
  return <PlatformPage id="facebook" />;
}
