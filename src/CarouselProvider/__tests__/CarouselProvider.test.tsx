import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vite-plus/test";
import CarouselProvider, { CarouselContext } from "..";
import Slider from "../../Slider";
import { CarouselProviderProps } from "../../types";

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

describe("<CarouselProvider />", () => {
  let props: CarouselProviderProps;

  beforeEach(() => {
    props = {
      children: "Hello World!",
      naturalSlideHeight: 100,
      naturalSlideWidth: 100,
      totalSlides: 7,
    };
  });

  it("should render", () => {
    render(<CarouselProvider {...props}>Hello</CarouselProvider>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("utility function getStoreState should return the state via context", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;
    const capture = (ctx: React.ContextType<typeof CarouselContext>) => {
      contextRef = ctx;
    };

    render(
      <CarouselProvider {...props} orientation="vertical">
        <ContextCapture onCapture={capture} />
        Hello
      </CarouselProvider>,
    );
    expect(contextRef).not.toBeNull();
    expect(contextRef?.getStoreState().orientation).toBe("vertical");
  });

  it("should update the carouselStore values for slideSize and slideTraySize if totalSlides prop changes", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;
    const capture = (ctx: React.ContextType<typeof CarouselContext>) => {
      contextRef = ctx;
    };

    const { rerender } = render(
      <CarouselProvider {...props} totalSlides={4}>
        <ContextCapture onCapture={capture} />
      </CarouselProvider>,
    );
    expect(contextRef?.state.slideSize).toBe(25);
    expect(contextRef?.state.slideTraySize).toBe(400);

    rerender(
      <CarouselProvider {...props} totalSlides={2}>
        <ContextCapture onCapture={capture} />
      </CarouselProvider>,
    );
    expect(contextRef?.state.slideSize).toBe(50);
    expect(contextRef?.state.slideTraySize).toBe(200);
  });

  it("should update the carouselStore values for slideSize and slideTraySize if visibleSlides prop changes", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;
    const capture = (ctx: React.ContextType<typeof CarouselContext>) => {
      contextRef = ctx;
    };

    const { rerender } = render(
      <CarouselProvider {...props} totalSlides={4}>
        <ContextCapture onCapture={capture} />
      </CarouselProvider>,
    );
    expect(contextRef?.state.slideSize).toBe(25);
    expect(contextRef?.state.slideTraySize).toBe(400);

    rerender(
      <CarouselProvider {...props} totalSlides={4} visibleSlides={2}>
        <ContextCapture onCapture={capture} />
      </CarouselProvider>,
    );
    expect(contextRef?.state.slideSize).toBe(25);
    expect(contextRef?.state.slideTraySize).toBe(200);
  });

  it("should keep currentSlide within bounds of totalSlides", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;
    const capture = (ctx: React.ContextType<typeof CarouselContext>) => {
      contextRef = ctx;
    };

    const { rerender } = render(
      <CarouselProvider {...props} currentSlide={3} totalSlides={4}>
        <ContextCapture onCapture={capture} />
      </CarouselProvider>,
    );
    rerender(
      <CarouselProvider {...props} currentSlide={3} totalSlides={3}>
        <ContextCapture onCapture={capture} />
      </CarouselProvider>,
    );
    expect(contextRef?.state.currentSlide).toEqual(2);
  });

  it("should not update the carouselStore if some prop we do not track changes", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;
    const capture = (ctx: React.ContextType<typeof CarouselContext>) => {
      contextRef = ctx;
    };

    const { rerender } = render(
      <CarouselProvider {...props} data-foo={1}>
        <ContextCapture onCapture={capture} />
      </CarouselProvider>,
    );
    const start = { ...contextRef?.state };
    rerender(
      <CarouselProvider {...props} data-foo={2}>
        <ContextCapture onCapture={capture} />
      </CarouselProvider>,
    );
    const end = { ...contextRef?.state };
    expect(start).toEqual(end);
  });

  it("should not reset the currentSlide or disableAnimation values when unrelated props change", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;
    const capture = (ctx: React.ContextType<typeof CarouselContext>) => {
      contextRef = ctx;
    };

    const { rerender } = render(
      <CarouselProvider {...props} totalSlides={4} data-foo={1}>
        <ContextCapture onCapture={capture} />
      </CarouselProvider>,
    );
    act(() => {
      contextRef?.setStoreState({ currentSlide: 2 });
    });
    const start = { ...contextRef?.state };
    rerender(
      <CarouselProvider {...props} totalSlides={4} naturalSlideWidth={300} data-foo={1}>
        <ContextCapture onCapture={capture} />
      </CarouselProvider>,
    );
    const end = { ...contextRef?.state };
    expect(start.currentSlide).toEqual(end.currentSlide);
    expect(start.disableAnimation).toEqual(end.disableAnimation);
  });

  it("should set disableAnimation to true and privateUnDisableAnimation to true if we updated currentSlide prop on CarouselProvider component", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;
    const capture = (ctx: React.ContextType<typeof CarouselContext>) => {
      contextRef = ctx;
    };

    const { rerender } = render(
      <CarouselProvider {...props}>
        <ContextCapture onCapture={capture} />
        Hello
      </CarouselProvider>,
    );
    rerender(
      <CarouselProvider {...props} currentSlide={1}>
        <ContextCapture onCapture={capture} />
        Hello
      </CarouselProvider>,
    );
    expect(contextRef?.state.disableAnimation).toBe(true);
    expect(contextRef?.state.privateUnDisableAnimation).toBe(true);
  });

  it("The Slider component should reset disableAnimation to false and privateUnDisableAnimation to false when Slider component is updated", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;
    const capture = (ctx: React.ContextType<typeof CarouselContext>) => {
      contextRef = ctx;
    };

    const { rerender } = render(
      <CarouselProvider {...props}>
        <ContextCapture onCapture={capture} />
        <Slider>Hello</Slider>
      </CarouselProvider>,
    );
    rerender(
      <CarouselProvider {...props} currentSlide={1}>
        <ContextCapture onCapture={capture} />
        <Slider>Hello</Slider>
      </CarouselProvider>,
    );
    expect(contextRef?.state.disableAnimation).toBe(false);
    expect(contextRef?.state.privateUnDisableAnimation).toBe(false);
  });

  it("should correctly set store variable when using isIntrinsicHeight", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;
    const capture = (ctx: React.ContextType<typeof CarouselContext>) => {
      contextRef = ctx;
    };

    render(
      <CarouselProvider {...props} isIntrinsicHeight>
        <ContextCapture onCapture={capture} />
        test
      </CarouselProvider>,
    );
    expect(contextRef?.state.isIntrinsicHeight).toBe(true);
  });

  it("should throw an error when trying to use isIntrinsicHeight in vertical orientation", () => {
    expect(() =>
      render(
        <CarouselProvider {...props} isIntrinsicHeight orientation="vertical">
          test
        </CarouselProvider>,
      ),
    ).toThrow(Error);
  });

  it("should not leak Slider-only touch scroll threshold props to the root DOM element", () => {
    const runtimeProps = {
      ...props,
      preventVerticalScrollOnTouch: true,
      horizontalPixelThreshold: 15,
      verticalPixelThreshold: 10,
    } as unknown as CarouselProviderProps;

    const { container } = render(
      <CarouselProvider {...runtimeProps} data-testid="provider-root">
        Hello
      </CarouselProvider>,
    );

    const providerEl = container.querySelector('[data-testid="provider-root"]');
    expect(providerEl).not.toBeNull();
    expect(providerEl?.hasAttribute("preventVerticalScrollOnTouch")).toBe(false);
    expect(providerEl?.hasAttribute("preventverticalscrollontouch")).toBe(false);
    expect(providerEl?.hasAttribute("horizontalPixelThreshold")).toBe(false);
    expect(providerEl?.hasAttribute("horizontalpixelthreshold")).toBe(false);
    expect(providerEl?.hasAttribute("verticalPixelThreshold")).toBe(false);
    expect(providerEl?.hasAttribute("verticalpixelthreshold")).toBe(false);
  });

  it("should initialize pauseOnInteract to true by default and sync changes to the store", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;
    const capture = (ctx: React.ContextType<typeof CarouselContext>) => {
      contextRef = ctx;
    };

    const { rerender } = render(
      <CarouselProvider {...props}>
        <ContextCapture onCapture={capture} />
      </CarouselProvider>,
    );
    expect(contextRef?.state.pauseOnInteract).toBe(true);

    rerender(
      <CarouselProvider {...props} pauseOnInteract={false}>
        <ContextCapture onCapture={capture} />
      </CarouselProvider>,
    );
    expect(contextRef?.state.pauseOnInteract).toBe(false);
  });

  it("should initialize snapType, snapAlign, and snapStop by default, sync changes to the store, and not leak them to the root DOM element", () => {
    let contextRef!: React.ContextType<typeof CarouselContext>;
    const capture = (ctx: React.ContextType<typeof CarouselContext>) => {
      contextRef = ctx;
    };

    const { container, rerender } = render(
      <CarouselProvider {...props} data-testid="provider-root">
        <ContextCapture onCapture={capture} />
      </CarouselProvider>,
    );
    expect(contextRef?.state.snapType).toBe("mandatory");
    expect(contextRef?.state.snapAlign).toBe("start");
    expect(contextRef?.state.snapStop).toBe("normal");

    rerender(
      <CarouselProvider
        {...props}
        data-testid="provider-root"
        snapType="proximity"
        snapAlign="center"
        snapStop="always"
      >
        <ContextCapture onCapture={capture} />
      </CarouselProvider>,
    );
    expect(contextRef?.state.snapType).toBe("proximity");
    expect(contextRef?.state.snapAlign).toBe("center");
    expect(contextRef?.state.snapStop).toBe("always");

    const providerEl = container.querySelector('[data-testid="provider-root"]');
    expect(providerEl).not.toBeNull();
    expect(providerEl?.hasAttribute("snapType")).toBe(false);
    expect(providerEl?.hasAttribute("snaptype")).toBe(false);
    expect(providerEl?.hasAttribute("snapAlign")).toBe(false);
    expect(providerEl?.hasAttribute("snapalign")).toBe(false);
    expect(providerEl?.hasAttribute("snapStop")).toBe(false);
    expect(providerEl?.hasAttribute("snapstop")).toBe(false);
  });
});
