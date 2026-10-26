import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  // GitHub Pages serves this repository under /Webgl/.
  base: "/Webgl/",
  build: {
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), "index.html"),
        about: resolve(process.cwd(), "about.html"),
        contact: resolve(process.cwd(), "contact.html")
      }
    }
  }
});
