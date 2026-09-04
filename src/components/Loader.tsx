import { useEffect, useState } from "react";
import { useGitHubEvents, useGitHubRepos, useGitHubUser } from "@/hooks/useGitHub";
import { HANDLE } from "@/lib/identity";

const STAGES = ["connecting to github", "reading profile", "loading repositories", "building activity graph", "ready"];

export const Loader = () => {
  const user = useGitHubUser();
  const repos = useGitHubRepos();
  const events = useGitHubEvents();

  const jobs = [user, repos, events];
  const settled = jobs.filter((job) => job.isFetched || job.isError).length;
  const ready = settled === jobs.length;

  const [progress, setProgress] = useState(6);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const target = ready ? 100 : Math.min(90, 12 + settled * 26);
    const id = window.setInterval(() => {
      setProgress((prev) => {
        const gap = target - prev;
        if (gap <= 0.4) return target;
        return prev + Math.max(0.8, gap * 0.14);
      });
    }, 90);
    return () => window.clearInterval(id);
  }, [ready, settled]);

  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => setDismissed(true), 560);
    return () => window.clearTimeout(id);
  }, [ready]);

  if (dismissed) return null;

  const circumference = 2 * Math.PI * 46;
  const shown = Math.min(100, Math.max(0, Math.round(progress)));
  const stage = ready ? STAGES[STAGES.length - 1] : STAGES[Math.min(settled, STAGES.length - 2)];

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-background px-6 transition-all duration-500 ease-out"
      style={{
        opacity: ready ? 0 : 1,
        transform: ready ? "scale(1.04)" : "scale(1)",
        pointerEvents: ready ? "none" : "auto",
      }}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center">
        <div className="relative h-32 w-32" style={{ perspective: "900px" }}>
          <div className="gyro">
            <div className="gyro-ring" style={{ transform: "rotateY(60deg)" }} />
            <div className="gyro-ring" style={{ transform: "rotateY(-60deg)" }} />
            <div className="gyro-ring" style={{ transform: "rotateX(60deg)" }} />
            <div className="gyro-core">
              {[0, 90, 180, 270, 0, 0].map((deg, i) => (
                <span
                  key={`${deg}-${i}`}
                  className="gyro-face"
                  style={{
                    transform:
                      i < 4 ? `rotateY(${deg}deg) translateZ(0.66rem)` : `rotateX(${i === 4 ? 90 : -90}deg) translateZ(0.66rem)`,
                  }}
                />
              ))}
            </div>
          </div>
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="46" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="hsl(var(--primary-bright))"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${(shown / 100) * circumference} ${circumference}`}
              style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.7))", transition: "stroke-dasharray 0.25s linear" }}
            />
          </svg>
        </div>

        <div className="mt-8 font-mono text-[13px] tracking-tight text-primary">{stage}</div>
        <div className="mt-3 h-[3px] w-56 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${shown}%`, transition: "width 0.25s linear" }}
          />
        </div>
        <div className="mt-2.5 flex w-56 items-center justify-between font-mono text-[11px] text-muted-foreground tabular-nums">
          <span>{HANDLE}</span>
          <span>{shown}%</span>
        </div>
      </div>
    </div>
  );
};
