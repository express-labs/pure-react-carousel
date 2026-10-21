import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { createComponentConfig } from "../../__tests__/component-config";
import Store from "../../Store/Store";
import Slider, { slideSizeInPx, slidesMoved } from "../Slider";
import GetScrollParent from "../GetScrollParent";
import CarouselProvider from "../../CarouselProvider";
import SliderWrapper from "../index";

describe("<Slider />", () => {
  let props: ReturnType<typeof createComponentConfig>["Slider"]["props"];
  let rafId = 0;

  beforeEach(() => {
    vi.useFakeTimers();
    props = createComponentConfig().Slider.props;
    rafId = 0;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      rafId += 1;
      return rafId;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    document.documentElement.style.overflow = "";
    document.documentElement.style.paddingLeft = "";
    document.documentElement.style.paddingRight = "";
    document.documentElement.style.direction = "";
  });

  describe("static helpers & GetScrollParent", () => {
    describe("slideSizeInPx()", () => {
      it("should return the tray width / total slides if orientation is horizontal", () => {
        expect(Slider.slideSizeInPx("horizontal", 100, 20, 2)).toBe(50);
        expect(slideSizeInPx("horizontal", 400, 100, 4)).toBe(100);
      });

      it("should return the tray height / total slides if orientation is vertical", () => {
        expect(Slider.slideSizeInPx("vertical", 100, 20, 2)).toBe(10);
        expect(slideSizeInPx("vertical", 100, 400, 4)).toBe(100);
      });
    });

    describe("slidesMoved()", () => {
      it("should return 0 if the delta is less than the threshold", () => {
        expect(Slider.slidesMoved(0.2, "horizontal", 19, 0, 100, 1)).toBe(0);
        expect(slidesMoved(0.1, "horizontal", 9, 0, 100, 1)).toBe(0);
        expect(slidesMoved(0.1, "vertical", 0, 9, 100, 1)).toBe(0);
      });

      it("should return 0 if the delta is 0", () => {
        expect(Slider.slidesMoved(0.2, "horizontal", 0, 0, 100, 1)).toBe(0);
      });

      it("should return -1 if delta meets threshold (positive delta)", () => {
        expect(Slider.slidesMoved(0.1, "horizontal", 10, 0, 100, 1)).toBe(-1);
        expect(Slider.slidesMoved(0.1, "vertical", 0, 10, 100, 1)).toBe(-1);
      });

      it("should return positive moved count when delta is negative", () => {
        expect(Slider.slidesMoved(0.1, "horizontal", -10, 0, 100, 1)).toBe(1);
      });

      it("should return -2 if the delta is greater than 2 slides but less than 2.5 slides", () => {
        expect(Slider.slidesMoved(0.2, "horizontal", 200, 0, 100, 1)).toBe(-2);
      });

      it("should return -3 if the delta is equal to or greater than 2.5 slides", () => {
        expect(Slider.slidesMoved(0.2, "horizontal", 250, 0, 100, 1)).toBe(-3);
        expect(Slider.slidesMoved(0.2, "horizontal", 299, 0, 100, 1)).toBe(-3);
      });
    });

    describe("GetScrollParent", () => {
      it("should return null if node is not a valid HTMLElement or SVGElement", () => {
        const gsp = new GetScrollParent();
        expect(gsp.getScrollParent(null)).toBeNull();
        expect(gsp.getScrollParent({})).toBeNull();
      });

      it("should find scrollable ancestor or fall back to documentElement", () => {
        const gsp = new GetScrollParent();
        const outer = document.createElement("div");
        outer.style.overflowY = "scroll";
        const inner = document.createElement("div");
        outer.appendChild(inner);
        document.body.appendChild(outer);

        expect(gsp.getScrollParent(inner)).toBe(outer);

        outer.style.overflowY = "visible";
        expect(gsp.getScrollParent(inner)).toBe(
          document.scrollingElement || document.documentElement,
        );

        document.body.removeChild(outer);
      });
    });
  });

  describe("mounting, unmounting & event listeners", () => {
    it("should render via Connected SliderWrapper inside CarouselProvider", () => {
      const { container } = render(
        <CarouselProvider naturalSlideWidth={100} naturalSlideHeight={125} totalSlides={2}>
          <SliderWrapper>
            <div>Slide 1</div>
          </SliderWrapper>
        </CarouselProvider>,
      );
      expect(container.querySelector(".carousel__slider")).toBeInTheDocument();
    });

    it("should register and clean up window and documentElement listeners on mount and unmount", () => {
      const winAddSpy = vi.spyOn(window, "addEventListener");
      const winRemoveSpy = vi.spyOn(window, "removeEventListener");
      const docAddSpy = vi.spyOn(document.documentElement, "addEventListener");
      const docRemoveSpy = vi.spyOn(document.documentElement, "removeEventListener");

      const { unmount } = render(
        <Slider {...props} lockOnWindowScroll preventVerticalScrollOnTouch />,
      );

      expect(winAddSpy).toHaveBeenCalledWith("scroll", expect.any(Function), false);
      expect(winAddSpy).toHaveBeenCalledWith("touchmove", expect.any(Function), false);
      expect(docAddSpy).toHaveBeenCalledWith("mouseleave", expect.any(Function), false);
      expect(docAddSpy).toHaveBeenCalledWith("mousemove", expect.any(Function), false);
      expect(docAddSpy).toHaveBeenCalledWith("mouseup", expect.any(Function), false);

      unmount();

      expect(winRemoveSpy).toHaveBeenCalledWith("scroll", expect.any(Function), false);
      expect(winRemoveSpy).toHaveBeenCalledWith("touchmove", expect.any(Function), false);
      expect(docRemoveSpy).toHaveBeenCalledWith("mouseleave", expect.any(Function), false);
      expect(docRemoveSpy).toHaveBeenCalledWith("mousemove", expect.any(Function), false);
      expect(docRemoveSpy).toHaveBeenCalledWith("mouseup", expect.any(Function), false);
    });

    it("should not add window scroll or touchmove listeners when disabled", () => {
      const winAddSpy = vi.spyOn(window, "addEventListener");
      render(
        <Slider
          {...props}
          lockOnWindowScroll={false}
          touchEnabled={false}
          preventVerticalScrollOnTouch={false}
        />,
      );
      expect(winAddSpy).not.toHaveBeenCalledWith("scroll", expect.any(Function), false);
      expect(winAddSpy).not.toHaveBeenCalledWith("touchmove", expect.any(Function), false);
    });
  });

  describe("masterSpinner", () => {
    it("should render a custom spinner if supplied when hasMasterSpinner is true", () => {
      const onMasterSpinner = vi.fn();
      const { container } = render(
        <Slider
          {...props}
          hasMasterSpinner
          masterSpinnerFinished={false}
          onMasterSpinner={onMasterSpinner}
          spinner={() => <div className="custom-spinner" />}
        />,
      );
      expect(container.querySelector(".carousel__master-spinner-container")).toBeInTheDocument();
      expect(container.querySelector(".custom-spinner")).toBeInTheDocument();
      expect(onMasterSpinner).toHaveBeenCalledTimes(1);
    });

    it("should render default spinner if no custom spinner is supplied", () => {
      const { container } = render(
        <Slider {...props} hasMasterSpinner masterSpinnerFinished={false} />,
      );
      expect(container.querySelector(".carousel__spinner")).toBeInTheDocument();
    });

    it("should not render master spinner if hasMasterSpinner is false or masterSpinnerFinished is true", () => {
      const { container, rerender } = render(
        <Slider {...props} hasMasterSpinner={false} masterSpinnerFinished={false} />,
      );
      expect(
        container.querySelector(".carousel__master-spinner-container"),
      ).not.toBeInTheDocument();

      rerender(<Slider {...props} hasMasterSpinner masterSpinnerFinished />);
      expect(
        container.querySelector(".carousel__master-spinner-container"),
      ).not.toBeInTheDocument();
    });
  });

  describe("touch dragging & scrolling", () => {
    it("should update tray transform on touchstart and touchmove when touchEnabled is true", () => {
      const { container } = render(<Slider {...props} />);
      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;

      fireEvent.touchStart(tray, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      expect(tray.style.transition).toBe("none");

      fireEvent.touchMove(tray, {
        targetTouches: [{ screenX: 150, screenY: 120 }],
      });
      expect(tray.style.transform).toContain("translateX(50px)");
    });

    it("should not update tray transform on touch when touchEnabled is false", () => {
      const { container } = render(<Slider {...props} touchEnabled={false} />);
      const slider = container.querySelector(".carousel__slider") as HTMLElement;
      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;

      expect(slider).toHaveClass("touchDisabled");

      fireEvent.touchStart(tray, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      fireEvent.touchMove(tray, {
        targetTouches: [{ screenX: 200, screenY: 200 }],
      });
      expect(tray.style.transform).toContain("translateX(0px)");
      fireEvent.touchEnd(tray, { targetTouches: [] });
    });

    it("should handle empty targetTouches gracefully on touchMove", () => {
      const { container } = render(<Slider {...props} />);
      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;

      fireEvent.touchMove(tray, { targetTouches: [] });
      expect(tray.style.transform).toContain("translateX(0px)");
    });

    it("should block window vertical scroll on horizontal touch drag when preventVerticalScrollOnTouch is true", () => {
      const { container } = render(<Slider {...props} />);
      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;

      fireEvent.touchStart(tray, {
        targetTouches: [{ screenX: 0, screenY: 0 }],
      });
      fireEvent.touchMove(tray, {
        targetTouches: [{ screenX: 100, screenY: 0 }],
      });

      const winTouchMove = new TouchEvent("touchmove", {
        cancelable: true,
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(winTouchMove, "preventDefault");
      const stopImmediateSpy = vi.spyOn(winTouchMove, "stopImmediatePropagation");
      window.dispatchEvent(winTouchMove);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopImmediateSpy).toHaveBeenCalledTimes(1);
    });

    it("should not block window vertical scroll on pure vertical touch move", () => {
      const { container } = render(<Slider {...props} />);
      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;

      fireEvent.touchStart(tray, {
        targetTouches: [{ screenX: 0, screenY: 0 }],
      });
      fireEvent.touchMove(tray, {
        targetTouches: [{ screenX: 0, screenY: 100 }],
      });

      const winTouchMove = new TouchEvent("touchmove", {
        cancelable: true,
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(winTouchMove, "preventDefault");
      window.dispatchEvent(winTouchMove);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should lock and unlock scroll parent overflow when orientation="vertical" and isPageScrollLocked changes', () => {
      document.documentElement.style.overflow = "scroll";
      const { container, rerender } = render(<Slider {...props} orientation="vertical" />);
      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;

      fireEvent.touchStart(tray, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      expect(props.carouselStore.state.isPageScrollLocked).toBe(true);

      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked />);
      expect(document.documentElement.style.overflow).toBe("hidden");

      fireEvent.touchEnd(tray, { targetTouches: [] });
      expect(props.carouselStore.state.isPageScrollLocked).toBe(false);

      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked={false} />);
      expect(document.documentElement.style.overflow).toBe("scroll");
    });

    it("should compensate scrollbar width on lockScroll and restore overflow and paddingRight on unlockScroll or unmount", () => {
      const scrollParent = document.documentElement;
      scrollParent.style.overflow = "scroll";
      scrollParent.style.paddingRight = "20px";

      Object.defineProperty(scrollParent, "clientWidth", {
        configurable: true,
        get() {
          return scrollParent.style.overflow === "hidden" ? 1015 : 1000;
        },
      });

      const { rerender, unmount } = render(<Slider {...props} orientation="vertical" />);

      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked />);
      expect(scrollParent.style.overflow).toBe("hidden");
      expect(scrollParent.style.paddingRight).toBe("35px");

      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked={false} />);
      expect(scrollParent.style.overflow).toBe("scroll");
      expect(scrollParent.style.paddingRight).toBe("20px");

      // Re-lock and unmount while locked -> should restore overflow and paddingRight on cleanup
      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked />);
      expect(scrollParent.style.overflow).toBe("hidden");
      expect(scrollParent.style.paddingRight).toBe("35px");

      unmount();
      expect(scrollParent.style.overflow).toBe("scroll");
      expect(scrollParent.style.paddingRight).toBe("20px");

      // Also compensate from 0px when initial paddingRight is empty
      scrollParent.style.paddingRight = "";
      const { unmount: unmountEmptyPad } = render(
        <Slider {...props} orientation="vertical" isPageScrollLocked />,
      );
      // Initial mount with isPageScrollLocked=true does not trigger transition, rerender from false -> true:
      unmountEmptyPad();

      const { rerender: rerenderEmpty, unmount: unmountEmpty } = render(
        <Slider {...props} orientation="vertical" />,
      );
      rerenderEmpty(<Slider {...props} orientation="vertical" isPageScrollLocked />);
      expect(scrollParent.style.paddingRight).toBe("15px");
      unmountEmpty();
      expect(scrollParent.style.paddingRight).toBe("");

      Reflect.deleteProperty(scrollParent, "clientWidth");
    });

    it("should compensate paddingLeft only when clientLeft decreases, keeping right-side compensation for RTL root viewports where clientLeft is unchanged", () => {
      const scrollParent = document.documentElement;
      scrollParent.style.overflow = "scroll";
      scrollParent.style.direction = "rtl";
      scrollParent.style.paddingLeft = "10px";
      scrollParent.style.paddingRight = "20px";

      Object.defineProperty(scrollParent, "clientWidth", {
        configurable: true,
        get() {
          return scrollParent.style.overflow === "hidden" ? 1015 : 1000;
        },
      });

      // 1. In Chromium/WebKit, root <html> viewport scrollbar stays on the right even in RTL (clientLeft stays 0 -> 0)
      Object.defineProperty(scrollParent, "clientLeft", {
        configurable: true,
        get() {
          return 0;
        },
      });

      const { rerender, unmount } = render(<Slider {...props} orientation="vertical" />);

      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked />);
      expect(scrollParent.style.overflow).toBe("hidden");
      expect(scrollParent.style.paddingLeft).toBe("10px");
      expect(scrollParent.style.paddingRight).toBe("35px");

      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked={false} />);
      expect(scrollParent.style.overflow).toBe("scroll");
      expect(scrollParent.style.paddingLeft).toBe("10px");
      expect(scrollParent.style.paddingRight).toBe("20px");

      // 2. When scrollbar is genuinely on the left (clientLeft decreases 15 -> 0 on overflow: hidden), compensate paddingLeft
      Object.defineProperty(scrollParent, "clientLeft", {
        configurable: true,
        get() {
          return scrollParent.style.overflow === "hidden" ? 0 : 15;
        },
      });

      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked />);
      expect(scrollParent.style.overflow).toBe("hidden");
      expect(scrollParent.style.paddingLeft).toBe("25px");
      expect(scrollParent.style.paddingRight).toBe("20px");

      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked={false} />);
      expect(scrollParent.style.overflow).toBe("scroll");
      expect(scrollParent.style.paddingLeft).toBe("10px");
      expect(scrollParent.style.paddingRight).toBe("20px");

      // 3. Also compensate from 0px when initial paddingLeft is empty and restore on unmount
      scrollParent.style.direction = "ltr";
      scrollParent.style.paddingLeft = "";

      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked />);
      expect(scrollParent.style.paddingLeft).toBe("15px");
      expect(scrollParent.style.paddingRight).toBe("20px");

      unmount();
      expect(scrollParent.style.overflow).toBe("scroll");
      expect(scrollParent.style.paddingLeft).toBe("");
      expect(scrollParent.style.paddingRight).toBe("20px");

      scrollParent.style.direction = "";
      Reflect.deleteProperty(scrollParent, "clientWidth");
      Reflect.deleteProperty(scrollParent, "clientLeft");
    });

    it("should preserve outer geometry and pre-lock content width for box-sizing: content-box containers (including minWidth) without shrinking border-box containers", () => {
      const scrollContainer = document.createElement("div");
      scrollContainer.style.overflow = "scroll";
      scrollContainer.style.boxSizing = "content-box";
      scrollContainer.style.width = "400px";
      scrollContainer.style.paddingRight = "20px";
      document.body.appendChild(scrollContainer);

      const parentWidth = 400;
      const getBoxMetrics = () => {
        const scrollbar = scrollContainer.style.overflow === "hidden" ? 0 : 15;
        const padLeft = parseFloat(scrollContainer.style.paddingLeft) || 0;
        const padRight = parseFloat(scrollContainer.style.paddingRight) || 0;
        const resolvedMinWidth =
          scrollContainer.style.minWidth === "100%"
            ? parentWidth
            : parseFloat(scrollContainer.style.minWidth) || 0;
        const baseCssWidth =
          scrollContainer.style.width === "auto"
            ? parentWidth - padLeft - padRight
            : parseFloat(scrollContainer.style.width) || 0;
        const cssWidth = Math.max(baseCssWidth, resolvedMinWidth);
        if (scrollContainer.style.boxSizing === "border-box") {
          const contentWidth = cssWidth - padLeft - padRight - scrollbar;
          return {
            cssWidth,
            contentWidth,
            clientWidth: contentWidth + padLeft + padRight,
            offsetWidth: cssWidth,
          };
        }
        // content-box: scrollbar is carved out of the CSS width box when present
        const contentWidth = cssWidth - scrollbar;
        return {
          cssWidth,
          contentWidth,
          clientWidth: contentWidth + padLeft + padRight,
          offsetWidth: contentWidth + padLeft + padRight + scrollbar,
        };
      };

      const origGetComputedStyle = window.getComputedStyle.bind(window);
      vi.spyOn(window, "getComputedStyle").mockImplementation((el, pseudoElt) => {
        const style = origGetComputedStyle(el, pseudoElt);
        if (el === scrollContainer) {
          const origGetPropertyValue = style.getPropertyValue.bind(style);
          return new Proxy(style, {
            get(target, prop, receiver) {
              if (prop === "getPropertyValue") {
                return (name: string) => {
                  if (name === "width" && scrollContainer.style.width === "auto") {
                    return `${getBoxMetrics().cssWidth}px`;
                  }
                  return origGetPropertyValue(name);
                };
              }
              return Reflect.get(target, prop, receiver);
            },
          });
        }
        return style;
      });

      Object.defineProperty(scrollContainer, "clientWidth", {
        configurable: true,
        get() {
          return getBoxMetrics().clientWidth;
        },
      });
      Object.defineProperty(scrollContainer, "offsetWidth", {
        configurable: true,
        get() {
          return getBoxMetrics().offsetWidth;
        },
      });

      expect(getBoxMetrics()).toEqual({
        cssWidth: 400,
        contentWidth: 385,
        clientWidth: 405,
        offsetWidth: 420,
      });

      const { rerender, unmount } = render(<Slider {...props} orientation="vertical" />, {
        container: scrollContainer,
      });

      // 1. content-box without minWidth: reduces width to 385px and leaves minWidth untouched ("")
      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked />);
      expect(scrollContainer.style.overflow).toBe("hidden");
      expect(scrollContainer.style.paddingRight).toBe("35px");
      expect(scrollContainer.style.width).toBe("385px");
      expect(scrollContainer.style.minWidth).toBe("");
      expect(getBoxMetrics()).toEqual({
        cssWidth: 385,
        contentWidth: 385,
        clientWidth: 420,
        offsetWidth: 420,
      });

      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked={false} />);
      expect(scrollContainer.style.overflow).toBe("scroll");
      expect(scrollContainer.style.paddingRight).toBe("20px");
      expect(scrollContainer.style.width).toBe("400px");
      expect(scrollContainer.style.minWidth).toBe("");
      expect(getBoxMetrics()).toEqual({
        cssWidth: 400,
        contentWidth: 385,
        clientWidth: 405,
        offsetWidth: 420,
      });

      // 2. content-box with minWidth = "400px": reduces both width and minWidth to 385px and restores both on unlock/unmount
      scrollContainer.style.minWidth = "400px";
      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked />);
      expect(scrollContainer.style.overflow).toBe("hidden");
      expect(scrollContainer.style.paddingRight).toBe("35px");
      expect(scrollContainer.style.width).toBe("385px");
      expect(scrollContainer.style.minWidth).toBe("385px");
      expect(getBoxMetrics()).toEqual({
        cssWidth: 385,
        contentWidth: 385,
        clientWidth: 420,
        offsetWidth: 420,
      });

      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked={false} />);
      expect(scrollContainer.style.overflow).toBe("scroll");
      expect(scrollContainer.style.paddingRight).toBe("20px");
      expect(scrollContainer.style.width).toBe("400px");
      expect(scrollContainer.style.minWidth).toBe("400px");

      // 3. content-box with non-pixel minWidth = "100%": reduces both width and minWidth to 385px and restores "100%" on unlock
      scrollContainer.style.minWidth = "100%";
      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked />);
      expect(scrollContainer.style.width).toBe("385px");
      expect(scrollContainer.style.minWidth).toBe("385px");
      expect(getBoxMetrics()).toEqual({
        cssWidth: 385,
        contentWidth: 385,
        clientWidth: 420,
        offsetWidth: 420,
      });

      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked={false} />);
      expect(scrollContainer.style.width).toBe("400px");
      expect(scrollContainer.style.minWidth).toBe("100%");

      // 4. content-box with width = "auto" and minWidth = "370px" (partial reduction 380 -> 370 clamped above targetWidth 365)
      scrollContainer.style.width = "auto";
      scrollContainer.style.minWidth = "370px";
      expect(getBoxMetrics()).toEqual({
        cssWidth: 380,
        contentWidth: 365,
        clientWidth: 385,
        offsetWidth: 400,
      });

      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked />);
      expect(scrollContainer.style.paddingRight).toBe("35px");
      expect(scrollContainer.style.width).toBe("365px");
      expect(scrollContainer.style.minWidth).toBe("365px");
      expect(getBoxMetrics()).toEqual({
        cssWidth: 365,
        contentWidth: 365,
        clientWidth: 400,
        offsetWidth: 400,
      });

      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked={false} />);
      expect(scrollContainer.style.paddingRight).toBe("20px");
      expect(scrollContainer.style.width).toBe("auto");
      expect(scrollContainer.style.minWidth).toBe("370px");

      // 5. border-box container with explicit width should NOT have style.width or style.minWidth reduced
      scrollContainer.style.width = "400px";
      scrollContainer.style.minWidth = "400px";
      scrollContainer.style.boxSizing = "border-box";
      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked />);
      expect(scrollContainer.style.paddingRight).toBe("35px");
      expect(scrollContainer.style.width).toBe("400px");
      expect(scrollContainer.style.minWidth).toBe("400px");
      expect(getBoxMetrics()).toEqual({
        cssWidth: 400,
        contentWidth: 365,
        clientWidth: 400,
        offsetWidth: 400,
      });

      // Re-lock as content-box with minWidth = "400px" and unmount while locked
      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked={false} />);
      scrollContainer.style.boxSizing = "content-box";
      rerender(<Slider {...props} orientation="vertical" isPageScrollLocked />);
      expect(scrollContainer.style.width).toBe("385px");
      expect(scrollContainer.style.minWidth).toBe("385px");

      unmount();
      expect(scrollContainer.style.overflow).toBe("scroll");
      expect(scrollContainer.style.paddingRight).toBe("20px");
      expect(scrollContainer.style.width).toBe("400px");
      expect(scrollContainer.style.minWidth).toBe("400px");

      scrollContainer.remove();
    });

    it("should ignore touchmove while document is scrolling when lockOnWindowScroll is true", () => {
      const { container } = render(<Slider {...props} lockOnWindowScroll />);
      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;

      fireEvent.scroll(window);

      fireEvent.touchMove(tray, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      expect(tray.style.transform).toContain("translateX(0px)");

      act(() => {
        vi.advanceTimersByTime(100);
      });

      fireEvent.touchMove(tray, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      expect(tray.style.transform).toContain("translateX(100px)");
    });

    it("should compute next slide on touchend and touchcancel (including clamping and infinite mode)", () => {
      const { container, rerender } = render(<Slider {...props} />);
      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;

      Object.defineProperty(tray, "clientWidth", {
        configurable: true,
        value: 500,
      });
      Object.defineProperty(tray, "clientHeight", {
        configurable: true,
        value: 100,
      });

      // Drag left by 51px (slideSizeInPx = 500 / 5 = 100px, threshold = 0.1 -> 10px) -> moves to slide 1
      fireEvent.touchStart(tray, {
        targetTouches: [{ screenX: 100, screenY: 0 }],
      });
      fireEvent.touchMove(tray, {
        targetTouches: [{ screenX: 49, screenY: 0 }],
      });
      fireEvent.touchEnd(tray, { targetTouches: [] });
      expect(props.carouselStore.state.currentSlide).toBe(1);

      // Drag past start (deltaX = +1000) -> clamps at 0
      fireEvent.touchStart(tray, {
        targetTouches: [{ screenX: 0, screenY: 0 }],
      });
      fireEvent.touchMove(tray, {
        targetTouches: [{ screenX: 1000, screenY: 0 }],
      });
      fireEvent.touchEnd(tray, { targetTouches: [] });
      expect(props.carouselStore.state.currentSlide).toBe(0);

      // Drag past end (deltaX = -1000) -> clamps at totalSlides - visibleSlides (5 - 2 = 3)
      fireEvent.touchStart(tray, {
        targetTouches: [{ screenX: 1000, screenY: 0 }],
      });
      fireEvent.touchMove(tray, {
        targetTouches: [{ screenX: 0, screenY: 0 }],
      });
      fireEvent.touchCancel(tray, { targetTouches: [] });
      expect(props.carouselStore.state.currentSlide).toBe(3);

      // Infinite mode: dragging past start from slide 0 wraps to maxSlide (3)
      rerender(<Slider {...props} infinite currentSlide={0} />);
      fireEvent.touchStart(tray, {
        targetTouches: [{ screenX: 0, screenY: 0 }],
      });
      fireEvent.touchMove(tray, {
        targetTouches: [{ screenX: 1000, screenY: 0 }],
      });
      fireEvent.touchEnd(tray, { targetTouches: [] });
      expect(props.carouselStore.state.currentSlide).toBe(3);

      // Infinite mode: dragging past end from last slide wraps to 0
      rerender(<Slider {...props} infinite currentSlide={props.totalSlides - 1} />);
      fireEvent.touchStart(tray, {
        targetTouches: [{ screenX: 1000, screenY: 0 }],
      });
      fireEvent.touchMove(tray, {
        targetTouches: [{ screenX: 0, screenY: 0 }],
      });
      fireEvent.touchEnd(tray, { targetTouches: [] });
      expect(props.carouselStore.state.currentSlide).toBe(0);
    });

    it("should suppress live drag translation when disableAnimation is true while still advancing currentSlide on touchend and mouseup", () => {
      const { container, rerender } = render(<Slider {...props} disableAnimation />);
      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;

      Object.defineProperty(tray, "clientWidth", {
        configurable: true,
        value: 500,
      });
      Object.defineProperty(tray, "clientHeight", {
        configurable: true,
        value: 500,
      });

      // Horizontal touch drag: tray stays at translateX(0px) during move, then advances slide on touchend
      fireEvent.touchStart(tray, {
        targetTouches: [{ screenX: 100, screenY: 0 }],
      });
      fireEvent.touchMove(tray, {
        targetTouches: [{ screenX: 40, screenY: 0 }],
      });
      expect(tray.style.transition).toBe("none");
      expect(tray.style.transform).toBe("translateX(0%) translateX(0px)");

      fireEvent.touchEnd(tray, { targetTouches: [] });
      expect(props.carouselStore.state.currentSlide).toBe(1);

      // Horizontal mouse drag: tray stays at translateX(0px) during move, then advances slide on mouseup
      rerender(<Slider {...props} disableAnimation currentSlide={1} />);
      fireEvent.mouseDown(tray, { screenX: 100, screenY: 0 });
      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mousemove", { screenX: 40, screenY: 0 }),
        );
      });
      expect(tray.style.transform).toBe("translateX(-50%) translateX(0px)");

      act(() => {
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      expect(props.carouselStore.state.currentSlide).toBe(2);

      // Vertical touch drag: tray stays at translateY(0px) during move, then advances slide on touchend
      rerender(<Slider {...props} disableAnimation orientation="vertical" currentSlide={2} />);
      fireEvent.touchStart(tray, {
        targetTouches: [{ screenX: 0, screenY: 100 }],
      });
      fireEvent.touchMove(tray, {
        targetTouches: [{ screenX: 0, screenY: 40 }],
      });
      expect(tray.style.transform).toBe("translateY(-100%) translateY(0px)");

      fireEvent.touchEnd(tray, { targetTouches: [] });
      expect(props.carouselStore.state.currentSlide).toBe(3);
    });
  });

  describe("mouse dragging & click capture", () => {
    it("should handle mousedown, document mousemove, clickCapture cancellation, and document mouseup", () => {
      const onMouseDown = vi.fn();
      const onClickCapture = vi.fn();
      const { container } = render(
        <Slider {...props} trayProps={{ onMouseDown, onClickCapture }} />,
      );
      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;

      Object.defineProperty(tray, "clientWidth", {
        configurable: true,
        value: 500,
      });

      // Normal click before dragging is not prevented
      const normalClick = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      });
      fireEvent(tray, normalClick);
      expect(onClickCapture).toHaveBeenCalledTimes(1);

      // Start mouse drag
      const mouseDownEv = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        screenX: 100,
        screenY: 100,
      });
      fireEvent(tray, mouseDownEv);
      expect(onMouseDown).toHaveBeenCalledTimes(1);
      expect(tray.style.transition).toBe("none");

      // Move mouse on document.documentElement
      const mouseMoveEv = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        screenX: 40,
        screenY: 100,
      });
      act(() => {
        document.documentElement.dispatchEvent(mouseMoveEv);
      });
      expect(tray.style.transform).toContain("translateX(-60px)");

      // End mouse drag on document.documentElement
      const mouseUpEv = new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
      });
      act(() => {
        document.documentElement.dispatchEvent(mouseUpEv);
      });
      expect(props.carouselStore.state.currentSlide).toBe(1);

      // Next clickCapture after drag should be prevented
      const postDragClick = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      });
      const preventClickSpy = vi.spyOn(postDragClick, "preventDefault");
      fireEvent(tray, postDragClick);
      expect(preventClickSpy).toHaveBeenCalledTimes(1);
    });

    it("should not start mouse drag when dragEnabled is false", () => {
      const onMouseDown = vi.fn();
      const { container } = render(
        <Slider {...props} dragEnabled={false} trayProps={{ onMouseDown }} />,
      );
      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;

      fireEvent.mouseDown(tray, { screenX: 100, screenY: 100 });
      expect(onMouseDown).toHaveBeenCalledTimes(1);

      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mousemove", { screenX: 200, screenY: 200 }),
        );
      });
      expect(tray.style.transform).toContain("translateX(0px)");
    });

    it("should suppress child button/link clicks after dragging > 5px, allow clicks with <= 5px micro-movement, and reset stale cancelNextClick on new press", () => {
      const onButtonClick = vi.fn();
      const onLinkClick = vi.fn();
      const { getByTestId } = render(
        <Slider {...props}>
          <div className="carousel__slide">
            <button type="button" data-testid="slide-btn" onClick={onButtonClick}>
              Action
            </button>
            <a href="#target" data-testid="slide-link" onClick={onLinkClick}>
              Link
            </a>
          </div>
        </Slider>,
      );

      const btn = getByTestId("slide-btn");
      const link = getByTestId("slide-link");

      // 1. Micro-movement <= 5px (e.g., 3px, 4px -> hypot = 5px) should NOT suppress child button click
      fireEvent.mouseDown(btn, { screenX: 100, screenY: 100 });
      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mousemove", { screenX: 103, screenY: 104 }),
        );
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      fireEvent.click(btn);
      expect(onButtonClick).toHaveBeenCalledTimes(1);

      // 2. Dragging > 5px (e.g., 20px) SHOULD suppress child button onClick via stopPropagation in capture phase
      fireEvent.mouseDown(btn, { screenX: 100, screenY: 100 });
      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mousemove", { screenX: 120, screenY: 100 }),
        );
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      const draggedClickEv = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(draggedClickEv, "preventDefault");
      fireEvent(btn, draggedClickEv);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(onButtonClick).toHaveBeenCalledTimes(1); // Still 1 — child handler did not fire!

      // 3. Touch drag > 5px also suppresses synthesized click on child link, while <= 5px touch jitter allows it
      fireEvent.touchStart(link, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      fireEvent.touchMove(link, {
        targetTouches: [{ screenX: 102, screenY: 102 }],
      });
      fireEvent.touchEnd(link, { targetTouches: [] });
      fireEvent.click(link);
      expect(onLinkClick).toHaveBeenCalledTimes(1);

      fireEvent.touchStart(link, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      fireEvent.touchMove(link, {
        targetTouches: [{ screenX: 130, screenY: 100 }],
      });
      fireEvent.touchEnd(link, { targetTouches: [] });
      fireEvent.click(link);
      expect(onLinkClick).toHaveBeenCalledTimes(1); // Still 1 — suppressed after touch drag!

      // 4. Dragging and releasing outside (no click event fired) resets cancelNextClick on the next press
      fireEvent.mouseDown(btn, { screenX: 100, screenY: 100 });
      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mousemove", { screenX: 150, screenY: 100 }),
        );
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      // No click fired after that drag! Now user performs a normal stationary click on the button:
      fireEvent.mouseDown(btn, { screenX: 100, screenY: 100 });
      act(() => {
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      fireEvent.click(btn);
      expect(onButtonClick).toHaveBeenCalledTimes(2);
    });

    it("should respect a custom dragClickThreshold prop", () => {
      const onButtonClick = vi.fn();
      const { getByTestId } = render(
        <Slider {...props} dragClickThreshold={15}>
          <div className="carousel__slide">
            <button type="button" data-testid="custom-thresh-btn" onClick={onButtonClick}>
              Action
            </button>
          </div>
        </Slider>,
      );

      const btn = getByTestId("custom-thresh-btn");

      // Movement of 10px is <= custom dragClickThreshold (15px), so click should still fire
      fireEvent.mouseDown(btn, { screenX: 100, screenY: 100 });
      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mousemove", { screenX: 110, screenY: 100 }),
        );
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      fireEvent.click(btn);
      expect(onButtonClick).toHaveBeenCalledTimes(1);

      // Movement of 20px is > custom dragClickThreshold (15px), so click should be suppressed
      fireEvent.mouseDown(btn, { screenX: 100, screenY: 100 });
      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mousemove", { screenX: 120, screenY: 100 }),
        );
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      fireEvent.click(btn);
      expect(onButtonClick).toHaveBeenCalledTimes(1);
    });

    it("should preserve touch click suppression through compatibility mousedown -> mouseup -> click events", () => {
      const onButtonClick = vi.fn();
      const { getByTestId } = render(
        <Slider {...props} dragClickThreshold={1}>
          <div className="carousel__slide">
            <button type="button" data-testid="touch-compat-btn" onClick={onButtonClick}>
              Action
            </button>
          </div>
        </Slider>,
      );

      const btn = getByTestId("touch-compat-btn");

      // Touch movement of 2px exceeds dragClickThreshold={1}, followed by compatibility mouse events
      fireEvent.touchStart(btn, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      fireEvent.touchMove(btn, {
        targetTouches: [{ screenX: 102, screenY: 100 }],
      });
      fireEvent.touchEnd(btn, { targetTouches: [] });

      // Browser synthesizes compatibility mousemove -> mousedown -> mouseup -> click at same coordinates
      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mousemove", { screenX: 102, screenY: 100 }),
        );
      });
      fireEvent.mouseDown(btn, { screenX: 102, screenY: 100 });
      act(() => {
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      const compatClickEv = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(compatClickEv, "preventDefault");
      fireEvent(btn, compatClickEv);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(onButtonClick).not.toHaveBeenCalled();

      // Subsequent normal click should work normally
      fireEvent.mouseDown(btn, { screenX: 102, screenY: 100 });
      act(() => {
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      fireEvent.click(btn);
      expect(onButtonClick).toHaveBeenCalledTimes(1);

      // touchCancel after a touch drag should clear suppression so subsequent click is allowed
      fireEvent.touchStart(btn, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      fireEvent.touchMove(btn, {
        targetTouches: [{ screenX: 110, screenY: 100 }],
      });
      fireEvent.touchCancel(btn, { targetTouches: [] });
      fireEvent.click(btn);
      expect(onButtonClick).toHaveBeenCalledTimes(2);
    });

    it("should suppress compatibility click when touchend changedTouches drifts from last touchmove or sourceCapabilities.firesTouchEvents is true", () => {
      const onButtonClick = vi.fn();
      const { getByTestId } = render(
        <Slider {...props} dragClickThreshold={1}>
          <div className="carousel__slide">
            <button type="button" data-testid="touch-drift-btn" onClick={onButtonClick}>
              Action
            </button>
          </div>
        </Slider>,
      );

      const btn = getByTestId("touch-drift-btn");

      // 1a. touchend release-coordinate drift: touchmove at (102, 0), touchend changedTouches at (104, 0)
      fireEvent.touchStart(btn, {
        targetTouches: [{ screenX: 100, screenY: 0 }],
      });
      fireEvent.touchMove(btn, {
        targetTouches: [{ screenX: 102, screenY: 0 }],
      });
      fireEvent.touchEnd(btn, {
        targetTouches: [],
        changedTouches: [{ screenX: 104, screenY: 0 }],
      });

      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mousemove", { screenX: 104, screenY: 0 }),
        );
      });
      fireEvent.mouseDown(btn, { screenX: 104, screenY: 0 });
      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mouseup", { screenX: 104, screenY: 0 }),
        );
      });
      fireEvent.click(btn);
      expect(onButtonClick).not.toHaveBeenCalled();

      // Also verify when touchstart -> touchend changedTouches alone exceeds dragClickThreshold
      fireEvent.touchStart(btn, {
        targetTouches: [{ screenX: 100, screenY: 0 }],
      });
      fireEvent.touchEnd(btn, {
        targetTouches: [],
        changedTouches: [{ screenX: 103, screenY: 0 }],
      });
      fireEvent.mouseDown(btn, { screenX: 103, screenY: 0 });
      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mouseup", { screenX: 103, screenY: 0 }),
        );
      });
      fireEvent.click(btn);
      expect(onButtonClick).not.toHaveBeenCalled();

      // 1b. Compatibility mousemove/mousedown with sourceCapabilities.firesTouchEvents === true even with slight coordinate shift
      fireEvent.touchStart(btn, {
        targetTouches: [{ screenX: 100, screenY: 0 }],
      });
      fireEvent.touchMove(btn, {
        targetTouches: [{ screenX: 102, screenY: 0 }],
      });
      fireEvent.touchEnd(btn, {
        targetTouches: [],
        changedTouches: [{ screenX: 102, screenY: 0 }],
      });

      act(() => {
        const compatMouseMoveEv = new MouseEvent("mousemove", {
          bubbles: true,
          cancelable: true,
          screenX: 106,
          screenY: 0,
        });
        Object.defineProperty(compatMouseMoveEv, "sourceCapabilities", {
          value: { firesTouchEvents: true },
        });
        document.documentElement.dispatchEvent(compatMouseMoveEv);
      });

      const compatMouseDownEv = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        screenX: 106,
        screenY: 0,
      });
      Object.defineProperty(compatMouseDownEv, "sourceCapabilities", {
        value: { firesTouchEvents: true },
      });
      fireEvent(btn, compatMouseDownEv);
      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mouseup", { screenX: 106, screenY: 0 }),
        );
      });
      fireEvent.click(btn);
      expect(onButtonClick).not.toHaveBeenCalled();
    });

    it("should allow clicking a child element that calls stopPropagation in onMouseDown after a touch swipe", () => {
      const onButtonClick = vi.fn();
      const { getByTestId } = render(
        <Slider {...props}>
          <div className="carousel__slide">
            <button
              type="button"
              data-testid="stop-prop-btn"
              onMouseDown={(ev) => ev.stopPropagation()}
              onClick={onButtonClick}
            >
              Interactive Control
            </button>
          </div>
        </Slider>,
      );

      const btn = getByTestId("stop-prop-btn");

      // 1. Touch swipe beyond dragClickThreshold without a compatibility click, then pointerdown(mouse) + stopped mousedown + click
      fireEvent.touchStart(btn, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      fireEvent.touchMove(btn, {
        targetTouches: [{ screenX: 140, screenY: 100 }],
      });
      fireEvent.touchEnd(btn, { targetTouches: [] });

      act(() => {
        const mousePtrDown = new Event("pointerdown", { bubbles: true }) as PointerEvent;
        Object.defineProperty(mousePtrDown, "pointerType", { value: "mouse" });
        btn.dispatchEvent(mousePtrDown);
      });
      fireEvent.mouseDown(btn, { screenX: 140, screenY: 100 });
      act(() => {
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      fireEvent.click(btn);
      expect(onButtonClick).toHaveBeenCalledTimes(1);

      // 2. Touch swipe beyond dragClickThreshold without a compatibility click, then stopped mousedown + click directly (no pointerdown)
      fireEvent.touchStart(btn, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      fireEvent.touchMove(btn, {
        targetTouches: [{ screenX: 140, screenY: 100 }],
      });
      fireEvent.touchEnd(btn, { targetTouches: [] });

      fireEvent.mouseDown(btn, { screenX: 140, screenY: 100 });
      act(() => {
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      fireEvent.click(btn);
      expect(onButtonClick).toHaveBeenCalledTimes(2);
    });

    it("should allow a genuine mouse click immediately after a touch swipe without an intervening compatibility click", () => {
      const onButtonClick = vi.fn();
      const { getByTestId, rerender } = render(
        <Slider {...props}>
          <div className="carousel__slide">
            <button type="button" data-testid="hybrid-mouse-btn" onClick={onButtonClick}>
              Action
            </button>
          </div>
        </Slider>,
      );

      const btn = getByTestId("hybrid-mouse-btn");

      // 1. Touch swipe beyond threshold without generating a compatibility click, followed immediately by a real mouse click
      fireEvent.touchStart(btn, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      fireEvent.touchMove(btn, {
        targetTouches: [{ screenX: 140, screenY: 100 }],
      });
      fireEvent.touchEnd(btn, { targetTouches: [] });

      // Immediate mouse click within < 1s (even at the same ending coordinates) should NOT be swallowed
      fireEvent.mouseDown(btn, { screenX: 140, screenY: 100 });
      act(() => {
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      fireEvent.click(btn);
      expect(onButtonClick).toHaveBeenCalledTimes(1);

      // 2. Small touch drag (with pointerdown touch) followed by a genuine mouse click with pointerdown (pointerType: "mouse")
      rerender(
        <Slider {...props} dragClickThreshold={1}>
          <div className="carousel__slide">
            <button type="button" data-testid="hybrid-mouse-btn" onClick={onButtonClick}>
              Action
            </button>
          </div>
        </Slider>,
      );

      act(() => {
        const touchPtrDown = new Event("pointerdown", { bubbles: true }) as PointerEvent;
        Object.defineProperty(touchPtrDown, "pointerType", { value: "touch" });
        btn.dispatchEvent(touchPtrDown);
      });
      fireEvent.touchStart(btn, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      fireEvent.touchMove(btn, {
        targetTouches: [{ screenX: 103, screenY: 100 }],
      });
      fireEvent.touchEnd(btn, { targetTouches: [] });

      act(() => {
        const mousePtrDown = new Event("pointerdown", { bubbles: true }) as PointerEvent;
        Object.defineProperty(mousePtrDown, "pointerType", { value: "mouse" });
        btn.dispatchEvent(mousePtrDown);
      });
      fireEvent.mouseDown(btn, { screenX: 103, screenY: 100 });
      act(() => {
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      fireEvent.click(btn);
      expect(onButtonClick).toHaveBeenCalledTimes(2);

      // 3. Small touch drag followed by a genuine mouse click with sourceCapabilities.firesTouchEvents === false
      fireEvent.touchStart(btn, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      fireEvent.touchMove(btn, {
        targetTouches: [{ screenX: 102, screenY: 100 }],
      });
      fireEvent.touchEnd(btn, { targetTouches: [] });

      const realMouseDownEv = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        screenX: 102,
        screenY: 100,
      });
      Object.defineProperty(realMouseDownEv, "sourceCapabilities", {
        value: { firesTouchEvents: false },
      });
      fireEvent(btn, realMouseDownEv);
      act(() => {
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      fireEvent.click(btn);
      expect(onButtonClick).toHaveBeenCalledTimes(3);

      // 4. Small touch drag followed by independent cursor movement (mousemove away from touch point) and mouse click
      fireEvent.touchStart(btn, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      fireEvent.touchMove(btn, {
        targetTouches: [{ screenX: 102, screenY: 100 }],
      });
      fireEvent.touchEnd(btn, { targetTouches: [] });

      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mousemove", { screenX: 115, screenY: 100 }),
        );
      });
      fireEvent.mouseDown(btn, { screenX: 102, screenY: 100 });
      act(() => {
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      fireEvent.click(btn);
      expect(onButtonClick).toHaveBeenCalledTimes(4);

      // 5. Touch swipe when dragEnabled={false} followed by genuine mouse click, and mouse drag when touchEnabled={false} followed by touch tap
      rerender(
        <Slider {...props} dragEnabled={false} touchEnabled>
          <div className="carousel__slide">
            <button type="button" data-testid="hybrid-mouse-btn" onClick={onButtonClick}>
              Action
            </button>
          </div>
        </Slider>,
      );
      fireEvent.touchStart(btn, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      fireEvent.touchMove(btn, {
        targetTouches: [{ screenX: 140, screenY: 100 }],
      });
      fireEvent.touchEnd(btn, { targetTouches: [] });
      fireEvent.mouseDown(btn, { screenX: 140, screenY: 100 });
      fireEvent.click(btn);
      expect(onButtonClick).toHaveBeenCalledTimes(5);

      rerender(
        <Slider {...props} dragEnabled touchEnabled={false}>
          <div className="carousel__slide">
            <button type="button" data-testid="hybrid-mouse-btn" onClick={onButtonClick}>
              Action
            </button>
          </div>
        </Slider>,
      );
      fireEvent.mouseDown(btn, { screenX: 100, screenY: 100 });
      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mousemove", { screenX: 140, screenY: 100 }),
        );
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      fireEvent.touchStart(btn, {
        targetTouches: [{ screenX: 100, screenY: 100 }],
      });
      fireEvent.click(btn);
      expect(onButtonClick).toHaveBeenCalledTimes(6);
    });

    it("should not block keyboard activation after dragging beyond threshold and releasing outside without a click", () => {
      const onButtonClick = vi.fn();
      const { container, getByTestId } = render(
        <Slider {...props}>
          <div className="carousel__slide">
            <button type="button" data-testid="kb-slide-btn" onClick={onButtonClick}>
              Action
            </button>
          </div>
        </Slider>,
      );

      const slider = container.querySelector(".carousel__slider") as HTMLElement;
      const btn = getByTestId("kb-slide-btn");

      // 1. Drag beyond threshold and release outside (no click event fired), then Tab to button and press Enter
      fireEvent.mouseDown(btn, { screenX: 100, screenY: 100, detail: 1 });
      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mousemove", { screenX: 150, screenY: 100 }),
        );
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });

      // User Tabs to the slide button and presses Enter
      fireEvent.keyDown(slider, { key: "Tab", code: "Tab", keyCode: 9 });
      btn.focus();
      fireEvent.keyDown(btn, { key: "Enter", code: "Enter", keyCode: 13 });
      fireEvent.click(btn, { detail: 0 });
      expect(onButtonClick).toHaveBeenCalledTimes(1);

      // 2. Drag beyond threshold and release outside, then trigger a keyboard-synthesized click (detail === 0) directly
      fireEvent.mouseDown(btn, { screenX: 100, screenY: 100, detail: 1 });
      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mousemove", { screenX: 150, screenY: 100 }),
        );
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      // Modifier keys during an active drag should not clear suppression
      fireEvent.mouseDown(btn, { screenX: 100, screenY: 100, detail: 1 });
      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mousemove", { screenX: 150, screenY: 100 }),
        );
      });
      fireEvent.keyDown(btn, { key: "Shift", keyCode: 16 });
      act(() => {
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      // Keyboard-generated click (detail: 0) is exempted and clears stale cancelNextClick
      fireEvent.click(btn, { detail: 0 });
      expect(onButtonClick).toHaveBeenCalledTimes(2);
    });
  });

  describe("keyboard navigation", () => {
    it("should move slider backward and forward on arrow keys and clamp within bounds", () => {
      const carouselStore = new Store({ currentSlide: 1 });
      const { container, rerender } = render(
        <Slider {...props} currentSlide={1} carouselStore={carouselStore} />,
      );
      const slider = container.querySelector(".carousel__slider") as HTMLElement;

      fireEvent.keyDown(slider, { keyCode: 37 });
      expect(carouselStore.state.currentSlide).toBe(0);

      // Should not go below 0
      rerender(<Slider {...props} currentSlide={0} carouselStore={carouselStore} />);
      fireEvent.keyDown(slider, { keyCode: 37 });
      expect(carouselStore.state.currentSlide).toBe(0);

      // Right arrow increments slide
      fireEvent.keyDown(slider, { keyCode: 39 });
      expect(carouselStore.state.currentSlide).toBe(1);

      // Should not exceed totalSlides - visibleSlides (3)
      carouselStore.setStoreState({ currentSlide: 3 });
      rerender(<Slider {...props} currentSlide={3} carouselStore={carouselStore} />);
      fireEvent.keyDown(slider, { keyCode: 39 });
      expect(carouselStore.state.currentSlide).toBe(3);
    });

    it("should not move slider on keydown when disableKeyboard is true or totalSlides <= visibleSlides", () => {
      const carouselStore = new Store({ currentSlide: 0 });
      const { container, rerender } = render(
        <Slider {...props} currentSlide={0} disableKeyboard carouselStore={carouselStore} />,
      );
      const slider = container.querySelector(".carousel__slider") as HTMLElement;

      fireEvent.keyDown(slider, { keyCode: 39 });
      expect(carouselStore.state.currentSlide).toBe(0);

      rerender(
        <Slider
          {...props}
          currentSlide={0}
          totalSlides={2}
          visibleSlides={2}
          carouselStore={carouselStore}
        />,
      );
      fireEvent.keyDown(slider, { keyCode: 39 });
      expect(carouselStore.state.currentSlide).toBe(0);
    });

    it("should ignore arrow keys from interactive descendants or defaultPrevented events, preserve child focus, and always chain consumer onKeyDown", () => {
      const onKeyDown = vi.fn();
      const carouselStore = new Store({ currentSlide: 1 });
      const { container, getByTestId, rerender } = render(
        <Slider {...props} currentSlide={1} carouselStore={carouselStore} onKeyDown={onKeyDown}>
          <div className="carousel__slide">
            <input data-testid="slide-input" type="text" />
            <textarea data-testid="slide-textarea" />
            <select data-testid="slide-select">
              <option value="a">A</option>
            </select>
            <button data-testid="slide-button" type="button">
              Btn
            </button>
            <a data-testid="slide-link" href="#test">
              Link
            </a>
            <div data-testid="slide-custom-slider" role="slider" aria-valuenow={50} tabIndex={0} />
            <div data-testid="slide-searchbox" role="searchbox" tabIndex={0} />
            <div data-testid="slide-radio" role="radio" aria-checked="false" tabIndex={0} />
            <div data-testid="slide-checkbox" role="checkbox" aria-checked="false" tabIndex={0} />
            <div data-testid="slide-switch" role="switch" aria-checked="false" tabIndex={0} />
            <div data-testid="slide-tree" role="tree" tabIndex={0}>
              <div
                data-testid="slide-treeitem"
                role="treeitem"
                aria-selected="false"
                tabIndex={0}
              />
            </div>
            <div
              data-testid="slide-prevented"
              tabIndex={0}
              onKeyDown={(ev) => ev.preventDefault()}
            />
          </div>
        </Slider>,
      );

      const slider = container.querySelector(".carousel__slider") as HTMLElement;
      const input = getByTestId("slide-input");
      const textarea = getByTestId("slide-textarea");
      const select = getByTestId("slide-select");
      const button = getByTestId("slide-button");
      const link = getByTestId("slide-link");
      const customSlider = getByTestId("slide-custom-slider");
      const searchbox = getByTestId("slide-searchbox");
      const radio = getByTestId("slide-radio");
      const checkbox = getByTestId("slide-checkbox");
      const switchEl = getByTestId("slide-switch");
      const tree = getByTestId("slide-tree");
      const treeitem = getByTestId("slide-treeitem");
      const preventedEl = getByTestId("slide-prevented");

      // Arrow keys inside interactive elements should NOT change currentSlide or preventDefault
      for (const el of [
        input,
        textarea,
        select,
        button,
        link,
        customSlider,
        searchbox,
        radio,
        checkbox,
        switchEl,
        tree,
        treeitem,
      ]) {
        const notPrevented = fireEvent.keyDown(el, { keyCode: 39 });
        expect(notPrevented).toBe(true);
        expect(carouselStore.state.currentSlide).toBe(1);
      }
      expect(onKeyDown).toHaveBeenCalledTimes(12);

      // Event with defaultPrevented already set by child should NOT change currentSlide
      fireEvent.keyDown(preventedEl, { keyCode: 39 });
      expect(carouselStore.state.currentSlide).toBe(1);
      expect(onKeyDown).toHaveBeenCalledTimes(13);

      // Pressing arrow key on slider itself navigates without stealing focus from activeElement
      input.focus();
      expect(document.activeElement).toBe(input);
      const focusSpy = vi.spyOn(slider, "focus");
      fireEvent.keyDown(slider, { keyCode: 39 });
      expect(carouselStore.state.currentSlide).toBe(2);
      expect(focusSpy).not.toHaveBeenCalled();
      expect(document.activeElement).toBe(input);
      expect(onKeyDown).toHaveBeenCalledTimes(14);

      // Consumer onKeyDown is still called when disableKeyboard is true
      rerender(
        <Slider
          {...props}
          currentSlide={2}
          disableKeyboard
          carouselStore={carouselStore}
          onKeyDown={onKeyDown}
        />,
      );
      fireEvent.keyDown(slider, { keyCode: 39 });
      expect(carouselStore.state.currentSlide).toBe(2);
      expect(onKeyDown).toHaveBeenCalledTimes(15);
    });

    it("should not call preventDefault or start mouse drag on form/editable/ARIA-widget descendants while keeping button/link descendants draggable", () => {
      const onMouseDown = vi.fn();
      const { container, getByTestId } = render(
        <Slider {...props} dragEnabled trayProps={{ onMouseDown }}>
          <div className="carousel__slide" role="option" data-testid="non-interactive-slide">
            <input data-testid="child-input" type="text" />
            <textarea data-testid="child-textarea" />
            <div data-testid="child-searchbox" role="searchbox" tabIndex={0} />
            <div data-testid="child-radio" role="radio" aria-checked="false" tabIndex={0} />
            <div data-testid="child-checkbox" role="checkbox" aria-checked="false" tabIndex={0} />
            <div data-testid="child-switch" role="switch" aria-checked="false" tabIndex={0} />
            <div data-testid="child-tree" role="tree" tabIndex={0}>
              <div
                data-testid="child-treeitem"
                role="treeitem"
                aria-selected="false"
                tabIndex={0}
              />
            </div>
            <button data-testid="child-button" type="button">
              Btn
            </button>
          </div>
        </Slider>,
      );

      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;
      const nonInteractiveSlide = getByTestId("non-interactive-slide");
      const childInput = getByTestId("child-input");
      const childTextarea = getByTestId("child-textarea");
      const childSearchbox = getByTestId("child-searchbox");
      const childRadio = getByTestId("child-radio");
      const childCheckbox = getByTestId("child-checkbox");
      const childSwitch = getByTestId("child-switch");
      const childTree = getByTestId("child-tree");
      const childTreeitem = getByTestId("child-treeitem");
      const childButton = getByTestId("child-button");

      // Mousedown on tray or non-interactive slide prevents default when dragEnabled is true
      expect(fireEvent.mouseDown(tray, { screenX: 10, screenY: 10 })).toBe(false);
      act(() => {
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      expect(fireEvent.mouseDown(nonInteractiveSlide, { screenX: 10, screenY: 10 })).toBe(false);
      act(() => {
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });

      // Mousedown on form/editable/ARIA-widget child does NOT prevent default AND does NOT start mouse drag on mousemove
      for (const el of [
        childInput,
        childTextarea,
        childSearchbox,
        childRadio,
        childCheckbox,
        childSwitch,
        childTree,
        childTreeitem,
      ]) {
        expect(fireEvent.mouseDown(el, { screenX: 100, screenY: 100 })).toBe(true);
        const moveEv = new MouseEvent("mousemove", {
          bubbles: true,
          cancelable: true,
          screenX: 40,
          screenY: 100,
        });
        const movePreventSpy = vi.spyOn(moveEv, "preventDefault");
        act(() => {
          document.documentElement.dispatchEvent(moveEv);
        });
        expect(movePreventSpy).not.toHaveBeenCalled();
        expect(tray.style.transform).toContain("translateX(0px)");
      }
      expect(onMouseDown).toHaveBeenCalledTimes(10);

      // Mousedown on button skips mousedown preventDefault (preserving focus) while participating in mouse drag on mousemove
      expect(fireEvent.mouseDown(childButton, { screenX: 100, screenY: 100 })).toBe(true);
      const btnMoveEv = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        screenX: 40,
        screenY: 100,
      });
      const btnMovePreventSpy = vi.spyOn(btnMoveEv, "preventDefault");
      act(() => {
        document.documentElement.dispatchEvent(btnMoveEv);
      });
      expect(btnMovePreventSpy).toHaveBeenCalledTimes(1);
      expect(tray.style.transform).toContain("translateX(-60px)");
      act(() => {
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
    });
  });

  describe("autoplay (play / stop / playForward / playBackward)", () => {
    it("should play forward on interval when isPlaying is true and wrap around at end", () => {
      const { rerender } = render(<Slider {...props} isPlaying />);

      act(() => {
        vi.advanceTimersByTime(props.interval);
      });
      expect(props.carouselStore.state.currentSlide).toBe(2);

      // At end (slide 3), next interval wraps to 0
      props.carouselStore.setStoreState({ currentSlide: 3 });
      rerender(<Slider {...props} isPlaying currentSlide={3} />);

      act(() => {
        vi.advanceTimersByTime(props.interval);
      });
      expect(props.carouselStore.state.currentSlide).toBe(0);

      // Stopping when isPlaying becomes false
      rerender(<Slider {...props} isPlaying={false} currentSlide={0} />);
      act(() => {
        vi.advanceTimersByTime(props.interval * 2);
      });
      expect(props.carouselStore.state.currentSlide).toBe(0);
    });

    it('should play backward when playDirection="backward" and wrap around at start', () => {
      const { rerender } = render(<Slider {...props} playDirection="backward" isPlaying={false} />);

      // Start playing via prop change from slide 0 -> wraps to totalSlides - visibleSlides (3)
      rerender(<Slider {...props} playDirection="backward" isPlaying />);
      act(() => {
        vi.advanceTimersByTime(props.interval);
      });
      expect(props.carouselStore.state.currentSlide).toBe(3);

      // From slide 4, steps back by step (2) to slide 2
      props.carouselStore.setStoreState({ currentSlide: 4 });
      rerender(<Slider {...props} playDirection="backward" isPlaying currentSlide={4} />);
      act(() => {
        vi.advanceTimersByTime(props.interval);
      });
      expect(props.carouselStore.state.currentSlide).toBe(2);
    });

    it("should dynamically reverse autoplay direction when playDirection changes while isPlaying is true", () => {
      const { rerender } = render(<Slider {...props} isPlaying playDirection="forward" />);

      // First tick moves forward from 0 -> 2
      act(() => {
        vi.advanceTimersByTime(props.interval);
      });
      expect(props.carouselStore.state.currentSlide).toBe(2);

      // Change playDirection to "backward" while still playing
      rerender(<Slider {...props} isPlaying currentSlide={2} playDirection="backward" />);

      act(() => {
        vi.advanceTimersByTime(props.interval);
      });
      expect(props.carouselStore.state.currentSlide).toBe(0);

      // Change playDirection back to "forward" while still playing
      rerender(<Slider {...props} isPlaying currentSlide={0} playDirection="forward" />);

      act(() => {
        vi.advanceTimersByTime(props.interval);
      });
      expect(props.carouselStore.state.currentSlide).toBe(2);
    });

    it("should dynamically update timer interval when interval prop changes while isPlaying is true", () => {
      const { rerender } = render(<Slider {...props} isPlaying interval={5000} />);

      // Change interval to 1000ms while already playing
      rerender(<Slider {...props} isPlaying interval={1000} />);

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(props.carouselStore.state.currentSlide).toBe(2);
    });

    it("should reset the interval timer instead of pausing autoplay on keyboard, drag, and slide changes when pauseOnInteract is false", () => {
      const carouselStore = new Store({
        currentSlide: 0,
        isPlaying: true,
        pauseOnInteract: false,
        totalSlides: 5,
        visibleSlides: 1,
        step: 1,
      });

      const { container, rerender } = render(
        <Slider
          {...props}
          carouselStore={carouselStore}
          currentSlide={0}
          isPlaying
          pauseOnInteract={false}
          interval={5000}
          totalSlides={5}
          visibleSlides={1}
          step={1}
        />,
      );

      const slider = container.querySelector(".carousel__slider") as HTMLElement;
      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;

      Object.defineProperty(tray, "clientWidth", {
        configurable: true,
        value: 500,
      });

      // Advance 3000ms of 5000ms interval, then press Right arrow
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      fireEvent.keyDown(slider, { keyCode: 39 });
      expect(carouselStore.state.currentSlide).toBe(1);
      expect(carouselStore.state.isPlaying).toBe(true);

      rerender(
        <Slider
          {...props}
          carouselStore={carouselStore}
          currentSlide={1}
          isPlaying
          pauseOnInteract={false}
          interval={5000}
          totalSlides={5}
          visibleSlides={1}
          step={1}
        />,
      );

      // 3000ms after key press should NOT have advanced yet because interval was reset to 5000ms
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(carouselStore.state.currentSlide).toBe(1);

      // Remaining 2000ms completes the 5000ms reset interval -> advances to slide 2
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(carouselStore.state.currentSlide).toBe(2);

      // Left arrow key with pauseOnInteract={false} also keeps isPlaying true and resets timer
      rerender(
        <Slider
          {...props}
          carouselStore={carouselStore}
          currentSlide={2}
          isPlaying
          pauseOnInteract={false}
          interval={5000}
          totalSlides={5}
          visibleSlides={1}
          step={1}
        />,
      );
      fireEvent.keyDown(slider, { keyCode: 37 });
      expect(carouselStore.state.currentSlide).toBe(1);
      expect(carouselStore.state.isPlaying).toBe(true);

      // Touch drag start pauses interval during drag without setting isPlaying: false,
      // and touch drag end restarts fresh interval
      rerender(
        <Slider
          {...props}
          carouselStore={carouselStore}
          currentSlide={1}
          isPlaying
          pauseOnInteract={false}
          interval={5000}
          totalSlides={5}
          visibleSlides={1}
          step={1}
        />,
      );
      fireEvent.touchStart(tray, {
        targetTouches: [{ screenX: 100, screenY: 0 }],
      });
      expect(carouselStore.state.isPlaying).toBe(true);

      // While dragging, timer is paused even past full interval
      act(() => {
        vi.advanceTimersByTime(10000);
      });
      expect(carouselStore.state.currentSlide).toBe(1);

      // End drag -> timer restarts fresh 5000ms interval
      fireEvent.touchEnd(tray, { targetTouches: [] });
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(carouselStore.state.currentSlide).toBe(1);
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(carouselStore.state.currentSlide).toBe(2);
    });
  });

  describe("classes, styles & privateUnDisableAnimation", () => {
    it("should apply horizontal classes and define display: flex on .sliderTray in Slider.scss", async () => {
      const sass = await import("sass");
      const path = await import("node:path");
      const compiled = sass.compile(path.resolve(import.meta.dirname, "../Slider.scss"));
      expect(compiled.css).toMatch(/\.sliderTray\s*\{[^}]*display:\s*flex/);
      expect(compiled.css).toMatch(/\.sliderAnimation\s*\{[^}]*transition:\s*transform 500ms/);
      expect(compiled.css).not.toMatch(/will-change/);
      expect(compiled.css).toMatch(/\.horizontalTray\s*\{/);
      expect(compiled.css).toMatch(/\.verticalTray\s*\{/);

      const { container } = render(<Slider {...props} orientation="horizontal" />);

      const slider = container.querySelector(".carousel__slider") as HTMLElement;
      const trayWrap = container.querySelector(".carousel__slider-tray-wrapper") as HTMLElement;
      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;

      expect(slider).toHaveClass("horizontalSlider", "carousel__slider--horizontal");
      expect(trayWrap).toHaveClass("carousel__slider-tray-wrap--horizontal");
      expect(trayWrap).not.toHaveClass("verticalSlideTrayWrap");
      expect(tray).toHaveClass(
        "sliderTray",
        "sliderAnimation",
        "horizontalTray",
        "carousel__slider-tray--horizontal",
      );
      expect(tray.style.flexDirection).toBe("row");
    });

    it('should apply vertical classes and styles when orientation="vertical" and isIntrinsicHeight is true', () => {
      const { container } = render(
        <Slider
          {...props}
          orientation="vertical"
          isIntrinsicHeight
          classNameAnimation="my-animation"
          classNameTray="tray-class"
          classNameTrayWrap="tray-class-wrap"
        />,
      );

      const slider = container.querySelector(".carousel__slider") as HTMLElement;
      const trayWrap = container.querySelector(".carousel__slider-tray-wrapper") as HTMLElement;
      const tray = container.querySelector(".carousel__slider-tray") as HTMLElement;

      expect(slider).toHaveClass("verticalSlider", "carousel__slider--vertical");
      expect(trayWrap).toHaveClass(
        "verticalSlideTrayWrap",
        "carousel__slider-tray-wrap--vertical",
        "tray-class-wrap",
      );
      expect(tray).toHaveClass(
        "verticalTray",
        "carousel__slider-tray--vertical",
        "my-animation",
        "tray-class",
      );
      expect(tray).not.toHaveClass("sliderAnimation");
      expect(tray.style.display).toBe("flex");
      expect(tray.style.alignItems).toBe("stretch");
    });

    it("should reset privateUnDisableAnimation and disableAnimation when privateUnDisableAnimation becomes true", () => {
      const spy = vi.spyOn(props.carouselStore, "setStoreState");
      const { rerender } = render(<Slider {...props} privateUnDisableAnimation={false} />);

      rerender(<Slider {...props} privateUnDisableAnimation />);
      expect(spy).toHaveBeenCalledWith({
        privateUnDisableAnimation: false,
        disableAnimation: false,
      });
    });

    it("should not pass internal carousel props to root div", () => {
      const { container } = render(<Slider {...props} />);
      const slider = container.querySelector(".carousel__slider") as HTMLElement;
      expect(slider.getAttribute("dragStep")).toBeNull();
      expect(slider.getAttribute("step")).toBeNull();
      expect(slider.getAttribute("infinite")).toBeNull();
    });

    it("should forward object and callback refs to the slider root element", () => {
      const objRef = React.createRef<HTMLDivElement>();
      let callbackNode: HTMLDivElement | null = null;
      const { rerender } = render(<Slider {...props} ref={objRef} />);
      expect(objRef.current).toBeInstanceOf(HTMLDivElement);
      expect(objRef.current).toHaveClass("carousel__slider");

      rerender(
        <Slider
          {...props}
          ref={(node) => {
            callbackNode = node;
          }}
        />,
      );
      expect(callbackNode).toBeInstanceOf(HTMLDivElement);
      expect(callbackNode).toHaveClass("carousel__slider");
    });

    it("should pass trayWrapProps to the tray wrapper element and merge className and style", () => {
      const { container } = render(
        <Slider
          {...props}
          classNameTrayWrap="custom-wrap"
          trayWrapProps={{
            id: "tray-wrap-id",
            "aria-label": "Tray Wrapper",
            className: "from-tray-wrap-props",
            style: { border: "1px solid red" },
          }}
        />,
      );
      const slider = container.querySelector(".carousel__slider") as HTMLElement;
      expect(slider.hasAttribute("trayWrapProps")).toBe(false);
      expect(slider.hasAttribute("traywrapprops")).toBe(false);

      const trayWrap = container.querySelector(".carousel__slider-tray-wrapper") as HTMLElement;
      expect(trayWrap).toHaveAttribute("id", "tray-wrap-id");
      expect(trayWrap).toHaveAttribute("aria-label", "Tray Wrapper");
      expect(trayWrap).toHaveClass(
        "carousel__slider-tray-wrapper",
        "custom-wrap",
        "from-tray-wrap-props",
      );
      expect(trayWrap.style.border).toBe("1px solid red");
    });

    it('should toggle default aria-live between "polite" and "off" based on isPlaying and omit default aria-label when aria-labelledby is set', () => {
      const { container, rerender } = render(<Slider {...props} isPlaying={false} />);
      const slider = container.querySelector(".carousel__slider") as HTMLElement;
      expect(slider).toHaveAttribute("aria-live", "polite");
      expect(slider).toHaveAttribute("aria-label", "slider");

      rerender(<Slider {...props} isPlaying />);
      expect(slider).toHaveAttribute("aria-live", "off");

      rerender(<Slider {...props} isPlaying aria-live="assertive" />);
      expect(slider).toHaveAttribute("aria-live", "assertive");

      rerender(<Slider {...props} aria-labelledby="carousel-heading" />);
      expect(slider).toHaveAttribute("aria-labelledby", "carousel-heading");
      expect(slider.hasAttribute("aria-label")).toBe(false);

      rerender(<Slider {...props} aria-label="Featured products" />);
      expect(slider).toHaveAttribute("aria-label", "Featured products");

      rerender(<Slider {...props} ariaLabel="Explicit slider ariaLabel" />);
      expect(slider).toHaveAttribute("aria-label", "Explicit slider ariaLabel");
    });
  });
});
