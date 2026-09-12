// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Deployed to GitHub Pages as a project site (github.com/shritankomm/portfolio),
// so it's served from /portfolio, not the domain root. If a custom domain is set
// up later (see README "Needed from the owner"), drop `base` and update `site`.
const SITE = 'https://shritankomm.github.io';
const BASE = '/portfolio';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), sitemap()]
});
