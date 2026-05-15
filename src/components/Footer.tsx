import { Heart, ArrowUp, Sparkles } from "lucide-react";
import { SiGithub, SiTelegram, SiWhatsapp, SiTiktok } from "react-icons/si";

const LINKS = [
  { url: "https://github.com/jdn404", Icon: SiGithub, color: "#fff" },
  { url: "https://t.me/mr_afrix", Icon: SiTelegram, color: "#26a5e4" },
  { url: "https://whatsapp.com/channel/0029VbCqF4wDDmFd1whyGY3h", Icon: SiWhatsapp, color: "#25d366" },
  { url: "https://tiktok.com/@mr_afrix", Icon: SiTiktok, color: "#ff0050" },
];

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="relative px-4 py-8 mt-4 border-t border-border max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-primary/20 rounded-lg"><Sparkles className="w-4 h-4 text-primary" /></div>
          <div>
            <h3 className="font-bold text-sm">jdn404</h3>
            <p className="text-[10px] text-muted-foreground">Developer & Creator</p>
          </div>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="p-2.5 bg-primary/15 hover:bg-primary/25 border border-primary/30 rounded-full text-primary transition-all hover:-translate-y-1"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
      <div className="flex justify-center gap-2 mb-4">
        {LINKS.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target="_blank" rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted/40 border border-border hover:border-primary/40 transition hover:-translate-y-0.5"
            style={{ boxShadow: `0 0 0 transparent` }}
          >
            <l.Icon size={16} style={{ color: l.color }} />
          </a>
        ))}
      </div>
      <div className="text-center text-xs text-muted-foreground">
        © {year} jdn404 · Made with <Heart className="w-3 h-3 inline text-red-500 animate-pulse" /> using React & TypeScript
      </div>
    </footer>
  );
};
