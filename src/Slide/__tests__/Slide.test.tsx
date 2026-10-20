import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vite-plus/test";
import ConnectedSlide from "..";
import Slide from "../Slide";
import CarouselProvider from "../../CarouselProvider";
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

  it("should apply default scroll-snap classes and not leak snapAlign or snapStop to the DOM element", () => {
    const { container, rerender } = render(<Slide {...props} />);
    const slide = container.querySelector(".slide") as HTMLElement;
    expect(slide).toHaveClass(
      "snapAlignStart",
      "carousel__slide--snap-align-start",
      "snapStopNormal",
      "carousel__slide--snap-stop-normal",
    );

    rerender(<Slide {...props} snapAlign="start" snapStop="normal" />);
    expect(slide.hasAttribute("snapAlign")).toBe(false);
    expect(slide.hasAttribute("snapalign")).toBe(false);
    expect(slide.hasAttribute("snapStop")).toBe(false);
    expect(slide.hasAttribute("snapstop")).toBe(false);
  });

  it("should apply snapAlign and snapStop classes when configured", () => {
    const { container, rerender } = render(
      <Slide {...props} snapAlign="center" snapStop="always" className="custom-slide" />,
    );
    const slide = container.querySelector(".slide") as HTMLElement;
    expect(slide).toHaveClass(
      "snapAlignCenter",
      "carousel__slide--snap-align-center",
      "snapStopAlways",
      "carousel__slide--snap-stop-always",
      "custom-slide",
    );
    expect(slide.className.endsWith("custom-slide")).toBe(true);

    rerender(<Slide {...props} snapAlign="end" snapStop="normal" />);
    expect(slide).toHaveClass(
      "snapAlignEnd",
      "carousel__slide--snap-align-end",
      "snapStopNormal",
      "carousel__slide--snap-stop-normal",
    );

    rerender(<Slide {...props} snapAlign="none" />);
    expect(slide).toHaveClass("snapAlignNone", "carousel__slide--snap-align-none");
  });

  it("should inherit snapAlign and snapStop from CarouselProvider store and allow per-slide overrides", () => {
    const { container } = render(
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={100}
        totalSlides={2}
        snapAlign="center"
        snapStop="always"
      >
        <ConnectedSlide index={0} />
        <ConnectedSlide index={1} snapAlign="end" snapStop="normal" />
      </CarouselProvider>,
    );
    const slides = container.querySelectorAll(".slide");
    expect(slides[0]).toHaveClass(
      "snapAlignCenter",
      "carousel__slide--snap-align-center",
      "snapStopAlways",
      "carousel__slide--snap-stop-always",
    );
    expect(slides[1]).toHaveClass(
      "snapAlignEnd",
      "carousel__slide--snap-align-end",
      "snapStopNormal",
      "carousel__slide--snap-stop-normal",
    );
  });

  it("should forward ref to the slide DOM element on both Slide and ConnectedSlide", () => {
    const viewRef = React.createRef<HTMLDivElement>();
    render(<Slide {...props} ref={viewRef} />);
    expect(viewRef.current).toBeInstanceOf(HTMLDivElement);
    expect(viewRef.current).toHaveClass("carousel__slide");

    const connectedRef = React.createRef<HTMLDivElement>();
    render(
      <CarouselProvider naturalSlideWidth={100} naturalSlideHeight={100} totalSlides={2}>
        <ConnectedSlide index={0} ref={connectedRef} />
      </CarouselProvider>,
    );
    expect(connectedRef.current).toBeInstanceOf(HTMLDivElement);
    expect(connectedRef.current).toHaveClass("carousel__slide");
  });

  it("should pass innerProps to the inner slide wrapper and merge className and style with innerClassName", () => {
    const { container } = render(
      <Slide
        {...props}
        isIntrinsicHeight
        innerClassName="from-inner-class"
        innerProps={{
          id: "inner-slide-1",
          role: "group",
          "aria-label": "Inner group",
          className: "from-inner-props",
          style: { backgroundColor: "rgb(255, 0, 0)" },
        }}
      />,
    );
    const outerSlide = container.querySelector(".carousel__slide") as HTMLElement;
    expect(outerSlide.hasAttribute("innerProps")).toBe(false);
    expect(outerSlide.hasAttribute("innerprops")).toBe(false);

    const innerSlide = container.querySelector(".carousel__inner-slide") as HTMLElement;
    expect(innerSlide).toHaveAttribute("id", "inner-slide-1");
    expect(innerSlide).toHaveAttribute("role", "group");
    expect(innerSlide).toHaveAttribute("aria-label", "Inner group");
    expect(innerSlide).toHaveClass("carousel__inner-slide", "from-inner-class", "from-inner-props");
    expect(innerSlide.style.position).toBe("unset");
    expect(innerSlide.style.backgroundColor).toBe("rgb(255, 0, 0)");
  });

  it("should only set default aria-selected for roles that support it and omit default aria-label when aria-labelledby is provided", () => {
    const { container, rerender } = render(<Slide {...props} />);
    const slide = container.querySelector(".carousel__slide") as HTMLElement;
    // Default role="option" gets aria-selected
    expect(slide).toHaveAttribute("role", "option");
    expect(slide).toHaveAttribute("aria-selected", "true");
    expect(slide).toHaveAttribute("aria-label", "slide");

    // role="group" or role="tabpanel" should NOT receive aria-selected unless explicitly passed
    rerender(<Slide {...props} role="group" aria-roledescription="slide" />);
    expect(slide).toHaveAttribute("role", "group");
    expect(slide.hasAttribute("aria-selected")).toBe(false);

    rerender(<Slide {...props} role="tabpanel" />);
    expect(slide.hasAttribute("aria-selected")).toBe(false);

    // Explicit aria-selected is still respected
    rerender(<Slide {...props} role="group" aria-selected={false} />);
    expect(slide).toHaveAttribute("aria-selected", "false");

    // aria-labelledby omits default aria-label="slide"
    rerender(<Slide {...props} aria-labelledby="slide-heading-1" />);
    expect(slide).toHaveAttribute("aria-labelledby", "slide-heading-1");
    expect(slide.hasAttribute("aria-label")).toBe(false);

    // Explicit ariaLabel prop is respected
    rerender(<Slide {...props} ariaLabel="Custom slide label" />);
    expect(slide).toHaveAttribute("aria-label", "Custom slide label");
  });
});
