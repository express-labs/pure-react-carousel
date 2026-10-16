import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import ButtonFirst from "../ButtonFirst";
import Store from "../../Store/Store";
import { ButtonFirstProps } from "../../types";

describe("<ButtonFirst />", () => {
  let props: ButtonFirstProps;

  beforeEach(() => {
    props = {
      children: "Onward!",
      carouselStore: new Store({
        currentSlide: 1,
        totalSlides: 7,
        isPlaying: true,
      }),
      currentSlide: 1,
      totalSlides: 7,
    };
  });

  it("should render", () => {
    render(<ButtonFirst {...props} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should be disabled if the currentSlide is 0", () => {
    render(<ButtonFirst {...props} currentSlide={0} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should be disabled if the disabled prop is set manually, regardless of currentSlide", () => {
    render(<ButtonFirst {...props} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should set the currentSlide to 0 when clicked", () => {
    render(<ButtonFirst {...props} />);
    fireEvent.click(screen.getByRole("button"));
    expect(props.carouselStore.getStoreState().currentSlide).toBe(0);
  });

  it("should call an onClick function passed as a prop", () => {
    const onClick = vi.fn();
    render(<ButtonFirst {...props} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should pause autoplay when clicked", () => {
    render(<ButtonFirst {...props} />);
    fireEvent.click(screen.getByRole("button"));
    expect(props.carouselStore.getStoreState().isPlaying).toBe(false);
  });
});
