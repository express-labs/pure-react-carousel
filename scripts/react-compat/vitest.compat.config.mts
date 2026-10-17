import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const targetVersion = process.env.TARGET_REACT_VERSION;
if (!targetVersion) {
  throw new Error("TARGET_REACT_VERSION is required");
}

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, "../..");
const cacheDir =
  process.env.REACT_COMPAT_CACHE_DIR || resolve(repoRoot, ".cache/react-compat");
const envRequire = createRequire(join(cacheDir, "envs", `v-${targetVersion}`, "package.json"));

const reactDir = dirname(envRequire.resolve("react/package.json"));
const reactDomDir = dirname(envRequire.resolve("react-dom/package.json"));

const aliases: Array<{ find: RegExp | string; replacement: string }> = [
  { find: /^react$/, replacement: envRequire.resolve("react") },
  { find: /^react-dom$/, replacement: envRequire.resolve("react-dom") },
  { find: /^react-dom\/server$/, replacement: envRequire.resolve("react-dom/server") },
  { find: /^react-dom\/test-utils$/, replacement: envRequire.resolve("react-dom/test-utils") },
];

let hasAutomaticJsxRuntime = false;
try {
  aliases.push(
    { find: /^react\/jsx-runtime$/, replacement: envRequire.resolve("react/jsx-runtime") },
    { find: /^react\/jsx-dev-runtime$/, replacement: envRequire.resolve("react/jsx-dev-runtime") },
  );
  hasAutomaticJsxRuntime = true;
} catch {
  // React < 16.14.0 did not ship react/jsx-runtime
}

try {
  aliases.push({
    find: /^react-dom\/client$/,
    replacement: envRequire.resolve("react-dom/client"),
  });
} catch {
  // React < 18 does not include react-dom/client
}
aliases.push(
  { find: /^react\/(.*)$/, replacement: join(reactDir, "$1") },
  { find: /^react-dom\/(.*)$/, replacement: join(reactDomDir, "$1") },
);

export default defineConfig({
  root: repoRoot,
  resolve: {
    alias: aliases,
  },
  ...(hasAutomaticJsxRuntime
    ? {}
    : {
        oxc: {
          jsx: {
            runtime: "classic",
            pragma: "React.createElement",
            pragmaFrag: "React.Fragment",
          },
        },
        esbuild: {
          jsx: "transform",
          jsxFactory: "React.createElement",
          jsxFragment: "React.Fragment",
        },
      }),
  plugins: [
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
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [
      join(currentDir, "setup-compat.ts"),
      resolve(repoRoot, "src/setupTests.ts"),
    ],
    include: ["src/**/__tests__/**/*.test.{ts,tsx}", "dev/**/__tests__/**/*.test.{ts,tsx}"],
    server: {
      deps: {
        inline: [/@testing-library\/react/],
      },
    },
  },
});
