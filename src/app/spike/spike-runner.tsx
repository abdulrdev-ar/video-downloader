"use client";
import { useState } from "react";

interface SpikeItem {
  label: string;
  url: string;
  [key: string]: unknown;
}

// Fetch from the browser with no Referer: this is the "direct" path. Success
// means the CDN allows CORS and does not bind the URL to the server's IP.
async function browserProbe(url: string) {
  const started = performance.now();
  try {
    const response = await fetch(url, {
      headers: { Range: "bytes=0-1023" },
      referrerPolicy: "no-referrer",
    });
    await response.body?.cancel();
    return { status: response.status, ms: Math.round(performance.now() - started) };
  } catch (error) {
    return {
      error: `blocked (CORS or network): ${(error as Error).message}`,
      ms: Math.round(performance.now() - started),
    };
  }
}

export default function SpikeRunner() {
  const [key, setKey] = useState("");
  const [urls, setUrls] = useState("");
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<unknown[]>([]);

  async function run() {
    setRunning(true);
    setReport([]);
    const results: unknown[] = [];
    for (const url of urls.split("\n").map((line) => line.trim()).filter(Boolean)) {
      const query = new URLSearchParams({ key, url });
      const started = performance.now();
      const response = await fetch(`/internal/spike?${query}`);
      const result = response.ok
        ? ((await response.json()) as { items?: SpikeItem[] })
        : { error: `HTTP ${response.status}` };
      const items = await Promise.all(
        (("items" in result && result.items) || []).map(async (item) =>
          item.url ? { ...item, browser: await browserProbe(item.url) } : item,
        ),
      );
      results.push({
        url,
        totalMs: Math.round(performance.now() - started),
        ...result,
        ...(items.length ? { items } : {}),
      });
      setReport([...results]);
    }
    setRunning(false);
  }

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-10 text-zinc-200">
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-xl font-semibold">Spike F0 (internal, temporary)</h1>
        <label className="block space-y-1">
          <span className="text-sm text-zinc-400">SPIKE_KEY</span>
          <input
            type="password"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm text-zinc-400">One public post URL per line</span>
          <textarea
            value={urls}
            onChange={(event) => setUrls(event.target.value)}
            rows={6}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm"
          />
        </label>
        <button
          type="button"
          onClick={run}
          disabled={running || !key || !urls.trim()}
          className="min-h-11 rounded-md bg-zinc-100 px-4 font-medium text-zinc-900 disabled:opacity-50"
        >
          {running ? "Running..." : "Run spike"}
        </button>
        {report.length > 0 && (
          <pre className="overflow-x-auto rounded-md border border-zinc-800 bg-zinc-950 p-3 text-xs">
            {JSON.stringify(report, null, 2)}
          </pre>
        )}
      </div>
    </main>
  );
}
