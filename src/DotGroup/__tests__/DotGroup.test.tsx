import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vite-plus/test";
import DotGroup from "../DotGroup";
import Store from "../../Store/Store";
import { CarouselProvider } from "../..";
import type { DotGroupViewProps } from "../../types";

const renderWithProvider = (ui: React.ReactElement) =>
  render(
    <CarouselProvider
      naturalSlideWidth={100}
      naturalSlideHeight={100}
      totalSlides={3}
      visibleSlides={2}
      currentSlide={1}
    >
      {ui}
    </CarouselProvider>,
  );

const renderCustomDots = ({ totalSlides }: DotGroupViewProps): React.ReactElement[] => {
  const dots: React.ReactElement[] = [];

  for (let i = 0; i < totalSlides; i += 1) {
    dots.push(<img key={i} data-testid={`custom-dot-${i}`} src="data:," alt="" />);
  }
  return dots;
};

describe("<DotGroup />", () => {
  let props: DotGroupViewProps;

  beforeEach(() => {
    props = {
      carouselStore: new Store({
        currentSlide: 1,
        totalSlides: 3,
        visibleSlides: 2,
      }),
      currentSlide: 1,
      totalSlides: 3,
      visibleSlides: 2,
    };
  });

  it("should render", () => {
    const { container } = renderWithProvider(<DotGroup {...props} />);
    expect(container.querySelector(".carousel__dot-group")).toBeInTheDocument();
  });

  it("should render any children", () => {
    renderWithProvider(
      <DotGroup {...props}>
        <h1>Hello There</h1>
      </DotGroup>,
    );
    expect(screen.getByRole("heading", { name: "Hello There" })).toBeInTheDocument();
  });

  it("should render dots with numbers if dotNumbers prop is true", () => {
    renderWithProvider(<DotGroup {...props} dotNumbers />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveTextContent("1");
    expect(buttons[1]).toHaveTextContent("2");
    expect(buttons[2]).toHaveTextContent("3");
  });

  it("should NOT render dots with numbers if dotNumbers prop is not set", () => {
    renderWithProvider(<DotGroup {...props} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveTextContent("");
    expect(buttons[1]).toHaveTextContent("");
    expect(buttons[2]).toHaveTextContent("");
  });

  it("should render enabled active dots if disableActiveDots prop is false", () => {
    renderWithProvider(<DotGroup {...props} disableActiveDots={false} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[1]).not.toBeDisabled();
    expect(buttons[2]).not.toBeDisabled();
  });

  it("should render DISABLED dots if disableActiveDots prop is not set", () => {
    renderWithProvider(<DotGroup {...props} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[1]).toBeDisabled();
    expect(buttons[2]).toBeDisabled();
  });

  it("should render only current slide dot as selected if showAsSelectedForCurrentSlideOnly prop is true", () => {
    renderWithProvider(<DotGroup {...props} showAsSelectedForCurrentSlideOnly />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).not.toHaveClass("carousel__dot--selected");
    expect(buttons[1]).toHaveClass("carousel__dot--selected");
    expect(buttons[2]).not.toHaveClass("carousel__dot--selected");
  });

  it("should render all visible slides dot as selected if showAsSelectedForCurrentSlideOnly prop is not set", () => {
    renderWithProvider(<DotGroup {...props} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).not.toHaveClass("carousel__dot--selected");
    expect(buttons[1]).toHaveClass("carousel__dot--selected");
    expect(buttons[2]).toHaveClass("carousel__dot--selected");
  });

  it("should render dots differently if renderDots is provided", () => {
    renderWithProvider(<DotGroup {...props} renderDots={renderCustomDots} />);
    expect(screen.getByTestId("custom-dot-0")).toBeInTheDocument();
    expect(screen.getByTestId("custom-dot-1")).toBeInTheDocument();
    expect(screen.getByTestId("custom-dot-2")).toBeInTheDocument();
  });

  it("should keep fallback aria-label when dotNumbers is false, omit it when dotNumbers is true, and forward dotProps and getDotProps", () => {
    const { rerender } = renderWithProvider(<DotGroup {...props} />);
    let buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveAttribute("aria-label", "slide dot");

    rerender(
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={100}
        totalSlides={3}
        visibleSlides={2}
        currentSlide={1}
      >
        <DotGroup {...props} dotNumbers />
      </CarouselProvider>,
    );
    buttons = screen.getAllByRole("button");
    expect(buttons[0]).not.toHaveAttribute("aria-label");
    expect(buttons[0]).toHaveAccessibleName("1");
    expect(buttons[1]).toHaveAccessibleName("2");

    rerender(
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={100}
        totalSlides={3}
        visibleSlides={2}
        currentSlide={1}
      >
        <DotGroup
          {...props}
          dotProps={{ className: "shared-dot" }}
          getDotProps={(i, selected) => ({
            "aria-label": `Go to slide ${i + 1}${selected ? " (active)" : ""}`,
            children: `Dot ${i + 1}`,
          })}
        />
      </CarouselProvider>,
    );
    buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveClass("shared-dot");
    expect(buttons[0]).toHaveAttribute("aria-label", "Go to slide 1");
    expect(buttons[0]).toHaveTextContent("Dot 1");
    expect(buttons[1]).toHaveAttribute("aria-label", "Go to slide 2 (active)");
  });
});
