import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "SaveIt — Free Video Downloader for YouTube, TikTok & Instagram",
  description:
    "Download videos from YouTube, TikTok and Instagram for free. No watermark, HD quality, no login required. The fastest online video downloader.",
  alternates: { canonical: "https://saveit.app" },
};

const PLATFORMS = [
  {
    href: "/youtube",
    name: "YouTube",
    tagline: "Up to 1080p HD",
    description:
      "Download any YouTube video, shorts, or playlist item. Choose between quality presets from 360p to full 1080p HD.",
    accent: "from-red-500 to-orange-500",
    border: "border-red-500/20 hover:border-red-500/50",
    glow: "hover:shadow-red-500/10",
    bg: "from-red-500/8 to-transparent",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    features: [
      "No ads or tracking",
      "720p & 1080p HD",
      "Audio-only MP3",
      "Shorts supported",
    ],
  },
  {
    href: "/tiktok",
    name: "TikTok",
    tagline: "No watermark",
    description:
      "Save TikTok videos without the annoying watermark. Clean, original quality file direct to your device.",
    accent: "from-pink-500 to-cyan-400",
    border: "border-pink-500/20 hover:border-pink-500/50",
    glow: "hover:shadow-pink-500/10",
    bg: "from-pink-500/8 to-transparent",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
      </svg>
    ),
    features: [
      "Zero watermark",
      "HD video quality",
      "Audio extraction",
      "All regions",
    ],
  },
  {
    href: "/instagram",
    name: "Instagram",
    tagline: "Reels & Posts",
    description:
      "Download Instagram Reels, feed posts, IGTV and carousel slides. Full resolution, original quality.",
    accent: "from-yellow-400 via-pink-500 to-purple-600",
    border: "border-purple-500/20 hover:border-purple-500/50",
    glow: "hover:shadow-purple-500/10",
    bg: "from-purple-500/8 to-transparent",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    features: [
      "Reels & feed posts",
      "Carousel support",
      "IGTV videos",
      "Original quality",
    ],
  },
];

const BENEFITS = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    body: "Videos start downloading in under 2 seconds. No waiting, no buffering — direct from CDN to your device.",
  },
  {
    icon: "🚫",
    title: "Zero Watermarks",
    body: "TikTok downloads are completely clean, with no logo or username overlaid on your saved video.",
  },
  {
    icon: "🔒",
    title: "Private by Default",
    body: "We don't log URLs, store your videos, or track your downloads. What you save is your business.",
  },
  {
    icon: "📱",
    title: "Works Everywhere",
    body: "Mobile, tablet, desktop — the interface adapts perfectly. No app install needed, just your browser.",
  },
  {
    icon: "🆓",
    title: "Completely Free",
    body: "No account, no subscription, no credit card. Just paste the URL and hit download. Always.",
  },
  {
    icon: "🎯",
    title: "High Resolution",
    body: "Download YouTube in up to 1080p HD. Instagram and TikTok in original uploaded quality.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Copy the URL",
    body: "Go to YouTube, TikTok, or Instagram and copy the link to any video or reel.",
  },
  {
    step: "02",
    title: "Paste & Fetch",
    body: "Paste the URL into SaveIt and click Fetch. We'll grab the title, thumbnail and available formats.",
  },
  {
    step: "03",
    title: "Choose & Download",
    body: "Pick your quality or format, then click Download. Your file saves directly to your device.",
  },
];

