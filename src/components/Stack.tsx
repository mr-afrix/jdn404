import type { IconType } from "react-icons";
import { Cpu, Layers, PenTool, Server, Wrench } from "lucide-react";
import {
  SiAstro,
  SiBootstrap,
  SiCloudflare,
  SiCss,
  SiDebian,
  SiDjango,
  SiDocker,
  SiElectron,
  SiExpress,
  SiFastapi,
  SiFigma,
  SiFlask,
  SiGit,
  SiGithub,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJupyter,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNetlify,
  SiNextdotjs,
  SiNodedotjs,
  SiNpm,
  SiPandas,
  SiPostgresql,
  SiPypi,
  SiPython,
  SiReact,
  SiRedis,
  SiRust,
  SiSqlite,
  SiSvelte,
  SiTailwindcss,
  SiTauri,
  SiTypescript,
  SiUbuntu,
  SiVercel,
  SiVite,
} from "react-icons/si";
import { useGitHubRepos } from "@/hooks/useGitHub";
import { LANGUAGE_COLORS, languageBreakdown, ownRepos } from "@/lib/github";
import { Reveal } from "./Reveal";
import { Panel } from "./Panel";

type Tool = { name: string; Icon: IconType; tint?: string; level: number };

const GROUPS: { id: string; label: string; icon: typeof Layers; tools: Tool[] }[] = [
  {
    id: "languages",
    label: "Languages",
    icon: Cpu,
    tools: [
      { name: "TypeScript", Icon: SiTypescript, level: 92 },
      { name: "Python", Icon: SiPython, level: 90 },
      { name: "JavaScript", Icon: SiJavascript, level: 88 },
      { name: "HTML", Icon: SiHtml5, level: 86 },
      { name: "CSS", Icon: SiCss, level: 84 },
      { name: "Rust", Icon: SiRust, level: 40 },
    ],
  },
  {
    id: "frontend",
    label: "Interface",
    icon: Layers,
    tools: [
      { name: "React", Icon: SiReact, level: 90 },
      { name: "Next.js", Icon: SiNextdotjs, level: 76 },
      { name: "Vite", Icon: SiVite, level: 84 },
      { name: "Tailwind CSS", Icon: SiTailwindcss, level: 88 },
      { name: "Svelte", Icon: SiSvelte, level: 48 },
      { name: "Astro", Icon: SiAstro, level: 44 },
      { name: "Bootstrap", Icon: SiBootstrap, level: 66 },
    ],
  },
  {
    id: "backend",
    label: "Services",
    icon: Server,
    tools: [
      { name: "Node.js", Icon: SiNodedotjs, level: 82 },
      { name: "Express", Icon: SiExpress, level: 78 },
      { name: "FastAPI", Icon: SiFastapi, level: 80 },
      { name: "Flask", Icon: SiFlask, level: 74 },
      { name: "Django", Icon: SiDjango, level: 60 },
      { name: "GraphQL", Icon: SiGraphql, level: 55 },
    ],
  },
  {
    id: "data",
    label: "Data",
    icon: PenTool,
    tools: [
      { name: "PostgreSQL", Icon: SiPostgresql, level: 72 },
      { name: "MySQL", Icon: SiMysql, level: 64 },
      { name: "MongoDB", Icon: SiMongodb, level: 60 },
      { name: "SQLite", Icon: SiSqlite, level: 74 },
      { name: "Redis", Icon: SiRedis, level: 62 },
      { name: "pandas", Icon: SiPandas, level: 78 },
      { name: "Jupyter", Icon: SiJupyter, level: 70 },
    ],
  },
  {
    id: "tooling",
    label: "Tooling and infra",
    icon: Wrench,
    tools: [
      { name: "Git", Icon: SiGit, level: 92 },
      { name: "GitHub", Icon: SiGithub, level: 90 },
      { name: "npm", Icon: SiNpm, level: 86 },
      { name: "PyPI", Icon: SiPypi, level: 80 },
      { name: "Docker", Icon: SiDocker, level: 68 },
      { name: "Linux", Icon: SiLinux, level: 78 },
      { name: "Debian", Icon: SiDebian, level: 66 },
      { name: "Ubuntu", Icon: SiUbuntu, level: 72 },
      { name: "Vercel", Icon: SiVercel, level: 64 },
      { name: "Netlify", Icon: SiNetlify, level: 52 },
      { name: "Cloudflare", Icon: SiCloudflare, level: 58 },
      { name: "Electron", Icon: SiElectron, level: 44 },
      { name: "Tauri", Icon: SiTauri, level: 40 },
      { name: "Figma", Icon: SiFigma, level: 56 },
    ],
  },
];

