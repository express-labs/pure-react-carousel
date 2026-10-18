import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vite-plus/test";
import Slide from "../Slide";
import type { SlideViewProps } from "../../types";

describe("<Slide />", () => {
  let props: SlideViewProps;

  beforeEach(() => {
    props = {
      currentSlide: 1,
      index: 1,
      naturalSlideHeight: 100,
      naturalSlideWidth: 100,
      orientation: "horizontal",
      slideSize: 25,
      totalSlides: 4,
      visibleSlides: 1,
    };
  });

  it("should render", () => {
    const { container } = render(<Slide {...props} />);
    expect(container.querySelector(".slide")).toBeInTheDocument();
  });

  it("should show an aria focus ring when focused", () => {
    const { container } = render(<Slide {...props} />);
    const slide = container.querySelector(".slide") as HTMLElement;
    expect(container.querySelector(".focusRing")).not.toBeInTheDocument();
    fireEvent.focus(slide);
    expect(container.querySelector(".focusRing")).toBeInTheDocument();
  });

  it("should call any supplied onFocus when focused and pass it event data", () => {
    const onFocus = vi.fn();
    const { container } = render(<Slide {...props} onFocus={onFocus} />);
    const slide = container.querySelector(".slide") as HTMLElement;
    fireEvent.focus(slide);
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it("should remove the aria focus ring when blur after focus", () => {
    const { container } = render(<Slide {...props} />);
    const slide = container.querySelector(".slide") as HTMLElement;
    expect(container.querySelector(".focusRing")).not.toBeInTheDocument();
    fireEvent.focus(slide);
    expect(container.querySelector(".focusRing")).toBeInTheDocument();
    fireEvent.blur(slide);
    expect(container.querySelector(".focusRing")).not.toBeInTheDocument();
  });

  it("should call any supplied onBlur when blurred and pass it event data", () => {
    const onBlur = vi.fn();
    const { container } = render(<Slide {...props} onBlur={onBlur} />);
    const slide = container.querySelector(".slide") as HTMLElement;
    fireEvent.blur(slide);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('should set the width to 100% when orientation is "vertical"', () => {
    const { container } = render(<Slide {...props} orientation="vertical" />);
    const slide = container.querySelector(".slide") as HTMLElement;
    expect(slide.style.width).toBe("100%");
  });

  it("should apply any supplied classes to hidden slides", () => {
    const { container } = render(
      <Slide
        classNameHidden="i-be-hidden"
        classNameVisible="i-be-visible"
        currentSlide={1}
        index={0}
        naturalSlideHeight={400}
        naturalSlideWidth={300}
        orientation="horizontal"
        slideSize={25}
        totalSlides={6}
        visibleSlides={2}
      />,
    );
    const slide = container.querySelector(".slide") as HTMLElement;
    expect(slide).toHaveClass("i-be-hidden");
    expect(slide).toHaveClass("carousel__slide--hidden");
  });

  it("should apply any supplied classes to visible slides", () => {
    const { container } = render(
      <Slide
        classNameHidden="i-be-hidden"
        classNameVisible="i-be-visible"
        currentSlide={0}
        index={0}
        naturalSlideHeight={400}
        naturalSlideWidth={300}
        orientation="horizontal"
        slideSize={25}
        totalSlides={6}
        visibleSlides={2}
      />,
    );
    const slide = container.querySelector(".slide") as HTMLElement;
    expect(slide).toHaveClass("i-be-visible");
    expect(slide).toHaveClass("carousel__slide--visible");
  });

  it("should correctly set styles if isIntrinsicHeight is set", () => {
    const { container } = render(<Slide {...props} isIntrinsicHeight />);
    const slide = container.querySelector(".slide") as HTMLElement;
    expect(slide.style.paddingBottom).toBe("unset");
    expect(slide.style.height).toBe("unset");

    const innerSlide = container.querySelector(".carousel__inner-slide") as HTMLElement;
    expect(innerSlide.style.position).toBe("unset");
  });

  it("should correctly set styles in vertical mode if isIntrinsicHeight is set", () => {
    const { container } = render(<Slide {...props} orientation="vertical" isIntrinsicHeight />);
    const slide = container.querySelector(".slide") as HTMLElement;
    expect(slide.style.paddingBottom).toBe("unset");
    expect(slide.style.width).toBe("unset");

    const innerSlide = container.querySelector(".carousel__inner-slide") as HTMLElement;
    expect(innerSlide.style.position).toBe("unset");
  });
});
