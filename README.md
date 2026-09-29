# marcusgafka.com

Personal portfolio of Marcus Gafka (Robotics & Mechanical Engineering at WPI), built with
**Vite**, vanilla **TypeScript**, and plain CSS, and deployed to **GitHub Pages** at
[marcusgafka.com](https://marcusgafka.com).

The site is a small single-page app: a sidebar with the main sections (Home, Work, WPI, 190,
Personal, About), a blog-style feed of projects for each section, a panel of project
thumbnails on the right, and a dedicated page for every project.

## Local development

Requires Node 22.

```bash
npm install            # install dependencies
npm run dev            # dev server at http://localhost:5173 (shows draft/placeholder pages)
npm run test           # run the Vitest suite
npm run build          # type-check + production build into dist/ (drafts hidden)
npm run build:drafts   # production build that still includes drafts
npm run preview        # serve dist/ locally (port 4173)
```

To try the phone layout, open DevTools (F12) and toggle the device toolbar (Ctrl+Shift+M),
or run `npm run dev -- --host` and open the printed Network address on a phone on the same
Wi-Fi.

## Branches and deployment

| Branch | Purpose | On push |
|---|---|---|
| `live` (default) | What's on marcusgafka.com | Tests, build, deploy to GitHub Pages |
| `dev` | Work in progress | Tests only |

Publish work from `dev`:

```bash
git switch live && git merge dev && git push && git switch dev
```

**Drafts.** Placeholder projects and empty paragraph posts live in the code on both branches
as reminders. The production build hides anything marked `draft`, so they appear locally but
never on the live site until they're written (`src/utils/drafts.ts`).

The custom domain is set by `public/CNAME`; DNS points `marcusgafka.com` at GitHub Pages.
Page views are counted with [GoatCounter](https://www.goatcounter.com/) (no cookies).

## Project layout

```text
├── .github/workflows/deploy.yml   # CI: test on live/dev, deploy live to GitHub Pages
├── public/
│   ├── CNAME                      # custom domain
│   ├── favicon.svg
│   └── assets/
│       ├── profile/               # sidebar headshot (+ close crop for phones)
│       └── projects/<id>/         # each project's images and video clips
├── src/
│   ├── main.ts                    # builds the layout, starts analytics and the router
│   ├── router.ts                  # hash routes: #/, #/<section>, #/<section>/<project>, #/about
│   ├── data/
│   │   ├── profile.ts             # name, headshot, home hero text, email, analytics code
│   │   ├── sections.ts            # sidebar sections, their groups, paragraph-only posts
│   │   ├── about.md               # About page
│   │   └── projects/
│   │       ├── projects.ts        # every project's details (title, date, tags, links, ...)
│   │       └── <id>/<Name>.md     # each project's write-up
│   ├── pages/                     # home, section feed, project page, about, resume, 404
│   ├── components/                # sidebar + phone menu, right panel/strip, cards, links, tags
│   ├── utils/                     # Markdown rendering, drafts, analytics, HTML escaping
│   └── styles/                    # variables (palette), layout, components, pages, feed
├── tests/                         # Vitest + happy-dom, one file per area
├── CLAUDE.md                      # detailed maintainer notes (structure, workflow, decisions)
└── vite.config.ts, tsconfig.json
```

## Editing content

Content is written in Markdown and TypeScript data files:

- **Home hero, name, email:** `src/data/profile.ts`
- **Sections** (title, intro, links, groups like *Current / Completed*): `src/data/sections.ts`
- **About page:** `src/data/about.md`
- **A project:**
  1. Write `src/data/projects/<id>/<Name>.md`.
  2. Import it in `src/data/projects/projects.ts` (with `?raw`) and add an entry: `id`,
     `section` (`work`, `wpi`, `190`, `personal`), `group`, `title`, `summary`, `date`,
     `sortDate` (`YYYY-MM`, newest first), `technologies`, `image`, `links`.
  3. Put media in `public/assets/projects/<id>/`.
  4. A `placeholder({...})` entry is a draft: listed locally, hidden on the live site.
- **The home page** features the three most recent finished projects automatically.

### Media in write-ups

| Markdown / HTML | Result |
|---|---|
| `<figure class="figure-inline">` before a bullet list | image floats beside the list |
| `<figure>` on its own | full-width image |
| `<div class="figure-row">` of `<figure>`s (`no-crop` to show images whole) | side-by-side row |
| `![Caption](/assets/projects/<id>/clip.mp4)` | silent, looping video clip |
| `![Caption](https://www.youtube.com/watch?v=...)` | embedded YouTube player |

`npm run test` checks, among other things, that every project belongs to a real section and
that every image and video path exists.
