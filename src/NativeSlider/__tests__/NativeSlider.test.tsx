import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { createComponentConfig } from "../../__tests__/component-config";
import Store from "../../Store/Store";
import NativeSliderView from "../NativeSlider";
import NativeSlider from "../index";
import CarouselProvider from "../../CarouselProvider";
import Slide from "../../Slide";
import ButtonNext from "../../ButtonNext";
import type { NativeSliderViewProps } from "../../types";

interface MockIntersectionEntry {
  target: Element;
  isIntersecting: boolean;
  intersectionRatio: number;
}

type ObserverCallback = (entries: MockIntersectionEntry[]) => void;

describe("<NativeSlider />", () => {
  let props: ReturnType<typeof createComponentConfig>["NativeSlider"]["props"];
  let observerCallback: ObserverCallback | null = null;
  let observedElements: Element[] = [];
  let observeSpy: ReturnType<typeof vi.fn>;
  let unobserveSpy: ReturnType<typeof vi.fn>;
  let disconnectSpy: ReturnType<typeof vi.fn>;
  let originalIntersectionObserver: typeof globalThis.IntersectionObserver | undefined;

  beforeEach(() => {
    vi.useFakeTimers();
    props = createComponentConfig().NativeSlider.props;
    observerCallback = null;
    observedElements = [];
    observeSpy = vi.fn((el: Element) => {
      observedElements.push(el);
    });
    unobserveSpy = vi.fn((el: Element) => {
      observedElements = observedElements.filter((item) => item !== el);
    });
    disconnectSpy = vi.fn();
    originalIntersectionObserver = globalThis.IntersectionObserver;

    class MockIntersectionObserver {
      readonly root: Element | Document | null;
      readonly thresholds: ReadonlyArray<number>;

      constructor(cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        observerCallback = cb as unknown as ObserverCallback;
        this.root = options?.root ?? null;
        this.thresholds = Array.isArray(options?.threshold)
          ? options.threshold
          : [options?.threshold ?? 0];
      }

      observe = observeSpy;
      unobserve = unobserveSpy;
      disconnect = disconnectSpy;
      takeRecords = () => [];
    }

    globalThis.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    if (originalIntersectionObserver) {
      globalThis.IntersectionObserver = originalIntersectionObserver;
    } else {
      Reflect.deleteProperty(globalThis, "IntersectionObserver");
    }
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const renderWithSlides = (
    overrideProps: Partial<NativeSliderViewProps> = {},
    slideCount = props.totalSlides,
  ) =>
    render(
      <NativeSliderView {...props} {...overrideProps}>
        {Array.from({ length: slideCount }, (_, i) => (
          <div key={i} className="carousel__slide" data-slide-index={i}>
            Slide {i}
          </div>
        ))}
      </NativeSliderView>,
    );

  describe("DOM structure, orientation & props", () => {
    it("renders the 3-level DOM structure in horizontal orientation with connected NativeSlider", () => {
      const { container } = render(
        <CarouselProvider naturalSlideWidth={100} naturalSlideHeight={125} totalSlides={3}>
          <NativeSlider
            className="custom-slider"
            classNameTrayWrap="custom-wrap"
            classNameTray="custom-tray"
          >
            <Slide index={0}>Slide 0</Slide>
            <Slide index={1}>Slide 1</Slide>
            <Slide index={2}>Slide 2</Slide>
          </NativeSlider>
        </CarouselProvider>,
      );

      const slider = container.querySelector(".carousel__slider") as HTMLElement;
      const trayWrap = container.querySelector(".carousel__slider-tray-wrapper") as HTMLElement;
      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;

      expect(slider).toBeInTheDocument();
      expect(slider).toHaveClass(
        "horizontalSlider",
        "carousel__slider",
        "carousel__native-slider",
        "carousel__slider--horizontal",
        "carousel__native-slider--horizontal",
        "custom-slider",
      );
      expect(slider).toHaveAttribute("aria-live", "polite");
      expect(slider).toHaveAttribute("aria-label", "slider");
      expect(slider).toHaveAttribute("role", "listbox");

      expect(trayWrap).toBeInTheDocument();
      expect(trayWrap).toHaveClass(
        "trayWrap",
        "horizontalSlideTrayWrap",
        "carousel__slider-tray-wrapper",
        "carousel__native-slider-tray-wrapper",
        "carousel__slider-tray-wrap--horizontal",
        "custom-wrap",
      );

      expect(tray).toBeInTheDocument();
      expect(tray).toHaveClass(
        "sliderTray",
        "horizontalTray",
        "carousel__slider-tray",
        "carousel__native-slider-tray",
        "carousel__slider-tray--horizontal",
        "custom-tray",
      );
      expect(tray.style.width).toBe("300%");
      expect(tray.style.flexDirection).toBe("row");
    });

    it("renders vertical orientation styles and classes", () => {
      const { container } = renderWithSlides({
        orientation: "vertical",
        naturalSlideWidth: 100,
        naturalSlideHeight: 100,
        visibleSlides: 2,
      });

      const slider = container.querySelector(".carousel__native-slider") as HTMLElement;
      const trayWrap = container.querySelector(
        ".carousel__native-slider-tray-wrapper",
      ) as HTMLElement;
      const tray = container.querySelector(".carousel__native-slider-tray") as HTMLElement;

      expect(slider).toHaveClass(
        "verticalSlider",
        "carousel__slider--vertical",
        "carousel__native-slider--vertical",
      );
      expect(trayWrap).toHaveClass("verticalSlideTrayWrap", "carousel__slider-tray-wrap--vertical");
      expect(trayWrap.style.height).toBe("0px");
      expect(trayWrap.style.paddingBottom).toBe("200%");
      expect(trayWrap.style.width).toBe("100%");

      expect(tray).toHaveClass("verticalTray", "carousel__slider-tray--vertical");
      expect(tray.style.width).toBe("100%");
      expect(tray.style.flexDirection).toBe("column");
    });

    it("applies isIntrinsicHeight flex styles and custom trayTag / filtered trayProps", () => {
      const { container } = renderWithSlides({
        isIntrinsicHeight: true,
        trayTag: "ul",
        trayProps: {
          id: "custom-tray",
          className: "ignored-class",
          style: { color: "red" },
        },
      });

      const tray = container.querySelector("ul.carousel__native-slider-tray") as HTMLElement;
      expect(tray).toBeInTheDocument();
      expect(tray).toHaveAttribute("id", "custom-tray");
      expect(tray).not.toHaveClass("ignored-class");
      expect(tray.style.display).toBe("flex");
      expect(tray.style.alignItems).toBe("stretch");
    });
  });

  describe("CSS classes for snapType, hideScrollbar, disableAnimation, and touchEnabled", () => {
    it("applies snapType classes for mandatory, proximity, and none", () => {
      const { container, rerender } = renderWithSlides({ snapType: "mandatory" });
      const trayWrap = container.querySelector(
        ".carousel__native-slider-tray-wrapper",
      ) as HTMLElement;

      expect(trayWrap).toHaveClass(
        "snapMandatory",
        "carousel__native-slider-tray-wrapper--snap-mandatory",
      );

      rerender(
        <NativeSliderView {...props} snapType="proximity">
          <div className="carousel__slide">Slide 0</div>
        </NativeSliderView>,
      );
      expect(trayWrap).toHaveClass(
        "snapProximity",
        "carousel__native-slider-tray-wrapper--snap-proximity",
      );

      rerender(
        <NativeSliderView {...props} snapType="none">
          <div className="carousel__slide">Slide 0</div>
        </NativeSliderView>,
      );
      expect(trayWrap).toHaveClass("snapNone", "carousel__native-slider-tray-wrapper--snap-none");
    });

    it("applies hideScrollbar, disableAnimation, and touchDisabled classes appropriately", () => {
      const { container, rerender } = renderWithSlides({
        hideScrollbar: true,
        disableAnimation: false,
        touchEnabled: true,
      });

      const slider = container.querySelector(".carousel__native-slider") as HTMLElement;
      const trayWrap = container.querySelector(
        ".carousel__native-slider-tray-wrapper",
      ) as HTMLElement;

      expect(trayWrap).toHaveClass(
        "hideScrollbar",
        "carousel__native-slider-tray-wrapper--hide-scrollbar",
        "smoothScroll",
        "carousel__native-slider-tray-wrapper--smooth-scroll",
      );
      expect(slider).not.toHaveClass("touchDisabled");
      expect(trayWrap).not.toHaveClass("touchDisabled");

      rerender(
        <NativeSliderView {...props} hideScrollbar={false} disableAnimation touchEnabled={false}>
          <div className="carousel__slide">Slide 0</div>
        </NativeSliderView>,
      );

      expect(trayWrap).not.toHaveClass(
        "hideScrollbar",
        "carousel__native-slider-tray-wrapper--hide-scrollbar",
      );
      expect(trayWrap).toHaveClass(
        "instantScroll",
        "carousel__native-slider-tray-wrapper--instant-scroll",
        "touchDisabled",
      );
      expect(slider).toHaveClass("touchDisabled");
    });
  });

  describe("IntersectionObserver slide tracking", () => {
    it("observes slides and updates currentSlide when a slide crosses >= 0.5 ratio (clamped to totalSlides - visibleSlides)", () => {
      const store = new Store({ currentSlide: 0, totalSlides: 5, visibleSlides: 2 });
      const { unmount } = renderWithSlides({
        carouselStore: store,
        currentSlide: 0,
        totalSlides: 5,
        visibleSlides: 2,
      });

      expect(observedElements).toHaveLength(5);
      expect(observerCallback).not.toBeNull();

      // Below threshold (< 0.5) should be ignored
      act(() => {
        observerCallback?.([
          { target: observedElements[1], isIntersecting: true, intersectionRatio: 0.3 },
        ]);
      });
      expect(store.getStoreState().currentSlide).toBe(0);

      // Crossing >= 0.5 updates currentSlide
      act(() => {
        observerCallback?.([
          { target: observedElements[2], isIntersecting: true, intersectionRatio: 0.6 },
        ]);
      });
      expect(store.getStoreState().currentSlide).toBe(2);

      // Trailing slide (index 4) clamps to totalSlides - visibleSlides (5 - 2 = 3)
      act(() => {
        observerCallback?.([
          { target: observedElements[4], isIntersecting: true, intersectionRatio: 0.9 },
        ]);
      });
      expect(store.getStoreState().currentSlide).toBe(3);

      // Non-slide element or non-intersecting entry is ignored
      const unrelatedEl = document.createElement("div");
      act(() => {
        observerCallback?.([
          { target: unrelatedEl, isIntersecting: true, intersectionRatio: 1 },
          { target: observedElements[0], isIntersecting: false, intersectionRatio: 0.8 },
        ]);
      });
      expect(store.getStoreState().currentSlide).toBe(3);

      unmount();
      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });

    it("observes dynamically added slides and unobserves removed slides when children or totalSlides change", () => {
      const { container, rerender } = render(
        <CarouselProvider naturalSlideWidth={100} naturalSlideHeight={100} totalSlides={2}>
          <NativeSlider>
            <Slide index={0}>Slide 0</Slide>
            <Slide index={1}>Slide 1</Slide>
          </NativeSlider>
        </CarouselProvider>,
      );

      expect(observedElements).toHaveLength(2);
      expect(observeSpy).toHaveBeenCalledTimes(2);

      // Dynamically add Slide 2 and increase totalSlides to 3
      rerender(
        <CarouselProvider naturalSlideWidth={100} naturalSlideHeight={100} totalSlides={3}>
          <NativeSlider>
            <Slide index={0}>Slide 0</Slide>
            <Slide index={1}>Slide 1</Slide>
            <Slide index={2}>Slide 2</Slide>
          </NativeSlider>
        </CarouselProvider>,
      );

      const slidesAfterAdd = container.querySelectorAll(".carousel__slide");
      expect(slidesAfterAdd).toHaveLength(3);
      expect(observedElements).toHaveLength(3);
      expect(observedElements).toContain(slidesAfterAdd[2]);
      // Existing unchanged slide DOM nodes are not re-observed or unobserved
      expect(observeSpy).toHaveBeenCalledTimes(3);
      expect(unobserveSpy).not.toHaveBeenCalled();

      // Intersecting the newly added Slide 2 updates currentSlide to 2
      act(() => {
        observerCallback?.([
          { target: slidesAfterAdd[2], isIntersecting: true, intersectionRatio: 0.75 },
        ]);
      });
      expect(slidesAfterAdd[2]).toHaveAttribute("aria-selected", "true");
      expect(slidesAfterAdd[0]).toHaveAttribute("aria-selected", "false");

      // Dynamically remove Slide 2 and decrease totalSlides back to 2
      const removedSlide = slidesAfterAdd[2];
      rerender(
        <CarouselProvider naturalSlideWidth={100} naturalSlideHeight={100} totalSlides={2}>
          <NativeSlider>
            <Slide index={0}>Slide 0</Slide>
            <Slide index={1}>Slide 1</Slide>
          </NativeSlider>
        </CarouselProvider>,
      );

      expect(unobserveSpy).toHaveBeenCalledTimes(1);
      expect(unobserveSpy).toHaveBeenCalledWith(removedSlide);
      expect(observedElements).toHaveLength(2);
      expect(observedElements).not.toContain(removedSlide);
    });

    it("commits the leading visible slide when visibleSlides > 1 and a trailing slide crosses the 0.5 threshold", () => {
      const store = new Store({ currentSlide: 0, totalSlides: 5, visibleSlides: 2 });
      renderWithSlides({
        carouselStore: store,
        currentSlide: 0,
        totalSlides: 5,
        visibleSlides: 2,
      });

      // Slide 1 enters at ratio 1.0 -> currentSlide becomes 1
      act(() => {
        observerCallback?.([
          { target: observedElements[1], isIntersecting: true, intersectionRatio: 1.0 },
        ]);
      });
      expect(store.getStoreState().currentSlide).toBe(1);

      // Subsequent callback reports only trailing slide 2 crossing 0.5 while slide 1 remains at 1.0
      act(() => {
        observerCallback?.([
          { target: observedElements[2], isIntersecting: true, intersectionRatio: 0.6 },
        ]);
      });
      expect(store.getStoreState().currentSlide).toBe(1);

      // Once slide 1 drops below 0.5, currentSlide advances to leading visible slide 2
      act(() => {
        observerCallback?.([
          { target: observedElements[1], isIntersecting: true, intersectionRatio: 0.2 },
        ]);
      });
      expect(store.getStoreState().currentSlide).toBe(2);
    });
  });

  describe("scrollsnapchange and scrollend events", () => {
    it("updates currentSlide on scrollsnapchange using snapTargetInline (horizontal) and snapTargetBlock (vertical)", () => {
      const store = new Store({ currentSlide: 0, totalSlides: 5, visibleSlides: 2 });
      const { container, rerender } = renderWithSlides({
        carouselStore: store,
        currentSlide: 0,
        orientation: "horizontal",
        snapType: "mandatory",
      });

      const trayWrap = container.querySelector(
        ".carousel__native-slider-tray-wrapper",
      ) as HTMLElement;
      const slides = container.querySelectorAll(".carousel__slide");

      const horizEvent = new Event("scrollsnapchange");
      Object.defineProperty(horizEvent, "snapTargetInline", { value: slides[2] });
      act(() => {
        trayWrap.dispatchEvent(horizEvent);
      });
      expect(store.getStoreState().currentSlide).toBe(2);

      // Rerender in vertical mode and test snapTargetBlock
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={2}
          orientation="vertical"
          snapType="proximity"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="carousel__slide">
              Slide {i}
            </div>
          ))}
        </NativeSliderView>,
      );

      const vertSlides = container.querySelectorAll(".carousel__slide");
      const vertEvent = new Event("scrollsnapchange");
      Object.defineProperty(vertEvent, "snapTargetBlock", { value: vertSlides[1] });
      act(() => {
        trayWrap.dispatchEvent(vertEvent);
      });
      expect(store.getStoreState().currentSlide).toBe(1);
    });

    it('ignores scrollsnapchange when snapType="none" or when target is missing', () => {
      const store = new Store({ currentSlide: 0, totalSlides: 5, visibleSlides: 2 });
      const { container } = renderWithSlides({
        carouselStore: store,
        currentSlide: 0,
        snapType: "none",
      });

      const trayWrap = container.querySelector(
        ".carousel__native-slider-tray-wrapper",
      ) as HTMLElement;
      const slides = container.querySelectorAll(".carousel__slide");

      const snapEvent = new Event("scrollsnapchange");
      Object.defineProperty(snapEvent, "snapTargetInline", { value: slides[2] });
      act(() => {
        trayWrap.dispatchEvent(snapEvent);
      });
      expect(store.getStoreState().currentSlide).toBe(0);
    });

    it("reconciles currentSlide on scrollend using scroll dimensions or visible ratios", () => {
      const store = new Store({ currentSlide: 0, totalSlides: 5, visibleSlides: 2 });
      const { container, rerender } = renderWithSlides({
        carouselStore: store,
        currentSlide: 0,
        orientation: "horizontal",
      });

      const trayWrap = container.querySelector(
        ".carousel__native-slider-tray-wrapper",
      ) as HTMLElement;
      Object.defineProperty(trayWrap, "scrollWidth", { value: 500, configurable: true });
      Object.defineProperty(trayWrap, "scrollLeft", {
        value: 200,
        writable: true,
        configurable: true,
      });

      act(() => {
        trayWrap.dispatchEvent(new Event("scrollend"));
      });
      expect(store.getStoreState().currentSlide).toBe(2);

      // Vertical scrollend reconciliation
      rerender(
        <NativeSliderView {...props} carouselStore={store} currentSlide={2} orientation="vertical">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="carousel__slide">
              Slide {i}
            </div>
          ))}
        </NativeSliderView>,
      );
      Object.defineProperty(trayWrap, "scrollHeight", { value: 500, configurable: true });
      Object.defineProperty(trayWrap, "scrollTop", {
        value: 100,
        writable: true,
        configurable: true,
      });

      act(() => {
        trayWrap.dispatchEvent(new Event("scrollend"));
      });
      expect(store.getStoreState().currentSlide).toBe(1);
    });

    it("translates scrollsnapchange center and end snap targets to the leading visible slide when visibleSlides > 1", () => {
      const store = new Store({
        currentSlide: 2,
        totalSlides: 5,
        visibleSlides: 3,
        snapAlign: "center",
      });
      const { container, rerender } = render(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={2}
          totalSlides={5}
          visibleSlides={3}
          orientation="horizontal"
          snapType="mandatory"
        >
          <div className="carousel__slide carousel__slide--snap-align-center">Slide 0</div>
          <div className="carousel__slide carousel__slide--snap-align-center">Slide 1</div>
          <div className="carousel__slide carousel__slide--snap-align-center">Slide 2</div>
          <div className="carousel__slide carousel__slide--snap-align-end">Slide 3</div>
          <div className="carousel__slide carousel__slide--snap-align-center">Slide 4</div>
        </NativeSliderView>,
      );

      const trayWrap = container.querySelector(
        ".carousel__native-slider-tray-wrapper",
      ) as HTMLElement;
      const slides = container.querySelectorAll(".carousel__slide");

      // Release initial mount lockout first
      fireEvent.pointerDown(trayWrap);

      // Center-aligned slide 1 snapped with visibleSlides=3 -> leading visible slide is 1 - 1 = 0
      const centerSnapEvent = new Event("scrollsnapchange");
      Object.defineProperty(centerSnapEvent, "snapTargetInline", { value: slides[1] });
      act(() => {
        trayWrap.dispatchEvent(centerSnapEvent);
      });
      expect(store.getStoreState().currentSlide).toBe(0);

      // End-aligned slide 3 snapped with visibleSlides=3 -> leading visible slide is 3 - 2 = 1
      const endSnapEvent = new Event("scrollsnapchange");
      Object.defineProperty(endSnapEvent, "snapTargetInline", { value: slides[3] });
      act(() => {
        trayWrap.dispatchEvent(endSnapEvent);
      });
      expect(store.getStoreState().currentSlide).toBe(1);

      // Even visibleSlides=2 with center-aligned slide 2 -> leading visible slide is 2 - Math.floor(2 / 2) = 1
      store.setStoreState({ currentSlide: 0, visibleSlides: 2 });
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={0}
          totalSlides={5}
          visibleSlides={2}
          orientation="horizontal"
          snapType="mandatory"
        >
          <div className="carousel__slide carousel__slide--snap-align-center">Slide 0</div>
          <div className="carousel__slide carousel__slide--snap-align-center">Slide 1</div>
          <div className="carousel__slide carousel__slide--snap-align-center">Slide 2</div>
          <div className="carousel__slide carousel__slide--snap-align-end">Slide 3</div>
          <div className="carousel__slide carousel__slide--snap-align-center">Slide 4</div>
        </NativeSliderView>,
      );
      fireEvent.pointerDown(trayWrap);
      const evenCenterSnapEvent = new Event("scrollsnapchange");
      Object.defineProperty(evenCenterSnapEvent, "snapTargetInline", { value: slides[2] });
      act(() => {
        trayWrap.dispatchEvent(evenCenterSnapEvent);
      });
      expect(store.getStoreState().currentSlide).toBe(1);

      // Restore visibleSlides=3 and verify IntersectionObserver active ratios take precedence
      store.setStoreState({ currentSlide: 0, visibleSlides: 3 });
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={0}
          totalSlides={5}
          visibleSlides={3}
          orientation="horizontal"
          snapType="mandatory"
        >
          <div className="carousel__slide carousel__slide--snap-align-center">Slide 0</div>
          <div className="carousel__slide carousel__slide--snap-align-center">Slide 1</div>
          <div className="carousel__slide carousel__slide--snap-align-center">Slide 2</div>
          <div className="carousel__slide carousel__slide--snap-align-end">Slide 3</div>
          <div className="carousel__slide carousel__slide--snap-align-center">Slide 4</div>
        </NativeSliderView>,
      );
      fireEvent.pointerDown(trayWrap);

      // When IntersectionObserver has active ratios for slides 2, 3, 4, scrollsnapchange on slide 3 uses observed leading slide 2
      act(() => {
        observerCallback?.([
          { target: slides[2], isIntersecting: true, intersectionRatio: 1.0 },
          { target: slides[3], isIntersecting: true, intersectionRatio: 1.0 },
          { target: slides[4], isIntersecting: true, intersectionRatio: 1.0 },
        ]);
      });
      store.setStoreState({ currentSlide: 0 });
      const ratioSnapEvent = new Event("scrollsnapchange");
      Object.defineProperty(ratioSnapEvent, "snapTargetInline", { value: slides[3] });
      act(() => {
        trayWrap.dispatchEvent(ratioSnapEvent);
      });
      expect(store.getStoreState().currentSlide).toBe(2);
    });

    it("prefers IntersectionObserver leading visible slide over raw scroll offset math on scrollend", () => {
      const store = new Store({ currentSlide: 0, totalSlides: 5, visibleSlides: 2 });
      const { container } = renderWithSlides({
        carouselStore: store,
        currentSlide: 0,
        totalSlides: 5,
        visibleSlides: 2,
        orientation: "horizontal",
      });

      const trayWrap = container.querySelector(
        ".carousel__native-slider-tray-wrapper",
      ) as HTMLElement;

      // IntersectionObserver tracks slides 1 and 2 as visible (leading slide = 1)
      act(() => {
        observerCallback?.([
          { target: observedElements[1], isIntersecting: true, intersectionRatio: 1.0 },
          { target: observedElements[2], isIntersecting: true, intersectionRatio: 0.8 },
        ]);
      });
      expect(store.getStoreState().currentSlide).toBe(1);

      // Even if raw scrollLeft / slideWidth rounds to 2, scrollend preserves observer's leading slide 1
      Object.defineProperty(trayWrap, "scrollWidth", { value: 500, configurable: true });
      Object.defineProperty(trayWrap, "scrollLeft", {
        value: 200,
        writable: true,
        configurable: true,
      });

      act(() => {
        trayWrap.dispatchEvent(new Event("scrollend"));
      });
      expect(store.getStoreState().currentSlide).toBe(1);
    });
  });

  describe("Two-way store sync & programmatic scroll lockout guard", () => {
    it("calls scrollTo on external currentSlide change and suppresses intermediate IntersectionObserver write-backs until scrollend, target intersection, or user interaction", () => {
      const store = new Store({ currentSlide: 0, totalSlides: 5, visibleSlides: 1 });
      const { container, rerender } = renderWithSlides({
        carouselStore: store,
        currentSlide: 0,
        totalSlides: 5,
        visibleSlides: 1,
        disableAnimation: false,
      });

      const trayWrap = container.querySelector(
        ".carousel__native-slider-tray-wrapper",
      ) as HTMLElement;
      const scrollToSpy = vi.fn();
      trayWrap.scrollTo = scrollToSpy;

      const slides = container.querySelectorAll(".carousel__slide");
      slides.forEach((slide, idx) => {
        Object.defineProperty(slide, "offsetLeft", { value: idx * 100, configurable: true });
      });

      // External update to slide 3 (e.g. Dot or ButtonNext)
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={3}
          totalSlides={5}
          visibleSlides={1}
          disableAnimation={false}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="carousel__slide">
              Slide {i}
            </div>
          ))}
        </NativeSliderView>,
      );

      expect(scrollToSpy).toHaveBeenCalledWith({
        left: 300,
        top: 0,
        behavior: "smooth",
      });

      // Intermediate IntersectionObserver entry for slide 1 during programmatic scroll is suppressed
      act(() => {
        observerCallback?.([
          { target: observedElements[1], isIntersecting: true, intersectionRatio: 0.8 },
        ]);
      });
      expect(store.getStoreState().currentSlide).not.toBe(1);

      // Intermediate scrollsnapchange for slide 1 is also suppressed
      const intermediateSnap = new Event("scrollsnapchange");
      Object.defineProperty(intermediateSnap, "snapTargetInline", { value: observedElements[1] });
      act(() => {
        trayWrap.dispatchEvent(intermediateSnap);
      });
      expect(store.getStoreState().currentSlide).not.toBe(1);

      // Target slide 3 intersecting releases lockout
      act(() => {
        observerCallback?.([
          { target: observedElements[3], isIntersecting: true, intersectionRatio: 0.9 },
        ]);
      });

      // Subsequent native scroll to slide 2 now updates the store without calling scrollTo again
      scrollToSpy.mockClear();
      act(() => {
        observerCallback?.([
          { target: observedElements[2], isIntersecting: true, intersectionRatio: 0.9 },
        ]);
      });
      expect(store.getStoreState().currentSlide).toBe(2);

      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={2}
          totalSlides={5}
          visibleSlides={1}
          disableAnimation={false}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="carousel__slide">
              Slide {i}
            </div>
          ))}
        </NativeSliderView>,
      );
      expect(scrollToSpy).not.toHaveBeenCalled();
    });

    it("uses behavior: 'instant' when disableAnimation is true and supports vertical scrollTo and user interaction lockout release", () => {
      const store = new Store({ currentSlide: 0, totalSlides: 4, visibleSlides: 1 });
      const { container, rerender } = renderWithSlides(
        {
          carouselStore: store,
          currentSlide: 0,
          totalSlides: 4,
          visibleSlides: 1,
          orientation: "vertical",
          disableAnimation: true,
        },
        4,
      );

      const trayWrap = container.querySelector(
        ".carousel__native-slider-tray-wrapper",
      ) as HTMLElement;
      const scrollToSpy = vi.fn();
      trayWrap.scrollTo = scrollToSpy;
      Object.defineProperty(trayWrap, "scrollHeight", { value: 400, configurable: true });

      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={2}
          totalSlides={4}
          visibleSlides={1}
          orientation="vertical"
          disableAnimation
        >
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="carousel__slide">
              Slide {i}
            </div>
          ))}
        </NativeSliderView>,
      );

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 200,
        left: 0,
        behavior: "instant",
      });

      // User pointerdown releases any lockout immediately
      fireEvent.pointerDown(trayWrap);
      act(() => {
        observerCallback?.([
          { target: observedElements[1], isIntersecting: true, intersectionRatio: 0.8 },
        ]);
      });
      expect(store.getStoreState().currentSlide).toBe(1);

      // Programmatic scroll lockout is also released by scrollend or target scrollsnapchange
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={3}
          totalSlides={4}
          visibleSlides={1}
          orientation="vertical"
          disableAnimation
        >
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="carousel__slide">
              Slide {i}
            </div>
          ))}
        </NativeSliderView>,
      );
      Object.defineProperty(trayWrap, "scrollTop", {
        value: 300,
        writable: true,
        configurable: true,
      });
      act(() => {
        trayWrap.dispatchEvent(new Event("scrollend"));
      });

      // Trigger another programmatic scroll and release lockout via target scrollsnapchange
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={0}
          totalSlides={4}
          visibleSlides={1}
          orientation="vertical"
          disableAnimation
        >
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="carousel__slide">
              Slide {i}
            </div>
          ))}
        </NativeSliderView>,
      );
      const targetSnapEvent = new Event("scrollsnapchange");
      Object.defineProperty(targetSnapEvent, "snapTargetBlock", {
        value: container.querySelectorAll(".carousel__slide")[0],
      });
      act(() => {
        trayWrap.dispatchEvent(targetSnapEvent);
      });
    });

    it("integrates with ButtonNext inside CarouselProvider to scroll natively", () => {
      const { container } = render(
        <CarouselProvider naturalSlideWidth={100} naturalSlideHeight={100} totalSlides={3}>
          <NativeSlider>
            <Slide index={0}>Slide 0</Slide>
            <Slide index={1}>Slide 1</Slide>
            <Slide index={2}>Slide 2</Slide>
          </NativeSlider>
          <ButtonNext>Next</ButtonNext>
        </CarouselProvider>,
      );

      const trayWrap = container.querySelector(
        ".carousel__native-slider-tray-wrapper",
      ) as HTMLElement;
      const scrollToSpy = vi.fn();
      trayWrap.scrollTo = scrollToSpy;

      fireEvent.click(container.querySelector(".carousel__next-button") as HTMLElement);
      expect(scrollToSpy).toHaveBeenCalledTimes(1);
    });

    it("scrolls to initial nonzero currentSlide on mount and locks out initial slide 0 observer callbacks", () => {
      const scrollToSpy = vi.fn();
      const originalScrollTo = HTMLElement.prototype.scrollTo;
      HTMLElement.prototype.scrollTo = scrollToSpy;

      try {
        const store = new Store({ currentSlide: 2, totalSlides: 5, visibleSlides: 1 });
        renderWithSlides({
          carouselStore: store,
          currentSlide: 2,
          totalSlides: 5,
          visibleSlides: 1,
        });

        expect(scrollToSpy).toHaveBeenCalledTimes(1);

        // Initial IntersectionObserver callback for slide 0 at offset 0 is suppressed by lockout
        act(() => {
          observerCallback?.([
            { target: observedElements[0], isIntersecting: true, intersectionRatio: 1.0 },
          ]);
        });
        expect(store.getStoreState().currentSlide).toBe(2);

        // Target slide 2 intersecting releases lockout
        act(() => {
          observerCallback?.([
            { target: observedElements[2], isIntersecting: true, intersectionRatio: 1.0 },
          ]);
        });
        expect(store.getStoreState().currentSlide).toBe(2);
      } finally {
        HTMLElement.prototype.scrollTo = originalScrollTo;
      }
    });

    it("offsets programmatic scrollTo and scrollend by half a slide when visibleSlides is even and snapAlign is center", () => {
      const store = new Store({
        currentSlide: 0,
        totalSlides: 4,
        visibleSlides: 2,
        snapAlign: "center",
      });
      const { container, rerender } = renderWithSlides(
        {
          carouselStore: store,
          currentSlide: 0,
          totalSlides: 4,
          visibleSlides: 2,
          orientation: "horizontal",
          snapType: "mandatory",
          disableAnimation: false,
        },
        4,
      );

      const trayWrap = container.querySelector(
        ".carousel__native-slider-tray-wrapper",
      ) as HTMLElement;
      const scrollToSpy = vi.fn();
      trayWrap.scrollTo = scrollToSpy;
      Object.defineProperty(trayWrap, "scrollWidth", { value: 400, configurable: true });

      store.setStoreState({ currentSlide: 1 });
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={1}
          totalSlides={4}
          visibleSlides={2}
          orientation="horizontal"
          snapType="mandatory"
          disableAnimation={false}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="carousel__slide">
              Slide {i}
            </div>
          ))}
        </NativeSliderView>,
      );

      expect(scrollToSpy).toHaveBeenCalledWith({
        left: 150,
        top: 0,
        behavior: "smooth",
      });

      Object.defineProperty(trayWrap, "scrollLeft", {
        value: 150,
        writable: true,
        configurable: true,
      });
      store.setStoreState({ currentSlide: 0 });
      act(() => {
        trayWrap.dispatchEvent(new Event("scrollend"));
      });
      expect(store.getStoreState().currentSlide).toBe(1);
    });

    it("reconciles currentSlide on scrollend when a programmatic scroll settles on a different slide than the target", () => {
      const store = new Store({ currentSlide: 0, totalSlides: 4, visibleSlides: 1 });
      const { container, rerender } = renderWithSlides(
        {
          carouselStore: store,
          currentSlide: 0,
          totalSlides: 4,
          visibleSlides: 1,
          orientation: "horizontal",
          disableAnimation: false,
        },
        4,
      );

      const trayWrap = container.querySelector(
        ".carousel__native-slider-tray-wrapper",
      ) as HTMLElement;
      trayWrap.scrollTo = vi.fn();
      Object.defineProperty(trayWrap, "scrollWidth", { value: 400, configurable: true });

      store.setStoreState({ currentSlide: 2 });
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={2}
          totalSlides={4}
          visibleSlides={1}
          orientation="horizontal"
          disableAnimation={false}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="carousel__slide">
              Slide {i}
            </div>
          ))}
        </NativeSliderView>,
      );

      // Browser settled at slide 1 (scrollLeft = 100) instead of target slide 2
      Object.defineProperty(trayWrap, "scrollLeft", {
        value: 100,
        writable: true,
        configurable: true,
      });
      act(() => {
        trayWrap.dispatchEvent(new Event("scrollend"));
      });
      expect(store.getStoreState().currentSlide).toBe(1);

      // Programmatic scroll to slide 3 where browser fires scrollsnapchange for neighboring slide 2 before scrollend
      store.setStoreState({ currentSlide: 3 });
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={3}
          totalSlides={4}
          visibleSlides={1}
          orientation="horizontal"
          disableAnimation={false}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="carousel__slide">
              Slide {i}
            </div>
          ))}
        </NativeSliderView>,
      );

      const slides = container.querySelectorAll(".carousel__slide");
      const neighborSnap = new Event("scrollsnapchange");
      Object.defineProperty(neighborSnap, "snapTargetInline", { value: slides[2] });
      act(() => {
        trayWrap.dispatchEvent(neighborSnap);
      });
      // Still locked out until scrollend
      expect(store.getStoreState().currentSlide).toBe(3);

      act(() => {
        trayWrap.dispatchEvent(new Event("scrollend"));
      });
      expect(store.getStoreState().currentSlide).toBe(2);
    });
  });

  describe("MasterSpinner, autoplay, privateUnDisableAnimation, and keyboard navigation", () => {
    it("renders default and custom masterSpinner and invokes onMasterSpinner", () => {
      const onMasterSpinner = vi.fn();
      const { container, rerender } = renderWithSlides({
        hasMasterSpinner: true,
        masterSpinnerFinished: false,
        onMasterSpinner,
      });

      expect(container.querySelector(".carousel__master-spinner-container")).toBeInTheDocument();
      expect(container.querySelector(".carousel__spinner")).toBeInTheDocument();
      expect(onMasterSpinner).toHaveBeenCalledTimes(1);

      rerender(
        <NativeSliderView
          {...props}
          hasMasterSpinner
          masterSpinnerFinished={false}
          spinner={() => <div className="custom-spinner" />}
        >
          <div className="carousel__slide">Slide 0</div>
        </NativeSliderView>,
      );
      expect(container.querySelector(".custom-spinner")).toBeInTheDocument();

      rerender(
        <NativeSliderView {...props} hasMasterSpinner masterSpinnerFinished>
          <div className="carousel__slide">Slide 0</div>
        </NativeSliderView>,
      );
      expect(
        container.querySelector(".carousel__master-spinner-container"),
      ).not.toBeInTheDocument();
    });

    it("handles autoplay forward and backward and pauses on user interaction when pauseOnInteract is true", () => {
      const store = new Store({
        currentSlide: 0,
        totalSlides: 4,
        visibleSlides: 1,
        step: 1,
        isPlaying: true,
      });
      const { container, rerender } = renderWithSlides(
        {
          carouselStore: store,
          currentSlide: 0,
          totalSlides: 4,
          visibleSlides: 1,
          step: 1,
          interval: 1000,
          isPlaying: true,
          playDirection: "forward",
          pauseOnInteract: true,
        },
        4,
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(store.getStoreState().currentSlide).toBe(1);

      // At end of slides (slide 3), forward autoplay wraps to 0
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={3}
          totalSlides={4}
          visibleSlides={1}
          step={1}
          interval={1000}
          isPlaying
          playDirection="forward"
        >
          <div className="carousel__slide">Slide 0</div>
        </NativeSliderView>,
      );
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(store.getStoreState().currentSlide).toBe(0);

      // Backward autoplay from 0 wraps to totalSlides - visibleSlides (3)
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={0}
          totalSlides={4}
          visibleSlides={1}
          step={1}
          interval={1000}
          isPlaying
          playDirection="backward"
          pauseOnInteract
        >
          <div className="carousel__slide">Slide 0</div>
        </NativeSliderView>,
      );
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(store.getStoreState().currentSlide).toBe(3);

      // Backward autoplay from slide 2 steps back to 1
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={2}
          totalSlides={4}
          visibleSlides={1}
          step={1}
          interval={1000}
          isPlaying
          playDirection="backward"
          pauseOnInteract
        >
          <div className="carousel__slide">Slide 0</div>
        </NativeSliderView>,
      );
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(store.getStoreState().currentSlide).toBe(1);

      // User wheel/touchstart interaction pauses autoplay when pauseOnInteract is true
      const trayWrap = container.querySelector(
        ".carousel__native-slider-tray-wrapper",
      ) as HTMLElement;
      fireEvent.wheel(trayWrap);
      expect(store.getStoreState().isPlaying).toBe(false);
    });

    it("resets privateUnDisableAnimation when it becomes true", () => {
      const store = new Store({
        disableAnimation: true,
        privateUnDisableAnimation: false,
      });
      const { rerender } = renderWithSlides({
        carouselStore: store,
        disableAnimation: true,
        privateUnDisableAnimation: false,
      });

      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          disableAnimation
          privateUnDisableAnimation
        >
          <div className="carousel__slide">Slide 0</div>
        </NativeSliderView>,
      );

      expect(store.getStoreState().disableAnimation).toBe(false);
      expect(store.getStoreState().privateUnDisableAnimation).toBe(false);
    });

    it("supports keyboard navigation (backwardKeyCode, forwardKeyCode, infinite, disableKeyboard)", () => {
      const onKeyDownSpy = vi.fn();
      const store = new Store({
        currentSlide: 0,
        totalSlides: 4,
        visibleSlides: 1,
        isPlaying: true,
      });
      const { container, rerender } = renderWithSlides(
        {
          carouselStore: store,
          currentSlide: 0,
          totalSlides: 4,
          visibleSlides: 1,
          infinite: false,
          isPlaying: true,
          pauseOnInteract: true,
          onKeyDown: onKeyDownSpy,
        },
        4,
      );

      const slider = container.querySelector(".carousel__native-slider") as HTMLElement;

      // Forward arrow (39) advances to slide 1, pauses autoplay, prevents default native scroll, and calls custom onKeyDown
      expect(fireEvent.keyDown(slider, { keyCode: 39 })).toBe(false);
      expect(store.getStoreState().currentSlide).toBe(1);
      expect(store.getStoreState().isPlaying).toBe(false);
      expect(onKeyDownSpy).toHaveBeenCalledTimes(1);
      expect(onKeyDownSpy.mock.calls[0][0].defaultPrevented).toBe(true);

      // Unhandled keys (e.g. Enter / 13) do not prevent default or change slide
      expect(fireEvent.keyDown(slider, { keyCode: 13 })).toBe(true);
      expect(store.getStoreState().currentSlide).toBe(1);
      expect(onKeyDownSpy).toHaveBeenCalledTimes(2);
      expect(onKeyDownSpy.mock.calls[1][0].defaultPrevented).toBe(false);

      // Backward arrow (37) from slide 1 moves back to 0 when infinite=false and prevents default
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={1}
          totalSlides={4}
          visibleSlides={1}
          infinite={false}
          pauseOnInteract={false}
        >
          <div className="carousel__slide">Slide 0</div>
        </NativeSliderView>,
      );
      expect(fireEvent.keyDown(slider, { keyCode: 37 })).toBe(false);
      expect(store.getStoreState().currentSlide).toBe(0);

      // Backward arrow (37) at slide 0 with infinite=true wraps to maxSlide (3) and prevents default
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={0}
          totalSlides={4}
          visibleSlides={1}
          infinite
          isPlaying
          pauseOnInteract={false}
        >
          <div className="carousel__slide">Slide 0</div>
        </NativeSliderView>,
      );
      expect(fireEvent.keyDown(slider, { keyCode: 37 })).toBe(false);
      expect(store.getStoreState().currentSlide).toBe(3);

      // Forward arrow (39) at maxSlide (3) with infinite=true wraps to 0 and prevents default
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={3}
          totalSlides={4}
          visibleSlides={1}
          infinite
        >
          <div className="carousel__slide">Slide 0</div>
        </NativeSliderView>,
      );
      expect(fireEvent.keyDown(slider, { keyCode: 39 })).toBe(false);
      expect(store.getStoreState().currentSlide).toBe(0);

      // disableKeyboard ignores key presses and does not prevent default
      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={0}
          totalSlides={4}
          visibleSlides={1}
          disableKeyboard
        >
          <div className="carousel__slide">Slide 0</div>
        </NativeSliderView>,
      );
      expect(fireEvent.keyDown(slider, { keyCode: 39 })).toBe(true);
      expect(store.getStoreState().currentSlide).toBe(0);
    });
  });

  describe("Graceful fallbacks", () => {
    it("renders and scrolls safely when IntersectionObserver is undefined and scrollTo is not implemented", () => {
      Reflect.deleteProperty(globalThis, "IntersectionObserver");

      const store = new Store({ currentSlide: 0, totalSlides: 3, visibleSlides: 1 });
      const { container, rerender } = renderWithSlides(
        {
          carouselStore: store,
          currentSlide: 0,
          totalSlides: 3,
          visibleSlides: 1,
        },
        3,
      );

      const trayWrap = container.querySelector(
        ".carousel__native-slider-tray-wrapper",
      ) as HTMLElement;
      Reflect.deleteProperty(trayWrap, "scrollTo");
      Object.defineProperty(trayWrap, "scrollWidth", { value: 300, configurable: true });

      rerender(
        <NativeSliderView
          {...props}
          carouselStore={store}
          currentSlide={2}
          totalSlides={3}
          visibleSlides={1}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="carousel__slide">
              Slide {i}
            </div>
          ))}
        </NativeSliderView>,
      );

      expect(trayWrap.scrollLeft).toBe(200);
    });
  });
});
