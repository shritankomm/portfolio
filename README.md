# Portfolio

Shritan Kommareddy's engineering portfolio — a reverse-chronological project timeline built with Astro 5+ and Tailwind CSS 4, deployed on Vercel. See [`portfolio-build-spec.md`](../portfolio-build-spec.md) (one level up) for the full design brief this was built from.

## Local dev

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # production build to ./dist/
npm run preview   # preview the production build locally
```

## Adding a project

This is the entire workflow, and it should stay exactly this short:

1. `npm run new-project` — prompts for title, category, and featured y/n, then scaffolds:
   - `src/content/projects/<slug>.mdx` with every frontmatter field present (optional ones commented out)
   - `src/assets/projects/<slug>/` with a `.gitkeep`
2. Fill in the frontmatter and write the body (four headings: Problem / Build / Approach / Result — already stubbed in).
3. Drop images into `src/assets/projects/<slug>/`.
4. `git push` — Vercel rebuilds automatically.

If adding a project ever requires opening a `.astro` file, something's wrong — projects are pure content, not code.

## `src/assets/` vs `public/`

This is the rule most likely to be gotten wrong, so it's spelled out:

**Project images → `src/assets/projects/<slug>/`**
Images here go through Astro's image pipeline: converted to WebP/AVIF, resized, content-hashed for cache-busting, dimensioned so nothing shifts on load. Reference them via the `cover` frontmatter field (it's typed as an `image()` schema field, so Astro resolves and optimizes it automatically) and read through `astro:assets`' `<Image />` component.

**Static files → `public/`**
Copied verbatim, unoptimized, at their exact filename — for anything that needs a stable public URL: `resume.pdf`, `favicon.svg`, `robots.txt`, `og.png`.

**Don't put project photos in `public/`.** An unoptimized 4MB phone photo served raw blows the performance budget for everyone, not just that one project's page.

**Large binaries (STL, STEP/CAD exports, Gerbers, full-res photo dumps) → the project's own GitHub repo or a GitHub Release**, linked via the `docs` frontmatter field. Don't commit them here — it bloats every clone and every Vercel build.

**Video → nothing to store.** Only the YouTube video ID goes in frontmatter; the embed is built from that.

## Frontmatter reference

Schema lives in [`src/content.config.ts`](src/content.config.ts) and is Zod-validated — a bad `category`, a full YouTube URL instead of an ID, or a missing `cover` on a featured project fails the build with a specific error message rather than shipping broken.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `date` | string `"YYYY-MM"` | yes | Used for sort and display. Use `"TODO"` if genuinely unknown — don't invent a date. |
| `endDate` | string `"YYYY-MM"` | no | For ongoing / multi-month builds. |
| `status` | `"complete" \| "in-progress" \| "archived"` | no, defaults to `"complete"` | |
| `featured` | boolean | no, defaults to `false` | Full card + video on the homepage. Keep this to 3–5 across the whole site — see "Promoting a project" below. |
| `category` | `"robotics" \| "software" \| "competition"` | yes | Drives the filter chips. |
| `summary` | string, ≤180 chars | yes | The one-liner shown in compact timeline rows. |
| `tech` | string array | yes | Tags, e.g. `["ROS 2", "Python"]`. |
| `youtube` | string | no | The 11-character video ID only (e.g. `"9L26LDluzQg"`) — never a full `youtube.com`/`youtu.be` URL, the schema will reject it. |
| `github` | URL string | no | |
| `docs` | URL string | no | External writeup, itch.io page, etc. |
| `cover` | image path | required if `featured: true` | e.g. `"../../assets/projects/my-slug/cover.jpg"`. 16:9 source, 2000px on the long edge is plenty — Astro handles conversion and resizing. |
| `coverAlt` | string | required whenever `cover` is set | Describe what's mechanically visible ("shoulder joint with the servo horn exposed"), not "a robot arm." |
| `specs` | array of `{ label, value }` | no | The technical-fingerprint block on detail pages — DOF count, BOM cost, part count, control-loop rate. Values go in `.mono`. |

Example of every field:

```yaml
---
title: "Example Project"
date: "2026-03"
endDate: "2026-06"
status: "complete"
featured: true
category: "robotics"
summary: "One sentence, under 180 characters, describing the project for the compact row."
tech: ["ROS 2", "Python", "Fusion 360"]
youtube: "dQw4w9WgXcQ"
github: "https://github.com/shritankomm/example"
docs: "https://example.com/writeup"
cover: "../../assets/projects/example-project/cover.jpg"
coverAlt: "gripper assembly with the drive belt and tensioner visible"
specs:
  - { label: "DOF", value: "6 DOF" }
  - { label: "BOM", value: "$412" }
---
```

## Image conventions

- **Format in:** JPG or PNG — don't pre-convert to WebP, Astro does that on build.
- **Size in:** 2000px on the long edge is plenty; bigger just slows builds.
- **Naming:** `cover.jpg` for the card image, then `01-<description>.jpg`, `02-…` for body images — numeric prefixes keep them in build order.
- **Cover aspect ratio:** 16:9. The card layout assumes it; other ratios will letterbox.
- **Alt text is required** on `cover` — the schema enforces it.

## Promoting a project to featured

Set `featured: true` and add a `cover` + `coverAlt` if it doesn't have one yet. Keep the featured count to 3–5 total (§6.1 of the build spec) — that tier is meant to carry the portfolio, not list everything with a video attached. If you're adding a 6th, demote one first.

## Fonts

- **IBM Plex Mono** — self-hosted via `@fontsource/ibm-plex-mono`. Used for dates, tags, and spec/BOM figures — real data only, never generic UI labels.
- **Satoshi** (the spec's intended headline/body face) is licensed through Fontshare and isn't redistributable via npm/Fontsource, so it can't be `npm install`ed. **Sora** (OFL, via `@fontsource/sora`) is standing in for now.

To switch in real Satoshi:
1. Download the woff2 files from [fontshare.com/fonts/satoshi](https://fontshare.com/fonts/satoshi).
2. Drop them in `src/fonts/satoshi/`.
3. Replace the `@fontsource/sora` imports in `src/styles/global.css` with `@font-face` rules pointing at those files, and update `--font-sans` in the same file.

## Known TODOs

All 9 current projects have real dates. What's still outstanding:

- **Resume** — `public/resume.pdf` doesn't exist yet; the header button will 404 until it's added. GitHub, YouTube, and LinkedIn are set.
- **Missing links per project** (leave the frontmatter field unset until you have the real URL — the UI already shows a TODO note in the body copy):
  - Assistive Wheelchair Arm — no links yet
  - URS — no links yet, and its cover is a placeholder (needs real screenshots/demo)
  - ESP Student Curriculum — no links yet
  - Brutus — TSA Robotics — no links yet
  - StablStep — GitHub repo + the MIT THINK technical writeup (PDF)
  - FRC "Charged Up" Practice Bot — no links yet, and its cover is a placeholder (needs a CAD render)
  - Myoelectric Prosthetic Hand — Onshape link
  - Mini Bike Chassis — Onshape link
- **Body writeups** — several projects have "The approach" / "The result" sections still marked TODO; fill these in with real detail once you have time to write them up.
- **Tagline wording** — still the spec's draft in `src/config/site.ts`.
- **Domain name** — `astro.config.mjs`'s `site`/`base` currently point at the GitHub Pages URL (`shritankomm.github.io/portfolio`); update both (and drop `base` entirely) if a custom domain gets set up.

---

Design influenced by [Brittany Chiang](https://brittanychiang.com)'s portfolio (MIT licensed) — palette, type, and specific layout details are deliberately different; see the build spec for why.
