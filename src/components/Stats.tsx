import { BookOpen, GitFork, Star, UserPlus, Users, Wrench, FileCode2, Eye } from "lucide-react";
import { useGitHubRepos, useGitHubUser, useProfileVisits } from "@/hooks/useGitHub";
import { useCountUp } from "@/hooks/useMotion";
import {
  formatDate,
  formatNumber,
  GITHUB_USERNAME,
  licensedCount,
  ownRepos,
  timeAgo,
  totalForks,
  totalStars,
  totalWatchers,
} from "@/lib/github";
import { Reveal } from "./Reveal";
import { Panel } from "./Panel";

const Ring = ({ progress, tint }: { progress: number; tint: string }) => {
  const r = 17;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="20" cy="20" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke={tint}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${(Math.min(progress, 1) * c).toFixed(2)} ${c.toFixed(2)}`}
        style={{ transition: "stroke-dasharray 1s cubic-bezier(0.22,1,0.36,1)" }}
      />
    </svg>
  );
};

type Cell = {
  key: string;
  label: string;
  value: number;
  scale: number;
  hint: string;
  tint: string;
  icon: typeof Star;
};

export const Stats = () => {
  const { data: user } = useGitHubUser();
  const { data: repos } = useGitHubRepos();
  const { data: visits } = useProfileVisits(GITHUB_USERNAME);

  const own = ownRepos(repos);
  const stars = totalStars(repos);
  const forks = totalForks(repos);
  const watchers = totalWatchers(repos);
  const licenses = licensedCount(repos);

  const cells: Cell[] = [
    {
      key: "repos",
      label: "Repositories",
      value: own.length,
      scale: 30,
      hint: `${own.filter((r) => r.language).length} with a detected language`,
      tint: "hsl(var(--primary))",
      icon: BookOpen,
    },
    {
      key: "stars",
      label: "Stars earned",
      value: stars,
      scale: 40,
      hint: stars ? "across public work" : "none yet",
      tint: "hsl(var(--secondary))",
      icon: Star,
    },
    {
      key: "forks",
      label: "Forks",
      value: forks,
      scale: 20,
      hint: "copies other people made",
      tint: "hsl(var(--accent))",
      icon: GitFork,
    },
    {
      key: "watchers",
      label: "Watchers",
      value: watchers,
      scale: 20,
      hint: "subscribed to updates",
      tint: "hsl(var(--primary-bright))",
      icon: Eye,
    },
    {
      key: "followers",
      label: "Followers",
      value: user?.followers ?? 0,
      scale: 40,
      hint: `${user?.following ?? 0} followed back`,
      tint: "hsl(var(--primary))",
      icon: Users,
    },
    {
      key: "gists",
      label: "Gists",
      value: user?.public_gists ?? 0,
      scale: 10,
      hint: "snippets and notes",
      tint: "hsl(var(--secondary))",
      icon: FileCode2,
    },
    {
      key: "licenses",
      label: "Licensed",
      value: licenses,
      scale: Math.max(own.length, 1),
      hint: `${own.length - licenses} without a license file`,
      tint: "hsl(var(--accent))",
      icon: Wrench,
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
      <Reveal>
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1">
          <p className="eyebrow">Account</p>
          <h2 className="text-base font-semibold tracking-tight">Profile snapshot</h2>
          <span className="font-mono text-[11px] text-muted-foreground">
            {user ? `joined ${formatDate(user.created_at)}, last active ${timeAgo(user.updated_at)}` : "reading account data"}
          </span>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cells.map((cell, i) => (
          <Cell key={cell.key} cell={cell} delay={i * 45} />
        ))}
        <Reveal delay={cells.length * 45}>
          <Panel hover className="flex h-full items-center gap-3 p-4">
            <UserPlus className="h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <div className="font-display text-lg font-semibold leading-none tabular-nums">
                {formatNumber(visits?.count ?? 0)}
              </div>
              <div className="mt-1 truncate text-[11px] text-muted-foreground">profile visits</div>
            </div>
          </Panel>
        </Reveal>
      </div>
    </section>
  );
};

const Cell = ({ cell, delay }: { cell: Cell; delay: number }) => {
  const shown = useCountUp(cell.value, 900);
  return (
    <Reveal delay={delay}>
      <Panel hover className="flex h-full items-center gap-3 p-4">
        <Ring progress={cell.value / Math.max(cell.scale, cell.value)} tint={cell.tint} />
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-xl font-semibold leading-none tabular-nums">{formatNumber(shown)}</span>
            <cell.icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="mt-1 text-xs font-medium">{cell.label}</div>
          <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{cell.hint}</div>
        </div>
      </Panel>
    </Reveal>
  );
};
