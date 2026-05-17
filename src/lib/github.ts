/**
 * GitHub API service — fetches real data from github.com/jdn404
 */

export const GITHUB_USERNAME = "jdn404";
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
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  topics: string[];
  pushed_at: string;
  archived: boolean;
}

export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", Java: "#b07219",
  "C++": "#f34b7d", C: "#555555", "C#": "#178600", Ruby: "#701516", Go: "#00ADD8",
  Rust: "#dea584", Swift: "#F05138", Kotlin: "#A97BFF", PHP: "#4F5D95", HTML: "#e34c26",
  CSS: "#563d7c", SCSS: "#c6538c", Shell: "#89e051", Vue: "#41b883", Svelte: "#ff3e00",
  Dart: "#00B4AB", Lua: "#000080", Dockerfile: "#384d54", Jupyter: "#DA5B0B",
  default: "#8b8b8b",
};

const TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;

async function gh<T>(path: string): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/vnd.github.v3+json" };
  if (TOKEN) headers["Authorization"] = `Bearer ${TOKEN}`;
  const res = await fetch(`${API}${path}`, { headers });
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Not found: ${path}`);
    if (res.status === 403) throw new Error("GitHub API rate limit hit. Try again in a few minutes.");
    throw new Error(`GitHub error ${res.status}`);
  }
  return res.json();
}

export const fetchUser = (u = GITHUB_USERNAME) => gh<GitHubUser>(`/users/${u}`);
export const fetchRepos = (u = GITHUB_USERNAME) =>
  gh<GitHubRepo[]>(`/users/${u}/repos?per_page=100&sort=updated`);

export const totalStars = (r: GitHubRepo[]) => r.reduce((s, x) => s + x.stargazers_count, 0);
export const totalForks = (r: GitHubRepo[]) => r.reduce((s, x) => s + x.forks_count, 0);

export function languageBreakdown(repos: GitHubRepo[]) {
  const counts: Record<string, number> = {};
  repos.forEach((r) => { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / total) * 100,
      color: LANGUAGE_COLORS[name] || LANGUAGE_COLORS.default,
    }))
    .sort((a, b) => b.count - a.count);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export function timeAgo(date: string): string {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const u: [string, number][] = [["y", 31536000], ["mo", 2592000], ["w", 604800], ["d", 86400], ["h", 3600], ["m", 60]];
  for (const [l, sec] of u) { const n = Math.floor(s / sec); if (n >= 1) return `${n}${l} ago`; }
  return "just now";
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}
