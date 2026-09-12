#!/usr/bin/env node
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';

const CONTENT_DIR = new URL('../src/content/projects/', import.meta.url);
const ASSETS_DIR = new URL('../src/assets/projects/', import.meta.url);

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function currentYearMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

const rl = createInterface({ input: process.stdin, output: process.stdout });

const title = (await rl.question('Project title: ')).trim();
if (!title) {
  console.error('A title is required.');
  process.exit(1);
}

const category = (await rl.question('Category (robotics/software/competition): ')).trim().toLowerCase();
if (!['robotics', 'software', 'competition'].includes(category)) {
  console.error('category must be one of: "robotics", "software", "competition"');
  process.exit(1);
}

const featuredAnswer = (await rl.question('Featured? (y/N): ')).trim().toLowerCase();
const featured = featuredAnswer === 'y' || featuredAnswer === 'yes';

rl.close();

const slug = slugify(title);
const mdxPath = new URL(`${slug}.mdx`, CONTENT_DIR);
const assetDir = new URL(`${slug}/`, ASSETS_DIR);

if (existsSync(mdxPath)) {
  console.error(`src/content/projects/${slug}.mdx already exists.`);
  process.exit(1);
}

const coverLines = featured
  ? [
      `cover: "../../assets/projects/${slug}/cover.jpg"`,
      `coverAlt: "TODO — describe what is mechanically visible, e.g. \\"shoulder joint with servo horn exposed\\""`
    ]
  : [
      `# cover: "../../assets/projects/${slug}/cover.jpg"  # required if featured: true`,
      `# coverAlt: "TODO"`
    ];

const frontmatter = `---
title: "${title}"
date: "${currentYearMonth()}"
# endDate: "YYYY-MM"  # optional, for ongoing/multi-month builds
status: "in-progress"
featured: ${featured}
category: "${category}"
summary: "TODO — one-line summary, max 180 characters, shown in compact timeline rows."
tech: []
# youtube: "TODO"  # 11-character video ID only, not a full URL
# github: "https://github.com/TODO"
# docs: "https://TODO"
${coverLines.join('\n')}
# specs:
#   - { label: "TODO", value: "TODO" }
---

## The problem

TODO — what needed solving.

## The build

TODO — what was made.

## The approach

TODO — how, with specifics: tools, languages, architecture decisions and why.

## The result

TODO — did it work, with evidence (video, metrics, photos).
`;

mkdirSync(new URL('.', mdxPath), { recursive: true });
writeFileSync(mdxPath, frontmatter);

mkdirSync(assetDir, { recursive: true });
writeFileSync(new URL('.gitkeep', assetDir), '');

console.log(`Created src/content/projects/${slug}.mdx`);
console.log(`Created src/assets/projects/${slug}/`);
