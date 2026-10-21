import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vite-plus/test";
import ButtonLast from "../ButtonLast";
import Store from "../../Store/Store";
import type { ButtonLastViewProps } from "../../types";

describe("<ButtonLast />", () => {
  let props: ButtonLastViewProps;

  beforeEach(() => {
    props = {
      children: "Onward!",
      carouselStore: new Store({
        currentSlide: 1,
        totalSlides: 7,
        visibleSlides: 1,
      }),
      currentSlide: 1,
      totalSlides: 7,
      visibleSlides: 1,
    };
  });

  it("should render", () => {
    render(<ButtonLast {...props} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should be disabled if the currentSlide is equal to totalSlides", () => {
    render(<ButtonLast {...props} currentSlide={props.totalSlides} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should be disabled if the disabled prop is set manually, regardless of currentSlide", () => {
    render(<ButtonLast {...props} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should set the currentSlide to totalSlides - 1 when clicked", () => {
    render(<ButtonLast {...props} />);
    fireEvent.click(screen.getByRole("button"));
    expect(props.carouselStore.getStoreState().currentSlide).toBe(props.totalSlides - 1);
  });

  it("should call an onClick function passed as a prop", () => {
    const onClick = vi.fn();
    render(<ButtonLast {...props} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should set the button to disabled when (visibleSlides > 1) and (currentSlide >= totalSlides - visibleSlides)", () => {
    const customStore = new Store({
      currentSlide: 5,
      totalSlides: 7,
      visibleSlides: 2,
    });
    render(
      <ButtonLast
        {...props}
        currentSlide={5}
        carouselStore={customStore}
        totalSlides={7}
        visibleSlides={2}
      />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should NOT set the button to disabled when (visibleSlides > 1) and (currentSlide < totalSlides - visibleSlides)", () => {
    const customStore = new Store({
      currentSlide: 4,
      totalSlides: 7,
      visibleSlides: 2,
    });
    render(
      <ButtonLast
        {...props}
        currentSlide={4}
        carouselStore={customStore}
        totalSlides={7}
        visibleSlides={2}
      />,
    );
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("should pause autoplay when clicked", () => {
    const customStore = new Store({
      isPlaying: true,
    });
    render(<ButtonLast {...props} carouselStore={customStore} />);
    fireEvent.click(screen.getByRole("button"));
    expect(customStore.getStoreState().isPlaying).toBe(false);
  });

  it("should not pause autoplay when clicked and pauseOnInteract is false", () => {
    const customStore = new Store({
      isPlaying: true,
    });
    render(<ButtonLast {...props} carouselStore={customStore} pauseOnInteract={false} />);
    fireEvent.click(screen.getByRole("button"));
    expect(customStore.getStoreState().currentSlide).toBe(props.totalSlides - 1);
    expect(customStore.getStoreState().isPlaying).toBe(true);
  });

  it("should default aria-label to 'last' only when no children, aria-label, or aria-labelledby are provided", () => {
    const { rerender } = render(<ButtonLast {...props}>{undefined}</ButtonLast>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "last");

    rerender(<ButtonLast {...props}>Last Slide</ButtonLast>);
    expect(screen.getByRole("button", { name: "Last Slide" })).not.toHaveAttribute("aria-label");

    rerender(
      <ButtonLast {...props} aria-labelledby="last-label">
        {undefined}
      </ButtonLast>,
    );
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-label");
    expect(screen.getByRole("button")).toHaveAttribute("aria-labelledby", "last-label");
  });
});
