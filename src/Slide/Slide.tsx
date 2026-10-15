import React, { useState } from "react";
import { cn, pct } from "../helpers";
import type { SlideProps } from "../types";
import s from "./Slide.scss";

const Slide = (props: SlideProps) => {
  const {
    ariaLabel = "slide",
    carouselStore: _carouselStore = null,
    children = null,
    className = null,
    classNameHidden = null,
    classNameVisible = null,
    currentSlide,
    index,
    innerClassName = null,
    innerTag: InnerTag = "div",
    naturalSlideHeight,
    naturalSlideWidth,
    onBlur = null,
    onFocus = null,
    orientation,
    slideSize,
    role = "option",
    style = {},
    tag: Tag = "div",
    totalSlides,
    visibleSlides,
    isIntrinsicHeight = false,
    ...restProps
  } = props;

  const [focused, setFocused] = useState(false);

  const isVisible = index >= currentSlide && index < currentSlide + visibleSlides;

  const handleOnFocus = (ev: React.FocusEvent<HTMLElement>) => {
    setFocused(true);
    if (onFocus !== null) {
      onFocus(ev);
    }
  };

  const handleOnBlur = (ev: React.FocusEvent<HTMLElement>) => {
    setFocused(false);
    if (onBlur !== null) {
      onBlur(ev);
    }
  };

  const renderFocusRing = () => {
    if (focused) {
      return <div className={[s.focusRing, "carousel__slide-focus-ring"].join(" ")} />;
    }
    return null;
  };

  const tempStyle: React.CSSProperties = {};

  if (orientation === "horizontal") {
    tempStyle.width = pct(slideSize);
    tempStyle.paddingBottom = pct((naturalSlideHeight * 100) / (naturalSlideWidth * totalSlides));
  } else {
    tempStyle.width = pct(100);
    tempStyle.paddingBottom = pct((naturalSlideHeight * 100) / naturalSlideWidth);
  }

  const innerStyle: React.CSSProperties = {};
  if (isIntrinsicHeight) {
    if (orientation === "horizontal") {
      tempStyle.height = "unset";
    } else {
      tempStyle.width = "unset";
    }
    tempStyle.paddingBottom = "unset";
    innerStyle.position = "unset";
  }

  const newStyle: React.CSSProperties = {
    ...tempStyle,
    ...style,
  };

  const newClassName = cn([
    s.slide,
    orientation === "horizontal" && s.slideHorizontal,
    "carousel__slide",
    focused && "carousel__slide--focused",
    isVisible && classNameVisible,
    isVisible && "carousel__slide--visible",
    !isVisible && classNameHidden,
    !isVisible && "carousel__slide--hidden",
    className,
  ]);

  const newInnerClassName = cn([s.slideInner, "carousel__inner-slide", innerClassName]);

  const OuterElement = Tag as React.ElementType;
  const InnerElement = InnerTag as React.ElementType;

  return (
    <OuterElement
      aria-selected={isVisible}
      aria-label={ariaLabel}
      role={role}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      className={newClassName}
      style={newStyle}
      {...restProps}
    >
      <InnerElement className={newInnerClassName} style={innerStyle}>
        {children}
        {renderFocusRing()}
      </InnerElement>
    </OuterElement>
  );
};

export default Slide;
