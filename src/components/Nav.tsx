import { useEffect, useState } from "react";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { useScrollSpy, useTheme } from "@/hooks/useMotion";
import { HANDLE, SECTIONS } from "@/lib/identity";

const IDS = SECTIONS.map((s) => s.id);

export const Nav = () => {
  const { dark, toggle } = useTheme();
  const active = useScrollSpy(IDS);
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        lifted ? "border-b border-line bg-background/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3 sm:px-8">
        <a href="#profile" className="group flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-mono text-[13px] font-semibold text-primary-foreground shadow-lift transition-transform duration-300 group-hover:-translate-y-0.5">
            h
          </span>
          <span className="font-semibold tracking-tight">{HANDLE}</span>
        </a>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`relative rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                active === section.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {section.label}
              <span
                className={`absolute inset-x-2.5 -bottom-0.5 h-px bg-primary transition-transform duration-300 ${
                  active === section.id ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-card text-muted-foreground transition-colors hover:border-primary/45 hover:text-foreground"
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            title={dark ? "Light theme" : "Dark theme"}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a
            href={`https://github.com/${HANDLE}`}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            Follow
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 pb-2 md:hidden">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors ${
              active === section.id
                ? "border-primary/50 bg-primary/10 text-foreground"
                : "border-line bg-card text-muted-foreground"
            }`}
          >
            {section.label}
          </a>
        ))}
      </div>
    </header>
  );
};
