import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vite-plus/test";
import ButtonNext from "../ButtonNext";
import Store from "../../Store/Store";
import { CarouselProvider, CarouselContext } from "../..";
import ButtonNextWithStore from "..";
import type { ButtonNextViewProps } from "../../types";

const ContextCapture = ({
  onCapture,
}: {
  onCapture: (ctx: React.ContextType<typeof CarouselContext>) => void;
}): null => {
  const ctx = React.useContext(CarouselContext);
  React.useEffect(() => {
    onCapture(ctx);
  });
  return null;
};

describe("<ButtonNext />", () => {
  let props: ButtonNextViewProps;

  beforeEach(() => {
    props = {
      children: "Onward!",
      carouselStore: new Store({
        currentSlide: 1,
        step: 1,
        totalSlides: 7,
        visibleSlides: 2,
      }),
      currentSlide: 1,
      step: 1,
      totalSlides: 7,
      visibleSlides: 2,
    };
  });

  it("should render", () => {
    render(<ButtonNext {...props} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should be disabled if the currentSlide >= totalSlides - visibleSlides", () => {
    const carouselStore = new Store({
      currentSlide: 5,
      totalSlides: 7,
      visibleSlides: 2,
    });
    render(
      <ButtonNext
        {...props}
        currentSlide={5}
        totalSlides={7}
        visibleSlides={2}
        carouselStore={carouselStore}
      />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should NOT be disabled if the currentSlide < totalSlides - visibleSlides", () => {
    const carouselStore = new Store({
      currentSlide: 4,
      totalSlides: 7,
      visibleSlides: 2,
      step: 1,
    });
    render(
      <ButtonNext
        {...props}
        currentSlide={4}
        totalSlides={7}
        visibleSlides={2}
        step={1}
        carouselStore={carouselStore}
      />,
    );
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("should be disabled if the disabled prop is set manually, regardless of currentSlide", () => {
    render(<ButtonNext {...props} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should add the value of step from currentSlide when clicked.", () => {
    const carouselStore = new Store({
      currentSlide: 0,
      totalSlides: 7,
      visibleSlides: 2,
      step: 2,
    });

    render(
      <ButtonNext
        {...props}
        carouselStore={carouselStore}
        currentSlide={0}
        totalSlides={7}
        visibleSlides={2}
        step={2}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(carouselStore.state.currentSlide).toBe(2);
  });

  it("should add the value of step from currentSlide when clicked and infinite is true.", () => {
    const carouselStore = new Store({
      currentSlide: 0,
      totalSlides: 7,
      visibleSlides: 2,
      step: 2,
    });

    render(
      <ButtonNext
        infinite
        {...props}
        carouselStore={carouselStore}
        currentSlide={0}
        totalSlides={7}
        visibleSlides={2}
        step={2}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(carouselStore.state.currentSlide).toBe(2);
  });

  it("should set the current slide to first slide if clicked when on the last slide if infinite is true.", () => {
    const mockStore = new Store({
      currentSlide: 7,
      step: 3,
      totalSlides: 10,
    });

    render(
      <ButtonNext
        infinite
        currentSlide={7}
        step={3}
        totalSlides={10}
        visibleSlides={3}
        carouselStore={mockStore}
      >
        Next
      </ButtonNext>,
    );
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(mockStore.getStoreState().currentSlide).toBe(0);
  });

  it("should call an onClick function passed as a prop", () => {
    const onClick = vi.fn();
    render(<ButtonNext {...props} onClick={onClick} currentSlide={0} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should disable the button and change the slide to (totalSlides - visibleSlides) if ((currentSlide + step) >= (totalSlides + 1))", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;

    const newProps = {
      currentSlide: 4,
      totalSlides: 7,
      visibleSlides: 2,
      step: 4,
      naturalSlideWidth: 100,
      naturalSlideHeight: 125,
    };

    render(
      <CarouselProvider {...newProps}>
        <ContextCapture
          onCapture={(ctx) => {
            contextRef = ctx;
          }}
        />
        <ButtonNextWithStore>Next</ButtonNextWithStore>
      </CarouselProvider>,
    );

    const button = screen.getByRole("button");
    expect(contextRef?.state.currentSlide).toBe(4);
    fireEvent.click(button);
    expect(contextRef?.state.currentSlide).toBe(newProps.totalSlides - newProps.visibleSlides);
    expect(button).toBeDisabled();
  });

  it("should pause autoplay when clicked", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;

    render(
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={3}
        currentSlide={0}
        step={1}
        isPlaying
      >
        <ContextCapture
          onCapture={(ctx) => {
            contextRef = ctx;
          }}
        />
        <ButtonNextWithStore>Hello</ButtonNextWithStore>
      </CarouselProvider>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(contextRef?.state.isPlaying).toBe(false);
  });

  it("should not pause autoplay when clicked and pauseOnInteract is false", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;

    render(
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={3}
        currentSlide={0}
        step={1}
        isPlaying
        pauseOnInteract={false}
      >
        <ContextCapture
          onCapture={(ctx) => {
            contextRef = ctx;
          }}
        />
        <ButtonNextWithStore>Hello</ButtonNextWithStore>
      </CarouselProvider>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(contextRef?.state.currentSlide).toBe(1);
    expect(contextRef?.state.isPlaying).toBe(true);
  });

  it("should default aria-label to 'next' only when no children, aria-label, or aria-labelledby are provided", () => {
    const { rerender } = render(<ButtonNext {...props}>{undefined}</ButtonNext>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "next");

    rerender(<ButtonNext {...props}>Next Slide</ButtonNext>);
    expect(screen.getByRole("button", { name: "Next Slide" })).not.toHaveAttribute("aria-label");

    rerender(
      <ButtonNext {...props} aria-labelledby="next-label">
        {undefined}
      </ButtonNext>,
    );
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-label");
    expect(screen.getByRole("button")).toHaveAttribute("aria-labelledby", "next-label");
  });
});
