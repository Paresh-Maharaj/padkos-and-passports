import type { ImageMetadata } from 'astro';

// Every photo uploaded through the editor lives in src/assets/uploads.
// This lets settings (which only store a file path) use the same
// automatic resizing as the stories do.
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/uploads/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}', { eager: true });

/** Finds an uploaded photo by its saved path (only the file name matters). */
export function findUpload(path?: string | null): ImageMetadata | undefined {
  if (!path) return undefined;
  const name = path.split('/').pop()?.toLowerCase();
  const match = Object.entries(files).find(([key]) => key.split('/').pop()?.toLowerCase() === name);
  return match?.[1].default;
}
