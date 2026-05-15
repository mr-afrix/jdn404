import { BarChart3 } from "lucide-react";
import { useGitHubRepos } from "@/hooks/useGitHub";
import { languageBreakdown } from "@/lib/github";
import { Reveal } from "./Reveal";

export const Languages = () => {
  const { data: repos } = useGitHubRepos();
  const langs = repos ? languageBreakdown(repos).slice(0, 6) : [];
  if (langs.length === 0) return null;

  const C = 2 * Math.PI * 42;
  let offset = 0;

  return (
    <section className="px-4 py-6 max-w-3xl mx-auto">
      <Reveal>
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Most Used Languages</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 items-center">
            {/* Multi-segment ring */}
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                {langs.map((l) => {
                  const len = (l.percentage / 100) * C;
                  const seg = (
                    <circle
                      key={l.name}
                      cx="50" cy="50" r="42" fill="none"
                      stroke={l.color}
                      strokeWidth="10"
                      strokeDasharray={`${len} ${C}`}
                      strokeDashoffset={-offset}
                      style={{ filter: `drop-shadow(0 0 4px ${l.color}88)` }}
                    />
                  );
                  offset += len;
                  return seg;
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold">{langs.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Languages</div>
              </div>
            </div>

            <div className="flex-1 w-full space-y-2">
              {langs.map((l) => (
                <div key={l.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                      <span className="font-medium">{l.name}</span>
                    </div>
                    <span className="text-muted-foreground font-mono">{l.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${l.percentage}%`, background: l.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
