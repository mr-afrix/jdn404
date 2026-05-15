import { Layers, Sparkles } from "lucide-react";
import {
  SiPython, SiJavascript, SiTypescript, SiReact, SiHtml5, SiCss, SiNodedotjs, SiDocker,
  SiGit, SiGithub, SiLinux, SiMysql, SiMongodb, SiPostgresql, SiTailwindcss, SiVuedotjs,
  SiSvelte, SiGo, SiRust, SiPhp, SiRuby, SiCplusplus, SiC, SiSharp, SiSwift, SiKotlin,
  SiDart, SiBootstrap, SiVite, SiNextdotjs, SiFlask, SiDjango, SiFastapi, SiTelegram,
} from "react-icons/si";
import { useGitHubRepos } from "@/hooks/useGitHub";
import { LANGUAGE_COLORS } from "@/lib/github";
import { Reveal } from "./Reveal";

const ICONS: Record<string, { Icon: any; level: number }> = {
  Python: { Icon: SiPython, level: 95 },
  JavaScript: { Icon: SiJavascript, level: 88 },
  TypeScript: { Icon: SiTypescript, level: 80 },
  React: { Icon: SiReact, level: 85 },
  HTML: { Icon: SiHtml5, level: 95 },
  CSS: { Icon: SiCss, level: 90 },
  "Node.js": { Icon: SiNodedotjs, level: 78 },
  Docker: { Icon: SiDocker, level: 70 },
  Git: { Icon: SiGit, level: 90 },
  GitHub: { Icon: SiGithub, level: 92 },
  Linux: { Icon: SiLinux, level: 80 },
  MySQL: { Icon: SiMysql, level: 70 },
  MongoDB: { Icon: SiMongodb, level: 65 },
  PostgreSQL: { Icon: SiPostgresql, level: 70 },
  Tailwind: { Icon: SiTailwindcss, level: 88 },
  Vue: { Icon: SiVuedotjs, level: 60 },
  Svelte: { Icon: SiSvelte, level: 50 },
  Go: { Icon: SiGo, level: 55 },
  Rust: { Icon: SiRust, level: 50 },
  PHP: { Icon: SiPhp, level: 60 },
  Ruby: { Icon: SiRuby, level: 50 },
  "C++": { Icon: SiCplusplus, level: 55 },
  C: { Icon: SiC, level: 60 },
  "C#": { Icon: SiSharp, level: 50 },
  Swift: { Icon: SiSwift, level: 45 },
  Kotlin: { Icon: SiKotlin, level: 50 },
  Dart: { Icon: SiDart, level: 50 },
  Bootstrap: { Icon: SiBootstrap, level: 75 },
  Vite: { Icon: SiVite, level: 80 },
  "Next.js": { Icon: SiNextdotjs, level: 70 },
  Flask: { Icon: SiFlask, level: 75 },
  Django: { Icon: SiDjango, level: 65 },
  FastAPI: { Icon: SiFastapi, level: 70 },
  Telegram: { Icon: SiTelegram, level: 90 },
};

const COLORS: Record<string, string> = {
  Python: "#3776ab", JavaScript: "#f7df1e", TypeScript: "#3178c6", React: "#61dafb",
  HTML: "#e34f26", CSS: "#1572b6", "Node.js": "#5fa04e", Docker: "#2496ed",
  Git: "#f05032", GitHub: "#ffffff", Linux: "#fcc624", Tailwind: "#06b6d4",
  Bootstrap: "#7952b3", Vite: "#646cff", "Next.js": "#ffffff", Flask: "#ffffff",
  Django: "#092e20", FastAPI: "#009688", Telegram: "#26a5e4",
};

export const TechStack = () => {
  const { data: repos } = useGitHubRepos();
  const repoLangs = new Set<string>();
  repos?.forEach((r) => r.language && repoLangs.add(r.language));

  // Default known + repo langs
  const baseTech = ["Python", "JavaScript", "TypeScript", "React", "HTML", "CSS", "Node.js", "Git", "GitHub", "Docker", "Linux", "Tailwind"];
  const all = Array.from(new Set([...baseTech, ...repoLangs])).filter((n) => ICONS[n]);

  return (
    <section className="px-4 py-6 max-w-3xl mx-auto">
      <Reveal>
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Tech Stack</h2>
            <span className="text-xs text-muted-foreground ml-auto">{all.length} skills</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {all.map((name, i) => {
              const { Icon, level } = ICONS[name];
              const color = COLORS[name] || LANGUAGE_COLORS[name] || "hsl(var(--primary))";
              return (
                <Reveal key={name} delay={i * 30}>
                  <div className="group relative flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/60 border border-border/50 hover:border-primary/40 transition-all hover:-translate-y-0.5">
                    <Icon size={28} style={{ color }} className="transition-transform group-hover:scale-110" />
                    <span className="text-[11px] font-medium text-center truncate w-full">{name}</span>
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${level}%`, background: color, boxShadow: `0 0 6px ${color}` }}
                      />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Always learning new tech
          </div>
        </div>
      </Reveal>
    </section>
  );
};
