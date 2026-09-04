import { useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderGit2,
  GitFork,
  Scale,
  Search,
  Star,
  Tag,
} from "lucide-react";
import { useGitHubRepos } from "@/hooks/useGitHub";
import { LANGUAGE_COLORS, formatNumber, ownRepos, timeAgo } from "@/lib/github";
import { HANDLE } from "@/lib/identity";
import { Reveal } from "./Reveal";
import { Panel } from "./Panel";

type SortKey = "updated" | "stars" | "forks" | "name" | "created";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "updated", label: "Recently pushed" },
  { id: "stars", label: "Most stars" },
  { id: "forks", label: "Most forks" },
  { id: "name", label: "Name" },
  { id: "created", label: "Newest" },
];

const PAGE_SIZE = 6;

export const Work = () => {
  const { data: repos, isLoading } = useGitHubRepos();
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("All");
  const [sort, setSort] = useState<SortKey>("updated");
  const [page, setPage] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true, loop: false });
  const [selected, setSelected] = useState(0);

  const own = useMemo(() => ownRepos(repos), [repos]);

  const languages = useMemo(() => {
    const set = new Set<string>();
    own.forEach((r) => r.language && set.add(r.language));
    return ["All", ...[...set].sort()];
  }, [own]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = own.filter((r) => {
      if (language !== "All" && r.language !== language) return false;
      if (!needle) return true;
      return (
        r.name.toLowerCase().includes(needle) ||
        (r.description ?? "").toLowerCase().includes(needle) ||
        (r.topics ?? []).some((t) => t.includes(needle))
      );
    });
    const byDate = (a: string, b: string) => new Date(b).getTime() - new Date(a).getTime();
    return [...list].sort((a, b) => {
      switch (sort) {
        case "stars":
          return b.stargazers_count - a.stargazers_count;
        case "forks":
          return b.forks_count - a.forks_count;
        case "name":
          return a.name.localeCompare(b.name);
        case "created":
          return byDate(a.created_at, b.created_at);
        default:
          return byDate(a.pushed_at, b.pushed_at);
      }
    });
  }, [own, query, language, sort]);

  const featured = useMemo(
    () => [...own].sort((a, b) => b.stargazers_count - a.stargazers_count || byPushed(b) - byPushed(a)).slice(0, 6),
    [own],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => setPage(0), [query, language, sort]);
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const focus = () => {
      document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => inputRef.current?.focus(), 320);
    };
    window.addEventListener("focus-repo-search", focus);
    return () => window.removeEventListener("focus-repo-search", focus);
  }, []);

  const visible = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section id="work" className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <Reveal>
        <div className="mb-6 flex flex-wrap items-end gap-x-4 gap-y-2">
          <div>
            <p className="eyebrow">Work</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[1.7rem]">Public repositories</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {own.length} owned {own.length === 1 ? "repository" : "repositories"}, forks hidden
          </p>
          <a
            href={`https://github.com/${HANDLE}?tab=repositories`}
            target="_blank"
            rel="noreferrer noopener"
            className="link-quiet ml-auto inline-flex items-center gap-1.5 text-sm"
          >
            All repositories
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </Reveal>

      {featured.length > 1 && (
        <Reveal>
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-3">
                {featured.map((repo, i) => {
                  const tint = LANGUAGE_COLORS[repo.language ?? ""] ?? LANGUAGE_COLORS.default;
                  return (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="panel panel-hover w-[82%] shrink-0 p-4 sm:w-[49%]"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="grid h-8 w-8 place-items-center rounded-lg border"
                          style={{ borderColor: `${tint}55`, background: `${tint}14` }}
                        >
                          <Star className="h-4 w-4" style={{ color: tint }} />
                        </span>
                        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold">{repo.name}</h3>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="mt-2.5 line-clamp-2 min-h-[2.5em] text-[13px] leading-relaxed text-muted-foreground">
                        {repo.description || "No description yet. The readme carries the detail."}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full" style={{ background: tint }} />
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {formatNumber(repo.stargazers_count)}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          {formatNumber(repo.forks_count)}
                        </span>
                        <span className="ml-auto">{timeAgo(repo.pushed_at)}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                {featured.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => emblaApi?.scrollTo(i)}
                    aria-label={`Show featured repository ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === selected ? "w-6 bg-primary" : "w-1.5 bg-muted hover:bg-muted-foreground/60"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollPrev()}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-card text-muted-foreground transition-colors hover:border-primary/45 hover:text-foreground"
                  aria-label="Previous repository"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollNext()}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-card text-muted-foreground transition-colors hover:border-primary/45 hover:text-foreground"
                  aria-label="Next repository"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      <Reveal delay={60}>
        <Panel className="mt-3 p-3 sm:p-4">
          <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by name, description or topic"
                className="field py-2 pl-9 pr-3"
                aria-label="Filter repositories"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-card2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
                /
              </kbd>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="field appearance-none px-3 py-2 md:w-40"
              aria-label="Filter by language"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l === "All" ? "All languages" : l}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="field appearance-none px-3 py-2 md:w-44"
              aria-label="Sort repositories"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {isLoading && (
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-28" />
              ))}
            </div>
          )}

          {!isLoading && visible.length === 0 && (
            <div className="mt-3 rounded-lg border border-dashed border-line px-4 py-8 text-center">
              <FolderGit2 className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2.5 text-sm font-medium">
                {own.length === 0 ? "No public repositories yet" : "Nothing matches this filter"}
              </p>
              <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
                {own.length === 0
                  ? `Public work for ${HANDLE} shows up here the moment it is pushed. The list, the graphs and the language ring all read the same source.`
                  : "Try a different language or clear the search box."}
              </p>
              {own.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setLanguage("All");
                  }}
                  className="mt-3 rounded-lg border border-line bg-card2 px-3 py-1.5 text-xs transition-colors hover:border-primary/45"
                >
                  Reset filters
                </button>
              )}
            </div>
          )}

          {!isLoading && visible.length > 0 && (
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {visible.map((repo) => {
                const tint = LANGUAGE_COLORS[repo.language ?? ""] ?? LANGUAGE_COLORS.default;
                return (
                  <li key={repo.id}>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex h-full flex-col rounded-lg border border-line bg-card2/40 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-card2/70"
                    >
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="h-4 w-4 shrink-0 text-primary" />
                        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold group-hover:text-primary-bright">
                          {repo.name}
                        </h3>
                        {repo.archived && (
                          <span className="rounded border border-line px-1.5 py-px text-[10px] uppercase text-muted-foreground">
                            archived
                          </span>
                        )}
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">
                        {repo.description || "No description set"}
                      </p>
                      {(repo.topics?.length ?? 0) > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {repo.topics.slice(0, 3).map((topic) => (
                            <span key={topic} className="flex items-center gap-1 rounded border border-line px-1.5 py-px text-[10px] text-muted-foreground">
                              <Tag className="h-2.5 w-2.5" />
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2.5 text-[11px] text-muted-foreground">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full" style={{ background: tint }} />
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {formatNumber(repo.stargazers_count)}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          {formatNumber(repo.forks_count)}
                        </span>
                        {repo.license?.spdx_id && repo.license.spdx_id !== "NOASSERTION" && (
                          <span className="flex items-center gap-1">
                            <Scale className="h-3 w-3" />
                            {repo.license.spdx_id}
                          </span>
                        )}
                        <span className="ml-auto">{timeAgo(repo.pushed_at)}</span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}

          {pageCount > 1 && (
            <div className="mt-3.5 flex items-center justify-between border-t border-line pt-3">
              <span className="font-mono text-[11px] text-muted-foreground">
                page {page + 1} of {pageCount}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted-foreground transition-colors hover:border-primary/45 hover:text-foreground disabled:opacity-35 disabled:hover:border-line"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i)}
                    className={`h-8 min-w-8 rounded-lg px-2 font-mono text-xs transition-colors ${
                      i === page
                        ? "bg-primary text-primary-foreground"
                        : "border border-line text-muted-foreground hover:border-primary/45 hover:text-foreground"
                    }`}
                    aria-label={`Page ${i + 1}`}
                    aria-current={i === page}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                  disabled={page >= pageCount - 1}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted-foreground transition-colors hover:border-primary/45 hover:text-foreground disabled:opacity-35 disabled:hover:border-line"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </Panel>
      </Reveal>
    </section>
  );
};

const byPushed = (repo: { pushed_at: string }) => new Date(repo.pushed_at).getTime();
