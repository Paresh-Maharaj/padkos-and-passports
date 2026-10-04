import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import settings from '../data/settings.json';
import { getPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: settings.siteTitle,
    description: settings.tagline,
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/blog/${p.id}/`,
      categories: [p.data.country, ...p.data.tags],
    })),
    customData: `<language>${settings.language.toLowerCase()}</language>`,
  });
}
