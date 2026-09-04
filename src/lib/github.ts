import { HANDLE } from "./identity";

export const GITHUB_USERNAME = HANDLE;

const API = "https://api.github.com";

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  blog: string;
  hireable: boolean | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  twitter_username: string | null;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
  language: string | null;
  license: { spdx_id: string | null; name: string } | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  created_at: string;
  pushed_at: string;
  updated_at: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    action?: string;
    ref?: string;
    ref_type?: string;
    size?: number;
    distinct_size?: number;
    commits?: { author?: { name?: string; email?: string } }[];
    forkee?: { name?: string };
    issue?: { pull_request?: unknown };
  };
}

export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572a5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  Go: "#00add8",
  Rust: "#dea584",
  Swift: "#f05138",
  Kotlin: "#a97bff",
  PHP: "#4f5d95",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Astro: "#d22b96",
  Dart: "#00b4ab",
  Lua: "#000080",
  Dockerfile: "#384d54",
  Jupyter: "#da5b0b",
  MDX: "#fcb32c",
  default: "#8b949e",
};

const RAW_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;

const TOKEN = RAW_TOKEN && !RAW_TOKEN.trim().startsWith("your_") ? RAW_TOKEN.trim() : undefined;

async function gh<T>(path: string): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  const res = await fetch(`${API}${path}`, { headers });
  if (!res.ok) throw new Error(`github ${res.status} ${path}`);
  return (await res.json()) as T;
}

export const fetchUser = (username = GITHUB_USERNAME) => gh<GitHubUser>(`/users/${username}`);

export const fetchRepos = (username = GITHUB_USERNAME) =>
  gh<GitHubRepo[]>(`/users/${username}/repos?per_page=100&sort=updated`);

export const fetchEvents = async (username = GITHUB_USERNAME): Promise<GitHubEvent[]> => {
  try {
    return await gh<GitHubEvent[]>(`/users/${username}/events/public?per_page=100`);
  } catch {
    return [];
  }
};

export const ownRepos = (repos: GitHubRepo[] | undefined) => (repos ?? []).filter((r) => !r.fork);

export const totalStars = (repos: GitHubRepo[] | undefined) =>
  ownRepos(repos).reduce((sum, r) => sum + r.stargazers_count, 0);

export const totalForks = (repos: GitHubRepo[] | undefined) =>
  ownRepos(repos).reduce((sum, r) => sum + r.forks_count, 0);

export const totalWatchers = (repos: GitHubRepo[] | undefined) =>
  ownRepos(repos).reduce((sum, r) => sum + r.watchers_count, 0);

export const totalIssues = (repos: GitHubRepo[] | undefined) =>
  ownRepos(repos).reduce((sum, r) => sum + r.open_issues_count, 0);

export const licensedCount = (repos: GitHubRepo[] | undefined) =>
  ownRepos(repos).filter((r) => r.license && r.license.spdx_id !== "NOASSERTION").length;

export const topicsOf = (repos: GitHubRepo[] | undefined) => {
  const counts = new Map<string, number>();
  ownRepos(repos ?? []).forEach((r) =>
    (r.topics ?? []).forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)),
  );
  return [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
};

export const lastPushed = (repos: GitHubRepo[] | undefined) =>
  ownRepos(repos).reduce<string | null>(
    (acc, r) => (!acc || new Date(r.pushed_at) > new Date(acc) ? r.pushed_at : acc),
    null,
  );

export const firstCreated = (repos: GitHubRepo[] | undefined) =>
  ownRepos(repos).reduce<string | null>(
    (acc, r) => (!acc || new Date(r.created_at) < new Date(acc) ? r.created_at : acc),
    null,
  );

export function languageBreakdown(repos: GitHubRepo[] | undefined) {
  const counts = new Map<string, number>();
  ownRepos(repos ?? []).forEach((r) => {
    if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  });
  const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
  return [...counts.entries()]
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / total) * 100,
      color: LANGUAGE_COLORS[name] ?? LANGUAGE_COLORS.default,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function formatNumber(n: number) {
  if (!Number.isFinite(n)) return "0";
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(Math.round(n));
}

export function timeAgo(date?: string | null) {
  if (!date) return "no activity";
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 45) return "just now";
  const units: [string, number][] = [
    ["y", 31_536_000],
    ["mo", 2_592_000],
    ["w", 604_800],
    ["d", 86_400],
    ["h", 3_600],
    ["m", 60],
  ];
  for (const [label, seconds] of units) {
    const n = Math.floor(diff / seconds);
    if (n >= 1) return `${n}${label} ago`;
  }
  return "just now";
}

export function formatDate(date?: string | null, opts?: Intl.DateTimeFormatOptions) {
  if (!date) return "unknown";
  return new Date(date).toLocaleDateString("en-GB", opts ?? { year: "numeric", month: "short" });
}

export function formatDay(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
