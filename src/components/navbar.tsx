"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/youtube",
    label: "YouTube",
    accent: "hover:text-red-400 hover:border-red-500/50",
    dot: "bg-red-500",
  },
  {
    href: "/tiktok",
    label: "TikTok",
    accent: "hover:text-pink-400 hover:border-pink-500/50",
    dot: "bg-pink-500",
  },
  {
    href: "/instagram",
    label: "Instagram",
    accent: "hover:text-purple-400 hover:border-purple-500/50",
    dot: "bg-purple-500",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-6xl mx-auto">
        <div className="glass rounded-2xl px-4 py-2.5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <span className="font-syne font-700 text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              SaveIt
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all duration-200
                  ${
                    isActive(item.href)
                      ? "bg-white/8 border-white/10 text-white"
                      : `border-transparent text-zinc-400 ${item.accent}`
                  }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${item.dot} ${isActive(item.href) ? "opacity-100" : "opacity-40"}`}
                />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.slice(0, 2)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
