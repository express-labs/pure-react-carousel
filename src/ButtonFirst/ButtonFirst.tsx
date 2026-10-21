import * as React from "react";
import { cn, hasAccessibleContent } from "../helpers";
import type { ButtonFirstViewProps } from "../types";
import s from "./ButtonFirst.scss";

const ButtonFirst = React.forwardRef<HTMLButtonElement, ButtonFirstViewProps>((props, ref) => {
  const {
    carouselStore,
    children,
    className = undefined,
    currentSlide,
    disabled = null,
    infinite: _infinite = false,
    onClick = null,
    pauseOnInteract = true,
    totalSlides: _totalSlides,
    ...restProps
  } = props;

  const isDisabled = disabled !== null && disabled !== undefined ? disabled : currentSlide === 0;

  const handleOnClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    carouselStore.setStoreState(
      {
        currentSlide: 0,
        ...(pauseOnInteract ? { isPlaying: false } : {}),
      },
      onClick !== null ? () => onClick(ev) : undefined,
    );
  };

  const newClassName = cn([s.buttonFirst, "carousel__first-button", className]);
  const defaultAriaLabel =
    restProps["aria-label"] === undefined &&
    restProps["aria-labelledby"] === undefined &&
    !hasAccessibleContent(children)
      ? "first"
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

export default ButtonFirst;
