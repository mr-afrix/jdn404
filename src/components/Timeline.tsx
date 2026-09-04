import { CircleDot, GitBranch, GitCommitHorizontal, GitFork, GitPullRequest, PackagePlus, Star, Tag } from "lucide-react";
import type { GitHubEvent } from "@/lib/github";
import { timeAgo } from "@/lib/github";
import { HANDLE } from "@/lib/identity";
import { useGitHubEvents } from "@/hooks/useGitHub";
import { Reveal } from "./Reveal";
import { Panel } from "./Panel";

const describe = (event: GitHubEvent) => {
  const repo = event.repo.name;
  const payload = event.payload ?? {};
  switch (event.type) {
    case "PushEvent": {
      const commits = payload.distinct_size ?? payload.size ?? 0;
      const branch = (payload.ref ?? "").replace("refs/heads/", "");
      return {
        Icon: GitCommitHorizontal,
        text: `pushed ${commits || 1} ${commits === 1 ? "commit" : "commits"} to ${branch || "a branch"} in ${repo}`,
      };
    }
    case "CreateEvent":
      return {
        Icon: payload.ref_type === "tag" ? Tag : GitBranch,
        text: `created ${payload.ref_type ?? "something"} ${payload.ref ?? ""} in ${repo}`.trim(),
      };
    case "ReleaseEvent":
      return { Icon: PackagePlus, text: `published a release in ${repo}` };
    case "PullRequestEvent":
      return { Icon: GitPullRequest, text: `${payload.action ?? "updated"} a pull request in ${repo}` };
    case "IssuesEvent":
      return { Icon: CircleDot, text: `${payload.action ?? "commented on"} an issue in ${repo}` };
    case "ForkEvent":
      return { Icon: GitFork, text: `forked ${repo}` };
    case "WatchEvent":
      return { Icon: Star, text: `starred ${repo}` };
    case "DeleteEvent":
      return { Icon: GitBranch, text: `deleted ${payload.ref ?? "a ref"} in ${repo}` };
    default:
      return { Icon: CircleDot, text: `${event.type.replace("Event", "").toLowerCase()} in ${repo}` };
  }
};

export const Timeline = () => {
  const { data: events = [], isLoading } = useGitHubEvents();
  const rows = events.slice(0, 9);

  return (
    <Reveal delay={120}>
      <Panel className="p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <GitCommitHorizontal className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Public event feed</h3>
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">{HANDLE}</span>
        </div>

        {isLoading && (
          <ul className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="skeleton h-9" />
            ))}
          </ul>
        )}

        {!isLoading && rows.length === 0 && (
          <p className="rounded-lg border border-dashed border-line px-3 py-5 text-center text-xs leading-relaxed text-muted-foreground">
            GitHub has no public events recorded for this account yet. Every push, release and star lands here
            automatically once there is activity.
          </p>
        )}

        {rows.length > 0 && (
          <ol className="relative space-y-2.5 pl-5">
            <span className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-primary/50 via-line to-transparent" />
            {rows.map((event) => {
              const { Icon, text } = describe(event);
              return (
                <li key={event.id} className="relative flex items-start gap-2.5">
                  <span className="absolute -left-5 top-1 grid h-3.5 w-3.5 place-items-center rounded-full border border-line bg-card">
                    <span className="h-1 w-1 rounded-full bg-primary" />
                  </span>
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <p className="min-w-0 flex-1 text-[12.5px] leading-snug">
                    <span className="text-foreground/90">{text}</span>
                    <span className="ml-1.5 whitespace-nowrap font-mono text-[10.5px] text-muted-foreground">
                      {timeAgo(event.created_at)}
                    </span>
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </Panel>
    </Reveal>
  );
};