export const Stack = () => {
  const { data: repos } = useGitHubRepos();
  const detected = new Set<string>();
  ownRepos(repos).forEach((r) => r.language && detected.add(r.language));
  languageBreakdown(repos).forEach((l) => detected.add(l.name));
  const total = ownRepos(repos).length;

  return (
    <section id="stack" className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <Reveal>
        <div className="mb-6 flex flex-wrap items-end gap-x-4 gap-y-2">
          <div>
            <p className="eyebrow">Stack</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[1.7rem]">Tools in rotation</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            filled bars are marked from repository languages
          </p>
        </div>
      </Reveal>

      <div className="grid gap-3 lg:grid-cols-2">
        {GROUPS.map((group, gi) => (
          <Reveal key={group.id} delay={gi * 70}>
            <Panel className="h-full p-4 sm:p-5">
              <div className="mb-3.5 flex items-center gap-2">
                <group.icon className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">{group.label}</h3>
                <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                  {group.tools.filter((t) => detected.has(t.name)).length} in use
                </span>
              </div>
              <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {group.tools.map((tool) => {
                  const used = detected.has(tool.name);
                  const tint = tool.tint ?? LANGUAGE_COLORS[tool.name] ?? "hsl(var(--primary))";
                  return (
                    <li
                      key={tool.name}
                      className={`group flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-all duration-300 ${
                        used
                          ? "border-primary/35 bg-primary/10"
                          : "border-line bg-card2/40 hover:border-primary/30"
                      }`}
                    >
                      <tool.Icon size={16} style={{ color: tint }} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
                      <span className="min-w-0 flex-1 truncate text-[11.5px] font-medium">{tool.name}</span>
                      <span className="h-1 w-6 shrink-0 overflow-hidden rounded-full bg-muted">
                        <span
                          className="block h-full rounded-full"
                          style={{ width: `${tool.level}%`, background: used ? "hsl(var(--primary-bright))" : tint, opacity: used ? 1 : 0.55 }}
                        />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          </Reveal>
        ))}

        <Reveal delay={GROUPS.length * 70}>
          <Panel className="flex h-full flex-col justify-between p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold">Language mix</h3>
              <span className="ml-auto font-mono text-[11px] text-muted-foreground">{total} repositories</span>
            </div>
            <LanguageList />
          </Panel>
        </Reveal>
      </div>
    </section>
  );
};

const LanguageList = () => {
  const { data: repos } = useGitHubRepos();
  const langs = languageBreakdown(repos);

  if (langs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line px-3 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          No language data yet. The ring fills from repository languages as soon as code is public.
        </p>
        <div className="mx-auto mt-4 h-20 w-20 rounded-full border-[6px] border-muted" />
      </div>
    );
  }

  const c = 2 * Math.PI * 42;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="relative h-28 w-28 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="11" />
          {langs.slice(0, 6).map((l) => {
            const len = (l.percentage / 100) * c;
            const segment = (
              <circle
                key={l.name}
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={l.color}
                strokeWidth="11"
                strokeDasharray={`${len} ${c}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return segment;
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="font-display text-xl font-semibold leading-none">{langs.length}</div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">langs</div>
          </div>
        </div>
      </div>
      <ul className="w-full flex-1 space-y-2">
        {langs.slice(0, 6).map((l) => (
          <li key={l.name} className="flex items-center gap-2.5">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: l.color }} />
            <span className="min-w-0 flex-1 truncate text-xs font-medium">{l.name}</span>
            <span className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted sm:w-24">
              <span className="block h-full rounded-full" style={{ width: `${l.percentage}%`, background: l.color }} />
            </span>
            <span className="w-10 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
              {l.percentage.toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
