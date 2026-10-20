import * as React from "react";
import { cn } from "../helpers";
import type { ButtonLastViewProps } from "../types";
import s from "./ButtonLast.scss";

const ButtonLast = React.forwardRef<HTMLButtonElement, ButtonLastViewProps>((props, ref) => {
  const {
    carouselStore,
    children,
    className = undefined,
    currentSlide,
    disabled = null,
    infinite: _infinite = false,
    onClick = null,
    pauseOnInteract = true,
    totalSlides,
    visibleSlides = 1,
    ...restProps
  } = props;

  const isDisabled =
    disabled !== null && disabled !== undefined
      ? disabled
      : currentSlide >= totalSlides - visibleSlides;

  const handleOnClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    carouselStore.setStoreState(
      {
        currentSlide: totalSlides - visibleSlides,
        ...(pauseOnInteract ? { isPlaying: false } : {}),
      },
      onClick !== null ? () => onClick(ev) : undefined,
    );
  };

  const newClassName = cn([s.buttonLast, "carousel__last-button", className]);

  return (
    <button
      ref={ref}
      type="button"
      aria-label="last"
      className={newClassName}
      onClick={handleOnClick}
      disabled={isDisabled}
      {...restProps}
    >
      {children}
    </button>
  );
});

export default ButtonLast;
