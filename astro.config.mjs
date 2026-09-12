// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// TODO: replace with the real domain once one is chosen (see README "Needed from the owner")
const SITE = 'https://example.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), sitemap()]
});
