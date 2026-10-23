import type { ImageMetadata } from 'astro';

// Every image the site uses was copied from the WordPress uploads folder into src/assets/uploads, keeping its
// year/month path, so the data files can name images exactly as WordPress did ("2023/01/about.jpg") and Astro
// resizes and converts them at build time.
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/uploads/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}', {
  eager: true,
});

export function upload(path: string): ImageMetadata {
  const file = files['/src/assets/uploads/' + path];
  if (!file) throw new Error(`Image not found in src/assets/uploads: ${path}`);
  return file.default;
}
