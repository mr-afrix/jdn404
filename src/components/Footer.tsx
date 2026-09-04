import { ArrowUp, Github, Heart } from "lucide-react";
import { useGitHubUser } from "@/hooks/useGitHub";
import { GITHUB_USERNAME, formatDate } from "@/lib/github";
import { HANDLE, IDENTITY, PLATFORMS, SECTIONS } from "@/lib/identity";

export const Footer = () => {
  const { data: user } = useGitHubUser();
  const year = new Date().getFullYear();
  const joined = formatDate(user?.created_at);

  return (
    <footer className="mt-8 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,0.6fr))]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-mono text-[13px] font-semibold text-primary-foreground">
              h
            </span>
            <div>
              <p className="font-semibold leading-tight tracking-tight">{HANDLE}</p>
              <p className="text-[11px] text-muted-foreground">
                {IDENTITY.role}, {IDENTITY.location}
              </p>
            </div>
          </div>
          <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-muted-foreground">{IDENTITY.bio}</p>
          <div className="mt-4 flex items-center gap-2">
            {PLATFORMS.map((platform) => (
              <a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noreferrer noopener"
                className="brand-tile h-8 w-8"
                style={{ "--brand": platform.accent } as React.CSSProperties}
                aria-label={`${platform.label} profile of ${platform.handle}`}
                title={platform.label}
              >
                <platform.Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">Navigate</p>
          <ul className="mt-3 space-y-1.5">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="link-quiet text-[13px]">
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Account</p>
          <ul className="mt-3 space-y-1.5 text-[13px] text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <Github className="h-3.5 w-3.5" />
              <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer noopener" className="link-quiet">
                {user?.login ?? HANDLE}
              </a>
            </li>
            <li>{user ? `on GitHub since ${joined}` : "reading account data"}</li>
            <li>{IDENTITY.timezone.replace("_", " ")}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-4 sm:px-8">
          <p className="text-[11.5px] text-muted-foreground">
            © {year} {HANDLE}. Activity, repositories and stats come straight from the GitHub REST API.
          </p>
          <p className="ml-auto hidden text-[11.5px] text-muted-foreground sm:block">
            press <kbd className="rounded border border-line bg-card2 px-1 font-mono text-[10px]">/</kbd> to filter
            repositories,{" "}
            <kbd className="rounded border border-line bg-card2 px-1 font-mono text-[10px]">t</kbd> to switch theme
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="ml-auto grid h-9 w-9 place-items-center rounded-lg border border-line bg-card text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:text-foreground sm:ml-0"
            aria-label="Back to top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="hairline" />
      <p className="flex items-center justify-center gap-1.5 py-4 text-[11px] text-muted-foreground">
        Built by hand with React, TypeScript and Tailwind
        <Heart className="h-3 w-3 fill-current text-destructive" />
      </p>
    </footer>
  );
};
