import DotGroup from "./DotGroup";
import WithStore from "../Store/WithStore";
import type { DotGroupProps as PublicDotGroupProps } from "../../typings";
import type { CarouselState, DotGroupProps } from "../types";

export default WithStore<
  DotGroupProps,
  Pick<CarouselState, "currentSlide" | "totalSlides" | "visibleSlides">
>(DotGroup, (state) => ({
  currentSlide: state.currentSlide,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
})) as React.ComponentType<PublicDotGroupProps>;
