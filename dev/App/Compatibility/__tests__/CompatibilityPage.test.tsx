import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vite-plus/test";
import CompatibilityPage, { CompatibilityReportData } from "../CompatibilityPage";

const mockCompatibilityData: CompatibilityReportData = {
  generatedAt: "2026-10-16",
  packageVersion: "3.0.0",
  nodeVersion: "v22.22.2",
  peerDependencies: {
    react: "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0",
    "react-dom": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0",
  },
  summary: {
    totalRuntimeVersions: 3,
    passedRuntimeVersions: 3,
    totalVitestVersions: 3,
    passedVitestFullSuite: 2,
    totalTypesTracks: 2,
    passedTypesTracks: 1,
  },
  tracks: [
    {
      id: "19",
      name: "React 19 Track",
      peerRange: "^19.0.0",
      versions: [
        {
          version: "19.3.1",
          trackId: "19",
          trackName: "React 19 Track",
          ssr: "PASS",
          clientRender: "PASS",
          hydration: "PASS",
          runtime: "PASS",
          vitestStatus: "PASS",
          vitestSummary: "18/18 files (200/200 tests)",
          note: "All runtime, SSR, hydration, and Vitest checks pass",
        },
      ],
    },
    {
      id: "18",
      name: "React 18 Track",
      peerRange: "^18.0.0",
      versions: [
        {
          version: "18.3.1",
          trackId: "18",
          trackName: "React 18 Track",
          ssr: "PASS",
          clientRender: "PASS",
          hydration: "PASS",
          runtime: "PASS",
          vitestStatus: "PASS",
          vitestSummary: "18/18 files (200/200 tests)",
          note: "All runtime, SSR, hydration, and Vitest checks pass",
        },
      ],
    },
    {
      id: "17",
      name: "React 17 Track",
      peerRange: "^17.0.0",
      versions: [
        {
          version: "17.0.2",
          trackId: "17",
          trackName: "React 17 Track",
          ssr: "PASS",
          clientRender: "PASS",
          hydration: "PASS",
          runtime: "PASS",
          vitestStatus: "SSR_ONLY",
          vitestSummary: "1/1 files (6/6 tests SSR)",
          note: "Runtime & hydration pass",
        },
      ],
    },
  ],
  typesCompatibility: [
    {
      id: "types-19.3.0",
      trackId: "19",
      label: "React 19.3 (@types/react@19.3.0)",
      typesReact: "19.3.0",
      expectedStatus: "PASS",
      note: "Full support for React.JSX namespace",
      status: "PASS",
      errorSummary: null,
    },
    {
      id: "types-18.0.0",
      trackId: "18",
      label: "React 18.0 (pinned @types/react@18.0.0)",
      typesReact: "18.0.0",
      expectedStatus: "FAIL",
      note: "Requires @types/react >= 18.2.9 where React.JSX was backported",
      status: "FAIL",
      errorSummary: "TS2694: Namespace 'React' has no exported member 'JSX'.",
    },
  ],
};

describe("<CompatibilityPage />", () => {
  it("renders the compatibility matrix heading, skip link, summary metrics, and tables", () => {
    render(<CompatibilityPage data={mockCompatibilityData} />);

    const skipLink = screen.getByRole("link", { name: /Skip to main content/i });
    expect(skipLink).toHaveAttribute("href", "#compat-main-content");
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "compat-main-content");
    expect(main).toHaveAttribute("tabindex", "-1");

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
    render(<CompatibilityPage data={mockCompatibilityData} />);

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
    render(<CompatibilityPage data={mockCompatibilityData} />);

    const searchInput = screen.getByLabelText("Filter Version:");
    fireEvent.change(searchInput, { target: { value: "17.0.2" } });

    expect(screen.getByText("17.0.2")).toBeInTheDocument();
    expect(screen.queryByText("19.3.1")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "99.99.99" } });
    expect(screen.getByText("No React versions match your current filter.")).toBeInTheDocument();
  });

  it("calls onBack when the back link is clicked", () => {
    const onBack = vi.fn();
    render(<CompatibilityPage data={mockCompatibilityData} onBack={onBack} />);

    const backLink = screen.getByText(/Back to Carousel Demo/i);
    fireEvent.click(backLink);

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("displays the current package.json version when rendered with default data", async () => {
    const pkg = await import("../../../../package.json");
    render(<CompatibilityPage />);

    expect(screen.getByText(`v${pkg.default.version}`)).toBeInTheDocument();
  });
});
