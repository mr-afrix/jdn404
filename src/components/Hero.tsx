import { useEffect, useState } from "react";
import { ArrowDownRight, Check, Copy, MapPin, Radio, Timer } from "lucide-react";
import { useGitHubRepos, useGitHubUser } from "@/hooks/useGitHub";
import { useCopy, useTilt, useTyping } from "@/hooks/useMotion";
import { formatNumber, ownRepos } from "@/lib/github";
import { HANDLE, IDENTITY, PLATFORMS, ROLES } from "@/lib/identity";
import { Reveal } from "./Reveal";

export const Hero = () => {
  const { data: user } = useGitHubUser();
  const { data: repos } = useGitHubRepos();
  const typed = useTyping(ROLES);
  const { copied, copy } = useCopy();
  const tilt = useTilt<HTMLDivElement>(6);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 20_000);
    return () => window.clearInterval(id);
  }, []);

  const name = user?.name || user?.login || IDENTITY.displayName;
  const handle = user?.login || HANDLE;
  const bio = user?.bio?.trim() || IDENTITY.bio;
  const location = user?.location?.trim() || IDENTITY.location;
  const count = ownRepos(repos).length;
  const joined = user?.created_at ? new Date(user.created_at).getFullYear() : Number(IDENTITY.since);

  const localTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: IDENTITY.timezone,
  }).format(now);

  return (
    <section id="profile" className="relative overflow-hidden pb-6 pt-24 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-orb left-[-10%] top-[-6rem] h-[26rem] w-[26rem] bg-primary/15" />
        <div
          className="glow-orb right-[-8%] top-24 h-[22rem] w-[22rem] bg-accent/10"
          style={{ animationDelay: "-8s" }}
        />
        <div className="grid-floor" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div>
          <Reveal>
            <div className="flex items-center gap-5">
              <div
                className="tilt relative h-32 w-32 shrink-0 sm:h-36 sm:w-36"
                ref={tilt.ref}
                onPointerMove={tilt.onPointerMove}
                onPointerLeave={tilt.onPointerLeave}
              >
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_210deg,hsl(var(--primary)),hsl(var(--accent)),hsl(var(--secondary)),hsl(var(--primary)))] opacity-70 blur-[14px]" />
                  <div className="absolute inset-[3px] overflow-hidden rounded-full border border-line bg-card">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={`${handle} avatar`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-card2 font-display text-3xl font-semibold text-primary">
                        hj
                      </div>
                    )}
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 grid h-7 w-7 place-items-center rounded-full border border-line bg-card shadow-panel">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="absolute h-2 w-2 rounded-full bg-primary animate-ping" />
                  </span>
                </div>
                <div className="orbit" aria-hidden="true">
                  {PLATFORMS.map((platform, i) => (
                    <span
                      key={platform.id}
                      className="orbit-node"
                      style={{ transform: `rotate(${i * (360 / PLATFORMS.length)}deg) translate(3.9rem)` }}
                    >
                      <span className="orbit-badge" style={{ color: platform.accent }}>
                        <platform.Icon size={14} />
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="min-w-0">
                <p className="eyebrow">{IDENTITY.role}</p>
                <h1 className="mt-1 truncate font-display text-3xl font-semibold tracking-tight sm:text-[2.6rem]">
                  {name}
                </h1>
                <a
                  href={`https://github.com/${handle}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-quiet font-mono text-sm"
                >
                  @{handle}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <p className="mt-6 flex min-h-7 items-center gap-2 font-mono text-sm sm:text-base">
              <span className="text-primary">$</span>
              <span className="text-foreground/90">{typed}</span>
              <span className="h-4 w-[2px] animate-caret bg-primary" />
            </p>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{bio}</p>
          </Reveal>

          <Reveal delay={210}>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="chip">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {location}
              </span>
              <span className="chip">
                <Timer className="h-3.5 w-3.5 text-accent" />
                {localTime} local
              </span>
              <span className="chip">
                <Radio className="h-3.5 w-3.5 text-secondary" />
                {IDENTITY.availability}
              </span>
              <span className="chip">
                <span className="font-mono text-foreground">{formatNumber(count)}</span>
                public repositories
              </span>
              <span className="chip">since {joined}</span>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lift transition-transform duration-300 hover:-translate-y-0.5"
              >
                <ArrowDownRight className="h-4 w-4" />
                Browse the work
              </a>
              <button
                type="button"
                onClick={() => copy(`@${handle}`)}
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-card px-4 py-2.5 text-sm transition-colors hover:border-primary/45"
              >
                {copied === `@${handle}` ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                {copied === `@${handle}` ? "Copied" : `Copy @${handle}`}
              </button>
              <a
                href={`https://t.me/${HANDLE}`}
                target="_blank"
                rel="noreferrer noopener"
                className="px-1 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Message on Telegram
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={180}>
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-line bg-card2/60 px-5 py-3">
              <p className="eyebrow">Handles</p>
              <span className="font-mono text-[11px] text-muted-foreground">{PLATFORMS.length} platforms</span>
            </div>
            <ul className="divide-y divide-line">
              {PLATFORMS.map((platform) => (
                <li key={platform.id}>
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-card2/70"
                  >
                    <span
                      className="brand-tile h-7 w-7"
                      style={{ "--brand": platform.accent } as React.CSSProperties}
                    >
                      <platform.Icon size={14} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-tight">{platform.label}</span>
                      <span className="block truncate font-mono text-[11px] text-muted-foreground">{platform.handle}</span>
                    </span>
                    <span className="hidden text-[11px] text-muted-foreground sm:block">{platform.kind}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="border-t border-line bg-card2/40 px-5 py-3">
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Same handle everywhere: <span className="font-mono text-foreground">{HANDLE}</span>
              </p>
              <ul className="mt-2 space-y-1">
                {IDENTITY.lines.map((line) => (
                  <li key={line} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
