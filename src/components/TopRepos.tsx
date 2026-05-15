import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, GitFork, ExternalLink, Flame, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useGitHubRepos } from "@/hooks/useGitHub";
import { LANGUAGE_COLORS, timeAgo, formatNumber } from "@/lib/github";
import { Reveal } from "./Reveal";

export const TopRepos = () => {
  const { data: repos } = useGitHubRepos();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false, dragFree: true });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  if (!repos) return null;
  const top = [...repos].filter((r) => !r.fork).sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 8);
  if (top.length === 0) return null;

  return (
    <section className="px-4 py-6 max-w-3xl mx-auto">
      <Reveal>
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold">Top Repositories</h2>
          <div className="ml-auto flex gap-1">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted border border-border hover:border-primary/40 transition"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted border border-border hover:border-primary/40 transition"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
          <div className="flex gap-3">
            {top.map((r, i) => {
              const color = LANGUAGE_COLORS[r.language || ""] || LANGUAGE_COLORS.default;
              return (
                <a
                  key={r.id}
                  href={r.html_url}
                  target="_blank" rel="noopener noreferrer"
                  className="group relative shrink-0 w-[78%] sm:w-[48%] glass-card p-4 transition hover:-translate-y-1 hover:border-primary/40"
                >
                  <div className="absolute top-3 right-3 text-xs font-mono text-muted-foreground">#{i + 1}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg" style={{ background: `${color}22`, border: `1px solid ${color}55` }}>
                      <Star className="w-4 h-4" style={{ color }} fill={color} />
                    </div>
                    <h3 className="font-semibold text-sm truncate group-hover:text-primary transition">{r.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.4em] mb-3">
                    {r.description || "No description provided"}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    {r.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                        {r.language}
                      </span>
                    )}
                    <span className="flex items-center gap-0.5"><Star className="w-3 h-3" />{formatNumber(r.stargazers_count)}</span>
                    <span className="flex items-center gap-0.5"><GitFork className="w-3 h-3" />{formatNumber(r.forks_count)}</span>
                    <span className="flex items-center gap-0.5 ml-auto"><Eye className="w-3 h-3" />{timeAgo(r.pushed_at)}</span>
                  </div>
                  <ExternalLink className="absolute bottom-3 right-3 w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                </a>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {top.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${i === selected ? "w-6 bg-primary" : "w-1.5 bg-muted"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
