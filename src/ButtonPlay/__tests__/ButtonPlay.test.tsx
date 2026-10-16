import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import ButtonPlay from "../ButtonPlay";
import Store from "../../Store/Store";
import type { ButtonPlayViewProps } from "../../types";

describe("<ButtonPlay />", () => {
  let props: ButtonPlayViewProps;

  beforeEach(() => {
    props = {
      children: "Onward!",
      carouselStore: new Store({
        isPlaying: false,
      }),
      isPlaying: false,
    };
  });

  it("should render", () => {
    render(<ButtonPlay {...props} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should update isPlaying in the carousel store toggling it from false to true after one click and back again after another click.", () => {
    const { rerender } = render(<ButtonPlay {...props} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(props.carouselStore.getStoreState().isPlaying).toBe(true);
    rerender(<ButtonPlay {...props} isPlaying={props.carouselStore.getStoreState().isPlaying} />);
    fireEvent.click(button);
    expect(props.carouselStore.getStoreState().isPlaying).toBe(false);
  });

  it("should call any supplied onClick function on click", () => {
    const onClick = vi.fn();
    render(<ButtonPlay {...props} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
