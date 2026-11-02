// @ts-check
import { defineConfig } from "astro/config";

// Set PUBLIC_SITE_URL to the deployed URL so the page carries a canonical link.
const site = process.env.PUBLIC_SITE_URL || undefined;

export default defineConfig({
  site,
  output: "static",
  build: {
    // Every stylesheet and script is a same-origin file, so the CSP needs no 'unsafe-inline'.
    inlineStylesheets: "never",
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
