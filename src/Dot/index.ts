import type React from "react";
import Dot from "./Dot";
import WithStore from "../Store/WithStore";
import type { CarouselState, DotProps, DotViewProps } from "../types";

const ConnectedDot: React.ComponentType<DotProps> = WithStore<
  DotViewProps,
  Pick<CarouselState, "currentSlide" | "totalSlides" | "visibleSlides">
>(Dot, (state) => ({
  currentSlide: state.currentSlide,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
}));

export default ConnectedDot;
