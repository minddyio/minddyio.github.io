// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru', 'uk'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['.loca.lt']
    },
    preview: {
      host: true,
      allowedHosts: true
    }
  }
});