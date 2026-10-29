import type { Metadata } from "next";
import SpikeRunner from "./spike-runner";

// F0 spike page for docs/vercel-migration.md. Temporary: delete with
// src/app/internal/spike after the results are recorded.
export const metadata: Metadata = {
  title: "Spike F0",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SpikeRunner />;
}
