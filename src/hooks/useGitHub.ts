import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { buildActivity } from "@/lib/activity";
import { fetchEvents, fetchRepos, fetchUser, GITHUB_USERNAME } from "@/lib/github";
import { buildVisitReport } from "@/lib/visits";

const FIVE_MINUTES = 5 * 60 * 1000;

export const useGitHubUser = (username = GITHUB_USERNAME) =>
  useQuery({
    queryKey: ["github", "user", username],
    queryFn: () => fetchUser(username),
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
    retry: 1,
  });

export const useGitHubRepos = (username = GITHUB_USERNAME) =>
  useQuery({
    queryKey: ["github", "repos", username],
    queryFn: () => fetchRepos(username),
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
    retry: 1,
  });

export const useGitHubEvents = (username = GITHUB_USERNAME) =>
  useQuery({
    queryKey: ["github", "events", username],
    queryFn: () => fetchEvents(username),
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
    retry: 1,
  });

export const useActivity = (username = GITHUB_USERNAME) => {
  const { data: events, ...rest } = useGitHubEvents(username);
  const activity = useMemo(() => buildActivity(events ?? []), [events]);
  return { activity, events: events ?? [], ...rest };
};

export const useProfileVisits = (username = GITHUB_USERNAME) =>
  useQuery({
    queryKey: ["visits", username],
    queryFn: () => buildVisitReport(username),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
