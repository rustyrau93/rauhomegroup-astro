// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://rauhomegroup.com',
  
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/draft/'),
    }),
  ],
  
  // Build settings - no trailing slashes for clean URLs
  trailingSlash: 'never',
  
  build: {
    assets: '_astro',
    inlineStylesheets: 'auto',
  },
  
  // Development server
  server: {
    port: 3000,
  },
  
  // Note: Redirects for .html URLs handled by Netlify in netlify.toml
});
