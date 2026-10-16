import type React from "react";
import DotGroup from "./DotGroup";
import WithStore from "../Store/WithStore";
import type { CarouselState, DotGroupProps, DotGroupViewProps } from "../types";

const ConnectedDotGroup: React.ComponentType<DotGroupProps> = WithStore<
  DotGroupViewProps,
  Pick<CarouselState, "currentSlide" | "totalSlides" | "visibleSlides">
>(DotGroup, (state) => ({
  currentSlide: state.currentSlide,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
}));

export default ConnectedDotGroup;
