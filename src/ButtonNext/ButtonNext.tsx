import * as React from "react";
import { cn } from "../helpers";
import type { ButtonNextViewProps } from "../types";
import s from "./ButtonNext.scss";

export function setDisabled(
  disabled: boolean | null | undefined,
  currentSlide: number,
  visibleSlides: number,
  totalSlides: number,
  infinite: boolean,
): boolean {
  if (disabled !== null && disabled !== undefined) return disabled;
  if (currentSlide >= totalSlides - visibleSlides && !infinite) return true;
  return false;
}

const ButtonNext = (props: ButtonNextViewProps) => {
  const {
    carouselStore,
    children,
    className = undefined,
    currentSlide,
    disabled = null,
    infinite = false,
    onClick = null,
    pauseOnInteract = true,
    step,
    totalSlides,
    visibleSlides = 1,
    ...restProps
  } = props;

  const isDisabled = setDisabled(disabled, currentSlide, visibleSlides, totalSlides, infinite);

  const handleOnClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    const maxSlide = totalSlides - visibleSlides;
    const nextSlide = step + currentSlide;
    const newCurrentSlide = Math.min(nextSlide, maxSlide);
    const isOnLastSlide = currentSlide === maxSlide && infinite;

    carouselStore.setStoreState(
      {
        currentSlide: isOnLastSlide ? 0 : newCurrentSlide,
        ...(pauseOnInteract ? { isPlaying: false } : {}),
      },
      onClick !== null ? () => onClick(ev) : undefined,
    );
  };

  const newClassName = cn([s.buttonNext, "carousel__next-button", className]);

  return (
    <button
      type="button"
      aria-label="next"
      className={newClassName}
      onClick={handleOnClick}
      disabled={isDisabled}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default ButtonNext;
