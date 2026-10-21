import * as React from "react";
import { cn, hasAccessibleContent } from "../helpers";
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

const ButtonBack = React.forwardRef<HTMLButtonElement, ButtonBackViewProps>((props, ref) => {
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
  const defaultAriaLabel =
    restProps["aria-label"] === undefined &&
    restProps["aria-labelledby"] === undefined &&
    !hasAccessibleContent(children)
      ? "previous"
      : undefined;

  return (
    <button
      ref={ref}
      type="button"
      aria-label={defaultAriaLabel}
      className={newClassName}
      onClick={handleOnClick}
      disabled={isDisabled}
      {...restProps}
    >
      {children}
    </button>
  );
});

export default ButtonBack;
