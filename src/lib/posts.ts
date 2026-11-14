import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export const REGIONS = {
  'south-africa': 'South Africa',
  africa: 'Rest of Africa',
  world: 'The wider world',
} as const;

export const TRIP_TYPES = {
  solo: 'Solo travel',
  couple: 'Travelling as a couple',
  family: 'Family travel',
} as const;

/** Short names used on tags and in the menu. */
export const TRIP_LABELS = {
  solo: 'Solo',
  couple: 'Couple',
  family: 'Family',
} as const;

/** The main country plus any others visited on the same trip, tidied and without repeats. */
export function countriesOf(post: Post): string[] {
  const all = [post.data.country, ...post.data.alsoVisited].map((c) => c.trim()).filter(Boolean);
  return [...new Map(all.map((c) => [c.toLowerCase(), c])).values()];
}

/** All published posts, newest first. Drafts only show while previewing locally. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

export function readingTime(body = ''): number {
  return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220));
}
