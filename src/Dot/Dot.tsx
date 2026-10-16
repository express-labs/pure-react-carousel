import React from "react";
import { cn } from "../helpers";
import type { DotViewProps } from "../types";
import s from "./Dot.scss";

const Dot = (props: DotViewProps) => {
  const {
    carouselStore,
    children = null,
    className = undefined,
    currentSlide,
    disabled = null,
    onClick = null,
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
        isPlaying: false,
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

  return (
    <button
      aria-label="slide dot"
      type="button"
      onClick={handleOnClick}
      className={newClassName}
      disabled={isDisabled}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Dot;
