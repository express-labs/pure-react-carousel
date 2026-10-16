// @vitest-environment node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import React from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
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
  Slide,
  Slider,
  Spinner,
} from "../index";
import GetScrollParent from "../Slider/GetScrollParent";

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
    expect(verticalMarkup).toContain("Slide 3 Content");

    const intrinsicMarkup = renderToStaticMarkup(
      buildCarouselTree({
        orientation: "horizontal",
        isIntrinsicHeight: true,
        hasMasterSpinner: false,
      }),
    );

    expect(intrinsicMarkup).toContain("carousel__slider--horizontal");
    expect(intrinsicMarkup).toContain("Slide 3 Content");
  });

  it("safely handles GetScrollParent when HTMLElement and SVGElement globals are undefined", () => {
    const scrollParent = new GetScrollParent();

    expect(GetScrollParent.isNodeValid(null)).toBe(false);
    expect(GetScrollParent.isNodeValid({})).toBe(false);
    expect(scrollParent.getScrollParent({})).toBeNull();
  });

  it("configures Rollup ESM and CJS outputs with the 'use client' directive banner for Next.js App Router", () => {
    const esConfig = readFileSync(resolve(process.cwd(), "rollup.config.es.mjs"), "utf8");
    const cjsConfig = readFileSync(resolve(process.cwd(), "rollup.config.cjs.mjs"), "utf8");

    expect(esConfig).toContain("banner: '\"use client\";'");
    expect(esConfig).toContain("directives: false");
    expect(cjsConfig).toContain("banner: '\"use client\";'");
    expect(cjsConfig).toContain("directives: false");
  });
});
