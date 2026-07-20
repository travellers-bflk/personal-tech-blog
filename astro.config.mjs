import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://439952066.xyz",
  integrations: [sitemap()],
});
