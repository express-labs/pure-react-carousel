import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CompatibilityPage from "../CompatibilityPage";

describe("<CompatibilityPage />", () => {
  it("renders the compatibility matrix heading, summary metrics, and tables", () => {
    render(<CompatibilityPage />);

    expect(screen.getByText("React Version Compatibility Matrix")).toBeInTheDocument();
    expect(screen.getByText(/Runtime, SSR & Unit Test Compatibility/i)).toBeInTheDocument();
    expect(
      screen.getByText(/TypeScript \(@types\/react\) Consumer Compatibility/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Running the Compatibility Suite Locally/i)).toBeInTheDocument();

    expect(screen.getByText("19.3.1")).toBeInTheDocument();
    expect(screen.getByText("18.3.1")).toBeInTheDocument();
    expect(screen.getByText("17.0.2")).toBeInTheDocument();
  });

  it("filters the runtime compatibility table by React major track", () => {
    render(<CompatibilityPage />);

    const react18Tab = screen.getByText(/React 18 Track \(\d+\)/i);
    fireEvent.click(react18Tab);

    expect(react18Tab).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("18.3.1")).toBeInTheDocument();
    expect(screen.queryByText("19.3.1")).not.toBeInTheDocument();

    const allTracksTab = screen.getByText(/All Tracks \(\d+\)/i);
    fireEvent.click(allTracksTab);

    expect(allTracksTab).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("19.3.1")).toBeInTheDocument();
  });

  it("filters versions by search query and shows an empty state when no version matches", () => {
    render(<CompatibilityPage />);

    const searchInput = screen.getByLabelText("Filter Version:");
    fireEvent.change(searchInput, { target: { value: "17.0.2" } });

    expect(screen.getByText("17.0.2")).toBeInTheDocument();
    expect(screen.queryByText("19.3.1")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "99.99.99" } });
    expect(screen.getByText("No React versions match your current filter.")).toBeInTheDocument();
  });

  it("calls onBack when the back link is clicked", () => {
    const onBack = vi.fn();
    render(<CompatibilityPage onBack={onBack} />);

    const backLink = screen.getByText(/Back to Carousel Demo/i);
    fireEvent.click(backLink);

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
