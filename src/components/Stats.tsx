import { Users, UserPlus, BookOpen, Star, GitFork, Code2, Trophy } from "lucide-react";
import { useGitHubUser, useGitHubRepos } from "@/hooks/useGitHub";
import { totalStars, totalForks, formatNumber, languageBreakdown, LANGUAGE_COLORS } from "@/lib/github";
import { Reveal } from "./Reveal";

const RingStat = ({
  value, max, label, icon: Icon, color, display,
}: {
  value: number; max: number; label: string; icon: any; color: string; display?: string;
}) => {
  const pct = Math.min((value / Math.max(max, 1)) * 100, 100);
  const C = 2 * Math.PI * 36;
  return (
    <div className="glass-card p-3 flex items-center gap-3">
      <div className="relative w-16 h-16 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="36" fill="none"
            stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * C} ${C}`}
            style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dasharray 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xl font-bold leading-tight truncate">{display ?? formatNumber(value)}</div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
};

export const Stats = () => {
  const { data: user } = useGitHubUser();
  const { data: repos } = useGitHubRepos();
  const langs = repos ? languageBreakdown(repos) : [];
  const top = langs[0]?.name || "N/A";
  const stars = repos ? totalStars(repos) : 0;
  const forks = repos ? totalForks(repos) : 0;

  const items = [
    { value: user?.followers ?? 0, max: Math.max(user?.followers ?? 0, 50), label: "Followers", icon: Users, color: "hsl(175 85% 50%)" },
    { value: user?.following ?? 0, max: Math.max(user?.following ?? 0, 20), label: "Following", icon: UserPlus, color: "hsl(280 75% 60%)" },
    { value: user?.public_repos ?? 0, max: Math.max(user?.public_repos ?? 0, 20), label: "Repos", icon: BookOpen, color: "hsl(45 100% 60%)" },
    { value: stars, max: Math.max(stars, 30), label: "Stars", icon: Star, color: "hsl(48 100% 55%)" },
    { value: forks, max: Math.max(forks, 30), label: "Forks", icon: GitFork, color: "hsl(210 100% 60%)" },
    { value: 1, max: 1, label: "Top Lang", icon: Code2, color: LANGUAGE_COLORS[top] || LANGUAGE_COLORS.default, display: top },
  ];

  return (
    <section className="px-4 py-6 max-w-3xl mx-auto">
      <Reveal>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold">GitHub Stats</h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((it, i) => (
          <Reveal key={it.label} delay={i * 60}>
            <RingStat {...it} />
          </Reveal>
        ))}
      </div>
    </section>
  );
};
