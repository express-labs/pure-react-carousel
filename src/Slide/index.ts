import type React from "react";
import Slide from "./Slide";
import WithStore from "../Store/WithStore";
import type { CarouselState, SlideProps, SlideViewProps } from "../types";

const ConnectedSlide: React.ComponentType<SlideProps> = WithStore<
  SlideViewProps,
  Pick<
    CarouselState,
    | "currentSlide"
    | "naturalSlideHeight"
    | "naturalSlideWidth"
    | "orientation"
    | "slideSize"
    | "totalSlides"
    | "visibleSlides"
    | "isIntrinsicHeight"
  >
>(Slide, (state) => ({
  currentSlide: state.currentSlide,
  naturalSlideHeight: state.naturalSlideHeight,
  naturalSlideWidth: state.naturalSlideWidth,
  orientation: state.orientation,
  slideSize: state.slideSize,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
  isIntrinsicHeight: state.isIntrinsicHeight,
}));

export default ConnectedSlide;
