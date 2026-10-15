import Dot from "./Dot";
import WithStore from "../Store/WithStore";
import type { DotProps as PublicDotProps } from "../../typings";
import type { CarouselState, DotProps } from "../types";

export default WithStore<
  DotProps,
  Pick<CarouselState, "currentSlide" | "totalSlides" | "visibleSlides">
>(Dot, (state) => ({
  currentSlide: state.currentSlide,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
})) as React.ComponentType<PublicDotProps>;
