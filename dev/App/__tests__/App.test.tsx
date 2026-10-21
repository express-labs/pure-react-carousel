import React from "react";
import { act, render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vite-plus/test";
import App from "../App";

describe("<App />", () => {
  it("should render the demo app without DOM nesting or console errors", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      render(<App />);
      expect(screen.getByRole("heading", { name: "Pure React Carousel" })).toBeInTheDocument();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it("should expose WCAG landmark roles, skip link, and named regions for significant page areas", () => {
    render(<App />);

    const skipLink = screen.getByRole("link", { name: /Skip to main content/i });
    expect(skipLink).toHaveAttribute("href", "#main-content");

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    expect(screen.getByRole("region", { name: /What is "unopinionated\?"/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Real World Example" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Default Carousel Examples" })).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /^Carousel \(With Master Loading Spinner\)/i }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("img", { name: "External link" })).toHaveLength(2);
    expect(screen.getByRole("img", { name: "Express logo" })).toBeInTheDocument();

    const example8 = screen.getByRole("region", {
      name: /Carousel \(lockOnWindowScroll set to TRUE\)/i,
    });
    expect(within(example8).getByRole("list")).toBeInTheDocument();
    expect(within(example8).getAllByRole("listitem")).toHaveLength(3);
  });

  it("should call handleChange when a select is changed", () => {
    const { container } = render(<App />);
    const select = container.querySelector(".select") as HTMLSelectElement;
    expect(select.value).toBe("0");
    fireEvent.change(select, { target: { value: "5" } });
    expect(select.value).toBe("5");
    expect(container.querySelector("#example--5")).toBeInTheDocument();
    expect(container.querySelector("#example--1")).not.toBeInTheDocument();
  });

  it("should render Example15 and demo dragClickThreshold with slide buttons and links", () => {
    const createdImages: HTMLImageElement[] = [];
    const origCreateElement = document.createElement.bind(document);
    const createElementSpy = vi
      .spyOn(document, "createElement")
      .mockImplementation((tagName: string, options?: ElementCreationOptions) => {
        const el = origCreateElement(tagName, options);
        if (tagName.toLowerCase() === "img") {
          createdImages.push(el as HTMLImageElement);
        }
        return el;
      });

    try {
      const { container, getByTestId } = render(<App />);
      const select = container.querySelector(".select") as HTMLSelectElement;
      fireEvent.change(select, { target: { value: "15" } });

      const section15 = container.querySelector("#example--15") as HTMLElement;
      expect(section15).toBeInTheDocument();

      act(() => {
        createdImages.forEach((img) => {
          img.dispatchEvent(new Event("load"));
        });
      });

      const slideImages = section15.querySelectorAll("img.carousel__image--success");
      expect(slideImages).toHaveLength(6);
      slideImages.forEach((img) => {
        expect(img).toHaveAttribute("alt", "");
      });

      const log = getByTestId("interactive-click-log");
      expect(log).toHaveTextContent("No slide buttons or links clicked yet.");

      const btn0 = getByTestId("slide-action-btn-0");
      const link0 = getByTestId("slide-action-link-0");

      // Normal click on slide button updates log
      fireEvent.click(btn0);
      expect(log).toHaveTextContent("Clicked button on Slide 1 (total clicks: 1)");

      // Normal click on slide link updates log
      fireEvent.click(link0);
      expect(log).toHaveTextContent("Clicked link on Slide 1 (total clicks: 2)");

      // Dragging > 5px across the button suppresses its click handler
      fireEvent.mouseDown(btn0, { screenX: 100, screenY: 100 });
      act(() => {
        document.documentElement.dispatchEvent(
          new MouseEvent("mousemove", { screenX: 140, screenY: 100 }),
        );
        document.documentElement.dispatchEvent(new MouseEvent("mouseup"));
      });
      fireEvent.click(btn0);
      expect(log).toHaveTextContent("Clicked link on Slide 1 (total clicks: 2)");

      // Update dragClickThreshold input and reset log
      const thresholdInput = getByTestId("drag-click-threshold-input") as HTMLInputElement;
      fireEvent.change(thresholdInput, { target: { value: "25" } });
      expect(thresholdInput.value).toBe("25");

      fireEvent.change(thresholdInput, { target: { value: "-5" } });
      expect(thresholdInput.value).toBe("0");

      fireEvent.click(getByTestId("reset-click-log"));
      expect(log).toHaveTextContent("No slide buttons or links clicked yet.");
    } finally {
      createElementSpy.mockRestore();
    }
  });

  it("should render Example16 and toggle disableAnimation with custom CSS transition classes", () => {
    const { container, getByTestId } = render(<App />);
    const select = container.querySelector(".select") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "16" } });

    const section = container.querySelector("#example--16") as HTMLElement;
    expect(section).toBeInTheDocument();

    const tray = section.querySelector(".carousel__slider-tray") as HTMLElement;
    expect(tray).toHaveClass("customTrayAnimation");
    expect(tray.style.transition).toBe("none");

    const toggle = getByTestId("disable-animation-toggle") as HTMLInputElement;
    expect(toggle.checked).toBe(true);

    fireEvent.click(toggle);
    expect(toggle.checked).toBe(false);
    expect(tray.style.transition).toBe("");
  });

  it("should render Example18 and dynamically adapt visibleSlides, step, and breakpoints", () => {
    const { container, getByTestId } = render(<App />);
    const select = container.querySelector(".select") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "18" } });

    const section = container.querySelector("#example--18") as HTMLElement;
    expect(section).toBeInTheDocument();

    const steppingModeGroup = within(section).getByRole("group", { name: /Stepping Mode/i });
    expect(steppingModeGroup.tagName).toBe("FIELDSET");

    // Default effective width falls back to 1000px in test env (Desktop Wide -> 4 visible slides)
    expect(getByTestId("metric-visible-slides")).toHaveTextContent("4");
    expect(getByTestId("metric-step")).toHaveTextContent("4");
    expect(getByTestId("metric-breakpoint")).toHaveTextContent("Desktop (Wide)");

    // Switch stepping mode to single item
    const radioSingle = getByTestId("step-mode-single") as HTMLInputElement;
    fireEvent.click(radioSingle);
    expect(radioSingle.checked).toBe(true);
    expect(getByTestId("metric-step")).toHaveTextContent("1");
    expect(getByTestId("metric-visible-slides")).toHaveTextContent("4");

    // Click mobile preset (360px -> Mobile -> 1 visible slide)
    const mobileBtn = getByTestId("preset-mobile");
    fireEvent.click(mobileBtn);
    expect(getByTestId("metric-width")).toHaveTextContent("360px");
    expect(getByTestId("metric-breakpoint")).toHaveTextContent("Mobile");
    expect(getByTestId("metric-visible-slides")).toHaveTextContent("1");

    // Click tablet portrait preset (580px -> Tablet Portrait -> 2 visible slides)
    const tabletPortBtn = getByTestId("preset-tablet-port");
    fireEvent.click(tabletPortBtn);
    expect(getByTestId("metric-width")).toHaveTextContent("580px");
    expect(getByTestId("metric-breakpoint")).toHaveTextContent("Tablet (Portrait)");
    expect(getByTestId("metric-visible-slides")).toHaveTextContent("2");

    // Switch back to page-by-page stepping mode
    const radioPage = getByTestId("step-mode-page") as HTMLInputElement;
    fireEvent.click(radioPage);
    expect(getByTestId("metric-step")).toHaveTextContent("2");

    // Test slider change
    const slider = getByTestId("manual-width-slider") as HTMLInputElement;
    fireEvent.change(slider, { target: { value: "700" } });
    expect(getByTestId("metric-width")).toHaveTextContent("700px");
    expect(getByTestId("metric-breakpoint")).toHaveTextContent("Tablet (Landscape)");
    expect(getByTestId("metric-visible-slides")).toHaveTextContent("3");
    expect(getByTestId("metric-step")).toHaveTextContent("3");

    // When available container width is narrower (600px) than manualWidthOverride (780px),
    // effectiveWidth and breakpoint should cap to the available 600px width
    const wrapper = section.querySelector(".responsiveExampleWrapper") as HTMLElement;
    const origGetBCR = wrapper.getBoundingClientRect;
    wrapper.getBoundingClientRect = () => ({ width: 600 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    fireEvent.click(mobileBtn);
    expect(getByTestId("metric-width")).toHaveTextContent("360px");
    expect(getByTestId("metric-breakpoint")).toHaveTextContent("Mobile");
    expect(getByTestId("metric-visible-slides")).toHaveTextContent("1");

    const tabletLandBtn = getByTestId("preset-tablet-land");
    fireEvent.click(tabletLandBtn);
    expect(getByTestId("metric-width")).toHaveTextContent("600px");
    expect(getByTestId("metric-breakpoint")).toHaveTextContent("Tablet (Portrait)");
    expect(getByTestId("metric-visible-slides")).toHaveTextContent("2");
    wrapper.getBoundingClientRect = origGetBCR;

    // Test Start Autoplay and Stop Autoplay buttons
    const startBtn = getByTestId("autoplay-start-btn") as HTMLButtonElement;
    const stopBtn = getByTestId("autoplay-stop-btn") as HTMLButtonElement;
    expect(getByTestId("metric-autoplay")).toHaveTextContent("Stopped");
    expect(startBtn).not.toBeDisabled();
    expect(stopBtn).toBeDisabled();

    fireEvent.click(startBtn);
    expect(getByTestId("metric-autoplay")).toHaveTextContent("Playing");
    expect(startBtn).toBeDisabled();
    expect(stopBtn).not.toBeDisabled();

    fireEvent.click(stopBtn);
    expect(getByTestId("metric-autoplay")).toHaveTextContent("Stopped");
    expect(startBtn).not.toBeDisabled();
    expect(stopBtn).toBeDisabled();
  });

  it("should navigate to the React Compatibility Chart page and back to the demo app", () => {
    const { container } = render(<App />);
    const select = container.querySelector(".select") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "1" } });

    const compatLink = screen.getByText("React Compatibility Chart");
    fireEvent.click(compatLink);

    expect(screen.getByText("React Version Compatibility Matrix")).toBeInTheDocument();

    const backLink = screen.getByText(/Back to Carousel Demo/i);
    fireEvent.click(backLink);

    expect(screen.getByText("Pure React Carousel")).toBeInTheDocument();
  });
});
