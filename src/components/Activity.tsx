import { useState } from "react";
import { Activity as ActivityIcon, CalendarRange, Eye, Flame, GitCommitVertical, TrendingUp } from "lucide-react";
import { useActivity, useProfileVisits } from "@/hooks/useGitHub";
import { useCountUp } from "@/hooks/useMotion";
import { GITHUB_USERNAME, formatDay, formatNumber, timeAgo } from "@/lib/github";
import { sparkline, weekdayLabels } from "@/lib/activity";
import { HANDLE } from "@/lib/identity";
import { Reveal } from "./Reveal";
import { Panel } from "./Panel";
import { Timeline } from "./Timeline";

const MONTH_WIDTH = "0.72rem";

const Metric = ({
  icon: Icon,
  value,
  label,
  hint,
}: {
  icon: typeof Flame;
  value: number;
  label: string;
  hint?: string;
}) => {
  const shown = useCountUp(value);
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line bg-card2/50 px-3 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <div className="font-display text-lg font-semibold leading-none tabular-nums">{formatNumber(shown)}</div>
        <div className="mt-1 truncate text-[11px] text-muted-foreground">{label}</div>
      </div>
      {hint && <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground/80">{hint}</span>}
    </div>
  );
};

export const Activity = () => {
  const { activity, events } = useActivity();
  const { data: visits } = useProfileVisits(GITHUB_USERNAME);
  const [hovered, setHovered] = useState<string | null>(null);

  const visitsCount = useCountUp(visits?.count ?? 0);
  const peak = Math.max(1, ...activity.series.map((d) => d.commits));
  const chart = sparkline((visits?.history ?? []).map((d) => d.count), 132, 30);
  const active = activity.total > 0;

  return (
    <section id="activity" className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <Reveal>
        <div className="mb-6 flex flex-wrap items-end gap-x-4 gap-y-2">
          <div>
            <p className="eyebrow">Last 12 months</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[1.7rem]">Contribution graph</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            {active ? (
              <span>
                <span className="font-mono text-foreground">{formatNumber(activity.total)}</span> contributions
              </span>
            ) : (
              <span>waiting on public activity</span>
            )}
          </div>
          <a
            href={`https://github.com/${HANDLE}?tab=overview`}
            target="_blank"
            rel="noreferrer noopener"
            className="ml-auto text-sm link-quiet"
          >
            Open on GitHub
          </a>
        </div>
      </Reveal>

      <Reveal>
        <Panel className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="hidden shrink-0 flex-col gap-[0.24rem] pt-[1.25rem] text-[10px] leading-[0.72rem] text-muted-foreground sm:flex">
              {weekdayLabels().map((label) => (
                <span key={label} className="h-[0.72rem]">
                  {label}
                </span>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <div className="no-scrollbar overflow-x-auto pb-1">
                <div className="min-w-fit">
                  <div className="flex gap-[0.24rem] text-[10px] text-muted-foreground">
                    {activity.weeks.map((_, i) => {
                      const mark = activity.months.find((m) => m.column === i);
                      return (
                        <span key={`m-${i}`} className="h-4" style={{ width: MONTH_WIDTH }}>
                          {mark ? mark.label : ""}
                        </span>
                      );
                    })}
                  </div>
                  <div className="mt-1 flex gap-[0.24rem]">
                    {activity.weeks.map((week, wi) => (
                      <div key={`w-${wi}`} className="flex flex-col gap-[0.24rem]">
                        {week.map((day) => (
                          <span
                            key={day.date}
                            className={`heat-cell ${day.level ? `heat-${day.level}` : ""}`}
                            style={{
                              visibility: day.future ? "hidden" : "visible",
                              animationDelay: `${Math.min(wi * 6, 320)}ms`,
                            }}
                            onMouseEnter={() => setHovered(day.date)}
                            onMouseLeave={() => setHovered(null)}
                          >
                            <span className="sr-only">
                              {formatDay(day.date)}: {day.count} contributions
                            </span>
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-3 text-[11px] text-muted-foreground">
                <span className="min-h-4 font-mono">
                  {hovered
                    ? `${formatDay(hovered)}, ${activity.days.find((d) => d.date === hovered)?.count ?? 0} contributions`
                    : "hover a square for the day"}
                </span>
                <span className="ml-auto flex items-center gap-1.5">
                  less
                  {[0, 1, 2, 3, 4].map((level) => (
                    <span key={level} className={`heat-cell ${level ? `heat-${level}` : ""}`} style={{ animation: "none" }} />
                  ))}
                  more
                </span>
              </div>
            </div>
          </div>
        </Panel>
      </Reveal>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Reveal delay={80}>
          <Panel className="h-full p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <GitCommitVertical className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Commits per day</h3>
              <span className="ml-auto font-mono text-[11px] text-muted-foreground">last 30 days</span>
            </div>
            <div className="flex h-28 items-end gap-[3px]">
              {activity.series.map((day, i) => {
                const height = day.commits === 0 ? 3 : Math.max(8, (day.commits / peak) * 100);
                return (
                  <div key={day.date} className="group relative flex h-full flex-1 items-end" title={`${formatDay(day.date)}, ${day.commits} commits`}>
                    <div
                      className={`w-full rounded-[3px] transition-colors ${day.commits ? "bg-primary/70 group-hover:bg-primary-bright" : "bg-muted"}`}
                      style={{ height: `${height}%`, animation: `bar-in 0.5s cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${i * 18}ms`, transformOrigin: "bottom" }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Metric icon={TrendingUp} value={activity.commitsRecent} label="Commits 30d" />
              <Metric icon={CalendarRange} value={activity.contributionsRecent} label="Contributions 30d" />
              <Metric icon={ActivityIcon} value={activity.activeDays} label="Active days" />
              <Metric icon={Flame} value={activity.currentStreak} label="Day streak" hint={activity.lastSeen ? timeAgo(`${activity.lastSeen}T12:00:00`) : undefined} />
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={140}>
          <Panel className="flex h-full flex-col p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Eye className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold">Profile visits</h3>
              <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                {visits?.origin === "github-counter" ? "github counter" : "this device"}
              </span>
            </div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="font-display text-4xl font-semibold leading-none tabular-nums">
                  {formatNumber(visitsCount)}
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {visits?.origin === "github-counter"
                    ? "lifetime views of the GitHub profile"
                    : `${visits?.recorded ?? 0} view${(visits?.recorded ?? 0) === 1 ? "" : "s"} tracked on this device`}
                </p>
              </div>
              <svg viewBox="0 0 132 30" className="h-10 w-[132px] shrink-0" aria-hidden="true">
                <defs>
                  <linearGradient id="visit-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={chart.area} fill="url(#visit-fill)" />
                <path d={chart.line} fill="none" stroke="hsl(var(--primary-bright))" strokeWidth="1.5" strokeLinejoin="round" />
                {chart.points.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="1.6" fill="hsl(var(--primary-bright))" />
                ))}
              </svg>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Metric icon={Flame} value={activity.longestStreak} label="Longest streak" />
              <Metric icon={GitCommitVertical} value={activity.commits} label="Commits 12mo" />
            </div>
            <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-muted-foreground">
              Best day so far:{" "}
              {activity.bestDay && activity.bestDay.count > 0
                ? `${formatDay(activity.bestDay.date)} with ${activity.bestDay.count} contributions`
                : `${HANDLE} has not recorded a public contribution in this window`}
              . Events are read from the public GitHub feed, which covers roughly the last 90 days.
            </p>
          </Panel>
        </Reveal>
      </div>

      {activity.mix.length > 0 && (
        <Reveal delay={180}>
          <Panel className="mt-3 p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <ActivityIcon className="h-4 w-4 text-secondary" />
              <h3 className="text-sm font-semibold">What the activity was</h3>
            </div>
            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {activity.mix.map((row) => {
                const max = Math.max(...activity.mix.map((m) => m.value), 1);
                return (
                  <div key={row.key} className="flex items-center gap-3">
                    <span className="w-36 shrink-0 text-xs text-muted-foreground">{row.label}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className="block h-full rounded-full bg-primary/75"
                        style={{ width: `${Math.max(4, (row.value / max) * 100)}%` }}
                      />
                    </span>
                    <span className="w-8 shrink-0 text-right font-mono text-xs tabular-nums">{row.value}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </Reveal>
      )}

      <div className="mt-3">
        <Timeline />
      </div>

      {events.length === 0 && (
        <Reveal delay={200}>
          <div className="mt-3 rounded-lg border border-dashed border-line px-4 py-3 text-xs text-muted-foreground">
            Public activity is empty, so the graph is drawn at zero instead of a placeholder number. It fills in as
            soon as pushes and releases are visible on the account.
          </div>
        </Reveal>
      )}
    </section>
  );
};
