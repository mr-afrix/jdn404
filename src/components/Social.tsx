import { useState } from "react";
import { SiGithub, SiTelegram, SiWhatsapp, SiTiktok } from "react-icons/si";
import { Heart, Copy, Check, ExternalLink } from "lucide-react";
import { Reveal } from "./Reveal";

const LINKS = [
  { name: "GitHub", handle: "@jdn404", url: "https://github.com/jdn404", Icon: SiGithub, color: "#ffffff", bg: "from-gray-700/30 to-gray-900/30" },
  { name: "Telegram", handle: "@mr_afrix", url: "https://t.me/mr_afrix", Icon: SiTelegram, color: "#26a5e4", bg: "from-sky-500/20 to-blue-700/20" },
  { name: "WhatsApp", handle: "Channel", url: "https://whatsapp.com/channel/0029VbCqF4wDDmFd1whyGY3h", Icon: SiWhatsapp, color: "#25d366", bg: "from-green-500/20 to-emerald-700/20" },
  { name: "TikTok", handle: "@mr_afrix", url: "https://tiktok.com/@mr_afrix", Icon: SiTiktok, color: "#ff0050", bg: "from-pink-500/20 to-rose-700/20" },
];

export const Social = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  return (
    <section className="px-4 py-6 max-w-3xl mx-auto">
      <Reveal>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold">Connect With Me</h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 gap-2.5">
        {LINKS.map((l, i) => (
          <Reveal key={l.name} delay={i * 60}>
            <div
              className={`group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br ${l.bg} backdrop-blur-sm hover:border-primary/40 transition-all hover:-translate-y-0.5`}
            >
              <a
                href={l.url}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3"
              >
                <div
                  className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center bg-background/40 border border-border/40 group-hover:scale-110 transition-transform"
                  style={{ boxShadow: `0 0 12px ${l.color}33` }}
                >
                  <l.Icon size={18} style={{ color: l.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold leading-none">{l.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate mt-1">{l.handle}</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
              </a>
              <button
                onClick={(e) => { e.preventDefault(); copy(l.url); }}
                className="absolute top-1 right-1 p-1 rounded-md hover:bg-background/50 transition opacity-60 hover:opacity-100"
                aria-label={`Copy ${l.name} link`}
              >
                {copied === l.url
                  ? <Check className="w-3 h-3 text-green-500" />
                  : <Copy className="w-3 h-3 text-muted-foreground" />}
              </button>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={300}>
        <div className="mt-4 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-500">Available for new projects & collabs</span>
        </div>
      </Reveal>
    </section>
  );
};
