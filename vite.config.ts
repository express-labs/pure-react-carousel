import fs from "node:fs";
import path from "node:path";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import * as sass from "sass";
import { defineConfig, type Plugin } from "vite-plus";

const isTest = Boolean(process.env.VITEST);

function createPackCssModulesPlugin(): Plugin {
  const styles = new Map<string, string>();

  return {
    name: "pack-scss-css-modules",
    async resolveId(source, importer, options) {
      if ((source.endsWith(".scss") || source.endsWith(".css")) && !source.includes("?")) {
        const resolved = await this.resolve(source, importer, {
          ...options,
          skipSelf: true,
        });
        if (resolved) {
          return `${resolved.id}?css-module.js`;
        }
      }
      return null;
    },
    async load(id: string) {
      if (!id.endsWith("?css-module.js")) {
        return null;
      }

      const realId = id.slice(0, -"?css-module.js".length);
      const compiled = sass.compile(realId);
      let tokens: Record<string, string> = {};

      const result = await postcss([
        postcssModules({
          generateScopedName: "[local]___[hash:base64:5]",
          getJSON(_cssFileName: string, json: Record<string, string>) {
            tokens = json;
          },
        }),
        autoprefixer(),
        cssnano(),
      ]).process(compiled.css, { from: realId });

      styles.set(realId, result.css);

      return {
        code: `export default ${JSON.stringify(tokens)};`,
        moduleType: "js",
      };
    },
    generateBundle(outputOptions) {
      let combinedCss = "";
      for (const moduleId of this.getModuleIds()) {
        if (moduleId.endsWith("?css-module.js")) {
          const realId = moduleId.slice(0, -"?css-module.js".length);
          const css = styles.get(realId);
          if (css) {
            combinedCss += css;
          }
        }
      }
      const fileName =
        outputOptions.format === "cjs" ? "react-carousel.cjs.css" : "react-carousel.es.css";
      this.emitFile({
        type: "asset",
        fileName,
        source: combinedCss,
      });
    },
  };
}

export default defineConfig({
  staged: {
    "{src,dev,typings}/**/*": "vp check --fix",
    "vite.config.ts": "vp check --fix",
  },
  fmt: {},
  lint: {
    plugins: ["typescript", "react", "unicorn"],
    categories: {
      correctness: "error",
      suspicious: "warn",
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "typescript/no-explicit-any": "warn",
      "unicorn/filename-case": "off",
      "unicorn/no-null": "off",
      "unicorn/prefer-add-event-listener": "off",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    ignorePatterns: ["dist/**", "dist-demo/**", "node_modules/**", "coverage/**"],
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
  },
  pack: {
    entry: { index: "src/index.ts" },
    outDir: "dist",
    format: ["esm", "cjs"],
    platform: "browser",
    target: "es2020",
    dts: false,
    clean: false,
    sourcemap: true,
    minify: true,
    banner: '"use client";',
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    deps: {
      neverBundle: ["react", "react-dom", "react/jsx-runtime"],
    },
    outExtensions({ format }) {
      return {
        js: format === "cjs" ? ".cjs.js" : ".es.js",
      };
    },
    inputOptions: {
      transform: {
        jsx: {
          runtime: "classic",
        },
      },
    },
    outputOptions(options, format) {
      if (format === "cjs") {
        options.exports = "named";
      }
      return options;
    },
    plugins: [createPackCssModulesPlugin()],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
    include: ["src/**/__tests__/**/*.test.{ts,tsx}", "dev/**/__tests__/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/__tests__/**",
        "src/setupTests.ts",
        "src/scss.d.ts",
        "src/types.ts",
        "src/**/index.ts",
      ],
    },
  },
  root: isTest ? undefined : "dev",
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
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "dev/index.html"),
        compatibility: path.resolve(import.meta.dirname, "dev/compatibility.html"),
      },
    },
  },
  plugins: isTest
    ? [
        {
          name: "scss-identity-proxy",
          enforce: "pre",
          resolveId(source) {
            if (source.endsWith(".scss") || source.endsWith(".css")) {
              return "\0scss-proxy.js";
            }
            return null;
          },
          load(id) {
            if (id === "\0scss-proxy.js") {
              return 'export default new Proxy({}, { get: (_, key) => key === "__esModule" ? false : typeof key === "symbol" ? undefined : String(key) });';
            }
            return null;
          },
        },
      ]
    : [
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
