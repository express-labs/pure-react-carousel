import React from "react";
import { act, render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vite-plus/test";
import App from "../App";

describe("<App />", () => {
  it("should render the demo app", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Pure React Carousel" })).toBeInTheDocument();
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
    const { container, getByTestId } = render(<App />);
    const select = container.querySelector(".select") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "15" } });

    expect(container.querySelector("#example--15")).toBeInTheDocument();
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
