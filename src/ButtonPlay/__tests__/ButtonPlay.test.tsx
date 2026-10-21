import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vite-plus/test";
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

  it("should dynamically default aria-label to 'play' or 'pause' when empty and omit default aria-label when accessible children or aria-labelledby are provided", () => {
    const { rerender } = render(
      <ButtonPlay {...props} isPlaying={false}>
        {null}
      </ButtonPlay>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "play");

    rerender(
      <ButtonPlay {...props} isPlaying>
        {null}
      </ButtonPlay>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "pause");

    rerender(
      <ButtonPlay
        {...props}
        childrenPaused="Start Autoplay"
        childrenPlaying="Stop Autoplay"
        isPlaying
      >
        {null}
      </ButtonPlay>,
    );
    expect(screen.getByRole("button", { name: "Stop Autoplay" })).not.toHaveAttribute("aria-label");

    rerender(
      <ButtonPlay {...props} aria-labelledby="play-heading">
        {null}
      </ButtonPlay>,
    );
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-label");
    expect(screen.getByRole("button")).toHaveAttribute("aria-labelledby", "play-heading");
  });
});
