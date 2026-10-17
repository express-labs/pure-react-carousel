import React from "react";
import { act, fireEvent } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
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

const buildHydrationTree = () => (
  <CarouselProvider
    naturalSlideWidth={100}
    naturalSlideHeight={125}
    totalSlides={3}
    visibleSlides={1}
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

describe("SSR client hydration (JSDOM)", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.restoreAllMocks();
  });

  it("hydrates server-rendered HTML without mismatch errors and attaches interactive handlers", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const ssrHtml = renderToString(buildHydrationTree());
    container.innerHTML = ssrHtml;

    let root: ReturnType<typeof hydrateRoot> | undefined;
    act(() => {
      root = hydrateRoot(container, buildHydrationTree());
    });

    expect(errorSpy).not.toHaveBeenCalled();

    const slides = container.querySelectorAll(".carousel__slide");
    const firstSlide = slides[0];
    const secondSlide = slides[1];
    expect(firstSlide).toHaveAttribute("aria-selected", "true");
    expect(secondSlide).toHaveAttribute("aria-selected", "false");

    const nextButton = container.querySelector(".carousel__next-button");
    expect(nextButton).not.toBeNull();
    if (nextButton) {
      act(() => {
        fireEvent.click(nextButton);
      });
    }

    expect(firstSlide).toHaveAttribute("aria-selected", "false");
    expect(secondSlide).toHaveAttribute("aria-selected", "true");

    act(() => {
      root?.unmount();
    });
  });

  it("validates both HTMLElement and SVGElement nodes in GetScrollParent.isNodeValid", () => {
    const div = document.createElement("div");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    expect(GetScrollParent.isNodeValid(div)).toBe(true);
    expect(GetScrollParent.isNodeValid(svg)).toBe(true);
    expect(GetScrollParent.isNodeValid(null)).toBe(false);
  });
});
