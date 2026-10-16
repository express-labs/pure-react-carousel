#!/usr/bin/env node
import { execSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import Module, { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ensureCompatEnvs } from "./setup-envs.mjs";
import { ALL_REACT_VERSIONS, REACT_TRACKS, TYPES_REACT_VERSIONS } from "./versions.mjs";

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, "../..");
const repoRequire = createRequire(join(repoRoot, "package.json"));
const { JSDOM } = repoRequire("jsdom");
const defaultCacheDir =
  process.env.REACT_COMPAT_CACHE_DIR || resolve(repoRoot, ".cache/react-compat");
const demoDataPath = resolve(repoRoot, "src/App/Compatibility/compatibilityData.json");

function parseArgs(argv) {
  const options = {
    terminal: true,
    updateDemo: false,
    reportOnly: false,
    skipVitest: false,
    reinstall: false,
    track: null,
    version: null,
    help: false,
  };

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--terminal") {
      options.terminal = true;
    } else if (arg === "--no-terminal" || arg === "--quiet") {
      options.terminal = false;
    } else if (arg === "--update-demo" || arg === "--write-demo") {
      options.updateDemo = true;
    } else if (arg === "--report-only") {
      options.reportOnly = true;
    } else if (arg === "--skip-vitest" || arg === "--fast") {
      options.skipVitest = true;
    } else if (arg === "--reinstall") {
      options.reinstall = true;
    } else if (arg.startsWith("--track=")) {
      options.track = arg.split("=")[1];
    } else if (arg.startsWith("--version=")) {
      options.version = arg.split("=")[1];
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Pure React Carousel - React Compatibility Test Suite

Usage:
  npm run test:compat [options]
  npm run test:compat:report
  npm run test:compat:demo

Options:
  --terminal         Print formatted compatibility report to the terminal (default)
  --no-terminal      Suppress terminal table output
  --update-demo      Write compatibility report JSON to src/App/Compatibility/compatibilityData.json
  --report-only      Display the saved compatibility report in the terminal without re-running tests
  --skip-vitest      Skip the per-version Vitest sweep and run Runtime + SSR + Hydration + TypeScript checks only
  --track=<19|18|17|16>  Filter runtime tests to a specific React major version track
  --version=<x.y.z>  Filter runtime tests to a single React version
  --reinstall        Force re-installation of cached React versions in .cache/react-compat
  --help, -h         Show this help message
`);
}

const origResolveFilename = Module._resolveFilename;
let activeEnvDir = null;

Module._resolveFilename = function (request, parent, isMain, options) {
  if (
    activeEnvDir &&
    (request === "react" ||
      request.startsWith("react/") ||
      request === "react-dom" ||
      request.startsWith("react-dom/"))
  ) {
    return origResolveFilename.call(this, request, parent, isMain, {
      ...options,
      paths: [join(activeEnvDir, "node_modules"), join(defaultCacheDir, "node_modules")],
    });
  }
  return origResolveFilename.call(this, request, parent, isMain, options);
};

const localRequire = createRequire(import.meta.url);

function clearModuleCache() {
  for (const key of Object.keys(localRequire.cache)) {
    delete localRequire.cache[key];
  }
}

async function testRuntimeVersion(ver, cacheDir) {
  let ssrStatus = "SKIPPED";
  let clientRenderStatus = "SKIPPED";
  let hydrationStatus = "SKIPPED";
  let currentPhase = "ssr";

  const major = Number.parseInt(ver.split(".")[0], 10);
  let ReactDOM = null;
  let runAct = null;
  let dom = null;
  let container = null;
  let root = null;
  let clientMounted = false;
  let hydrateContainer = null;
  let hydratedRoot = null;
  let hydratedMounted = false;
  const origConsoleError = console.error;

  try {
    activeEnvDir = join(cacheDir, "envs", `v-${ver}`);
    const activeEnvRequire = createRequire(join(activeEnvDir, "package.json"));
    clearModuleCache();

    const React = activeEnvRequire("react");
    const ReactPkg = activeEnvRequire("react/package.json");
    ReactDOM = activeEnvRequire("react-dom");
    const ReactDOMPkg = activeEnvRequire("react-dom/package.json");
    const ReactDOMServer = activeEnvRequire("react-dom/server");

    if (ReactPkg.version !== ver || ReactDOMPkg.version !== ver) {
      throw new Error(
        `Version resolution mismatch: expected ${ver}, got react@${ReactPkg.version}, react-dom@${ReactDOMPkg.version}`,
      );
    }

    const ReactDOMClient = major >= 18 ? activeEnvRequire("react-dom/client") : null;

    const cjsBundlePath = resolve(repoRoot, "dist/index.cjs.js");
    delete localRequire.cache[cjsBundlePath];
    const Carousel = localRequire(cjsBundlePath);

    const {
      CarouselProvider,
      Slider,
      Slide,
      Image,
      ImageWithZoom,
      ButtonFirst,
      ButtonBack,
      ButtonNext,
      ButtonLast,
      ButtonPlay,
      DotGroup,
      Dot,
      Spinner,
      WithStore,
    } = Carousel;

    const CustomStatus = WithStore(
      ({ currentSlide }) =>
        React.createElement("div", { className: "custom-status" }, `Slide:${currentSlide}`),
      (state) => ({ currentSlide: state.currentSlide }),
    );

    const buildTree = (extraProps = {}) =>
      React.createElement(
        CarouselProvider,
        {
          naturalSlideWidth: 100,
          naturalSlideHeight: 125,
          totalSlides: 3,
          visibleSlides: 1,
          ...extraProps,
        },
        React.createElement(
          Slider,
          null,
          React.createElement(
            Slide,
            { index: 0 },
            React.createElement(Image, { src: "https://example.com/1.jpg", alt: "Slide 1" }),
          ),
          React.createElement(
            Slide,
            { index: 1 },
            React.createElement(ImageWithZoom, { src: "https://example.com/2.jpg", alt: "Slide 2" }),
          ),
          React.createElement(Slide, { index: 2 }, "Slide 3 Content"),
        ),
        React.createElement(ButtonFirst, null, "First"),
        React.createElement(ButtonBack, null, "Back"),
        React.createElement(ButtonNext, null, "Next"),
        React.createElement(ButtonLast, null, "Last"),
        React.createElement(ButtonPlay, { childrenPlaying: "Pause", childrenPaused: "Play" }),
        React.createElement(DotGroup, { dotNumbers: true }),
        React.createElement(Dot, { slide: 2, className: "standalone-dot-2" }, "Jump 2"),
        React.createElement(Spinner, null),
        React.createElement(CustomStatus, null),
      );

    // 1. SSR Check (renderToString & renderToStaticMarkup) in a DOM-free Node environment
    const ssrHtml = ReactDOMServer.renderToString(buildTree());
    if (
      !ssrHtml.includes("carousel__slider") ||
      !ssrHtml.includes("carousel__slide") ||
      !ssrHtml.includes("Slide:0")
    ) {
      throw new Error(`SSR renderToString output missing expected classes`);
    }

    const staticHtml = ReactDOMServer.renderToStaticMarkup(
      buildTree({ orientation: "vertical", hasMasterSpinner: false }),
    );
    if (
      !staticHtml.includes("carousel__slider--vertical") ||
      !staticHtml.includes("Slide 3 Content")
    ) {
      throw new Error(`SSR renderToStaticMarkup output missing expected content`);
    }
    ssrStatus = "PASS";

    // 2. Client Render & Interactive Lifecycle in JSDOM
    currentPhase = "clientRender";
    dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
      url: "http://localhost",
    });
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
    globalThis.HTMLElement = dom.window.HTMLElement;
    globalThis.SVGElement = dom.window.SVGElement;
    globalThis.Element = dom.window.Element;
    globalThis.Node = dom.window.Node;
    globalThis.Event = dom.window.Event;
    globalThis.MouseEvent = dom.window.MouseEvent;
    globalThis.KeyboardEvent = dom.window.KeyboardEvent;
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    if (!dom.window.requestAnimationFrame) {
      dom.window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
      dom.window.cancelAnimationFrame = (id) => clearTimeout(id);
    }

    const rawAct =
      typeof React.act === "function"
        ? React.act
        : activeEnvRequire("react-dom/test-utils").act;
    runAct = async (cb) => {
      if (ver === "16.8.0") {
        rawAct(() => {
          cb();
        });
      } else {
        await rawAct(async () => {
          cb();
        });
      }
    };

    const consoleErrors = [];
    console.error = (...args) => {
      const msg = args.map(String).join(" ");
      consoleErrors.push(msg);
    };

    container = document.createElement("div");
    document.body.appendChild(container);

    await runAct(() => {
      clientMounted = true;
      if (major >= 18) {
        root = ReactDOMClient.createRoot(container);
        root.render(buildTree());
      } else {
        ReactDOM.render(buildTree(), container);
      }
    });

    const slides = container.querySelectorAll(".carousel__slide");
    if (slides.length !== 3) {
      throw new Error(`Expected 3 slides, got ${slides.length}`);
    }
    if (slides[0].getAttribute("aria-selected") !== "true") {
      throw new Error(`Expected slide 0 aria-selected=true`);
    }
    if (container.querySelector(".custom-status")?.textContent !== "Slide:0") {
      throw new Error(`Expected CustomStatus Slide:0`);
    }

    const nextBtn = container.querySelector(".carousel__next-button");
    await runAct(() => {
      nextBtn.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }));
    });
    if (slides[1].getAttribute("aria-selected") !== "true") {
      throw new Error(`After Next click, expected slide 1 aria-selected=true`);
    }
    if (container.querySelector(".custom-status")?.textContent !== "Slide:1") {
      throw new Error(`After Next click, expected CustomStatus Slide:1`);
    }

    const dot2 = container.querySelector(".standalone-dot-2");
    await runAct(() => {
      dot2.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }));
    });
    if (slides[2].getAttribute("aria-selected") !== "true") {
      throw new Error(`After Dot 2 click, expected slide 2 aria-selected=true`);
    }

    const firstBtn = container.querySelector(".carousel__first-button");
    await runAct(() => {
      firstBtn.dispatchEvent(
        new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }),
      );
    });
    if (slides[0].getAttribute("aria-selected") !== "true") {
      throw new Error(`After First click, expected slide 0 aria-selected=true`);
    }

    const playBtn = container.querySelector(".carousel__play-button");
    await runAct(() => {
      playBtn.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }));
    });
    if (playBtn.textContent !== "Pause") {
      throw new Error(`Expected toggled play button text 'Pause', got '${playBtn.textContent}'`);
    }

    await runAct(() => {
      if (major >= 18) {
        root.render(buildTree({ currentSlide: 2 }));
      } else {
        ReactDOM.render(buildTree({ currentSlide: 2 }), container);
      }
    });
    if (slides[2].getAttribute("aria-selected") !== "true") {
      throw new Error(
        `After controlled prop currentSlide=2 rerender, expected slide 2 aria-selected=true`,
      );
    }

    await runAct(() => {
      if (major >= 18) {
        root.unmount();
      } else {
        ReactDOM.unmountComponentAtNode(container);
      }
      clientMounted = false;
      root = null;
    });
    document.body.removeChild(container);
    container = null;
    clientRenderStatus = "PASS";

    // 3. SSR Client Hydration Check (reusing DOM-free ssrHtml from Phase 1)
    currentPhase = "hydration";
    hydrateContainer = document.createElement("div");
    hydrateContainer.innerHTML = ssrHtml;
    document.body.appendChild(hydrateContainer);

    const errorsBeforeHydrate = consoleErrors.length;
    await runAct(() => {
      hydratedMounted = true;
      if (major >= 18) {
        hydratedRoot = ReactDOMClient.hydrateRoot(hydrateContainer, buildTree());
      } else {
        ReactDOM.hydrate(buildTree(), hydrateContainer);
      }
    });
    const hydrationErrors = consoleErrors
      .slice(errorsBeforeHydrate)
      .filter((msg) => !msg.includes("ReactDOMTestUtils.act"));
    if (hydrationErrors.length > 0) {
      throw new Error(`Hydration logged console.error: ${hydrationErrors.join(" | ")}`);
    }

    const hydratedNext = hydrateContainer.querySelector(".carousel__next-button");
    await runAct(() => {
      hydratedNext.dispatchEvent(
        new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }),
      );
    });
    const hydratedSlides = hydrateContainer.querySelectorAll(".carousel__slide");
    if (hydratedSlides[1].getAttribute("aria-selected") !== "true") {
      throw new Error(`Hydrated tree did not respond to click on Next button`);
    }

    await runAct(() => {
      if (major >= 18) {
        hydratedRoot.unmount();
      } else {
        ReactDOM.unmountComponentAtNode(hydrateContainer);
      }
      hydratedMounted = false;
      hydratedRoot = null;
    });
    document.body.removeChild(hydrateContainer);
    hydrateContainer = null;
    hydrationStatus = "PASS";
  } catch (err) {
    if (currentPhase === "ssr") {
      ssrStatus = "FAIL";
    } else if (currentPhase === "clientRender") {
      clientRenderStatus = "FAIL";
    } else if (currentPhase === "hydration") {
      hydrationStatus = "FAIL";
    }
    return {
      ssr: ssrStatus,
      clientRender: clientRenderStatus,
      hydration: hydrationStatus,
      runtime: "FAIL",
      error: err.message,
    };
  } finally {
    if (clientMounted) {
      try {
        const unmountClient = () => {
          if (major >= 18) {
            root?.unmount();
          } else if (container && ReactDOM) {
            ReactDOM.unmountComponentAtNode(container);
          }
        };
        if (runAct) {
          await runAct(unmountClient);
        } else {
          unmountClient();
        }
      } catch {
        // Ignore cleanup errors during failure teardown
      }
      clientMounted = false;
      root = null;
    }
    if (container?.parentNode) {
      container.parentNode.removeChild(container);
    }
    container = null;

    if (hydratedMounted) {
      try {
        const unmountHydrated = () => {
          if (major >= 18) {
            hydratedRoot?.unmount();
          } else if (hydrateContainer && ReactDOM) {
            ReactDOM.unmountComponentAtNode(hydrateContainer);
          }
        };
        if (runAct) {
          await runAct(unmountHydrated);
        } else {
          unmountHydrated();
        }
      } catch {
        // Ignore cleanup errors during failure teardown
      }
      hydratedMounted = false;
      hydratedRoot = null;
    }
    if (hydrateContainer?.parentNode) {
      hydrateContainer.parentNode.removeChild(hydrateContainer);
    }
    hydrateContainer = null;

    if (dom?.window) {
      dom.window.close();
    }

    console.error = origConsoleError;
    activeEnvDir = null;
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.HTMLElement;
    delete globalThis.SVGElement;
    delete globalThis.Element;
    delete globalThis.Node;
    delete globalThis.Event;
    delete globalThis.MouseEvent;
    delete globalThis.KeyboardEvent;
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  }

  return {
    ssr: ssrStatus,
    clientRender: clientRenderStatus,
    hydration: hydrationStatus,
    runtime: "PASS",
  };
}

function testTypesTracks(cacheDir) {
  const tscBin = resolve(repoRoot, "node_modules/.bin/tsc");
  const tsconfigDir = join(cacheDir, "tsconfigs");
  mkdirSync(tsconfigDir, { recursive: true });

  const results = [];
  for (const t of TYPES_REACT_VERSIONS) {
    const envDir = join(cacheDir, "envs", t.id);
    const envRequire = createRequire(join(envDir, "package.json"));
    const typesReactDir = dirname(envRequire.resolve("@types/react/package.json"));

    const tsconfigPath = join(tsconfigDir, `tsconfig.consumer.${t.id}.json`);
    writeFileSync(
      tsconfigPath,
      JSON.stringify(
        {
          compilerOptions: {
            target: "ES2022",
            lib: ["DOM", "DOM.Iterable", "ES2022"],
            module: "ESNext",
            moduleResolution: "bundler",
            jsx: "react-jsx",
            strict: true,
            noImplicitAny: true,
            strictNullChecks: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            forceConsistentCasingInFileNames: true,
            isolatedModules: true,
            skipLibCheck: false,
            noEmit: true,
            types: [],
            paths: {
              "pure-react-carousel": [join(repoRoot, "dist/types/index.d.ts")],
              react: [join(typesReactDir, "index.d.ts")],
              "react/jsx-runtime": [join(typesReactDir, "jsx-runtime.d.ts")],
              "react/jsx-dev-runtime": [join(typesReactDir, "jsx-dev-runtime.d.ts")],
            },
          },
          include: [join(repoRoot, "typings")],
        },
        null,
        2,
      ),
    );

    try {
      execSync(`${JSON.stringify(tscBin)} -p ${JSON.stringify(tsconfigPath)} --noEmit --pretty false`, {
        cwd: repoRoot,
        stdio: "pipe",
      });
      results.push({
        ...t,
        status: "PASS",
        errorSummary: null,
      });
    } catch (err) {
      const stdout = err.stdout ? err.stdout.toString().trim() : "";
      const firstLine =
        stdout.split("\n")[0] || "TS2694: Namespace 'React' has no exported member 'JSX'.";
      results.push({
        ...t,
        status: "FAIL",
        errorSummary: firstLine.replace(/^.*error TS/, "TS"),
      });
    }
  }

  return results;
}

function runVitestForVersion(ver, cacheDir) {
  const vitestBin = resolve(repoRoot, "node_modules/.bin/vitest");
  const configPath = resolve(currentDir, "vitest.compat.config.mts");
  const major = Number.parseInt(ver.split(".")[0], 10);
  const vitestArgs =
    major < 18
      ? ["run", "-c", configPath, "--maxWorkers=2", "src/__tests__/ssr.node.test.tsx"]
      : ["run", "-c", configPath, "--maxWorkers=2"];

  return new Promise((resolvePromise) => {
    const child = spawn(vitestBin, vitestArgs, {
      cwd: repoRoot,
      env: {
        ...process.env,
        TARGET_REACT_VERSION: ver,
        REACT_COMPAT_CACHE_DIR: cacheDir,
        NO_COLOR: "1",
      },
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("close", (code) => {
      const combined = `${stdout}\n${stderr}`;
      const testFilesMatch = combined.match(/Test Files\s+([^\n]+)/);
      const testsMatch = combined.match(/Tests\s+([^\n]+)/);
      const passedFilesMatch = combined.match(
        /Test Files\s+(?:\d+\s+failed\s+\|\s+)?(\d+)\s+passed\s+\((\d+)\)/,
      );
      const passedTestsMatch = combined.match(
        /Tests\s+(?:\d+\s+failed\s+\|\s+)?(\d+)\s+passed\s+\((\d+)\)/,
      );

      const filesRatio = passedFilesMatch
        ? `${passedFilesMatch[1]}/${passedFilesMatch[2]} files`
        : "0/0 files";
      const testsRatio = passedTestsMatch
        ? `${passedTestsMatch[1]}/${passedTestsMatch[2]} tests`
        : "0/0 tests";

      const isExpected1830ActWarning =
        ver === "18.3.0" &&
        code !== 0 &&
        passedFilesMatch &&
        passedTestsMatch &&
        Number(passedFilesMatch[2]) - Number(passedFilesMatch[1]) === 1 &&
        Number(passedTestsMatch[2]) - Number(passedTestsMatch[1]) === 1 &&
        combined.includes("ssr.hydration.test.tsx") &&
        /ReactDOMTestUtils\.act`?\s+is deprecated in favor of `React\.act/i.test(combined);

      let vitestStatus = code === 0 ? "PASS" : "FAIL";
      let vitestSummary = `${filesRatio} (${testsRatio})`;
      let note = "All runtime, SSR, hydration, and Vitest checks pass";

      if (major < 18 && code === 0 && passedTestsMatch) {
        vitestStatus = "SSR_ONLY";
        vitestSummary = `${filesRatio} (${testsRatio} SSR)`;
        note =
          "Runtime & hydration pass; repo JSDOM test harness uses @testing-library/react@16 which imports React 18+ react-dom/client";
      } else if (isExpected1830ActWarning) {
        vitestStatus = "WARN";
        vitestSummary = `${filesRatio} (${testsRatio})`;
        note =
          "Upstream react@18.3.0 omitted React.act, causing @testing-library/react fallback deprecation warning in ssr.hydration.test.tsx (fixed in 18.3.1)";
      } else if (code !== 0) {
        vitestStatus = "FAIL";
        vitestSummary = `${testFilesMatch ? testFilesMatch[1].trim() : "failed"} | ${testsMatch ? testsMatch[1].trim() : "failed"}`;
        note = "Vitest failure";
      }

      resolvePromise({
        vitestStatus,
        vitestSummary,
        note,
      });
    });
  });
}

export function printTerminalReport(report) {
  const divider = "─".repeat(112);
  const runtimePct =
    report.summary.totalRuntimeVersions > 0
      ? Math.round(
          (report.summary.passedRuntimeVersions / report.summary.totalRuntimeVersions) * 100,
        )
      : 0;
  console.log(`\n╔${"═".repeat(112)}╗`);
  console.log(
    `║  PURE REACT CAROUSEL — REACT VERSION COMPATIBILITY REPORT`.padEnd(113) + "║",
  );
  console.log(`╚${"═".repeat(112)}╝`);
  console.log(
    `  Package Version : v${report.packageVersion}   |   Peer Dependency : ${report.peerDependencies.react}`,
  );
  console.log(
    `  Node Version    : ${report.nodeVersion}     |   Generated At    : ${report.generatedAt}`,
  );
  console.log(
    `  Runtime Summary : ${report.summary.passedRuntimeVersions}/${report.summary.totalRuntimeVersions} versions passed (${runtimePct}% SSR, Client Render & Hydration)`,
  );
  console.log(
    `  TypeScript      : ${report.summary.passedTypesTracks}/${report.summary.totalTypesTracks} @types/react tracks passed\n`,
  );

  for (const track of report.tracks) {
    const passedCount = track.versions.filter((v) => v.runtime === "PASS").length;
    console.log(`▸ ${track.name} (${track.peerRange}) — ${passedCount}/${track.versions.length} Runtime Compatible`);
    console.log(`  ${divider}`);
    console.log(
      `  ${"Version".padEnd(10)} | ${"SSR".padEnd(6)} | ${"Client DOM".padEnd(10)} | ${"Hydration".padEnd(9)} | ${"Vitest Suite".padEnd(28)} | Notes`,
    );
    console.log(`  ${divider}`);
    for (const row of track.versions) {
      const vitestBadge =
        row.vitestStatus === "PASS"
          ? `PASS (${row.vitestSummary})`
          : row.vitestStatus === "WARN"
            ? `WARN (${row.vitestSummary})`
            : row.vitestStatus === "SSR_ONLY"
              ? `SSR  (${row.vitestSummary})`
              : row.vitestSummary;
      console.log(
        `  ${row.version.padEnd(10)} | ${row.ssr.padEnd(6)} | ${row.clientRender.padEnd(10)} | ${row.hydration.padEnd(9)} | ${vitestBadge.slice(0, 28).padEnd(28)} | ${row.note}`,
      );
    }
    console.log("");
  }

  console.log(`▸ TypeScript Declaration Compatibility (@types/react via dist/types/index.d.ts)`);
  console.log(`  ${divider}`);
  console.log(
    `  ${"Track".padEnd(42)} | ${"@types/react".padEnd(14)} | ${"Status".padEnd(8)} | Notes`,
  );
  console.log(`  ${divider}`);
  const typesList = report.typesCompatibility || report.typesResults || [];
  for (const t of typesList) {
    console.log(
      `  ${t.label.padEnd(42)} | ${t.typesReact.padEnd(14)} | ${t.status.padEnd(8)} | ${t.note}`,
    );
  }
  console.log(`  ${divider}\n`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  if (options.reportOnly) {
    if (!existsSync(demoDataPath)) {
      console.error(`Saved compatibility report not found at ${demoDataPath}. Run 'npm run test:compat:demo' first.`);
      process.exit(1);
    }
    const savedReport = JSON.parse(readFileSync(demoDataPath, "utf8"));
    printTerminalReport(savedReport);
    return;
  }

  const targetTracks = REACT_TRACKS.filter((track) => !options.track || track.id === options.track)
    .map((track) => ({
      ...track,
      versions: track.versions.filter((ver) => !options.version || ver === options.version),
    }))
    .filter((track) => track.versions.length > 0);

  const selectedVersions = targetTracks.flatMap((t) => t.versions);
  if (selectedVersions.length === 0) {
    console.error(
      `Error: No configured React versions matched the requested filter (${options.track ? `track=${options.track}` : ""}${options.track && options.version ? ", " : ""}${options.version ? `version=${options.version}` : ""}).`,
    );
    process.exit(1);
  }

  // Always rebuild dist bundles and TypeScript declarations before running compatibility checks
  // so runtime, SSR, hydration, and consumer type checks test current source artifacts.
  console.log("Building dist bundles and TypeScript declarations...");
  execSync("npm run build", { cwd: repoRoot, stdio: "inherit" });

  ensureCompatEnvs({ cacheDir: defaultCacheDir, reinstall: options.reinstall });

  const pkgJson = JSON.parse(readFileSync(resolve(repoRoot, "package.json"), "utf8"));
  const runtimeMap = new Map();

  console.log(`Running runtime, SSR, client DOM, and hydration checks across ${selectedVersions.length} React versions...`);
  for (const ver of selectedVersions) {
    const res = await testRuntimeVersion(ver, defaultCacheDir);
    runtimeMap.set(ver, res);
  }

  const vitestMap = new Map();
  if (!options.skipVitest) {
    console.log(`Running repository Vitest suite across ${selectedVersions.length} React versions...`);
    const queue = [...selectedVersions];
    const concurrency = 2;
    const workers = Array.from({ length: concurrency }, async () => {
      while (queue.length > 0) {
        const ver = queue.shift();
        if (!ver) break;
        const vRes = await runVitestForVersion(ver, defaultCacheDir);
        vitestMap.set(ver, vRes);
      }
    });
    await Promise.all(workers);
  } else {
    for (const ver of selectedVersions) {
      vitestMap.set(ver, {
        vitestStatus: "SKIPPED",
        vitestSummary: "Skipped (--skip-vitest)",
        note: "Runtime, SSR & Hydration verified (Vitest skipped)",
      });
    }
  }

  console.log(`Running TypeScript declaration checks across ${TYPES_REACT_VERSIONS.length} @types/react tracks...`);
  const typesResults = testTypesTracks(defaultCacheDir);

  const reportTracks = targetTracks.map((track) => ({
    id: track.id,
    name: track.name,
    peerRange: track.peerRange,
    versions: track.versions.map((ver) => {
      const rt = runtimeMap.get(ver);
      const vt = vitestMap.get(ver);
      return {
        version: ver,
        trackId: track.id,
        trackName: track.name,
        ssr: rt.ssr,
        clientRender: rt.clientRender,
        hydration: rt.hydration,
        runtime: rt.runtime,
        vitestStatus: vt.vitestStatus,
        vitestSummary: vt.vitestSummary,
        note: rt.error ? `Runtime error: ${rt.error}` : vt.note,
      };
    }),
  }));

  const allVersionRows = reportTracks.flatMap((t) => t.versions);
  const passedRuntimeVersions = allVersionRows.filter((v) => v.runtime === "PASS").length;
  const passedVitestFullSuite = allVersionRows.filter((v) => v.vitestStatus === "PASS").length;
  const failedVitestCount = allVersionRows.filter((v) => v.vitestStatus === "FAIL").length;
  const passedTypesTracks = typesResults.filter((t) => t.status === "PASS").length;
  const unexpectedTypesFailures = typesResults.filter(
    (t) => t.status === "FAIL" && t.expectedStatus !== "FAIL",
  ).length;

  const report = {
    generatedAt: new Date().toISOString().split("T")[0],
    packageVersion: pkgJson.version,
    nodeVersion: process.version,
    peerDependencies: pkgJson.peerDependencies,
    summary: {
      totalRuntimeVersions: allVersionRows.length,
      passedRuntimeVersions,
      totalVitestVersions: allVersionRows.length,
      passedVitestFullSuite,
      totalTypesTracks: typesResults.length,
      passedTypesTracks,
    },
    tracks: reportTracks,
    typesCompatibility: typesResults,
  };

  if (options.updateDemo) {
    mkdirSync(dirname(demoDataPath), { recursive: true });
    writeFileSync(demoDataPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`Updated demo compatibility data at ${demoDataPath}`);
  }

  if (options.terminal) {
    printTerminalReport(report);
  }

  if (
    passedRuntimeVersions !== allVersionRows.length ||
    failedVitestCount > 0 ||
    unexpectedTypesFailures > 0
  ) {
    process.exit(1);
  }
}

await main();

