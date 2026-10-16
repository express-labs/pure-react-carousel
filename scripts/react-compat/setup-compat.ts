import Module from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import ReactDOM from "react-dom";
import { beforeAll, expect } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, "../..");
const targetVersion = process.env.TARGET_REACT_VERSION;
const cacheDir =
  process.env.REACT_COMPAT_CACHE_DIR || resolve(repoRoot, ".cache/react-compat");
const activeEnvDir = join(cacheDir, "envs", `v-${targetVersion}`);

const origResolveFilename = (
  Module as unknown as {
    _resolveFilename: (
      request: string,
      parent: unknown,
      isMain: boolean,
      options?: Record<string, unknown>,
    ) => string;
  }
)._resolveFilename;

(
  Module as unknown as {
    _resolveFilename: (
      request: string,
      parent: unknown,
      isMain: boolean,
      options?: Record<string, unknown>,
    ) => string;
  }
)._resolveFilename = function (request, parent, isMain, options) {
  if (
    request === "react" ||
    request.startsWith("react/") ||
    request === "react-dom" ||
    request.startsWith("react-dom/")
  ) {
    return origResolveFilename.call(this, request, parent, isMain, {
      ...options,
      paths: [join(activeEnvDir, "node_modules"), join(cacheDir, "node_modules")],
    });
  }
  return origResolveFilename.call(this, request, parent, isMain, options);
};

beforeAll(() => {
  expect(React.version.startsWith(targetVersion ?? "")).toBe(true);
});
