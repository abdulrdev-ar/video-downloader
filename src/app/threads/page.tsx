import PlatformPage, {
  platformMetadata,
} from "@/components/download/platform-page";

export const metadata = platformMetadata("threads");

export default function Page() {
  return <PlatformPage id="threads" />;
}
