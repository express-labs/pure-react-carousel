import * as React from "react";
import { cn, hasAccessibleContent } from "../helpers";
import type { DotViewProps } from "../types";
import s from "./Dot.scss";

const Dot = React.forwardRef<HTMLButtonElement, DotViewProps>((props, ref) => {
  const {
    carouselStore,
    children = null,
    className = undefined,
    currentSlide,
    disabled = null,
    onClick = null,
    pauseOnInteract = true,
    selected = null,
    slide,
    totalSlides,
    visibleSlides,
    ...restProps
  } = props;

  const defaultSelected = slide >= currentSlide && slide < currentSlide + visibleSlides;
  const isSelected = typeof selected === "boolean" ? selected : defaultSelected;
  const defaultDisabled = defaultSelected === true;
  const isDisabled = typeof disabled === "boolean" ? disabled : defaultDisabled;

  const handleOnClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    const maxSlide = totalSlides - visibleSlides;
    const newCurrentSlide = Math.min(slide, maxSlide);

    carouselStore.setStoreState(
      {
        currentSlide: newCurrentSlide,
        ...(pauseOnInteract ? { isPlaying: false } : {}),
      },
      onClick !== null ? () => onClick(ev) : undefined,
    );
  };

  const newClassName = cn([
    s.dot,
    isSelected && s.dotSelected,
    "carousel__dot",
    `carousel__dot--${slide}`,
    isSelected && "carousel__dot--selected",
    className,
  ]);
  const defaultAriaLabel =
    restProps["aria-label"] === undefined &&
    restProps["aria-labelledby"] === undefined &&
    !hasAccessibleContent(children)
      ? "slide dot"
      : undefined;
  const isSelectableRole = restProps.role === "tab" || restProps.role === "option";
  const defaultAriaSelected = isSelectableRole ? isSelected : undefined;
  const defaultAriaCurrent =
    !isSelectableRole && restProps["aria-selected"] === undefined
      ? isSelected
        ? "true"
        : undefined
      : undefined;

  return (
    <button
      ref={ref}
      aria-label={defaultAriaLabel}
      aria-selected={defaultAriaSelected}
      aria-current={defaultAriaCurrent}
      type="button"
      onClick={handleOnClick}
      className={newClassName}
      disabled={isDisabled}
      {...restProps}
    >
      {children}
    </button>
  );
});

export default Dot;
