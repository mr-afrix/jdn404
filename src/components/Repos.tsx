import { useState, useMemo, useEffect } from "react";
import { Star, GitFork, Clock, ExternalLink, Search, BookOpen, ChevronLeft, ChevronRight, Filter, FolderGit2 } from "lucide-react";
import { useGitHubRepos } from "@/hooks/useGitHub";
import { LANGUAGE_COLORS, timeAgo, formatNumber } from "@/lib/github";
import { Reveal } from "./Reveal";

const PAGE_SIZE = 6;

type Sort = "updated" | "stars" | "forks" | "name" | "created";

export const Repos = () => {
  const { data: repos, isLoading } = useGitHubRepos();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("updated");
  const [lang, setLang] = useState<string>("All");
  const [page, setPage] = useState(1);

  const allLangs = useMemo(() => {
    const s = new Set<string>();
    repos?.forEach((r) => r.language && s.add(r.language));
    return ["All", ...Array.from(s).sort()];
  }, [repos]);

  const filtered = useMemo(() => {
    if (!repos) return [];
    let r = repos.filter((x) => !x.fork);
    if (q) {
      const s = q.toLowerCase();
      r = r.filter((x) => x.name.toLowerCase().includes(s) || x.description?.toLowerCase().includes(s));
    }
    if (lang !== "All") r = r.filter((x) => x.language === lang);
    r.sort((a, b) => {
      switch (sort) {
        case "stars": return b.stargazers_count - a.stargazers_count;
        case "forks": return b.forks_count - a.forks_count;
        case "name": return a.name.localeCompare(b.name);
        case "created": return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
        default: return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
      }
    });
    return r;
  }, [repos, q, sort, lang]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => { setPage(1); }, [q, sort, lang]);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="px-4 py-6 max-w-3xl mx-auto">
      <Reveal>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold">Repositories</h2>
          <span className="text-xs text-muted-foreground">({filtered.length})</span>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="space-y-2 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search repos..."
              className="w-full pl-9 pr-3 py-2 bg-muted/40 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-muted/40 border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {allLangs.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="updated">Recently Updated</option>
              <option value="stars">Most Stars</option>
              <option value="forks">Most Forks</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </Reveal>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass-card h-24 animate-pulse" />)}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="glass-card p-6 text-center text-sm text-muted-foreground">
          {q || lang !== "All" ? "No repos match your filters." : "No public repos yet."}
        </div>
      )}

      <div className="space-y-2.5">
        {pageItems.map((r, i) => {
          const color = LANGUAGE_COLORS[r.language || ""] || LANGUAGE_COLORS.default;
          return (
            <Reveal key={r.id} delay={i * 40}>
              <a
                href={r.html_url}
                target="_blank" rel="noopener noreferrer"
                className="group flex items-start gap-3 p-3 glass-card transition hover:border-primary/40 hover:-translate-y-0.5"
              >
                <div
                  className="p-2 rounded-lg shrink-0"
                  style={{ background: `${color}1a`, border: `1px solid ${color}40` }}
                >
                  <FolderGit2 className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm truncate group-hover:text-primary transition">{r.name}</h3>
                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0" />
                  </div>
                  {r.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{r.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-muted-foreground">
                    {r.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                        {r.language}
                      </span>
                    )}
                    <span className="flex items-center gap-0.5"><Star className="w-3 h-3" />{formatNumber(r.stargazers_count)}</span>
                    <span className="flex items-center gap-0.5"><GitFork className="w-3 h-3" />{formatNumber(r.forks_count)}</span>
                    <span className="flex items-center gap-0.5 ml-auto"><Clock className="w-3 h-3" />{timeAgo(r.pushed_at)}</span>
                  </div>
                </div>
              </a>
            </Reveal>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-muted/50 border border-border hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-7 h-7 text-xs rounded-md font-mono transition ${
                  page === i + 1
                    ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.5)]"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-muted/50 border border-border hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
};
