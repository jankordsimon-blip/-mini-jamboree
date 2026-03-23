import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://jankordsimon-blip.github.io',
  base: '/-mini-jamboree',
  integrations: [react()],
});