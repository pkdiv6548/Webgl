import { defineConfig } from "vite";

// This repository is published under the GitHub Pages /Webgl/ path.
export default defineConfig({
  base: "/Webgl/",
  build: {
    rollupOptions: {
      input: {
        home: "index.html"
      }
    }
  }
});
