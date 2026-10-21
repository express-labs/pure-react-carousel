import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vite-plus/test";
import ButtonBack from "../ButtonBack";
import Store from "../../Store/Store";
import { CarouselProvider, CarouselContext } from "../..";
import ButtonBackWithStore from "..";

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

describe("<ButtonBack />", () => {
  it("should render", () => {
    const mockStore = new Store({ currentSlide: 1, step: 1, totalSlides: 10, visibleSlides: 1 });
    render(
      <ButtonBack
        currentSlide={1}
        step={1}
        carouselStore={mockStore}
        totalSlides={10}
        visibleSlides={1}
      >
        Hello
      </ButtonBack>,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should be disabled if the currentSlide is 0", () => {
    const mockStore = new Store({ currentSlide: 0, step: 1, totalSlides: 10, visibleSlides: 1 });
    render(
      <ButtonBack
        currentSlide={0}
        step={1}
        carouselStore={mockStore}
        totalSlides={10}
        visibleSlides={1}
      >
        Hello
      </ButtonBack>,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should be disabled if the disabled prop is set manually, regardless of currentSlide", () => {
    const mockStore = new Store({ currentSlide: 1, step: 1, totalSlides: 10, visibleSlides: 1 });
    render(
      <ButtonBack
        currentSlide={1}
        step={1}
        carouselStore={mockStore}
        totalSlides={10}
        visibleSlides={1}
        disabled
      >
        Hello
      </ButtonBack>,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should subtract the value of step from currentSlide when clicked.", () => {
    const mockStore = new Store({
      currentSlide: 4,
      step: 3,
    });

    render(
      <ButtonBack
        currentSlide={4}
        step={3}
        totalSlides={10}
        visibleSlides={1}
        carouselStore={mockStore}
      >
        Hello
      </ButtonBack>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(mockStore.getStoreState().currentSlide).toBe(1);
  });

  it("should subtract the value of step from currentSlide when clicked and infinite is true.", () => {
    const mockStore = new Store({
      currentSlide: 4,
      step: 3,
      totalSlides: 10,
      visibleSlides: 3,
    });

    render(
      <ButtonBack
        infinite
        currentSlide={4}
        step={3}
        totalSlides={10}
        visibleSlides={3}
        carouselStore={mockStore}
      >
        back
      </ButtonBack>,
    );
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(mockStore.getStoreState().currentSlide).toBe(1);
  });

  it("should set the current slide to last if clicked when on the first slide if infinite is true.", () => {
    const mockStore = new Store({
      currentSlide: 0,
      step: 3,
      totalSlides: 10,
      visibleSlides: 3,
    });

    render(
      <ButtonBack
        infinite
        currentSlide={0}
        step={3}
        totalSlides={10}
        visibleSlides={3}
        carouselStore={mockStore}
      >
        Back
      </ButtonBack>,
    );
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(mockStore.getStoreState().currentSlide).toBe(7);
  });

  it("should call an onClick function passed as a prop", () => {
    const mockStore = new Store({
      currentSlide: 4,
      step: 3,
    });

    const mockOnClick = vi.fn();

    render(
      <ButtonBack
        currentSlide={4}
        step={3}
        carouselStore={mockStore}
        onClick={mockOnClick}
        totalSlides={10}
        visibleSlides={1}
      >
        Hello
      </ButtonBack>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should disable the button and change the slide to 0 if currentSlide - step <= 0", () => {
    render(
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={3}
        currentSlide={1}
        step={3}
      >
        <ButtonBackWithStore>Hello</ButtonBackWithStore>
      </CarouselProvider>,
    );

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(button).toBeDisabled();
  });

  it("should pass through any classes and append them to the list of classnames", () => {
    const mockStore = new Store({ currentSlide: 4, step: 3 });
    render(
      <ButtonBack
        currentSlide={4}
        step={3}
        carouselStore={mockStore}
        totalSlides={10}
        visibleSlides={1}
        className="bob"
      >
        Hello
      </ButtonBack>,
    );
    const button = screen.getByRole("button");
    const classes = button.className.split(" ");
    expect(classes[0]).toEqual("buttonBack");
    expect(classes[1]).toEqual("carousel__back-button");
    expect(classes[2]).toEqual("bob");
  });

  it("should pass through any props not consumed by the component", () => {
    const mockStore = new Store({ currentSlide: 4, step: 3 });
    render(
      <ButtonBack
        currentSlide={4}
        step={3}
        carouselStore={mockStore}
        totalSlides={10}
        visibleSlides={1}
        data-foo="bar"
      >
        Hello
      </ButtonBack>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("data-foo", "bar");
  });

  it("should pause autoplay when clicked", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;

    render(
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={3}
        currentSlide={1}
        step={3}
        isPlaying
      >
        <ContextCapture
          onCapture={(ctx) => {
            contextRef = ctx;
          }}
        />
        <ButtonBackWithStore>Hello</ButtonBackWithStore>
      </CarouselProvider>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(contextRef?.getStoreState().isPlaying).toBe(false);
  });

  it("should not pause autoplay when clicked and pauseOnInteract is false", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;

    render(
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={3}
        currentSlide={1}
        step={1}
        isPlaying
        pauseOnInteract={false}
      >
        <ContextCapture
          onCapture={(ctx) => {
            contextRef = ctx;
          }}
        />
        <ButtonBackWithStore>Hello</ButtonBackWithStore>
      </CarouselProvider>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(contextRef?.getStoreState().currentSlide).toBe(0);
    expect(contextRef?.getStoreState().isPlaying).toBe(true);
  });

  it("should forward ref to the underlying button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <CarouselProvider naturalSlideWidth={100} naturalSlideHeight={125} totalSlides={3}>
        <ButtonBackWithStore ref={ref}>Back</ButtonBackWithStore>
      </CarouselProvider>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveClass("carousel__back-button");
  });

  it("should default aria-label to 'previous' only when no children, aria-label, or aria-labelledby are provided", () => {
    const mockStore = new Store({ currentSlide: 1, step: 1, totalSlides: 3, visibleSlides: 1 });
    const { rerender } = render(
      <ButtonBack
        currentSlide={1}
        step={1}
        carouselStore={mockStore}
        totalSlides={3}
        visibleSlides={1}
      />,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "previous");

    rerender(
      <ButtonBack
        currentSlide={1}
        step={1}
        carouselStore={mockStore}
        totalSlides={3}
        visibleSlides={1}
      >
        Previous Slide
      </ButtonBack>,
    );
    expect(screen.getByRole("button", { name: "Previous Slide" })).not.toHaveAttribute(
      "aria-label",
    );

    rerender(
      <ButtonBack
        currentSlide={1}
        step={1}
        carouselStore={mockStore}
        totalSlides={3}
        visibleSlides={1}
        aria-labelledby="prev-label"
      />,
    );
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-label");
    expect(screen.getByRole("button")).toHaveAttribute("aria-labelledby", "prev-label");
  });
});
