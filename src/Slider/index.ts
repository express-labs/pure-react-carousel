import type * as React from "react";
import Slider from "./Slider";
import WithStore from "../Store/WithStore";
import type { CarouselState, SliderProps, SliderViewProps } from "../types";

const ConnectedSlider: React.ComponentType<SliderProps> = WithStore<
  SliderViewProps,
  Pick<
    CarouselState,
    | "currentSlide"
    | "disableAnimation"
    | "disableKeyboard"
    | "hasMasterSpinner"
    | "infinite"
    | "interval"
    | "isIntrinsicHeight"
    | "isPageScrollLocked"
    | "isPlaying"
    | "lockOnWindowScroll"
    | "masterSpinnerFinished"
    | "naturalSlideHeight"
    | "naturalSlideWidth"
    | "orientation"
    | "playDirection"
    | "privateUnDisableAnimation"
    | "slideSize"
    | "slideTraySize"
    | "step"
    | "dragStep"
    | "totalSlides"
    | "touchEnabled"
    | "dragEnabled"
    | "visibleSlides"
  >
>(Slider, (state) => ({
  currentSlide: state.currentSlide,
  disableAnimation: state.disableAnimation,
  disableKeyboard: state.disableKeyboard,
  hasMasterSpinner: state.hasMasterSpinner,
  infinite: state.infinite,
  interval: state.interval,
  isIntrinsicHeight: state.isIntrinsicHeight,
  isPageScrollLocked: state.isPageScrollLocked,
  isPlaying: state.isPlaying,
  lockOnWindowScroll: state.lockOnWindowScroll,
  masterSpinnerFinished: state.masterSpinnerFinished,
  naturalSlideHeight: state.naturalSlideHeight,
  naturalSlideWidth: state.naturalSlideWidth,
  orientation: state.orientation,
  playDirection: state.playDirection,
  privateUnDisableAnimation: state.privateUnDisableAnimation,
  slideSize: state.slideSize,
  slideTraySize: state.slideTraySize,
  step: state.step,
  dragStep: state.dragStep,
  totalSlides: state.totalSlides,
  touchEnabled: state.touchEnabled,
  dragEnabled: state.dragEnabled,
  visibleSlides: state.visibleSlides,
}));

export default ConnectedSlider;
