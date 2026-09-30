# marcusgafka.com — notes for Claude

Marcus Gafka's personal portfolio (WPI Robotics + Mechanical Engineering, FRC 190 mentor,
DEKA/NASA intern). Live at https://marcusgafka.com. Modeled on a friend's repo in
`../elliot_repo/Portfolio` (Vite + TS SPA) but simpler. Read this first every session.

## Hard rules
- **Never commit `planning/`.** It's git-ignored and holds private files (resume with home
  address/phone, raw photos). A past slip pushed it once and history had to be scrubbed.
  Before any commit, check `git status` and never use `git add -A` without looking.
- **Work on `dev`; only `live` deploys.** Don't push to `live` unless Marcus says to publish
  ("push"/"publish"/"merge to live").
- Strip metadata (GPS!) from phone photos before they go in `public/` — re-save via Pillow.
- Force-pushes / history rewrites are blocked by the permission classifier; give Marcus the
  command to run with `!` instead.

## Stack
Vite 8 + vanilla TypeScript (no framework), plain CSS, `showdown` (Markdown) + `highlight.js`,
Vitest + happy-dom. Node 22 via nvm (`export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"`).
Bundled npm 10 crashes on fresh installs (arborist "edgesOut"): use `npx npm@11 install <pkg>`.

```bash
npm run dev          # localhost:5173, shows drafts/placeholders
npm run test         # vitest (~65 tests, all must pass)
npm run build        # tsc + vite build → dist/ (production: drafts hidden)
npm run build:drafts # production build that still shows drafts
npm run preview      # serve dist/
```

## Branches & deploy
- `live` (default branch) → GitHub Actions (`.github/workflows/deploy.yml`) tests, builds,
  deploys to GitHub Pages. `dev` → tests only. PRs to `live` run tests.
- Publish: `git switch live && git merge dev && git push && git switch dev`.
- Drafts (placeholder projects, empty paragraph posts) are in the code on both branches;
  the production build hides them (`src/utils/drafts.ts`, `SHOW_DRAFTS`).
- Domain: GoDaddy DNS → GitHub Pages (A records 185.199.108–111.153, `www` CNAME →
  `marcus-gafka.github.io`), `public/CNAME`, HTTPS enforced. Repo:
  github.com/marcus-gafka/marcusgafka_website (public).
- WPI's campus network blocks marcusgafka.com ("newly-registered-domain"); curl from this
  machine fails/503s. Verify deploys via `gh run` / GitHub instead.
- Analytics: GoatCounter (`marcusgafka.goatcounter.com`), code in `src/data/profile.ts`,
  per-route page views in `src/utils/analytics.ts`.

## Content workflow: `planning/` → site
Marcus writes everything in `planning/` (see `planning/README.md`). "Update the website from
planning" / "reread planning" = read it and sync to the site.
- `planning/<section>/_section.md` → `src/data/sections.ts` (title, sidebar label, intro,
  links, groups, `highlights` hero cards). Folders: `home/`, `about/`, `work/`, `wpi/`,
  `robotics/` (Competitive Robotics, section id `robotics`; old `#/190` URLs redirect via
  `sectionAliases`), `personal/`, plus `_unsorted/`, `_archive/`.
- `planning/<section>/<project>/website.md` = exact site text. YAML header → the entry in
  `src/data/projects/projects.ts`; body → `src/data/projects/<id>/<Name>.md`.
  Header fields: `title, status (live|draft), group, date, sort (YYYY-MM), order, role,
  summary, tags, image, links`. `type: paragraph` folders → `textPosts` in sections.ts
  (`before: <project-id>` positions one).
- Media conventions in planning Markdown (translate to site HTML when syncing):
  - single image before a bullet list → `<figure class="figure-inline">` (floats beside list)
  - single image on its own → plain `<figure>` (full width)
  - consecutive image lines → `<div class="figure-row">` (add `no-crop` for screenshots,
    charts, portrait photos, and videos)
  - `![Caption](clip.mov|mp4)` → transcoded silent looping clip `<figure class="video-clip">`
    (seamless: rounded border like images, no controls/fullscreen/PiP, not tappable; `makeSeamless()` in markdown.ts
    applies to every `.video-clip video`, including hand-written HTML)
  - `![Caption](youtube URL)` → YouTube embed (Markdown renderer handles it directly)
  - `> text` blockquote → highlighted note/callout box (e.g. the DEKA NDA note)
- Planning references original filenames (e.g. `trophies/IMG_9703.MOV`); site copies get
  descriptive names in `public/assets/projects/<id>/`.
- Media tools (not installed system-wide): make a venv in the scratchpad and
  `pip install pillow pillow-heif imageio-ffmpeg`. Photos: exif_transpose, max ~1400px,
  JPEG q82, no exif. Videos: `-an -vf scale=-2:960 -c:v libx264 -crf 26 -movflags +faststart`
  + a `-poster.jpg` frame.

## Code map
- `index.html`, `src/main.ts` — builds `.layout` = sidebar + `<main id="content">`, starts
  analytics + router.
