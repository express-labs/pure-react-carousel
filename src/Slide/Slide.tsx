import * as React from "react";
import { useState } from "react";
import { cn, getInertValue, pct } from "../helpers";
import type { ScrollSnapAlign, ScrollSnapStop, SlideViewProps } from "../types";
import s from "./Slide.scss";

const SNAP_ALIGN_CLASS_MAP: Record<ScrollSnapAlign, string> = {
  start: s.snapAlignStart,
  center: s.snapAlignCenter,
  end: s.snapAlignEnd,
  none: s.snapAlignNone,
};

const SNAP_STOP_CLASS_MAP: Record<ScrollSnapStop, string> = {
  normal: s.snapStopNormal,
  always: s.snapStopAlways,
};

const SELECTABLE_ROLES = new Set([
  "option",
  "tab",
  "gridcell",
  "row",
  "columnheader",
  "rowheader",
  "treeitem",
]);

const Slide = React.forwardRef<HTMLDivElement, SlideViewProps>((props, ref) => {
  const {
    ariaLabel,
    carouselStore: _carouselStore = null,
    children = null,
    className = null,
    classNameHidden = null,
    classNameVisible = null,
    currentSlide,
    focusRing = true,
    index,
    inert: inertProp,
    innerClassName = null,
    innerProps = {},
    innerTag: InnerTag = "div",
    naturalSlideHeight,
    naturalSlideWidth,
    onBlur = null,
    onFocus = null,
    orientation,
    slideSize,
    snapAlign = "start",
    snapStop = "normal",
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
    if (ev.target === ev.currentTarget) {
      setFocused(true);
    }
    if (onFocus !== null) {
      onFocus(ev);
    }
  };

  const handleOnBlur = (ev: React.FocusEvent<HTMLElement>) => {
    if (ev.target === ev.currentTarget) {
      setFocused(false);
    }
    if (onBlur !== null) {
      onBlur(ev);
    }
  };

  const renderFocusRing = () => {
    if (focused && focusRing) {
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
    SNAP_ALIGN_CLASS_MAP[snapAlign],
    `carousel__slide--snap-align-${snapAlign}`,
    SNAP_STOP_CLASS_MAP[snapStop],
    `carousel__slide--snap-stop-${snapStop}`,
    className,
  ]);

  const {
    className: innerPropsClassName,
    ref: _innerPropsRef,
    style: innerPropsStyle,
    ...restInnerProps
  } = innerProps;

  const newInnerClassName = cn([
    s.slideInner,
    "carousel__inner-slide",
    innerClassName,
    innerPropsClassName,
  ]);
  const mergedInnerStyle: React.CSSProperties = {
    ...innerStyle,
    ...innerPropsStyle,
  };

  const defaultAriaHidden = !isVisible ? "true" : undefined;
  const shouldBeInert = inertProp !== undefined ? Boolean(inertProp) : !isVisible;
  const resolvedInert = shouldBeInert ? getInertValue() : undefined;
  const defaultAriaSelected = SELECTABLE_ROLES.has(role) ? isVisible : undefined;
  const resolvedAriaLabel =
    ariaLabel !== undefined
      ? ariaLabel
      : restProps["aria-labelledby"] !== undefined
        ? undefined
        : "slide";

  return React.createElement(
    Tag,
    {
      ref,
      "aria-hidden": defaultAriaHidden,
      "aria-selected": defaultAriaSelected,
      "aria-label": resolvedAriaLabel,
      inert: resolvedInert,
      role,
      onFocus: handleOnFocus,
      onBlur: handleOnBlur,
      className: newClassName,
      style: newStyle,
      ...restProps,
    },
    React.createElement(
      InnerTag,
      { className: newInnerClassName, style: mergedInnerStyle, ...restInnerProps },
      children,
      renderFocusRing(),
    ),
  );
});

export default Slide;
