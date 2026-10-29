import { defineConfig } from "vite";
import { resolve } from "node:path";

const pages = ["index", "talent", "categories", "projects", "how-it-works", "about", "contact", "join", "login"];

export default defineConfig({
  base: "/Webgl/",
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((name) => [name, resolve(process.cwd(), name + ".html")])
      )
    }
  }
});
