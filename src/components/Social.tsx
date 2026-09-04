import { ArrowUpRight, Check, Copy, Package, Terminal } from "lucide-react";
import { useCopy } from "@/hooks/useMotion";
import { HANDLE, IDENTITY, PLATFORMS } from "@/lib/identity";
import { Reveal } from "./Reveal";
import { Panel } from "./Panel";

const COMMANDS = [
  { label: "npm", command: `npm view ${HANDLE}`, hint: "registry.npmjs.org" },
  { label: "pip", command: `pip index versions ${HANDLE}`, hint: "pypi.org" },
];

export const Social = () => {
  const { copied, copy } = useCopy();

  return (
    <section id="connect" className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <Reveal>
        <div className="mb-6 flex flex-wrap items-end gap-x-4 gap-y-2">
          <div>
            <p className="eyebrow">Connect</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[1.7rem]">Every handle, one name</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {PLATFORMS.length} accounts under <span className="font-mono text-foreground">{HANDLE}</span>
          </p>
        </div>
      </Reveal>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORMS.map((platform, i) => (
          <Reveal key={platform.id} delay={i * 55}>
            <Panel hover className="group relative h-full">
              <a
                href={platform.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex h-full items-center gap-3.5 p-4"
                style={{ "--brand": platform.accent } as React.CSSProperties}
              >
                <span className="brand-tile">
                  <platform.Icon size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold leading-tight">{platform.label}</span>
                    <span className="rounded-full border border-line px-1.5 py-px text-[10px] uppercase tracking-wider text-muted-foreground">
                      {platform.kind}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-xs text-primary">{platform.handle}</span>
                  <span className="mt-1 block truncate text-[11px] text-muted-foreground">{platform.hint}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-1" />
              </a>
              <button
                type="button"
                onClick={() => copy(platform.url)}
                className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-line hover:bg-card2 hover:text-foreground"
                aria-label={`Copy the ${platform.label} link`}
              >
                {copied === platform.url ? (
                  <Check className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </Panel>
          </Reveal>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Reveal delay={330}>
          <Panel className="flex h-full flex-col justify-between p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="relative grid h-8 w-8 place-items-center rounded-full bg-primary/10 border border-primary/30">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="absolute h-2 w-2 rounded-full bg-primary animate-ping" />
              </span>
              <h3 className="text-sm font-semibold">{IDENTITY.availability}</h3>
            </div>
            <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
              Best contact route is Telegram, replies usually land the same day. For code, open an issue on the
              repository first so the context stays with the project.
            </p>
            <a
              href={`https://t.me/${HANDLE}`}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3.5 inline-flex w-fit items-center gap-1.5 rounded-lg border border-line bg-card2 px-3 py-1.5 text-xs transition-colors hover:border-primary/45"
            >
              Start a chat
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </Panel>
        </Reveal>

        <Reveal delay={390}>
          <Panel className="h-full p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-secondary" />
              <h3 className="text-sm font-semibold">Packages</h3>
              <span className="ml-auto font-mono text-[11px] text-muted-foreground">same username</span>
            </div>
            <ul className="space-y-2">
              {COMMANDS.map((row) => (
                <li
                  key={row.command}
                  className="flex items-center gap-2 rounded-lg border border-line bg-background/50 px-3 py-2"
                >
                  <Terminal className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <code className="min-w-0 flex-1 truncate font-mono text-[11.5px]">{row.command}</code>
                  <span className="hidden shrink-0 text-[10px] text-muted-foreground sm:block">{row.hint}</span>
                  <button
                    type="button"
                    onClick={() => copy(row.command)}
                    className="grid h-6 w-6 shrink-0 place-items-center rounded text-muted-foreground transition-colors hover:bg-card2 hover:text-foreground"
                    aria-label={`Copy the ${row.label} command`}
                  >
                    {copied === row.command ? (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              Published packages live under the same name on both registries. Nothing is installed from this page, the
              commands are here to copy.
            </p>
          </Panel>
        </Reveal>
      </div>
    </section>
  );
};
