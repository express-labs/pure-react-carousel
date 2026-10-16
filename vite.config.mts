import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "dev",
  base: "/pure-react-carousel/",
  resolve: {
    alias: {
      "/src": path.resolve(import.meta.dirname, "src"),
    },
  },
  server: {
    fs: {
      allow: [import.meta.dirname],
    },
  },
  css: {
    modules: {
      generateScopedName: "[local]___[hash:base64:5]",
    },
  },
  build: {
    outDir: "../dist-demo",
    emptyOutDir: true,
  },
  plugins: [
    {
      name: "scss-css-modules",
      enforce: "pre",
      async resolveId(source, importer, options) {
        if (source.endsWith(".scss") && !source.includes("?")) {
          const resolved = await this.resolve(source, importer, {
            ...options,
            skipSelf: true,
          });
          if (resolved) {
            return `${resolved.id}?.module.scss`;
          }
        }
        return null;
      },
    },
    {
      name: "copy-demo-media",
      apply: "build",
      closeBundle() {
        const srcMedia = path.resolve(import.meta.dirname, "dev/media");
        const destMedia = path.resolve(import.meta.dirname, "dist-demo/media");
        if (fs.existsSync(srcMedia)) {
          fs.cpSync(srcMedia, destMedia, { recursive: true });
        }
      },
    },
  ],
});
