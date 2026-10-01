// Owner-specific values that aren't content — see README "Needed from the owner".
// TODO markers here are intentional; fill in and remove the TODO comment once set.

export const SITE_CONFIG = {
  name: 'Shritan Kommareddy',
  tagline: "I'm a passionate high schooler interested in robotics and engineering that makes a real impact.",
  links: {
    resume: 'resume.pdf', // resolved against the base path — see src/lib/url.ts
    github: 'https://github.com/shritankomm',
    youtube: 'https://www.youtube.com/@shritankommareddy1792',
    linkedin: 'https://www.linkedin.com/in/shritan-kommareddy-0b894237a/'
  },
  // this repo's own GitHub URL, for the footer per §7.3 — update once the site repo is created
  repoUrl: 'https://github.com/shritankomm/portfolio'
};

export const CATEGORIES = ['all', 'robotics', 'software', 'competition', 'video'] as const;
export type CategoryFilter = (typeof CATEGORIES)[number];

export const CATEGORY_FILTER_LABELS: Record<CategoryFilter, string> = {
  all: 'All',
  robotics: 'Robotics',
  software: 'Software',
  competition: 'Competition',
  video: 'Video'
};
