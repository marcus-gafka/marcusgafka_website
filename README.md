# marcusgafka.com

Personal portfolio site for Marcus Gafka, built with **Vite**, **TypeScript**, and plain CSS,
and deployed to **GitHub Pages** at [marcusgafka.com](https://marcusgafka.com).

## Project Layout

```text
├── .github/workflows/deploy.yml   # Test → build → deploy to GitHub Pages on push to main
├── public/
│   ├── CNAME                      # Custom domain for GitHub Pages
│   ├── assets/projects/           # Project images and videos
│   └── resume/                    # Resume PDF (Marcus_Gafka_Resume.pdf)
├── src/
│   ├── components/                # Sidebar, project cards, tech tags, contact links
│   ├── data/
│   │   ├── profile.ts             # Name, tagline, links, resume path
│   │   ├── about.md               # About page content
│   │   └── projects/              # projects.ts + one folder of Markdown per project
│   ├── pages/                     # Home, Projects, Project detail, About, Resume, 404
│   ├── styles/                    # CSS variables and styles
│   ├── utils/                     # Markdown rendering, HTML escaping
│   ├── main.ts                    # App entry point
│   └── router.ts                  # Hash router (#/projects/<id>)
└── tests/                         # Vitest tests
```

## Local Development

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:5173
npm run test     # run tests
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## Editing Content

- **Your info:** edit `src/data/profile.ts`.
- **About page:** edit `src/data/about.md`.
- **Resume:** drop your PDF at `public/resume/Marcus_Gafka_Resume.pdf`.
- **Add a project:**
  1. Create `src/data/projects/<project-id>/<ProjectName>.md` with the write-up.
  2. Import it at the top of `src/data/projects/projects.ts` with the `?raw` suffix.
  3. Add an entry to the `projects` array. Set `featured: true` to show it on the home page.
  4. Put any images or videos in `public/assets/projects/` and reference them as `/assets/projects/<file>`.

## Deployment

Every push to `main` runs the tests, builds the site, and deploys `dist/` to GitHub Pages.
`public/CNAME` tells GitHub Pages to serve the site at `marcusgafka.com`.
