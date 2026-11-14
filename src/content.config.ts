import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The editor saves an empty "Updated on" box as '' — treat blank or
// unreadable dates as "not set" instead of stopping the site from building.
const optionalDate = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) return undefined;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.valueOf()) ? undefined : d;
}, z.date().optional());

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      // No hard length limits: a long title or summary should never stop the site
      // from publishing. Search-engine snippets are trimmed in BaseHead.astro.
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: optionalDate,
      cover: image(),
      coverAlt: z.string(),
      country: z.string(),
      region: z.enum(['south-africa', 'africa', 'world']),
      tripType: z.enum(['solo', 'family']),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      sponsored: z.boolean().default(false),
      sponsorName: z.string().optional(),
      // Extra photos shown as a gallery after the story.
      gallery: z
        .array(
          z.object({
            image: image(),
            alt: z.string(),
            caption: z.string().optional(),
          }),
        )
        .default([]),
    }),
});

export const collections = { posts };
