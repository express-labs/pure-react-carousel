import type * as React from "react";
import Dot from "./Dot";
import WithStore from "../Store/WithStore";
import type { CarouselState, DotProps, DotViewProps } from "../types";

const ConnectedDot: React.ComponentType<DotProps> = WithStore<
  DotViewProps,
  Pick<CarouselState, "currentSlide" | "totalSlides" | "visibleSlides" | "pauseOnInteract">
>(Dot, (state) => ({
  currentSlide: state.currentSlide,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
  pauseOnInteract: state.pauseOnInteract,
}));

export default ConnectedDot;
