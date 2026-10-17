import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vite-plus/test";
import Dot from "../Dot";
import Store from "../../Store/Store";
import type { DotViewProps } from "../../types";

describe("<Dot />", () => {
  let props: DotViewProps;

  beforeEach(() => {
    props = {
      carouselStore: new Store({
        currentSlide: 6,
        totalSlides: 9,
        visibleSlides: 2,
        isPlaying: true,
      }),
      children: "Hello World!",
      currentSlide: 6,
      slide: 2,
      totalSlides: 9,
      visibleSlides: 2,
    };
  });

  it("should render", () => {
    render(<Dot {...props} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should add the dotSelected class when selected", () => {
    render(<Dot {...props} selected />);
    expect(screen.getByRole("button")).toHaveClass("dotSelected");
  });

  it("should add the carousel__dot--selected class when selected", () => {
    render(<Dot {...props} selected />);
    expect(screen.getByRole("button")).toHaveClass("carousel__dot--selected");
  });

  it("should call any supplied onClick as a callback", () => {
    const onClick = vi.fn();
    render(<Dot {...props} onClick={onClick} />);
    expect(onClick).toHaveBeenCalledTimes(0);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should update carouselStore.state.currentSlide with the value of slide", () => {
    const onClick = vi.fn();
    const carouselStore = new Store({
      currentSlide: 0,
      totalSlides: 9,
      visibleSlides: 2,
    });
    render(<Dot {...props} onClick={onClick} carouselStore={carouselStore} />);
    expect(carouselStore.state.currentSlide).toBe(0);
    fireEvent.click(screen.getByRole("button"));
    expect(carouselStore.state.currentSlide).toEqual(props.slide);
  });

  it("should keep the last slide pegged to the right of the viewport if visibleSlides > 1", () => {
    render(<Dot {...props} slide={10} />);
    fireEvent.click(screen.getByRole("button"));
    expect(props.carouselStore.getStoreState().currentSlide).toBe(7);
  });

  it("should not override disabled if disabled prop is set to false manually", () => {
    render(<Dot {...props} slide={10} disabled={false} />);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("should not override disabled if disabled prop is set to true manually", () => {
    render(<Dot {...props} slide={0} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should pause autoplay when clicked", () => {
    render(<Dot {...props} slide={10} />);
    fireEvent.click(screen.getByRole("button"));
    expect(props.carouselStore.getStoreState().isPlaying).toBe(false);
  });
});
