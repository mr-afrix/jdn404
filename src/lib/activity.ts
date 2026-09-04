import type { GitHubEvent } from "./github";

export type DayCell = {
  date: string;
  count: number;
  commits: number;
  pushes: number;
  pulls: number;
  issues: number;
  releases: number;
  creates: number;
  stars: number;
  forks: number;
  level: number;
  future: boolean;
};

export type MonthMark = { label: string; column: number };

export type Activity = {
  weeks: DayCell[][];
  days: DayCell[];
  months: MonthMark[];
  series: DayCell[];
  total: number;
  commits: number;
  commitsRecent: number;
  contributionsRecent: number;
  currentStreak: number;
  longestStreak: number;
  bestDay: DayCell | null;
  activeDays: number;
  average: number;
  firstSeen: string | null;
  lastSeen: string | null;
  mix: { key: string; label: string; value: number }[];
};

const DAY_MS = 86_400_000;

const pad = (n: number) => String(n).padStart(2, "0");

export const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const blankDay = (date: string, future: boolean): DayCell => ({
  date,
  count: 0,
  commits: 0,
  pushes: 0,
  pulls: 0,
  issues: 0,
  releases: 0,
  creates: 0,
  stars: 0,
  forks: 0,
  level: 0,
  future,
});

const contributions = (d: DayCell) =>
  d.commits + d.pushes + d.pulls + d.issues + d.releases + d.creates;

export function buildActivity(events: GitHubEvent[] = [], weekCount = 53): Activity {
  const today = startOfDay(new Date());
  const gridStart = new Date(today.getTime() - (weekCount * 7 - 1) * DAY_MS);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const bucket = new Map<string, DayCell>();
  const at = (date: string) => {
    let cell = bucket.get(date);
    if (!cell) {
      cell = blankDay(date, false);
      bucket.set(date, cell);
    }
    return cell;
  };

  let firstSeen: string | null = null;
  let lastSeen: string | null = null;

  for (const event of events) {
    const stamp = new Date(event.created_at);
    if (Number.isNaN(stamp.getTime())) continue;
    const key = dayKey(stamp);
    if (key > dayKey(today)) continue;
    if (!firstSeen || key < firstSeen) firstSeen = key;
    if (!lastSeen || key > lastSeen) lastSeen = key;

    const cell = at(key);
    const payload = event.payload ?? {};
    switch (event.type) {
      case "PushEvent":
        cell.pushes += 1;
        cell.commits += payload.distinct_size ?? payload.size ?? payload.commits?.length ?? 0;
        break;
      case "PullRequestEvent":
        cell.pulls += 1;
        break;
      case "IssuesEvent":
        if (!payload.issue?.pull_request) cell.issues += 1;
        break;
      case "ReleaseEvent":
        cell.releases += 1;
        break;
      case "CreateEvent":
        cell.creates += 1;
        break;
      case "WatchEvent":
        cell.stars += 1;
        break;
      case "ForkEvent":
        cell.forks += 1;
        break;
    }
  }

  const days: DayCell[] = [];
  const cursor = new Date(gridStart);
  while (cursor <= today) {
    const key = dayKey(cursor);
    const cell = bucket.get(key) ?? blankDay(key, false);
    days.push({ ...cell, date: key, count: contributions(cell) });
    cursor.setTime(cursor.getTime() + DAY_MS);
  }

  const filled = days.length + ((7 - (days.length % 7)) % 7);
  for (let i = days.length; i < filled; i += 1) {
    const date = new Date(gridStart.getTime() + i * DAY_MS);
    days.push(blankDay(dayKey(date), date > today));
  }

  const positive = days.filter((d) => !d.future && d.count > 0).map((d) => d.count).sort((a, b) => a - b);
  const threshold = (q: number) => (positive.length ? positive[Math.min(positive.length - 1, Math.floor(positive.length * q))] : 1);
  const cuts = [threshold(0.34), threshold(0.67), threshold(0.92)];
  const levelled = days.map((d) => {
    if (d.future || d.count === 0) return { ...d, level: 0 };
    const level = 1 + cuts.filter((c) => d.count >= c).length;
    return { ...d, level: Math.min(level, 4) };
  });

  const weeks: DayCell[][] = [];
  for (let i = 0; i < levelled.length; i += 7) weeks.push(levelled.slice(i, i + 7));

  const months: MonthMark[] = [];
  let previous = -1;
  weeks.forEach((week, column) => {
    const anchor = week.find((d) => !d.future) ?? week[0];
    if (!anchor || column === 0) return;
    const month = new Date(`${anchor.date}T12:00:00`).getMonth();
    if (month !== previous) {
      months.push({ label: new Date(`${anchor.date}T12:00:00`).toLocaleDateString("en-GB", { month: "short" }), column });
      previous = month;
    }
  });

  const total = levelled.reduce((sum, d) => (d.future ? sum : sum + d.count), 0);
  const commits = levelled.reduce((sum, d) => (d.future ? sum : sum + d.commits), 0);
  const visible = levelled.filter((d) => !d.future);
  const activeDays = visible.filter((d) => d.count > 0).length;

  const bestDay = visible.reduce<DayCell | null>(
    (acc, d) => (!acc || d.count > acc.count ? d : acc),
    null,
  );

  let longestStreak = 0;
  let run = 0;
  for (const d of visible) {
    if (d.count > 0) {
      run += 1;
      longestStreak = Math.max(longestStreak, run);
    } else run = 0;
  }

  let currentStreak = 0;
  for (let i = visible.length - 1; i >= 0; i -= 1) {
    if (visible[i].count > 0) currentStreak += 1;
    else if (i === visible.length - 1) continue;
    else break;
  }

  const sumTail = (days_: DayCell[], field: "count" | "commits", n: number) =>
    days_.slice(Math.max(0, days_.length - n)).reduce((s, d) => s + d[field], 0);

  const mix: Activity["mix"] = [
    { key: "commits", label: "Commits", value: commits },
    { key: "pushes", label: "Pushes", value: levelled.reduce((s, d) => s + d.pushes, 0) },
    { key: "pulls", label: "Pull requests", value: levelled.reduce((s, d) => s + d.pulls, 0) },
    { key: "issues", label: "Issues", value: levelled.reduce((s, d) => s + d.issues, 0) },
    { key: "creates", label: "Branches and repos", value: levelled.reduce((s, d) => s + d.creates, 0) },
    { key: "stars", label: "Stars given", value: levelled.reduce((s, d) => s + d.stars, 0) },
  ];

  return {
    weeks,
    days: visible,
    months,
    series: visible.slice(-30),
    total,
    commits,
    commitsRecent: sumTail(visible, "commits", 30),
    contributionsRecent: sumTail(visible, "count", 30),
    currentStreak,
    longestStreak,
    bestDay,
    activeDays,
    average: visible.length ? total / visible.length : 0,
    firstSeen,
    lastSeen,
    mix: mix.filter((m) => m.value > 0),
  };
}

export function sparkline(values: number[], width = 120, height = 34) {
  if (values.length === 0) return { line: "", area: "", points: [] as { x: number; y: number }[] };
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const points = values.map((v, i) => ({
    x: i * step,
    y: height - (v / max) * (height - 4) - 2,
  }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  return { line, area, points };
}

export function weekdayLabels() {
  return ["", "Mon", "", "Wed", "", "Fri", ""];
}
