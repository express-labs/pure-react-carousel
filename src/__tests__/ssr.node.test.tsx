// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import * as React from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import {
  ButtonBack,
  ButtonFirst,
  ButtonLast,
  ButtonNext,
  ButtonPlay,
  CarouselProvider,
  Dot,
  DotGroup,
  Image,
  ImageWithZoom,
  NativeSlider,
  Slide,
  Slider,
  Spinner,
} from "../index";
import GetScrollParent from "../Slider/GetScrollParent";

function collectFiles(dir: string, predicate: (filePath: string) => boolean): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, predicate));
    } else if (predicate(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

const buildCarouselTree = (props?: Partial<React.ComponentProps<typeof CarouselProvider>>) => (
  <CarouselProvider
    naturalSlideWidth={100}
    naturalSlideHeight={125}
    totalSlides={3}
    visibleSlides={1}
    isPlaying
    lockOnWindowScroll
    hasMasterSpinner
    {...props}
  >
    <Slider>
      <Slide index={0}>
        <Image src="https://example.com/slide-1.jpg" alt="Slide 1" />
      </Slide>
      <Slide index={1}>
        <ImageWithZoom src="https://example.com/slide-2.jpg" alt="Slide 2" />
      </Slide>
      <Slide index={2}>Slide 3 Content</Slide>
    </Slider>
    <NativeSlider>
      <Slide index={0}>Native Slide 1</Slide>
      <Slide index={1}>Native Slide 2</Slide>
      <Slide index={2}>Native Slide 3</Slide>
    </NativeSlider>
    <ButtonFirst>First</ButtonFirst>
    <ButtonBack>Back</ButtonBack>
    <ButtonNext>Next</ButtonNext>
    <ButtonLast>Last</ButtonLast>
    <ButtonPlay>Play</ButtonPlay>
    <DotGroup />
    <Dot slide={0}>Dot 0</Dot>
    <Spinner />
  </CarouselProvider>
);

describe("SSR compatibility (Node environment without DOM globals)", () => {
  it("runs in a pure Node environment where window and document are undefined", () => {
    expect(typeof window).toBe("undefined");
    expect(typeof document).toBe("undefined");
    expect(typeof HTMLElement).toBe("undefined");
    expect(typeof SVGElement).toBe("undefined");
  });

  it("renders all carousel components with renderToString without throwing", () => {
    const html = renderToString(buildCarouselTree());

    expect(html).toContain("carousel");
    expect(html).toContain("carousel__slider");
    expect(html).toContain("carousel__native-slider");
    expect(html).toContain("carousel__slide");
    expect(html).toContain("carousel__first-button");
    expect(html).toContain("carousel__back-button");
    expect(html).toContain("carousel__next-button");
    expect(html).toContain("carousel__last-button");
    expect(html).toContain("carousel__play-button");
    expect(html).toContain("carousel__dot-group");
    expect(html).toContain("carousel__dot");
    expect(html).toContain("carousel__spinner");
  });

  it("renders vertical and intrinsic-height carousels with renderToStaticMarkup without throwing", () => {
    const verticalMarkup = renderToStaticMarkup(
      buildCarouselTree({
        orientation: "vertical",
        hasMasterSpinner: false,
      }),
    );

    expect(verticalMarkup).toContain("carousel__slider--vertical");
    expect(verticalMarkup).toContain("carousel__native-slider--vertical");
    expect(verticalMarkup).toContain("Slide 3 Content");

    const intrinsicMarkup = renderToStaticMarkup(
      buildCarouselTree({
        orientation: "horizontal",
        isIntrinsicHeight: true,
        hasMasterSpinner: false,
      }),
    );

    expect(intrinsicMarkup).toContain("carousel__slider--horizontal");
    expect(intrinsicMarkup).toContain("carousel__native-slider--horizontal");
    expect(intrinsicMarkup).toContain("Slide 3 Content");
  });

  it("safely handles GetScrollParent when HTMLElement and SVGElement globals are undefined", () => {
    const scrollParent = new GetScrollParent();

    expect(GetScrollParent.isNodeValid(null)).toBe(false);
    expect(GetScrollParent.isNodeValid({})).toBe(false);
    expect(GetScrollParent.style({} as Element, "overflow")).toBe("");
    expect(scrollParent.parents({ parentNode: {} } as unknown as Node, [])).toEqual([]);
    expect(scrollParent.scrollParent({ parentNode: null } as unknown as HTMLElement)).toBeNull();
    expect(scrollParent.getScrollParent({})).toBeNull();
  });

  it("configures Vite Plus pack ESM and CJS outputs with the 'use client' directive banner for Next.js App Router", () => {
    const viteConfig = readFileSync(resolve(process.cwd(), "vite.config.ts"), "utf8");

    expect(viteConfig).toContain("banner: '\"use client\";'");
    expect(viteConfig).toContain('format: ["esm", "cjs"]');

    const esBundlePath = resolve(process.cwd(), "dist/index.es.js");
    const cjsBundlePath = resolve(process.cwd(), "dist/index.cjs.js");
    if (existsSync(esBundlePath) && existsSync(cjsBundlePath)) {
      expect(readFileSync(esBundlePath, "utf8").startsWith('"use client";')).toBe(true);
      expect(readFileSync(cjsBundlePath, "utf8").startsWith('"use client";')).toBe(true);
    }
  });

  it("uses namespace React imports across source and emitted declaration files for consumers without default-import interop", () => {
    const defaultReactImportPattern =
      /^\s*import\s+(?:type\s+)?React(?:\s*,|\s+from)\s*["']react["']/m;

    const srcFiles = collectFiles(
      resolve(process.cwd(), "src"),
      (filePath) =>
        (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) &&
        !filePath.includes("__tests__") &&
        !filePath.endsWith(".test.ts") &&
        !filePath.endsWith(".test.tsx"),
    );

    expect(srcFiles.length).toBeGreaterThan(0);
    for (const filePath of srcFiles) {
      const content = readFileSync(filePath, "utf8");
      expect(content).not.toMatch(defaultReactImportPattern);
    }

    const distTypesDir = resolve(process.cwd(), "dist/types");
    if (existsSync(distTypesDir)) {
      const dtsFiles = collectFiles(distTypesDir, (filePath) => filePath.endsWith(".d.ts"));
      expect(dtsFiles.length).toBeGreaterThan(0);
      for (const filePath of dtsFiles) {
        const content = readFileSync(filePath, "utf8");
        expect(content).not.toMatch(defaultReactImportPattern);
      }
    }
  });
});
