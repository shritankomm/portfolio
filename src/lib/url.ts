// GitHub Pages serves this site under a /portfolio base path, not the domain root.
// Every internal link must go through this helper so it still works if the base
// ever changes (a custom domain, a repo rename) — see astro.config.mjs.
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function url(path: string): string {
  const trimmed = path.replace(/^\/+/, '');
  return `${BASE}/${trimmed}`;
}
