// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import settings from './src/data/settings.json' with { type: 'json' };
import { rehypeExternalLinks } from './src/lib/rehype-external-links.mjs';

export default defineConfig({
  // Your public web address. Change it in the CMS under "Site settings".
  site: settings.siteUrl,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin/') && !page.includes('/search/'),
    }),
  ],
  markdown: {
    processor: unified({ rehypePlugins: [rehypeExternalLinks] }),
  },
  image: {
    // Photos are resized and converted to modern formats at build time.
    responsiveStyles: true,
    layout: 'constrained',
  },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
