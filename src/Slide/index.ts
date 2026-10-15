import Slide from "./Slide";
import WithStore from "../Store/WithStore";
import type { SlideProps as PublicSlideProps } from "../../typings";
import type { CarouselState, SlideProps } from "../types";

export default WithStore<
  SlideProps,
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
})) as React.ComponentType<PublicSlideProps>;