- `src/router.ts` — hash routes: `#/` home, `#/<section>`, `#/<section>/<project-id>`,
  `#/about`, `#/resume`; sets title, highlights nav, reports page views.
- `src/data/`
  - `profile.ts` — name, headshots, hero text (`heroIntro`, `heroLinks` with optional
    multi-word `lead` that highlights on hover), email, GoatCounter code, resume path (empty).
  - `sections.ts` — sidebar sections, their groups, `highlights`, `textPosts`,
    `sectionAliases`, `logos`; `visibleTextPosts()`. Long paragraph posts can live in
    `src/data/<section>/*.md` (e.g. `wpi/scholarship.md`).
  - `projects/projects.ts` — `allProjects` (full entries + `placeholder({...})` drafts),
    `projects` (drafts filtered), `sortNewestFirst`, `recentProjects` (home featured = 3
    newest non-work, non-draft), `projectsInSection`, `findProject`.
  - `about.md` — About page Markdown.
- `src/pages/` — `home.ts` (hero + featured), `section.ts` (blog feed grouped like the right
  panel, newest first; text posts), `projectDetail.ts` (write-up + right panel), `about.ts`,
  `resume.ts`, `notFound.ts`.
- `src/components/` — `sidebar.ts` (headshot, nav, phone ☰ menu), `projectNav.ts` (right
  panel; becomes "Jump to"/"More in…" swipe strip ≤1100px), `projectCard.ts` (home cards),
  `contactLinks.ts` ("Email me" link), `linkList.ts`, `techTags.ts`.
- `src/utils/` — `markdown.ts` (showdown, highlight.js, YouTube + video-clip embeds,
  reduced-motion), `drafts.ts`, `analytics.ts`, `html.ts` (escapeHtml).
- `src/styles/` — `variables.css` (palette + sizes), `base.css`, `layout.css` (sidebar,
  phone top bar/menu), `components.css` (buttons, cards, tags, Markdown figures/videos),
  `pages.css` (hero, home one-screen fit, phone home), `feed.css` (posts, right panel/strip).
- `tests/` — one file per area; `projects.test.ts` checks every image/video path exists.
- `README.md` — human-facing overview (may lag behind this file).

## Design decisions (keep unless Marcus changes them)
- Section structure: WPI = title with logos to its right (WPI wordmark, sized to the title; Gompei pending a file from Marcus —
  the athletics logo online is copyrighted/fair-use only, don't pull it) + hero highlight cards →
  Scholarship (paragraph post with both 2023 submission videos, FRC + VEX, from
  youtube.com/@marcusgafka) → Robotics Honor Society (Rho Beta Epsilon) → Coursework · Current →
  Coursework · Completed. Competitive Robotics is reverse-chronological
  by group: FRC 190 season → FRC 190 off-season → WPI RRC → high school FRC 118 → VEX 2373M →
  "Where It Started" (early/BEST). Honor society entry has no `sortDate` so it's never featured.
- Palette: bg `#0f0e0e`, text `#fbf5f3`, accent sage `#8daa9d` (headings/links/hover word),
  details plum `#522b47` (tags) and burgundy `#7b0828` (rules, active-nav bar; never text).
  Sidebar is sage with black text; active nav = black pill, white text, burgundy bar.
- Home: hero lines link to sections; hovering grows/bolds the lead in sage. Line height is
  fixed so hover never shifts layout. ≥1140px wide the home page fills exactly one screen
  (featured photos flex); on phones everything through "Featured Projects" fits one screen
  (tested down to iPhone SE 375×548). Hero lines aren't links on phones/touch.
- Right panel: full-height, flush to the window's right edge, sticky; feed centered left of it.
- Breakpoints: 760px (phone top bar + menu), 1100px (right panel → strip), 1140px (home
  one-screen mode).
- Verify visual changes with headless Chrome screenshots (`google-chrome --headless=new`,
  serve `dist/` with `python3 -m http.server`); append `.page{opacity:1!important}` to the
  copied CSS so the fade-in doesn't blank screenshots.

## Open items (as of 2026-09-29)
- Many placeholders (drafts) await write-ups: MQP, RBE4540/4701, ME3902, RBE2001, AR1100/2750,
  Doom Spiral/Turnover, V3, Whiplash, Trophies (RRC), FRC 118, VEX 2373M, BEST, all Personal
  projects, paragraph posts (Why I Love FRC, What Is the WPI RRC?, Early Robotics Interest,
  Art in Engineering).
- WPI Dean's List isn't on the resume; ask Marcus for terms before adding a highlight.
- Missing dates for IQP-adjacent courses (RBE2002, RBE1001, ME3310) → undated, sorted last.
- NASA page: bullet says ordering sheet for 40 trophies but photo shows 44 — ask before changing.
- Ask WPI IT to unblock the domain (ticket link on the block page, `http://marcusgafka.com`).
- Old commit `10b56f4` with the resume may still be cached by GitHub (support purge request).
