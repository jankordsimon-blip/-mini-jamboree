// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  site: 'https://jankordsimon-blip.github.io',
  base: isProd ? '/-mini-jamboree' : '/',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});