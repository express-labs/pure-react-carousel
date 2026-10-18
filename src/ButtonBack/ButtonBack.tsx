import * as React from "react";
import { cn } from "../helpers";
import type { ButtonBackViewProps } from "../types";
import s from "./ButtonBack.scss";

function setDisabled(
  disabled: boolean | null | undefined,
  currentSlide: number,
  infinite: boolean,
): boolean {
  if (disabled !== null && disabled !== undefined) return disabled;
  if (currentSlide === 0 && !infinite) return true;
  return false;
}

const ButtonBack = (props: ButtonBackViewProps) => {
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
    visibleSlides,
    ...restProps
  } = props;

  const isDisabled = setDisabled(disabled, currentSlide, infinite);

  const handleOnClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    const maxSlide = totalSlides - visibleSlides;
    const newCurrentSlide = Math.max(currentSlide - step, 0);
    const isOnFirstSlide = currentSlide === 0 && infinite;

    carouselStore.setStoreState(
      {
        currentSlide: isOnFirstSlide ? maxSlide : newCurrentSlide,
        ...(pauseOnInteract ? { isPlaying: false } : {}),
      },
      onClick !== null ? () => onClick(ev) : undefined,
    );
  };

  const newClassName = cn([s.buttonBack, "carousel__back-button", className]);

  return (
    <button
      type="button"
      aria-label="previous"
      className={newClassName}
      onClick={handleOnClick}
      disabled={isDisabled}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default ButtonBack;
