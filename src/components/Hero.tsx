import { Github, MapPin, Calendar, Briefcase, Users, BookOpen, Star } from "lucide-react";
import { useGitHubUser, useGitHubRepos, useTyping } from "@/hooks/useGitHub";
import { formatDate, totalStars } from "@/lib/github";

const ROLES = ["Full Stack Developer", "Python Enthusiast", "Open Source Builder", "Tech Explorer"];

export const Hero = () => {
  const { data: user } = useGitHubUser();
  const { data: repos } = useGitHubRepos();
  const typed = useTyping(ROLES);
  const stars = repos ? totalStars(repos) : 0;

  return (
    <section className="relative w-full">
      {/* Banner */}
      <div className="relative h-32 sm:h-40 w-full overflow-hidden">
        <img
          src="https://files.catbox.moe/mqcr6p.jpg"
          alt="Banner"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.4),transparent_60%)]" />
      </div>

      <div className="relative px-4 -mt-14 max-w-3xl mx-auto">
        <div className="flex items-end gap-3 sm:gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl blur opacity-70 animate-pulse" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-background overflow-hidden bg-card">
              {user ? (
                <img src={user.avatar_url} alt={user.login} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Github className="w-8 h-8 text-primary" />
                </div>
              )}
            </div>
            {user?.hireable && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-background rounded-full animate-pulse" />
            )}
          </div>

          {/* Name + handle inline */}
          <div className="flex-1 min-w-0 pb-1">
            <h1 className="text-xl sm:text-2xl font-bold truncate glow-text">
              {user?.name || user?.login || "jdn404"}
            </h1>
            <a
              href={user?.html_url || "https://github.com/jdn404"}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-xs sm:text-sm"
            >
              <Github className="w-3.5 h-3.5" />@{user?.login || "jdn404"}
            </a>
          </div>
        </div>

        {/* Typing line */}
        <div className="mt-3 flex items-center gap-2 font-mono text-sm sm:text-base">
          <span className="text-primary">{">"}</span>
          <span className="text-foreground/90">{typed}</span>
          <span className="w-0.5 h-4 bg-primary animate-pulse" />
        </div>

        {/* Bio */}
        {user?.bio && (
          <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{user.bio}</p>
        )}

        {/* Meta chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          {user?.location && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted/60 rounded-md text-muted-foreground">
              <MapPin className="w-3 h-3" />{user.location}
            </span>
          )}
          {user?.hireable && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/15 text-accent rounded-md">
              <Briefcase className="w-3 h-3" />Available
            </span>
          )}
          {user?.created_at && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted/60 rounded-md text-muted-foreground">
              <Calendar className="w-3 h-3" />Joined {formatDate(user.created_at)}
            </span>
          )}
        </div>

        {/* Quick stat row — compact, professional */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { icon: Users, label: "Followers", value: user?.followers ?? 0 },
            { icon: BookOpen, label: "Repos", value: user?.public_repos ?? 0 },
            { icon: Star, label: "Stars", value: stars },
          ].map((s) => (
            <div key={s.label} className="glass-card px-3 py-2.5 flex items-center gap-2">
              <s.icon className="w-4 h-4 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="text-base font-bold leading-none">{s.value}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
