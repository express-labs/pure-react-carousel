import type { Orientation, PlayDirection } from "../types";

// Calculates the width (horizontal) or height (vertical) of each slide as a percentage of the slideTray
export const slideSize = (totalSlides: number, _visibleSlides?: number): number =>
  100 / totalSlides;

// Calculates the width (horizontal) or height (vertical) of the slideTray as a % of the viewport.
export const slideTraySize = (totalSlides: number, visibleSlides: number): number =>
  (100 * totalSlides) / visibleSlides;

export interface DefaultCarouselConfig {
  currentSlide: number;
  disableAnimation: boolean;
  disableKeyboard: boolean;
  dragEnabled: boolean;
  hasMasterSpinner: boolean;
  infinite: boolean;
  interval: number;
  isIntrinsicHeight: boolean;
  isPageScrollLocked: boolean;
  isPlaying: boolean;
  lockOnWindowScroll: boolean;
  orientation: Orientation;
  playDirection: PlayDirection;
  privateUnDisableAnimation: boolean;
  step: number;
  dragStep: number;
  tag: "div";
  touchEnabled: boolean;
  visibleSlides: number;
}

export const defaultProps: DefaultCarouselConfig = {
  currentSlide: 0,
  disableAnimation: false,
  disableKeyboard: false,
  dragEnabled: true,
  hasMasterSpinner: false,
  infinite: false,
  interval: 5000,
  isIntrinsicHeight: false,
  isPageScrollLocked: false,
  isPlaying: false,
  lockOnWindowScroll: false,
  orientation: "horizontal",
  playDirection: "forward",
  privateUnDisableAnimation: false,
  step: 1,
  dragStep: 1,
  tag: "div",
  touchEnabled: true,
  visibleSlides: 1,
};

export default {
  defaultProps,
  slideSize,
  slideTraySize,
};
