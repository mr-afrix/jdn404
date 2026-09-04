# hiamjaden

Profile site for the account `hiamjaden`. It reads the public GitHub API at runtime, so every number on the page
comes from the account itself. There is no build-time data and no hard-coded stats.

## Handles

One name across every platform. The list lives in `src/lib/identity.ts` and drives the profile card, the connect
grid and the footer.

| Platform  | Handle      | Link                            |
| --------- | ----------- | ------------------------------- |
| GitHub    | `hiamjaden` | github.com/hiamjaden            |
| Instagram | `hiamjaden` | instagram.com/hiamjaden         |
| Telegram  | `hiamjaden` | t.me/hiamjaden                  |
| X         | `hiamjaden` | x.com/hiamjaden                 |
| npm       | `hiamjaden` | npmjs.com/~hiamjaden            |
| PyPI      | `hiamjaden` | pypi.org/user/hiamjaden         |

Change the handle once in `identity.ts` and the whole site follows.

## What is on the page

- Profile card with avatar, live local time, and the handle table
- Contribution graph built from the public events feed, 53 weeks, with day readout and streaks
- Commits per day for the last 30 days, plus active days and totals
- Profile view counter, which falls back to a device counter when the remote counter is unreachable
- Public event timeline
- Featured repositories carousel, then a searchable, filterable and paginated repository list
- Language ring computed from repository languages
- Tool groups, where tools detected in the repositories are highlighted
- Connect grid with round brand tiles, copy link on every tile, and copyable package commands

## Layout

```
src
  components   sections and shared pieces
  hooks        query hooks, animation hooks, theme, copy
  lib          identity, github client, activity maths, visit counter
  pages        Index, the page composition
```

`src/lib/activity.ts` holds the contribution maths and nothing else, so the graph can be tested or reused without
pulling in React.

## Running it

```
npm install
npm run dev
```

Scripts: `dev`, `build`, `preview`, `typecheck`.

## API token

Unauthenticated GitHub requests are limited to 60 per hour per IP. For heavier use, copy `.env.example` to `.env`
and set a token with `repo` scope removed, it only needs public reads.

```
VITE_GITHUB_TOKEN=ghp_xxx
```

The token is read through `import.meta.env`, so it ships in the bundle. Only use a public, read-only token, and keep
it out of the repository.

## Keyboard

- `/` jumps to the repository filter
- `t` switches between the dark and light theme
- `Tab` and the arrow keys reach every control

## Theme

Dark by default, with the choice stored in `localStorage` and applied before first paint. Tokens are plain HSL
custom properties at the top of `src/index.css`, light and dark sets sit next to each other. Motion respects
`prefers-reduced-motion` and the graphs still draw without it.

## Deploy

Static build, so GitHub Pages, Netlify or Cloudflare Pages all work. Set the base path in `vite.config.ts` if the
site is not served from the domain root.
