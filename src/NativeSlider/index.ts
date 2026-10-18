import type * as React from "react";
import NativeSlider from "./NativeSlider";
import WithStore from "../Store/WithStore";
import type { CarouselState, NativeSliderProps, NativeSliderViewProps } from "../types";

const ConnectedNativeSlider: React.ComponentType<NativeSliderProps> = WithStore<
  NativeSliderViewProps,
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
    | "pauseOnInteract"
    | "playDirection"
    | "privateUnDisableAnimation"
    | "slideSize"
    | "slideTraySize"
    | "snapType"
    | "step"
    | "totalSlides"
    | "touchEnabled"
    | "visibleSlides"
  >
>(NativeSlider, (state) => ({
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
  pauseOnInteract: state.pauseOnInteract,
  playDirection: state.playDirection,
  privateUnDisableAnimation: state.privateUnDisableAnimation,
  slideSize: state.slideSize,
  slideTraySize: state.slideTraySize,
  snapType: state.snapType,
  step: state.step,
  totalSlides: state.totalSlides,
  touchEnabled: state.touchEnabled,
  visibleSlides: state.visibleSlides,
}));

export default ConnectedNativeSlider;
