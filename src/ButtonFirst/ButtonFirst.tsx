import React from "react";
import { cn } from "../helpers";
import type { ButtonFirstProps } from "../types";
import s from "./ButtonFirst.scss";

const ButtonFirst = (props: ButtonFirstProps) => {
  const {
    carouselStore,
    children,
    className = undefined,
    currentSlide,
    disabled = null,
    infinite: _infinite = false,
    onClick = null,
    totalSlides: _totalSlides,
    ...restProps
  } = props;

  const isDisabled = disabled !== null && disabled !== undefined ? disabled : currentSlide === 0;

  const handleOnClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    carouselStore.setStoreState(
      {
        currentSlide: 0,
        isPlaying: false,
      },
      onClick !== null ? () => onClick(ev) : undefined,
    );
  };

  const newClassName = cn([s.buttonFirst, "carousel__first-button", className]);

  return (
    <button
      type="button"
      aria-label="first"
      className={newClassName}
      onClick={handleOnClick}
      disabled={isDisabled}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default ButtonFirst;
