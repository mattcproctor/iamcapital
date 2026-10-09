// @ts-check
import { defineConfig } from 'astro/config';

// A static port of the hand-written page: src/pages/investments.astro builds to dist/investments.html (served at
// /investments by vercel.json's cleanUrls), and public/ is copied as it is, so every URL stays what it was.
export default defineConfig({
  site: 'https://iamcapital.vercel.app',
  build: { format: 'file' },
  compressHTML: false,
});
