import { dayKey } from "./activity";

const STORE = "hiamjaden.visits.v1";
const GUARD = "hiamjaden.visited";

export type VisitHistory = { total: number; days: Record<string, number> };

export type VisitReport = {
  count: number;
  origin: "github-counter" | "device";
  history: { date: string; count: number }[];
  recorded: number;
};

const read = (): VisitHistory => {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return { total: 0, days: {} };
    const parsed = JSON.parse(raw) as Partial<VisitHistory>;
    return {
      total: Number.isFinite(parsed.total) ? Number(parsed.total) : 0,
      days: parsed.days && typeof parsed.days === "object" ? parsed.days : {},
    };
  } catch {
    return { total: 0, days: {} };
  }
};

const write = (value: VisitHistory) => {
  try {
    localStorage.setItem(STORE, JSON.stringify(value));
  } catch {}
};

export function recordVisit(): VisitHistory {
  const current = read();
  const today = dayKey(new Date());
  try {
    if (sessionStorage.getItem(GUARD) === today) return current;
    sessionStorage.setItem(GUARD, today);
  } catch {}
  const next: VisitHistory = {
    total: current.total + 1,
    days: { ...current.days, [today]: (current.days[today] ?? 0) + 1 },
  };
  const keep = Object.entries(next.days).slice(-90);
  write({ total: next.total, days: Object.fromEntries(keep) });
  return next;
}

export function visitHistory(limit = 14): { date: string; count: number }[] {
  const days = read().days;
  const out: { date: string; count: number }[] = [];
  for (let i = limit - 1; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 86_400_000);
    const key = dayKey(d);
    out.push({ date: key, count: days[key] ?? 0 });
  }
  return out;
}

export async function fetchCounter(username: string, timeoutMs = 4000): Promise<number | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`https://komarev.com/ghpvc/api/v1/user/${username}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { total?: number | string; count?: number | string };
    const value = Number(data?.total ?? data?.count);
    return Number.isFinite(value) ? Math.round(value) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function buildVisitReport(username: string): Promise<VisitReport> {
  const local = recordVisit();
  const remote = await fetchCounter(username);
  const history = visitHistory();
  if (remote !== null) {
    return { count: remote, origin: "github-counter", history, recorded: local.total };
  }
  return { count: local.total, origin: "device", history, recorded: local.total };
}
