import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { createComponentConfig } from "../../__tests__/component-config";
import ImageWithZoom, {
  midpointBetweenTwoTouches,
  distanceBetweenTwoTouches,
} from "../ImageWithZoom";
import CarouselProvider from "../../CarouselProvider";
import ImageWithZoomWrapper from "../index";

const touchStart = {
  targetTouches: [
    {
      identifier: 1,
      clientX: 50,
      clientY: 50,
    },
    {
      identifier: 2,
      clientX: 100,
      clientY: 100,
    },
  ],
};

const touchEnd = {
  changedTouches: [{ identifier: 1 }, { identifier: 2 }],
};

const renderWithProvider = (ui: React.ReactElement) =>
  render(
    <CarouselProvider naturalSlideWidth={100} naturalSlideHeight={125} totalSlides={1}>
      {ui}
    </CarouselProvider>,
  );

describe("<ImageWithZoom />", () => {
  let props: ReturnType<typeof createComponentConfig>["ImageWithZoom"]["props"];
  let createdImages: HTMLImageElement[];
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    props = createComponentConfig().ImageWithZoom.props;
    createdImages = [];
    originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation(
      (tagName: string, options?: ElementCreationOptions) => {
        const el = originalCreateElement(tagName, options);
        if (tagName.toLowerCase() === "img") {
          createdImages.push(el as HTMLImageElement);
        }
        return el;
      },
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("unit & helper tests", () => {
    it("midpointBetweenTwoTouches should calculate midpoint accurately", () => {
      expect(midpointBetweenTwoTouches({ x1: 0, y1: 0, x2: 100, y2: 200 })).toEqual({
        x: 50,
        y: 100,
      });
      expect(ImageWithZoom.midpointBetweenTwoTouches).toBe(midpointBetweenTwoTouches);
    });

    it("distanceBetweenTwoTouches should calculate distance accurately", () => {
      expect(distanceBetweenTwoTouches({ x1: 0, y1: 0, x2: 3, y2: 4 })).toBe(5);
      expect(ImageWithZoom.distanceBetweenTwoTouches).toBe(distanceBetweenTwoTouches);
    });

    it("should render a custom spinner if supplied while loading", () => {
      const { container } = renderWithProvider(
        <ImageWithZoom {...props} spinner={() => <div className="custom-spinner" />} />,
      );
      expect(container.querySelector(".custom-spinner")).toBeInTheDocument();
    });

    it("should render the default spinner if no custom spinner was supplied while loading", () => {
      const { container } = renderWithProvider(<ImageWithZoom {...props} />);
      expect(container.querySelector(".carousel__spinner")).toBeInTheDocument();
    });

    it("should hide spinner and call onLoad when background image finishes loading", () => {
      const onLoad = vi.fn();
      const { container } = renderWithProvider(<ImageWithZoom {...props} onLoad={onLoad} />);
      expect(
        container.querySelector(".carousel__image-loading-spinner-container"),
      ).toBeInTheDocument();

      act(() => {
        createdImages[0].dispatchEvent(new UIEvent("load"));
      });

      expect(onLoad).toHaveBeenCalledTimes(1);
      expect(
        container.querySelector(".carousel__image-loading-spinner-container"),
      ).not.toBeInTheDocument();
    });

    it("should hide spinner and call onError when background image fails to load", () => {
      const onError = vi.fn();
      const { container } = renderWithProvider(<ImageWithZoom {...props} onError={onError} />);

      act(() => {
        createdImages[0].dispatchEvent(new UIEvent("error"));
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(
        container.querySelector(".carousel__image-loading-spinner-container"),
      ).not.toBeInTheDocument();
    });
  });

  describe("integration tests", () => {
    it("should render via Connected ImageWithZoomWrapper", () => {
      const { container } = renderWithProvider(<ImageWithZoomWrapper src="bob.jpg" />);
      expect(container.querySelector(".carousel__zoom-image")).toBeInTheDocument();
      expect(container.querySelector(".carousel__zoom-image-overlay")).toBeInTheDocument();
    });

    it("should add and remove hovering classes to the overlay when mouse hovers and leaves", () => {
      const { container } = renderWithProvider(<ImageWithZoom {...props} />);
      const overlay = container.querySelector(".carousel__zoom-image-overlay") as HTMLElement;

      expect(overlay).not.toHaveClass("hover");
      expect(overlay).not.toHaveClass("carousel__zoom-image-overlay--hovering");

      fireEvent.mouseOver(overlay);

      expect(overlay).toHaveClass("hover");
      expect(overlay).toHaveClass("carousel__zoom-image-overlay--hovering");

      fireEvent.mouseOut(overlay);

      expect(overlay).not.toHaveClass("hover");
      expect(overlay).not.toHaveClass("carousel__zoom-image-overlay--hovering");
    });

    it("should add and remove zooming classes to the overlay on touch pinch zoom", () => {
      const { container } = renderWithProvider(<ImageWithZoom {...props} />);
      const overlay = container.querySelector(".carousel__zoom-image-overlay") as HTMLElement;

      vi.spyOn(overlay, "getBoundingClientRect").mockReturnValue({
        left: -75,
        top: -75,
        width: 300,
        height: 300,
        right: 225,
        bottom: 225,
        x: -75,
        y: -75,
        toJSON: () => {},
      });

      expect(overlay).not.toHaveClass("zoom");
      expect(overlay).not.toHaveClass("carousel__zoom-image-overlay--zooming");

      fireEvent.touchStart(overlay, touchStart);
      fireEvent.touchMove(overlay, {
        targetTouches: [
          {
            identifier: 1,
            clientX: 25,
            clientY: 25,
          },
          {
            identifier: 2,
            clientX: 125,
            clientY: 125,
          },
        ],
      });

      expect(overlay).toHaveClass("zoom");
      expect(overlay).toHaveClass("carousel__zoom-image-overlay--zooming");
      expect(overlay.style.transformOrigin).toBe("50% 50%");
      expect(props.carouselStore.state.isPageScrollLocked).toBe(true);

      fireEvent.touchEnd(overlay, touchEnd);

      expect(overlay).not.toHaveClass("zoom");
      expect(overlay).not.toHaveClass("carousel__zoom-image-overlay--zooming");
      expect(props.carouselStore.state.isPageScrollLocked).toBe(false);
    });
  });

  describe("background image and zoom prop tests", () => {
    it("should use bgImageTag and alt on the background image when loaded", () => {
      const { container } = renderWithProvider(
        <ImageWithZoom {...props} bgImageTag="img" alt="Test Alt" />,
      );

      act(() => {
        createdImages[0].dispatchEvent(new UIEvent("load"));
      });

      const img = container.querySelector("img.carousel__zoom-image");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("alt", "Test Alt");
    });

    it('should use the "src" prop for the regular and zoomed image if optional prop srcZoomed is NOT provided', () => {
      renderWithProvider(<ImageWithZoom {...props} />);
      expect(createdImages[0].src).toContain("bob.jpg");
      expect(createdImages[1].src).toContain("bob.jpg");
    });

    it('should use the "srcZoomed" prop for the zoomed image if optional prop srcZoomed is provided', () => {
      renderWithProvider(<ImageWithZoom {...props} srcZoomed="fred.jpg" />);
      expect(createdImages[0].src).toContain("bob.jpg");
      expect(createdImages[1].src).toContain("fred.jpg");
    });

    it("should properly update transformOrigin x y when mouse is hovering and moving", () => {
      const { container } = renderWithProvider(<ImageWithZoom {...props} />);
      const overlay = container.querySelector(".carousel__zoom-image-overlay") as HTMLElement;

      Object.defineProperty(overlay, "offsetWidth", {
        configurable: true,
        value: 100,
      });
      Object.defineProperty(overlay, "offsetHeight", {
        configurable: true,
        value: 100,
      });

      fireEvent.mouseOver(overlay);

      const moveEvent1 = new MouseEvent("mousemove", { bubbles: true });
      Object.defineProperty(moveEvent1, "offsetX", { value: 1 });
      Object.defineProperty(moveEvent1, "offsetY", { value: 1 });
      fireEvent(overlay, moveEvent1);

      expect(overlay.style.transformOrigin).toBe("1% 1%");

      const moveEvent2 = new MouseEvent("mousemove", { bubbles: true });
      Object.defineProperty(moveEvent2, "offsetX", { value: 50 });
      Object.defineProperty(moveEvent2, "offsetY", { value: 50 });
      fireEvent(overlay, moveEvent2);

      expect(overlay.style.transformOrigin).toBe("50% 50%");
    });

    it("mouse handlers should not alter state while touch zooming is active", () => {
      const { container } = renderWithProvider(<ImageWithZoom {...props} />);
      const overlay = container.querySelector(".carousel__zoom-image-overlay") as HTMLElement;

      fireEvent.touchStart(overlay, touchStart);
      expect(overlay).toHaveClass("zoom");

      fireEvent.mouseOver(overlay);
      expect(overlay).not.toHaveClass("hover");

      const moveEvent = new MouseEvent("mousemove", { bubbles: true });
      Object.defineProperty(moveEvent, "offsetX", { value: 25 });
      Object.defineProperty(moveEvent, "offsetY", { value: 25 });
      fireEvent(overlay, moveEvent);
      expect(overlay.style.transformOrigin).toBe("");

      fireEvent.mouseOut(overlay);
      expect(overlay).toHaveClass("zoom");
    });

    it("should not zoom on touch when isPinchZoomEnabled is false", () => {
      const { container } = renderWithProvider(
        <ImageWithZoom {...props} isPinchZoomEnabled={false} />,
      );
      const overlay = container.querySelector(".carousel__zoom-image-overlay") as HTMLElement;

      fireEvent.touchStart(overlay, touchStart);
      expect(overlay).not.toHaveClass("zoom");

      fireEvent.touchMove(overlay, {
        targetTouches: [
          { identifier: 1, clientX: 25, clientY: 25 },
          { identifier: 2, clientX: 125, clientY: 125 },
        ],
      });
      expect(overlay).not.toHaveClass("zoom");

      fireEvent.touchEnd(overlay, touchEnd);
      expect(overlay).not.toHaveClass("zoom");
    });

    it("should not end zooming if only 1 of 2 touches ended", () => {
      const { container } = renderWithProvider(<ImageWithZoom {...props} />);
      const overlay = container.querySelector(".carousel__zoom-image-overlay") as HTMLElement;

      fireEvent.touchStart(overlay, touchStart);
      expect(overlay).toHaveClass("zoom");

      fireEvent.touchEnd(overlay, {
        changedTouches: [{ identifier: 1 }],
      });
      expect(overlay).toHaveClass("zoom");

      fireEvent.touchMove(overlay, {
        targetTouches: [{ identifier: 2, clientX: 125, clientY: 125 }],
      });
      expect(overlay).toHaveClass("zoom");

      fireEvent.touchEnd(overlay, {
        changedTouches: [{ identifier: 2 }],
      });
      expect(overlay).not.toHaveClass("zoom");
    });

    it("should forward ref to the zoom image container and pass overlayProps to the overlay", () => {
      const ref = React.createRef<HTMLDivElement>();
      const onMouseOver = vi.fn();
      const onMouseOut = vi.fn();
      const { container } = renderWithProvider(
        <ImageWithZoom
          {...props}
          ref={ref}
          overlayClassName="from-overlay-class-name"
          overlayProps={{
            role: "application",
            "aria-label": "Zoomable image",
            className: "from-overlay-props",
            style: { opacity: 0.9 },
            onMouseOver,
            onMouseOut,
          }}
        />,
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass("container");

      const overlay = container.querySelector(".carousel__zoom-image-overlay") as HTMLElement;
      expect(overlay).toHaveAttribute("role", "application");
      expect(overlay).toHaveAttribute("aria-label", "Zoomable image");
      expect(overlay).toHaveClass(
        "carousel__zoom-image-overlay",
        "from-overlay-class-name",
        "from-overlay-props",
      );
      expect(overlay.style.opacity).toBe("0.9");

      fireEvent.mouseOver(overlay);
      expect(onMouseOver).toHaveBeenCalledTimes(1);
      expect(overlay).toHaveClass("hover");

      fireEvent.mouseOut(overlay);
      expect(onMouseOut).toHaveBeenCalledTimes(1);
      expect(overlay).not.toHaveClass("hover");
    });

    it("should initialize transformOrigin to 50% 50% on focus when mouse has not moved, and support keyboard zoom toggle, arrow-key panning, and Escape", () => {
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      const onKeyDown = vi.fn();
      const { container } = renderWithProvider(
        <ImageWithZoom
          {...props}
          overlayProps={{
            tabIndex: 0,
            onFocus,
            onBlur,
            onKeyDown,
          }}
        />,
      );

      const overlay = container.querySelector(".carousel__zoom-image-overlay") as HTMLElement;

      // Focus initializes x/y to 50% so transformOrigin is valid CSS ("50% 50%") instead of "null null"
      fireEvent.focus(overlay);
      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(overlay).toHaveClass("carousel__zoom-image-overlay--hovering");
      expect(overlay.style.transformOrigin).toBe("50% 50%");
      expect(overlay.style.transform).toBe("scale(2)");

      // Arrow keys pan the zoom origin by 10% increments while zoomed
      fireEvent.keyDown(overlay, { key: "ArrowRight" });
      expect(overlay.style.transformOrigin).toBe("60% 50%");

      fireEvent.keyDown(overlay, { key: "ArrowDown" });
      expect(overlay.style.transformOrigin).toBe("60% 60%");

      fireEvent.keyDown(overlay, { key: "ArrowLeft" });
      expect(overlay.style.transformOrigin).toBe("50% 60%");

      fireEvent.keyDown(overlay, { key: "ArrowUp" });
      expect(overlay.style.transformOrigin).toBe("50% 50%");

      // Escape exits zoom while focused
      fireEvent.keyDown(overlay, { key: "Escape" });
      expect(overlay).not.toHaveClass("carousel__zoom-image-overlay--hovering");

      // Arrow keys when not zoomed do not pan or prevent default
      expect(fireEvent.keyDown(overlay, { key: "ArrowRight" })).toBe(true);

      // Enter / Space / + toggles zoom back on and off
      fireEvent.keyDown(overlay, { key: "Enter" });
      expect(overlay).toHaveClass("carousel__zoom-image-overlay--hovering");
      expect(overlay.style.transform).toBe("scale(2)");

      fireEvent.keyDown(overlay, { key: "Enter" });
      expect(overlay).not.toHaveClass("carousel__zoom-image-overlay--hovering");

      // Blur resets hover zoom and chains overlayProps.onBlur
      fireEvent.focus(overlay);
      expect(overlay).toHaveClass("carousel__zoom-image-overlay--hovering");
      fireEvent.blur(overlay);
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(overlay).not.toHaveClass("carousel__zoom-image-overlay--hovering");
      expect(onKeyDown).toHaveBeenCalledTimes(8);
    });
  });
});
