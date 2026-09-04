import type { IconType } from "react-icons";
import { SiGithub, SiInstagram, SiNpm, SiPypi, SiTelegram, SiX } from "react-icons/si";

export const HANDLE = "hiamjaden";

export const IDENTITY = {
  handle: HANDLE,
  displayName: "hiamjaden",
  role: "Developer",
  bio: "I build small, fast tools for trading, automation and the web. Everything ships plain and readable.",
  location: "Harare, Zimbabwe",
  timezone: "Africa/Harare",
  availability: "Open to collaboration and paid work",
  lines: ["TypeScript and Python first", "Ship small, ship often", "No framework without a reason"],
  since: "2026",
};

export const ROLES = [
  "typescript engineer",
  "python developer",
  "trading tooling",
  "bot infrastructure",
  "open source",
] as const;

export type Platform = {
  id: string;
  label: string;
  kind: string;
  handle: string;
  url: string;
  accent: string;
  Icon: IconType;
  hint: string;
};

export const PLATFORMS: Platform[] = [
  {
    id: "github",
    label: "GitHub",
    kind: "Source",
    handle: `@${HANDLE}`,
    url: `https://github.com/${HANDLE}`,
    accent: "hsl(var(--foreground))",
    Icon: SiGithub,
    hint: "Repositories, commits and contribution history",
  },
  {
    id: "instagram",
    label: "Instagram",
    kind: "Social",
    handle: `@${HANDLE}`,
    url: `https://www.instagram.com/${HANDLE}/`,
    accent: "#e1417c",
    Icon: SiInstagram,
    hint: "Build logs, screenshots, short clips",
  },
  {
    id: "telegram",
    label: "Telegram",
    kind: "Direct",
    handle: `@${HANDLE}`,
    url: `https://t.me/${HANDLE}`,
    accent: "#2aabee",
    Icon: SiTelegram,
    hint: "Fastest way to reach me",
  },
  {
    id: "x",
    label: "X",
    kind: "Social",
    handle: `@${HANDLE}`,
    url: `https://x.com/${HANDLE}`,
    accent: "hsl(var(--foreground))",
    Icon: SiX,
    hint: "Release notes and short takes",
  },
  {
    id: "npm",
    label: "npm",
    kind: "Packages",
    handle: HANDLE,
    url: `https://www.npmjs.com/~${HANDLE}`,
    accent: "#cb3837",
    Icon: SiNpm,
    hint: "JavaScript packages I publish",
  },
  {
    id: "pypi",
    label: "PyPI",
    kind: "Packages",
    handle: HANDLE,
    url: `https://pypi.org/user/${HANDLE}`,
    accent: "#4b8bbe",
    Icon: SiPypi,
    hint: "Python packages I publish",
  },
];

export const platformById = (id: string) => PLATFORMS.find((p) => p.id === id);

export const CONTACT = {
  primary: platformById("telegram")!,
  source: platformById("github")!,
  packageScope: HANDLE,
};

export const SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "activity", label: "Activity" },
  { id: "work", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "connect", label: "Connect" },
];
