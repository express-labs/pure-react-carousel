import fs from "node:fs";
import path from "node:path";
import { describe, it, expect, beforeAll } from "vite-plus/test";
import { Rolldown } from "vite-plus/pack";
import pkg from "../../package.json";
import viteConfig from "../../vite.config";

const UNUSED_COMPONENT_MARKERS_FOR_DOT = [
  "carousel__back-button",
  "carousel__first-button",
  "carousel__last-button",
  "carousel__next-button",
  "carousel__play-button",
  "carousel__dot-group",
  "carousel__image",
  "carousel__zoom-image",
  "carousel__native-slider",
  "carousel__slide",
  "carousel__slider",
  "carousel__spinner",
];

function resolvePackEntries(): Record<string, string> {
  const rootDir = path.resolve(import.meta.dirname, "../..");
  const srcDir = path.resolve(rootDir, "src");
  const rawEntry = viteConfig.pack && "entry" in viteConfig.pack ? viteConfig.pack.entry : [];
  const patterns = Array.isArray(rawEntry) ? rawEntry : [];

  const positivePatterns = patterns.filter(
    (p): p is string => typeof p === "string" && !p.startsWith("!"),
  );
  const negativePatterns = patterns
    .filter((p): p is string => typeof p === "string" && p.startsWith("!"))
    .map((p) => p.slice(1));

  const excluded = new Set(
    negativePatterns.flatMap((pattern) => fs.globSync(pattern, { cwd: rootDir })),
  );

  const entries: Record<string, string> = {};
  for (const pattern of positivePatterns) {
    for (const relPath of fs.globSync(pattern, { cwd: rootDir })) {
      if (excluded.has(relPath)) continue;
      const absPath = path.resolve(rootDir, relPath);
      const entryName = path
        .relative(srcDir, absPath)
        .replace(/\.[^.]+$/, "")
        .split(path.sep)
        .join("/");
      entries[entryName] = absPath;
    }
  }
  return entries;
}

async function buildPackedLibraryEsm(): Promise<Map<string, string>> {
  const input = resolvePackEntries();
  const build = await Rolldown.rolldown({
    input,
    platform: "browser",
    external: ["react", "react-dom", "react/jsx-runtime"],
    transform: {
      target: "es2020",
      define: {
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
      jsx: {
        runtime: "classic",
      },
    },
    plugins: [
      {
        name: "scss-static-tokens",
        resolveId(source) {
          if (source.endsWith(".scss") || source.endsWith(".css")) {
            return `\0${source}.js`;
          }
          return null;
        },
        load(id) {
          if (id.startsWith("\0") && id.endsWith(".js")) {
            return {
              code: `export default {
                snapAlignStart: "snapAlignStart___mock",
                snapAlignCenter: "snapAlignCenter___mock",
                snapAlignEnd: "snapAlignEnd___mock",
                snapAlignNone: "snapAlignNone___mock",
                snapStopAlways: "snapStopAlways___mock",
                snapStopNormal: "snapStopNormal___mock"
              };`,
              moduleSideEffects: false,
            };
          }
          return null;
        },
      },
    ],
  });

  try {
    const { output } = await build.generate({
      format: "esm",
      minify: true,
      banner: '"use client";',
      entryFileNames: "[name].es.js",
      chunkFileNames: "[name].es.js",
    });
    const files = new Map<string, string>();
    for (const item of output) {
      if (item.type === "chunk") {
        files.set(item.fileName, item.code);
      }
    }
    return files;
  } finally {
    await build.close();
  }
}

async function bundleConsumerCode(
  libraryFiles: Map<string, string>,
  consumerEntryCode: string,
): Promise<string> {
  const build = await Rolldown.rolldown({
    input: "virtual:consumer-entry.js",
    external: ["react", "react-dom", "react/jsx-runtime"],
    treeshake: true,
    onLog(level, log, defaultHandler) {
      if (log.code === "MODULE_LEVEL_DIRECTIVE") return;
      defaultHandler(level, log);
    },
    plugins: [
      {
        name: "virtual-consumer",
        resolveId(id, importer) {
          if (id === "virtual:consumer-entry.js") return "\0virtual:consumer-entry.js";
          if (id === "pure-react-carousel") return "\0lib:index.es.js";
          if (importer?.startsWith("\0lib:") && id.startsWith(".")) {
            const importerRel = importer.slice("\0lib:".length);
            const resolvedRel = path.posix.join(path.posix.dirname(importerRel), id);
            return `\0lib:${resolvedRel}`;
          }
          return null;
        },
        load(id) {
          if (id === "\0virtual:consumer-entry.js") {
            return { code: consumerEntryCode, moduleSideEffects: true };
          }
          if (id.startsWith("\0lib:")) {
            const fileName = id.slice("\0lib:".length);
            const code = libraryFiles.get(fileName);
            if (!code) {
              throw new Error(`Missing packed library module: ${fileName}`);
            }
            return { code, moduleSideEffects: false };
          }
          return null;
        },
      },
    ],
  });

  try {
    const { output } = await build.generate({
      format: "esm",
      minify: true,
    });
    return output[0].code;
  } finally {
    await build.close();
  }
}

describe("library tree-shaking", () => {
  let packedLibraryFiles = new Map<string, string>();

  beforeAll(async () => {
    packedLibraryFiles = await buildPackedLibraryEsm();
  });

  it("declares CSS-only sideEffects in package.json so bundlers tree-shake JS modules", () => {
    expect(pkg).toHaveProperty("sideEffects", ["*.css"]);
  });

  it("emits multiple entry modules from src/ so components are separated by module boundaries", () => {
    expect(packedLibraryFiles.has("index.es.js")).toBe(true);
    expect(packedLibraryFiles.has("Dot/index.es.js")).toBe(true);
    expect(packedLibraryFiles.has("Dot/Dot.es.js")).toBe(true);
    expect(packedLibraryFiles.size).toBeGreaterThan(20);
  });

  it("drops unused components when a consumer imports only { Dot }", async () => {
    const consumerBundle = await bundleConsumerCode(
      packedLibraryFiles,
      'export { Dot } from "pure-react-carousel";',
    );

    expect(consumerBundle).toContain("carousel__dot");
    for (const marker of UNUSED_COMPONENT_MARKERS_FOR_DOT) {
      expect(consumerBundle).not.toContain(marker);
    }
  });

  it("drops unused components and Store/CarouselContext when a consumer imports only { DotView }", async () => {
    const consumerBundle = await bundleConsumerCode(
      packedLibraryFiles,
      'export { DotView } from "pure-react-carousel";',
    );

    expect(consumerBundle).toContain("carousel__dot");
    for (const marker of UNUSED_COMPONENT_MARKERS_FOR_DOT) {
      expect(consumerBundle).not.toContain(marker);
    }
    expect(consumerBundle).not.toContain("CarouselContext");
    expect(consumerBundle).not.toContain("subscribeMasterSpinner");
  });
});
