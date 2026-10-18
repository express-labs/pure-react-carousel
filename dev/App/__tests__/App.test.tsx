import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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