const FAQS = [
  {
    q: "Is SaveIt free to use?",
    a: "Yes, completely free. No sign-up, no subscription, no limits.",
  },
  {
    q: "Can I download TikTok videos without watermark?",
    a: "Yes. SaveIt uses the original source file before TikTok applies the watermark overlay, giving you a completely clean video.",
  },
  {
    q: "What's the maximum quality I can download from YouTube?",
    a: "Up to 1080p Full HD. For resolutions ≤720p the download is near-instant via CDN. 1080p requires server-side merging of separate video and audio streams.",
  },
  {
    q: "Does SaveIt work on mobile?",
    a: "Yes. The site is fully responsive and works great on iOS and Android browsers.",
  },
  {
    q: "Can I download private Instagram posts?",
    a: "No. SaveIt only works with publicly accessible content. Private accounts require authentication which we do not support.",
  },
  {
    q: "Do you store downloaded videos?",
    a: "No. Videos are streamed directly to your browser and are never stored on our servers.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080808] overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[120px] animate-pulse-glow" />
          <div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[100px] animate-pulse-glow"
            style={{ animationDelay: "1.5s" }}
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Pill badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-zinc-400 border border-white/8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Free · No login · No watermark
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-100 font-syne text-5xl sm:text-6xl md:text-7xl font-800 leading-[1.05] tracking-tight">
            Download any video
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              in seconds.
            </span>
          </h1>

          <p className="animate-fade-up delay-200 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
            YouTube, TikTok, Instagram — save any video to your device, in full
            quality, completely free. No watermarks, no sign-up.
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-up delay-300 flex flex-wrap items-center justify-center gap-3">
            {PLATFORMS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className={`group flex items-center gap-2.5 px-5 py-3 rounded-2xl border ${p.border} bg-gradient-to-br ${p.bg} hover:shadow-xl ${p.glow} transition-all duration-300`}
              >
                <div
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${p.accent} flex items-center justify-center shadow-lg flex-shrink-0`}
                >
                  {p.icon}
                </div>
                <div className="text-left">
                  <div className="text-sm font-syne font-600 text-white">
                    {p.name}
                  </div>
                  <div className="text-xs text-zinc-500">{p.tagline}</div>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>

          {/* Stats row */}
          <div className="animate-fade-up delay-400 flex items-center justify-center gap-8 pt-4">
            {[
              ["3 platforms", "supported"],
              ["1080p", "max quality"],
              ["0 seconds", "sign-up time"],
            ].map(([val, label]) => (
              <div key={val} className="text-center">
                <div className="font-syne text-xl font-700 text-white">
                  {val}
                </div>
                <div className="text-xs text-zinc-600 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-700">
          <span className="text-xs">scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-zinc-700 to-transparent" />
        </div>
      </section>

      {/* ── PLATFORM CARDS ── */}
      <section className="relative px-4 py-24" id="platforms">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-600">
              Supported Platforms
            </p>
            <h2 className="font-syne text-3xl sm:text-4xl font-700 text-white">
              Every major platform,{" "}
              <span className="text-zinc-500">covered.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {PLATFORMS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className={`group relative rounded-3xl border ${p.border} bg-gradient-to-b ${p.bg} p-6 hover:shadow-2xl ${p.glow} transition-all duration-300 overflow-hidden`}
              >
                {/* Top glow */}
                <div
                  className={`absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r ${p.accent} opacity-50 group-hover:opacity-100 transition-opacity`}
                />

                <div className="space-y-5">
                  {/* Icon + name */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.accent} flex items-center justify-center shadow-lg`}
                    >
                      {p.icon}
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-syne text-xl font-700 text-white">
                      {p.name}
                    </h3>
                    <p className="text-zinc-500 text-sm mt-1 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Feature chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {p.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs px-2.5 py-1 rounded-full bg-white/4 border border-white/6 text-zinc-400"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative px-4 py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-600">
              Simple Process
            </p>
            <h2 className="font-syne text-3xl sm:text-4xl font-700 text-white">
              Three steps, <span className="text-zinc-500">that's it.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.step}
                className="relative group text-center sm:text-left space-y-4 p-6 rounded-2xl glass hover:bg-white/4 transition-colors duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/4 border border-white/8 font-syne font-800 text-2xl text-zinc-700 group-hover:text-zinc-400 transition-colors">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-syne font-600 text-white text-lg">
                    {step.title}
                  </h3>
                  <p className="text-zinc-500 text-sm mt-1.5 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="px-4 py-24" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-600">
              Why SaveIt
            </p>
            <h2 className="font-syne text-3xl sm:text-4xl font-700 text-white">
              Built different,{" "}
              <span className="text-zinc-500">on purpose.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b, i) => (
              <div
                key={b.title}
                className="group p-6 rounded-2xl border border-white/5 hover:border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 space-y-3"
              >
                <div className="text-3xl">{b.icon}</div>
                <h3 className="font-syne font-600 text-white">{b.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-24" id="faq">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-600">
              FAQ
            </p>
            <h2 className="font-syne text-3xl sm:text-4xl font-700 text-white">
              Common questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group glass rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-white/3 transition-colors">
                  <span className="font-medium text-white text-sm pr-4">
                    {faq.q}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-zinc-600 flex-shrink-0 group-open:rotate-45 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-4 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-600/20 to-violet-600/20 blur-xl" />
            <div className="relative glass rounded-3xl p-10 space-y-6 border border-white/8">
              <h2 className="font-syne text-3xl sm:text-4xl font-700 text-white leading-tight">
                Ready to save
                <br />
                your first video?
              </h2>
              <p className="text-zinc-400 text-sm">
                Pick a platform and paste your link. Takes less than 5 seconds.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {PLATFORMS.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${p.accent} text-white text-sm font-syne font-600 hover:opacity-90 transition-opacity shadow-lg`}
                  >
                    {p.name} →
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-4 py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <span className="font-syne text-sm font-600 text-zinc-400">
              SaveIt
            </span>
          </div>
          <p className="text-xs text-zinc-700 text-center">
            For personal use only. Respect copyright laws and creators' rights.
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-700">
            <Link
              href="/youtube"
              className="hover:text-zinc-400 transition-colors"
            >
              YouTube
            </Link>
            <Link
              href="/tiktok"
              className="hover:text-zinc-400 transition-colors"
            >
              TikTok
            </Link>
            <Link
              href="/instagram"
              className="hover:text-zinc-400 transition-colors"
            >
              Instagram
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
