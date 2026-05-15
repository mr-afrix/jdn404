import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { useGitHubUser, useGitHubRepos } from "@/hooks/useGitHub";

export const Loader = () => {
  const { isLoading: u } = useGitHubUser();
  const { isLoading: r } = useGitHubRepos();
  const loading = u || r;
  const [hide, setHide] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) {
      setProgress(100);
      const t = setTimeout(() => setHide(true), 500);
      return () => clearTimeout(t);
    }
    const i = setInterval(() => setProgress((p) => Math.min(p + Math.random() * 12, 92)), 300);
    return () => clearInterval(i);
  }, [loading]);

  if (hide) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        !loading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse" />
        <div className="relative w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center">
          <Github className="w-10 h-10 text-primary animate-pulse" />
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="48"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray={`${(progress / 100) * 301.6} 301.6`}
              className="transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      <div className="mt-6 font-mono text-sm text-primary">Fetching GitHub data...</div>
      <div className="mt-3 w-48 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-muted-foreground font-mono">{Math.floor(progress)}%</div>
    </div>
  );
};
